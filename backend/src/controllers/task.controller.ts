import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { CreateTaskInput, UpdateTaskInput } from '../types/task';
import { TaskStatus } from '@prisma/client';
import { startOfDay, endOfDay } from 'date-fns';

/** Relations always included when fetching a task */
const taskIncludes = {
  assignedUser: { select: { id: true, name: true, email: true } },
  creator: { select: { id: true, name: true, email: true } },
  lead: { select: { id: true, fullName: true, status: true } },
  customer: { select: { id: true, contactPerson: true, company: true } },
};

export class TaskController {
  // ---------------------------------------------------------------------------
  // GET /tasks — list with search, filters, and pagination
  // ---------------------------------------------------------------------------
  static async getAllTasks(req: Request, res: Response) {
    try {
      const query = String(req.query.query || '');
      const status = String(req.query.status || '');
      const priority = String(req.query.priority || '');
      const dueToday = req.query.dueToday === 'true';
      const overdue = req.query.overdue === 'true';
      const page = Math.max(parseInt(String(req.query.page || '1')), 1);
      const limit = Math.min(parseInt(String(req.query.limit || '10')), 100);

      const today = new Date();
      const start = startOfDay(today);
      const end = endOfDay(today);

      // Build the where clause
      const where: any = {};

      // Full-text search across title, lead name, customer name, assigned user name
      if (query) {
        where.OR = [
          { title: { contains: query } },
          { lead: { fullName: { contains: query } } },
          { customer: { company: { contains: query } } },
          { customer: { contactPerson: { contains: query } } },
          { assignedUser: { name: { contains: query } } },
        ];
      }

      if (status) {
        where.status = status as TaskStatus;
      }

      if (priority) {
        where.priority = priority;
      }

      if (dueToday) {
        where.dueDate = { gte: start, lte: end };
      }

      if (overdue) {
        where.dueDate = { lt: start };
        where.status = { notIn: [TaskStatus.COMPLETED, TaskStatus.CANCELLED] };
      }

      const skip = (page - 1) * limit;

      const [tasks, total] = await Promise.all([
        prisma.task.findMany({
          where,
          skip,
          take: limit,
          orderBy: { dueDate: 'asc' },
          include: taskIncludes,
        }),
        prisma.task.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          items: tasks,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ---------------------------------------------------------------------------
  // GET /tasks/:id — single task with full relations
  // ---------------------------------------------------------------------------
  static async getTaskById(req: Request, res: Response) {
    try {
      const id = req.params['id'] as string;

      const task = await prisma.task.findUnique({
        where: { id: id },
        include: taskIncludes,
      });

      if (!task) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }

      res.json({ success: true, data: task });
    } catch (error: any) {
      console.error('Error fetching task:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ---------------------------------------------------------------------------
  // POST /tasks — create a task
  // ---------------------------------------------------------------------------
  static async createTask(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const input: CreateTaskInput = req.body;
      const { title, assignedUserId, dueDate, leadId, customerId, ...rest } = input;

      // --- Validation ---
      if (!title?.trim()) {
        return res.status(400).json({ success: false, error: 'Title is required.' });
      }
      if (!assignedUserId) {
        return res.status(400).json({ success: false, error: 'Assigned user is required.' });
      }
      if (!dueDate) {
        return res.status(400).json({ success: false, error: 'Due date is required.' });
      }

      // --- Verify assigned user exists ---
      const assignedUser = await prisma.user.findUnique({ where: { id: assignedUserId } });
      if (!assignedUser) {
        return res.status(400).json({ success: false, error: 'Assigned user does not exist.' });
      }

      // --- Business rule: No tasks for LOST leads ---
      if (leadId) {
        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead) {
          return res.status(400).json({ success: false, error: 'Related lead not found.' });
        }
        if (lead.status === 'LOST') {
          return res.status(400).json({
            success: false,
            error: 'Tasks cannot be created for leads marked as Lost. Please requalify the lead first.',
          });
        }
      }

      // --- Create the task ---
      const task = await prisma.task.create({
        data: {
          title: title.trim(),
          assignedUserId,
          createdBy: userId,
          dueDate: new Date(dueDate),
          leadId: leadId || null,
          customerId: customerId || null,
          ...rest,
        },
        include: taskIncludes,
      });

      res.status(201).json({ success: true, data: task });
    } catch (error: any) {
      console.error('Error creating task:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ---------------------------------------------------------------------------
  // PUT /tasks/:id — update a task
  // ---------------------------------------------------------------------------
  static async updateTask(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const input: UpdateTaskInput = req.body as UpdateTaskInput;

      // --- Fetch existing task ---
      const existing = await prisma.task.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }

      // --- Business rule: Strict Lifecycle Enforcement ---
      // 1. Completed and Cancelled are final states; tasks in these states cannot be edited.
      if (
        existing.status === TaskStatus.COMPLETED ||
        existing.status === TaskStatus.CANCELLED
      ) {
        return res.status(400).json({
          success: false,
          error: `Task is ${existing.status.toLowerCase()} and cannot be edited.`,
        });
      }

      // 2. Validate allowed status transitions
      if (input.status && input.status !== existing.status) {
        if (existing.status === TaskStatus.PENDING) {
          if (
            input.status !== TaskStatus.IN_PROGRESS &&
            input.status !== TaskStatus.CANCELLED
          ) {
            return res.status(400).json({
              success: false,
              error: 'Pending tasks can only transition to In Progress or Cancelled.',
            });
          }
        } else if (existing.status === TaskStatus.IN_PROGRESS) {
          if (input.status !== TaskStatus.COMPLETED) {
            return res.status(400).json({
              success: false,
              error: 'In Progress tasks can only transition to Completed.',
            });
          }
        }
      }

      // --- Validate title if provided ---
      if (input.title !== undefined && !input.title.trim()) {
        return res.status(400).json({ success: false, error: 'Title cannot be empty.' });
      }

      // --- Validate assigned user if provided ---
      if (input.assignedUserId) {
        const user = await prisma.user.findUnique({ where: { id: input.assignedUserId } });
        if (!user) {
          return res.status(400).json({ success: false, error: 'Assigned user does not exist.' });
        }
      }

      // --- Build update payload ---
      const updateData: any = { ...input };
      if (input.dueDate) updateData.dueDate = new Date(input.dueDate);
      if (input.title) updateData.title = input.title.trim();
      
      // Cleanse empty strings for relations so Prisma can disconnect them if needed
      if (input.leadId === '') updateData.leadId = null;
      if (input.customerId === '') updateData.customerId = null;
      if (input.remarks === '') updateData.remarks = null;
      if (input.description === '') updateData.description = null;

      const task = await prisma.task.update({
        where: { id },
        data: updateData,
        include: taskIncludes,
      });

      res.json({ success: true, data: task });
    } catch (error: any) {
      console.error('Error updating task:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ---------------------------------------------------------------------------
  // DELETE /tasks/:id — hard delete (backend only; UI uses Cancel)
  // ---------------------------------------------------------------------------
  static async deleteTask(req: Request, res: Response) {
    try {
      const id = req.params['id'] as string;

      const existing = await prisma.task.findUnique({ where: { id: id } });
      if (!existing) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }

      await prisma.task.delete({ where: { id: id } });
      res.json({ success: true, message: 'Task deleted successfully.' });
    } catch (error: any) {
      console.error('Error deleting task:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ---------------------------------------------------------------------------
  // GET /tasks/today — tasks due today (any non-terminal status)
  // ---------------------------------------------------------------------------
  static async getTodaysTasks(req: Request, res: Response) {
    try {
      const today = new Date();
      const start = startOfDay(today);
      const end = endOfDay(today);

      const tasks = await prisma.task.findMany({
        where: {
          dueDate: { gte: start, lte: end },
          status: { notIn: [TaskStatus.COMPLETED, TaskStatus.CANCELLED] },
        },
        include: taskIncludes,
        orderBy: { dueDate: 'asc' },
      });

      res.json({ success: true, data: tasks });
    } catch (error: any) {
      console.error('Error fetching today\'s tasks:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ---------------------------------------------------------------------------
  // GET /tasks/overdue — tasks past their due date and not completed/cancelled
  // ---------------------------------------------------------------------------
  static async getOverdueTasks(req: Request, res: Response) {
    try {
      const today = new Date();
      const start = startOfDay(today);

      const tasks = await prisma.task.findMany({
        where: {
          dueDate: { lt: start },
          status: { notIn: [TaskStatus.COMPLETED, TaskStatus.CANCELLED] },
        },
        include: taskIncludes,
        orderBy: { dueDate: 'asc' },
      });

      res.json({ success: true, data: tasks });
    } catch (error: any) {
      console.error('Error fetching overdue tasks:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
