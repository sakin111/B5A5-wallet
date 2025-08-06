import express from 'express';
import { AgentController } from './agent.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../user/user.interface';

const router = express.Router();

router.get('/me', checkAuth(Role.AGENT), AgentController.getMyProfile);
router.get('/transactions', checkAuth(Role.AGENT), AgentController.getMyTransactions);
router.get('/commissions', checkAuth(Role.AGENT), AgentController.getMyCommissions);

export const AgentRoutes = router;

