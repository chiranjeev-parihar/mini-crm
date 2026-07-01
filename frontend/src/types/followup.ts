export enum FollowUpType {
  PHONE_CALL = 'PHONE_CALL',
  WHATSAPP = 'WHATSAPP',
  EMAIL = 'EMAIL',
  MEETING = 'MEETING',
  SITE_VISIT = 'SITE_VISIT',
  DEMO = 'DEMO',
  OTHER = 'OTHER',
}

export enum FollowUpStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  MISSED = 'MISSED',
  CANCELLED = 'CANCELLED',
}

export enum FollowUpPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface FollowUp {
  id: string;
  leadId: string;
  followUpDate: string;
  followUpTime?: string;
  reminderTime?: string;
  type: FollowUpType;
  status: FollowUpStatus;
  priority: FollowUpPriority;
  notes?: string;
  outcomeNotes?: string;
  nextFollowUpDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  lead?: {
    id: string;
    fullName: string;
  };
  creator?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateFollowUpInput {
  leadId: string;
  followUpDate: string;
  followUpTime?: string;
  reminderTime?: string;
  type: FollowUpType;
  priority: FollowUpPriority;
  notes?: string;
}

export interface UpdateFollowUpInput {
  followUpDate?: string;
  followUpTime?: string;
  reminderTime?: string;
  type?: FollowUpType;
  priority?: FollowUpPriority;
  status?: FollowUpStatus;
  notes?: string;
  outcomeNotes?: string;
  nextFollowUpDate?: string;
}
