import express from 'express';
import { checkAuth } from '../../middleware/checkAuth';
import { CommissionController } from './commission.controller';
import { Role } from '../user/user.interface';

const router = express.Router();

router.get('/my-commissions', checkAuth(Role.AGENT), CommissionController.getMyCommissions);
router.get('/all-commission', checkAuth(Role.ADMIN), CommissionController.getAllCommissions);

export const CommissionRoutes = router;

