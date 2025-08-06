
import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import httpStatus from 'http-status-codes';
import { AdminService } from './admin.service';
import { sendResponse } from '../../utils/sendResponse';
import { SystemService } from '../system/system.service';

const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getAllUsers();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const getAllWallets = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getAllWallets();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Wallets retrieved successfully',
    data: result,
  });
});

const getAllTransactions = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getAllTransactions();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Transactions retrieved successfully',
    data: result,
  });
});

const blockWallet = catchAsync(async (req: Request, res: Response) => {
  const walletId = req.params.id;
  const result = await AdminService.blockWallet(walletId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Wallet blocked successfully',
    data: result,
  });
});

const unblockWallet = catchAsync(async (req: Request, res: Response) => {
  const walletId = req.params.id;
  const result = await AdminService.unblockWallet(walletId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Wallet unblocked successfully',
    data: result,
  });
});

const approveAgent = catchAsync(async (req: Request, res: Response) => {
  const agentId = req.params.id;
  const result = await AdminService.approveAgent(agentId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Agent approved successfully',
    data: result,
  });
});

const suspendAgent = catchAsync(async (req: Request, res: Response) => {
  const agentId = req.params.id;
  const result = await AdminService.suspendAgent(agentId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Agent suspended successfully',
    data: result,
  });
});

const getCommissionRate = catchAsync(async (req: Request, res: Response) => {
  const rate = await SystemService.getCommissionRate();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Current commission rate retrieved',
    data: { commissionRate: rate },
  });
});

const setCommissionRate = catchAsync(async (req: Request, res: Response) => {
  const { rate } = req.body;
  const result = await SystemService.setCommissionRate(rate);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Commission rate updated successfully',
    data: result,
  });
});


export const AdminController = {
  getAllUsers,
  getAllWallets,
  getAllTransactions,
  blockWallet,
  unblockWallet,
  approveAgent,
  suspendAgent,
};
