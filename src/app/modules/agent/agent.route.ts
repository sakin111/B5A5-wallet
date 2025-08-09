
import express from 'express';
import { AgentController } from './agent.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../user/user.interface';

const router = express.Router();

router.get('/me', checkAuth(Role.ADMIN ,Role.AGENT), AgentController.getMyProfile);
router.get('/transactions', checkAuth(Role.ADMIN,Role.AGENT), AgentController.getMyTransactions);


export const agentRoutes = router
