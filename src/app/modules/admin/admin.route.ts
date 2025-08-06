import express from 'express';

import { Role } from '../user/user.interface';
import { checkAuth } from '../../middleware/checkAuth';
import { AdminController } from './admin.controller';

const router = express.Router();

router.get('/users', checkAuth(Role.ADMIN), AdminController.getAllUsers);
router.get('/wallets', checkAuth(Role.ADMIN), AdminController.getAllWallets);
router.get('/transactions', checkAuth(Role.ADMIN), AdminController.getAllTransactions);

router.patch('/wallets/:id/block', checkAuth(Role.ADMIN), AdminController.blockWallet);
router.patch('/wallets/:id/unblock', checkAuth(Role.ADMIN), AdminController.unblockWallet);

router.patch('/agents/:id/approve', checkAuth(Role.ADMIN), AdminController.approveAgent);
router.patch('/agents/:id/suspend', checkAuth(Role.ADMIN), AdminController.suspendAgent);

export const AdminRoutes = router;

