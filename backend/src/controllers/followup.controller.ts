import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { CreateFollowUpInput, UpdateFollowUpInput } from '../types/followup';
import { FollowUpStatus } from '@prisma/client';
import { endOfDay, startOfDay } from 'date-fns';

export class FollowUpController {
  // Get all followups
  static async getAllFollowUps(req: Request, res: Response) {
    try {
      const followUps = await prisma.followUp.findMany({
        include: {
          lead: true,
          creator: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: {
          followUpDate: 'asc',
        },
      });
      res.json({ success: true, data: followUps });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get single followup
  static async getFollowUpById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const followUp = await prisma.followUp.findUnique({
        where: { id },
        include: {
          lead: true,
          creator: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      if (!followUp) {
        return res.status(404).json({ success: false, error: 'Follow-up not found' });
      }

      res.json({ success: true, data: followUp });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Create followup
  static async createFollowUp(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const input: CreateFollowUpInput = req.body;
      const { leadId, followUpDate, ...rest } = input;

      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (!lead) {
        return res.status(404).json({ success: false, error: 'Lead not found' });
      }

      const followUp = await prisma.followUp.create({
        data: {
          leadId,
          followUpDate: new Date(followUpDate),
          createdBy: userId,
          ...rest,
        },
        include: {
          lead: true,
        },
      });

      res.status(201).json({ success: true, data: followUp });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Update followup
  static async updateFollowUp(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const input: UpdateFollowUpInput = req.body;

      const existing = await prisma.followUp.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ success: false, error: 'Follow-up not found' });
      }

      if (existing.status === FollowUpStatus.COMPLETED) {
        return res.status(400).json({ success: false, error: 'Completed follow-ups cannot be edited' });
      }

      const updateData: any = { ...input };
      if (input.followUpDate) updateData.followUpDate = new Date(input.followUpDate);
      if (input.nextFollowUpDate) updateData.nextFollowUpDate = new Date(input.nextFollowUpDate);

      const followUp = await prisma.followUp.update({
        where: { id },
        data: updateData,
        include: {
          lead: true,
        },
      });

      res.json({ success: true, data: followUp });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Delete followup
  static async deleteFollowUp(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await prisma.followUp.delete({ where: { id } });
      res.json({ success: true, message: 'Follow-up deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get today's followups
  static async getTodaysFollowUps(req: Request, res: Response) {
    try {
      const today = new Date();
      const start = startOfDay(today);
      const end = endOfDay(today);

      const followUps = await prisma.followUp.findMany({
        where: {
          followUpDate: {
            gte: start,
            lte: end,
          },
        },
        include: {
          lead: true,
        },
        orderBy: {
          followUpTime: 'asc',
        },
      });

      res.json({ success: true, data: followUps });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get upcoming followups
  static async getUpcomingFollowUps(req: Request, res: Response) {
    try {
      const today = new Date();
      const startOfTomorrow = startOfDay(new Date(today.getTime() + 24 * 60 * 60 * 1000));

      const followUps = await prisma.followUp.findMany({
        where: {
          followUpDate: {
            gte: startOfTomorrow,
          },
          status: {
            not: FollowUpStatus.COMPLETED,
          }
        },
        include: {
          lead: true,
        },
        orderBy: {
          followUpDate: 'asc',
        },
      });

      res.json({ success: true, data: followUps });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
