import { TaskPriority, TaskStatus } from '@prisma/client';

/** Input for creating a new task */
export interface CreateTaskInput {
  title: string;
  description?: string;
  assignedUserId: string;
  leadId?: string;
  customerId?: string;
  dueDate: string; // ISO date string from request body
  priority?: TaskPriority;
  status?: TaskStatus;
  remarks?: string;
}

/** Input for updating an existing task */
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  assignedUserId?: string;
  leadId?: string;
  customerId?: string;
  dueDate?: string; // ISO date string from request body
  priority?: TaskPriority;
  status?: TaskStatus;
  remarks?: string;
}
