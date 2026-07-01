import {
  FollowUp as PrismaFollowUp,
  FollowUpType,
  FollowUpStatus,
  FollowUpPriority,
} from '@prisma/client';

export type FollowUp = PrismaFollowUp;

export interface CreateFollowUpInput {
  leadId: string;
  followUpDate: string; // ISO date string
  followUpTime?: string; // HH:mm
  reminderTime?: string; // HH:mm
  type?: FollowUpType;
  priority?: FollowUpPriority;
  notes?: string;
  nextFollowUpDate?: string;
}

export interface UpdateFollowUpInput {
  followUpDate?: string;
  followUpTime?: string;
  reminderTime?: string;
  type?: FollowUpType;
  priority?: FollowUpPriority;
  notes?: string;
  outcomeNotes?: string;
  status?: FollowUpStatus;
  nextFollowUpDate?: string;
}
