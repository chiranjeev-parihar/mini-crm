import { Router } from 'express';
import { login } from '../controllers/auth.controller';

const router = Router();

/**
 * POST /api/auth/login
 * Public route — authenticates user credentials and returns a JWT.
 */
router.post('/login', login);

export { router as authRoutes };
