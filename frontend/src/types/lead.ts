export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  PROPOSAL_SENT = 'PROPOSAL_SENT',
  NEGOTIATION = 'NEGOTIATION',
  WON = 'WON',
  LOST = 'LOST',
}

export interface Lead {
  id: string;
  fullName: string;
  company?: string;
  phone?: string;
  email?: string;
  source?: string;
  status: LeadStatus;
  assignedTo?: string;
  address?: string;
  notes?: string;
  /** Conversion tracking fields */
  isConverted?: boolean;
  convertedAt?: string;
  conversionReason?: string;
  createdAt: string;
  updatedAt: string;
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PaginatedLeads {
  items: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
