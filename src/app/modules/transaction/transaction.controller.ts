
import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

import { transactionService } from './transaction.service';
import { sendResponse } from '../../utils/sendResponse';
import { catchAsync } from '../../utils/catchAsync';


const sendMoney = catchAsync(async (req: Request, res: Response,) => {
  const result = await transactionService.sendMoney(req.user.email, req.body.toEmail, req.body.amount);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Money sent successfully',
    data: result,
  });
});

const cashOut= catchAsync(async (req: Request, res: Response) => {
  const { agentEmail, amount } = req.body;
  const fromEmail =req.user.email;
  const result = await transactionService.cashOut(fromEmail, agentEmail, amount);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Withdraw successful",
    data: result,
  });
});


const cashIn = catchAsync(async (req: Request, res: Response) => {
  
  const result = await transactionService.cashIn(req.user.email, req.body.toUserId, req.body.amount);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cash-in successful',
    data: result,
  });
});



const getMyTransactions = catchAsync(async (req: Request, res: Response) => {
   const query = req.query
  const result = await transactionService.getMyTransactions(req.user.id, query as Record<string, string>);


  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Transaction history fetched successfully',
    data: result,
    meta: result.meta,
  });
});

const cashOutHistory = catchAsync(async (req: Request, res: Response) => {
  const agentId = req.user.id;
   const query = req.query
  const result = await transactionService.cashOutHistory(agentId, query as Record<string, string>);


  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Transaction history fetched successfully',
    data: result,
    meta: result.meta,
  });
});

export const TransactionController = {
  sendMoney,
  cashIn,
  cashOut,
  getMyTransactions,
  cashOutHistory 
};
