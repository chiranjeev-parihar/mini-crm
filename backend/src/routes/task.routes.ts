import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';

const router = Router();

// Special routes must come before /:id
router.get('/today', TaskController.getTodaysTasks);
router.get('/overdue', TaskController.getOverdueTasks);

router.get('/', TaskController.getAllTasks);
router.get('/:id', TaskController.getTaskById);
router.post('/', TaskController.createTask);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

export { router as taskRoutes };
