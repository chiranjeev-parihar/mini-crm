import { Router } from 'express';
import { prisma } from '../config/prisma';

const router = Router();

/**
 * GET /users
 * Returns a lightweight list of all users (id, name, email, role).
 * Used to populate "Assign To" dropdowns in the Task form.
 */
router.get('/', async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: users });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export { router as usersRoutes };
