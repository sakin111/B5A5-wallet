import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { CommissionService } from './commission.service';

const getMyCommissions = catchAsync(async (req: Request, res: Response) => {
  const agentId = req.user._id;

  const commissions = await CommissionService.getAgentCommissions(agentId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Agent commission history fetched successfully',
    data: commissions,
  });
});

const getAllCommissions = catchAsync(async (_req: Request, res: Response) => {
  const commissions = await CommissionService.getAllCommissions();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All commissions fetched successfully',
    data: commissions,
  });
});

export const CommissionController = {
  getMyCommissions,
  getAllCommissions,
};
