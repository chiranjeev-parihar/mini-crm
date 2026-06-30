import { Router } from 'express';
import * as leadController from '../controllers/lead.controller';

const router = Router();

router.get('/', leadController.getLeads);
router.get('/:id', leadController.getLeadById);
router.post('/', leadController.createLead);
router.put('/:id', leadController.updateLead);
router.delete('/:id', leadController.deleteLead);

export { router as leadRoutes };
