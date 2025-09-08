

import express from 'express';
import { checkAuth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { TransactionController } from './transaction.controller';
import { CashInSchema, CashOutSchema, SendMoneySchema, WithdrawSchema } from './transaction.validation';
import { Role } from '../user/user.interface';




const router = express.Router();

// Users
router.get('/me', checkAuth(Role.USER, Role.AGENT), TransactionController.getMyTransactions);
router.post('/send', checkAuth(Role.USER), validateRequest(SendMoneySchema), TransactionController.sendMoney);
router.post('/withdraw', checkAuth(Role.USER), validateRequest(WithdrawSchema), TransactionController.cashOut);

// Agents
router.post('/cash-in', checkAuth(Role.AGENT), validateRequest(CashInSchema), TransactionController.cashIn);
router.post('/cash-out', checkAuth(Role.AGENT), validateRequest(CashOutSchema), TransactionController.cashOut);

export const TransactionRoutes = router;
