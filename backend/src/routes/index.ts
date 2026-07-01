import { Router } from 'express';
import { healthRoutes } from './health.routes';
import { authRoutes } from './auth.routes';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

// Protected routes — all routes below this line require a valid JWT
router.use(authenticate);

import { leadRoutes } from './lead.routes';
import { customerRoutes } from './customer.routes';
import { followupRoutes } from './followup.routes';
import { prisma } from '../config/prisma';
import { startOfDay, endOfDay } from 'date-fns';
import { FollowUpStatus } from '@prisma/client';

router.use('/leads', leadRoutes);
router.use('/customers', customerRoutes);
router.use('/followups', followupRoutes);

// Protected dashboard endpoint
router.get('/dashboard', async (_req, res) => {
  try {
    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);

    const [
      totalLeads, 
      activeCustomers, 
      todaysFollowUps, 
      pendingTasks,
      completedTodayFollowUps,
      upcomingFollowUps,
      missedFollowUps,
      todaysSchedule
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.customer.count(),
      prisma.followUp.count({
        where: {
          followUpDate: {
            gte: start,
            lte: end,
          }
        }
      }),
      prisma.lead.count({ where: { status: 'NEW' } }), // Fake pending tasks for now
      prisma.followUp.count({
        where: {
          status: FollowUpStatus.COMPLETED,
          updatedAt: { // Completed today (using updatedAt or followUpDate)
            gte: start,
            lte: end,
          }
        }
      }),
      prisma.followUp.count({
        where: {
          followUpDate: {
            gt: end,
          },
          status: {
            not: FollowUpStatus.COMPLETED
          }
        }
      }),
      prisma.followUp.count({
        where: {
          followUpDate: {
            lt: start,
          },
          status: {
            not: FollowUpStatus.COMPLETED
          }
        }
      }),
      prisma.followUp.findMany({
        where: {
          followUpDate: {
            gte: start,
            lte: end,
          }
        },
        include: {
          lead: {
            select: { fullName: true }
          }
        },
        orderBy: {
          followUpTime: 'asc'
        }
      })
    ]);

    res.json({
      success: true,
      message: 'Dashboard data',
      data: { 
        user: _req.user,
        stats: {
          totalLeads,
          activeCustomers,
          todaysFollowUps,
          pendingTasks,
          completedTodayFollowUps,
          upcomingFollowUps,
          missedFollowUps
        },
        todaysSchedule
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export { router as routes };

