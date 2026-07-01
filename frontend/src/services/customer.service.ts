import type { Customer, PaginatedCustomers } from '../types/customer';
import { get, put, del, post } from './api';

// ---------------------------------------------------------------------------
// List / Search
// ---------------------------------------------------------------------------

export const getCustomers = async (
  query = '',
  page = 1,
  limit = 10
): Promise<PaginatedCustomers> => {
  const params = new URLSearchParams({
    query,
    page: page.toString(),
    limit: limit.toString(),
  });

  const result = await get<{ data: PaginatedCustomers }>(`/customers?${params.toString()}`);
  return result.data;
};

// ---------------------------------------------------------------------------
// Single record
// ---------------------------------------------------------------------------

export const getCustomerById = async (id: string): Promise<Customer> => {
  const result = await get<{ data: Customer }>(`/customers/${id}`);
  return result.data;
};

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

export const updateCustomer = async (
  id: string,
  data: Partial<Customer>
): Promise<Customer> => {
  const result = await put<{ data: Customer }>(`/customers/${id}`, data);
  return result.data;
};

// ---------------------------------------------------------------------------
// Lead → Customer conversion
// ---------------------------------------------------------------------------

export const convertLead = async (
  leadId: string,
  conversionReason?: string
): Promise<Customer> => {
  const result = await post<{ data: Customer }>(`/leads/${leadId}/convert`, {
    conversionReason,
  });
  return result.data;
};

// ---------------------------------------------------------------------------
// Delete (internal; no UI trigger)
// ---------------------------------------------------------------------------

export const deleteCustomer = async (id: string): Promise<void> => {
  await del(`/customers/${id}`);
};
