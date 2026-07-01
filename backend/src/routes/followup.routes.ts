import { Router } from 'express';
import { FollowUpController } from '../controllers/followup.controller';

const router = Router();

router.get('/today', FollowUpController.getTodaysFollowUps);
router.get('/upcoming', FollowUpController.getUpcomingFollowUps);
router.get('/', FollowUpController.getAllFollowUps);
router.get('/:id', FollowUpController.getFollowUpById);
router.post('/', FollowUpController.createFollowUp);
router.put('/:id', FollowUpController.updateFollowUp);
router.delete('/:id', FollowUpController.deleteFollowUp);

export { router as followupRoutes };
