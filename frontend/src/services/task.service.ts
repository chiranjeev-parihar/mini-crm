import { get, post, put, del } from './api';
import { Task, PaginatedTasks, CreateTaskInput, UpdateTaskInput } from '../types/task';

export interface TaskFilters {
  query?: string;
  status?: string;
  priority?: string;
  dueToday?: boolean;
  overdue?: boolean;
  page?: number;
  limit?: number;
}

export const getTasks = async (filters: TaskFilters = {}): Promise<PaginatedTasks> => {
  const params = new URLSearchParams();
  if (filters.query) params.set('query', filters.query);
  if (filters.status) params.set('status', filters.status);
  if (filters.priority) params.set('priority', filters.priority);
  if (filters.dueToday) params.set('dueToday', 'true');
  if (filters.overdue) params.set('overdue', 'true');
  params.set('page', String(filters.page ?? 1));
  params.set('limit', String(filters.limit ?? 10));

  const result = await get<{ data: PaginatedTasks }>(`/tasks?${params.toString()}`);
  return result.data;
};

export const getTaskById = async (id: string): Promise<Task> => {
  const result = await get<{ data: Task }>(`/tasks/${id}`);
  return result.data;
};

export const createTask = async (data: CreateTaskInput): Promise<Task> => {
  const result = await post<{ data: Task }>('/tasks', data);
  return result.data;
};

export const updateTask = async (id: string, data: UpdateTaskInput): Promise<Task> => {
  const result = await put<{ data: Task }>(`/tasks/${id}`, data);
  return result.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await del(`/tasks/${id}`);
};

export const getTodaysTasks = async (): Promise<Task[]> => {
  const result = await get<{ data: Task[] }>('/tasks/today');
  return result.data;
};

export const getOverdueTasks = async (): Promise<Task[]> => {
  const result = await get<{ data: Task[] }>('/tasks/overdue');
  return result.data;
};
