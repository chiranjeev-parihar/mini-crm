import { get, post, put, del } from './api';
import { FollowUp, CreateFollowUpInput, UpdateFollowUpInput } from '../types/followup';

export const getFollowUps = async (): Promise<FollowUp[]> => {
  const result = await get<{ data: FollowUp[] }>('/followups');
  return result.data;
};

export const getTodaysFollowUps = async (): Promise<FollowUp[]> => {
  const result = await get<{ data: FollowUp[] }>('/followups/today');
  return result.data;
};

export const getUpcomingFollowUps = async (): Promise<FollowUp[]> => {
  const result = await get<{ data: FollowUp[] }>('/followups/upcoming');
  return result.data;
};

export const getFollowUpById = async (id: string): Promise<FollowUp> => {
  const result = await get<{ data: FollowUp }>(`/followups/${id}`);
  return result.data;
};

export const createFollowUp = async (input: CreateFollowUpInput): Promise<FollowUp> => {
  const result = await post<{ data: FollowUp }>('/followups', input);
  return result.data;
};

export const updateFollowUp = async (id: string, input: UpdateFollowUpInput): Promise<FollowUp> => {
  const result = await put<{ data: FollowUp }>(`/followups/${id}`, input);
  return result.data;
};

export const deleteFollowUp = async (id: string): Promise<void> => {
  await del(`/followups/${id}`);
};
