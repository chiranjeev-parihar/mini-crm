import { Lead, PaginatedLeads } from '../types/lead';
import { get, post, put, del } from './api';

export const getLeads = async (
  query = '',
  status = '',
  page = 1,
  limit = 10
): Promise<PaginatedLeads> => {
  const params = new URLSearchParams({
    query,
    status,
    page: page.toString(),
    limit: limit.toString(),
  });

  const result = await get<{ data: PaginatedLeads }>(`/leads?${params.toString()}`);
  return result.data;
};

export const getLeadById = async (id: string): Promise<Lead> => {
  const result = await get<{ data: Lead }>(`/leads/${id}`);
  return result.data;
};

export const createLead = async (data: Partial<Lead>): Promise<Lead> => {
  const result = await post<{ data: Lead }>('/leads', data);
  return result.data;
};

export const updateLead = async (id: string, data: Partial<Lead>): Promise<Lead> => {
  const result = await put<{ data: Lead }>(`/leads/${id}`, data);
  return result.data;
};

export const deleteLead = async (id: string): Promise<void> => {
  await del(`/leads/${id}`);
};
