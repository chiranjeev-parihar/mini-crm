import { Router } from 'express';
import * as leadController from '../controllers/lead.controller';
import * as customerController from '../controllers/customer.controller';

const router = Router();

router.get('/', leadController.getLeads);
router.get('/:id', leadController.getLeadById);
router.post('/', leadController.createLead);
router.put('/:id', leadController.updateLead);
router.delete('/:id', leadController.deleteLead);

// Lead → Customer conversion
router.post('/:id/convert', customerController.convertLead);

export { router as leadRoutes };
