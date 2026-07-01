export interface Customer {
  id: string;
  leadId: string;
  company?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  industry?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  /** Included via Prisma relation */
  lead?: {
    id: string;
    fullName: string;
    status: string;
    source?: string;
    assignedTo?: string;
    convertedAt?: string;
    conversionReason?: string;
    assignee?: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface PaginatedCustomers {
  items: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
