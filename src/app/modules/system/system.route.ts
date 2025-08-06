

import express from 'express';
import { checkAuth } from '../../middleware/checkAuth';
import { SystemController } from './system.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { SetCommissionRateSchema } from './system.validation';
import { Role } from '../user/user.interface';

const router = express.Router();

router.get('/commission-rate', checkAuth(Role.ADMIN), SystemController.getCommissionRate);
router.patch(
  '/commission-rate',
  checkAuth(Role.ADMIN),
  validateRequest(SetCommissionRateSchema),
  SystemController.setCommissionRate
);

export const SystemRoutes = router;
