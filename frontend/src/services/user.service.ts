import { get } from './api';
import { UserOption } from '../types/task';

/** Fetch all users for the "Assign To" dropdown */
export const getUsers = async (): Promise<UserOption[]> => {
  const result = await get<{ data: UserOption[] }>('/users');
  return result.data;
};
