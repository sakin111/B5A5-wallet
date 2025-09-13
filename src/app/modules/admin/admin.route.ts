import express from 'express';

import { Role } from '../user/user.interface';
import { checkAuth } from '../../middleware/checkAuth';
import { AdminController } from './admin.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { updateAdminZodSchema } from './admin.validation';

const router = express.Router();

router.get('/users', checkAuth(Role.ADMIN), AdminController.getAllUsers);
router.get('/wallets', checkAuth(Role.ADMIN), AdminController.getAllWallets);
router.get('/allTransactions', checkAuth(Role.ADMIN), AdminController.getAllTransactions);
router.get('/transactions', checkAuth(Role.ADMIN), AdminController.AllTransactions);
router.get("/adminProfile", checkAuth(...Object.values(Role)), AdminController.AdminProfile)

router.patch('/agents/:id/approve', checkAuth(Role.ADMIN), AdminController.approveAgent);
router.patch('/agents/:id/suspend', checkAuth(Role.ADMIN), AdminController.suspendAgent);
router.patch('/agents/:id/active', checkAuth(Role.ADMIN), AdminController.activeAgent);
router.patch("/:id", validateRequest(updateAdminZodSchema), checkAuth(...Object.values(Role)), AdminController.updatedAdmin)


export const AdminRoutes = router;

