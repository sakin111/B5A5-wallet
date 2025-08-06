

import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { AgentService } from './agent.service';

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await AgentService.getAgentProfile(req.user._id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Agent profile fetched successfully',
    data: result,
  });
});


const getMyTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await AgentService.getAgentTransactions(req.user._id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Agent transactions fetched successfully',
    data: result,
  });
});

const getMyCommissions = catchAsync(async (req: Request, res: Response) => {
  const result = await AgentService.getAgentCommissionHistory(req.user._id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Agent commission history fetched successfully',
    data: result,
  });
});

export const AgentController = {
  getMyProfile,
  getMyTransactions,
  getMyCommissions,
};
