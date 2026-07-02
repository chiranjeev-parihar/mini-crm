/** Task priority matching the Prisma TaskPriority enum */
export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

/** Task lifecycle status matching the Prisma TaskStatus enum */
export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/** Full Task object as returned by the API */
export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedUserId: string;
  leadId?: string;
  customerId?: string;
  createdBy: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  remarks?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  assignedUser?: {
    id: string;
    name: string;
    email: string;
  };
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  lead?: {
    id: string;
    fullName: string;
    status: string;
  };
  customer?: {
    id: string;
    contactPerson?: string;
    company?: string;
  };
}

/** Paginated task list response */
export interface PaginatedTasks {
  items: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Input for creating a task */
export interface CreateTaskInput {
  title: string;
  description?: string;
  assignedUserId: string;
  leadId?: string;
  customerId?: string;
  dueDate: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  remarks?: string;
}

/** Input for updating a task — all fields optional */
export type UpdateTaskInput = Partial<CreateTaskInput> & { status?: TaskStatus };

/** User option in the assign-to dropdown */
export interface UserOption {
  id: string;
  name: string;
  email: string;
  role: string;
}
