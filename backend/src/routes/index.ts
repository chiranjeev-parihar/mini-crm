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

router.use('/leads', leadRoutes);
router.use('/customers', customerRoutes);

// Protected dashboard endpoint (returns authenticated user info)
router.get('/dashboard', (_req, res) => {
  res.json({
    success: true,
    message: 'Dashboard data',
    data: { user: _req.user },
  });
});

export { router as routes };

