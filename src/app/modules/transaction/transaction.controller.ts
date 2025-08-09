
import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

import { transactionService } from './transaction.service';
import { sendResponse } from '../../utils/sendResponse';
import { catchAsync } from '../../utils/catchAsync';


const sendMoney = catchAsync(async (req: Request, res: Response,) => {
  const result = await transactionService.sendMoney(req.user.userId, req.body.toUserId, req.body.amount);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Money sent successfully',
    data: result,
  });
});

const withdraw = catchAsync(async (req: Request, res: Response) => {
  const result = await transactionService.withdrawMoney(req.user.userId, req.body.amount);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Withdraw successful',
    data: result,
  });
});

const cashIn = catchAsync(async (req: Request, res: Response) => {
  const result = await transactionService.cashIn(req.user._id, req.body.toUserId, req.body.amount);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cash-in successful',
    data: result,
  });
});

const cashOut = catchAsync(async (req: Request, res: Response) => {

   const agentId = req.user._id; 
  const { userId, amount } = req.body;
  const result = await transactionService.cashOut(agentId, userId, amount);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cash-out successful',
    data: result,
  });
});

const getMyTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await transactionService.getMyTransactions(req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Transaction history fetched successfully',
    data: result,
  });
});

export const TransactionController = {
  sendMoney,
  withdraw,
  cashIn,
  cashOut,
  getMyTransactions,
};
