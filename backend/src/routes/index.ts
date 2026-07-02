import { Router } from 'express';
import { healthRoutes } from './health.routes';
import { authRoutes } from './auth.routes';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

// Protected routes — all routes below this line require a valid JWT
router.use(authenticate);

import { leadRoutes } from './lead.routes';
import { customerRoutes } from './customer.routes';
import { followupRoutes } from './followup.routes';
import { taskRoutes } from './task.routes';
import { usersRoutes } from './users.routes';
import { prisma } from '../config/prisma';
import { startOfDay, endOfDay } from 'date-fns';
import { FollowUpStatus, TaskStatus } from '@prisma/client';

router.use('/leads', leadRoutes);
router.use('/customers', customerRoutes);
router.use('/followups', followupRoutes);
router.use('/tasks', taskRoutes);
router.use('/users', usersRoutes);

// Protected dashboard endpoint
router.get('/dashboard', async (_req, res) => {
  try {
    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);

    const [
      totalLeads,
      activeCustomers,
      todaysFollowUps,
      pendingTasks,
      tasksDueToday,
      tasksCompletedToday,
      overdueTasksCount,
      todaysTasks,
      completedTodayFollowUps,
      upcomingFollowUps,
      missedFollowUps,
      todaysSchedule,
    ] = await Promise.all([
      // Leads & customers
      prisma.lead.count(),
      prisma.customer.count(),

      // Follow-up stats
      prisma.followUp.count({
        where: { followUpDate: { gte: start, lte: end } },
      }),

      // Real task stats (replaces fake pendingTasks from leads)
      prisma.task.count({ where: { status: TaskStatus.PENDING } }),

      prisma.task.count({
        where: {
          dueDate: { gte: start, lte: end },
          status: { notIn: [TaskStatus.COMPLETED, TaskStatus.CANCELLED] },
        },
      }),

      prisma.task.count({
        where: {
          status: TaskStatus.COMPLETED,
          updatedAt: { gte: start, lte: end },
        },
      }),

      prisma.task.count({
        where: {
          dueDate: { lt: start },
          status: { notIn: [TaskStatus.COMPLETED, TaskStatus.CANCELLED] },
        },
      }),

      // Today's Tasks — for the dashboard widget (ordered chronologically)
      prisma.task.findMany({
        where: {
          dueDate: { gte: start, lte: end },
          status: { notIn: [TaskStatus.COMPLETED, TaskStatus.CANCELLED] },
        },
        include: {
          assignedUser: { select: { id: true, name: true } },
          lead: { select: { id: true, fullName: true } },
        },
        orderBy: { dueDate: 'asc' },
        take: 10,
      }),

      // Follow-up stats (existing)
      prisma.followUp.count({
        where: {
          status: FollowUpStatus.COMPLETED,
          updatedAt: { gte: start, lte: end },
        },
      }),
      prisma.followUp.count({
        where: {
          followUpDate: { gt: end },
          status: { not: FollowUpStatus.COMPLETED },
        },
      }),
      prisma.followUp.count({
        where: {
          followUpDate: { lt: start },
          status: { not: FollowUpStatus.COMPLETED },
        },
      }),

      // Today's follow-up schedule
      prisma.followUp.findMany({
        where: { followUpDate: { gte: start, lte: end } },
        include: { lead: { select: { fullName: true } } },
        orderBy: { followUpTime: 'asc' },
      }),
    ]);

    res.json({
      success: true,
      message: 'Dashboard data',
      data: {
        user: _req.user,
        stats: {
          totalLeads,
          activeCustomers,
          todaysFollowUps,
          pendingTasks,
          tasksDueToday,
          tasksCompletedToday,
          overdueTasksCount,
          completedTodayFollowUps,
          upcomingFollowUps,
          missedFollowUps,
        },
        todaysTasks,
        todaysSchedule,
      },
    });
  } catch (error: any) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export { router as routes };
