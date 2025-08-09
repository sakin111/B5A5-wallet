
import express from 'express';

import { validateRequest } from '../../middleware/validateRequest';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../user/user.interface';
import { AddMoneySchema } from './wallet.validation';
import { walletController } from './wallet.controller';



const router = express.Router();

router.get('/me', checkAuth(Role.USER ), walletController.getMyWallet);
router.post('/add-money', checkAuth(Role.USER), validateRequest(AddMoneySchema), walletController.addMoney);
router.patch('/block/:userId', checkAuth(Role.ADMIN), walletController.blockWallet);
router.patch('/unblock/:userId', checkAuth(Role.ADMIN), walletController.unblockWallet);

export const WalletRoutes = router