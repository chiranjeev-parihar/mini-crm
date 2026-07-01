import { Router } from 'express';
import * as customerController from '../controllers/customer.controller';

const router = Router();

router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomerById);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

export { router as customerRoutes };
