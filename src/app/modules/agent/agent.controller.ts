

import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { AgentService } from './agent.service';

const getMyProfile = catchAsync(async (req: Request, res: Response) => {

  const agentId = req.user.userId;
  const result = await AgentService.getAgentProfile(agentId);
 

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Agent profile fetched successfully',
    data: result,
  });
});


const getMyTransactions = catchAsync(async (req: Request, res: Response) => {
  const query = req.query
  const agentId = req.user.userId;
  const result = await AgentService.getAgentTransactions(agentId, query as Record<string, string> );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Agent transactions fetched successfully',
    data: result,
    meta: result.meta
  });
});



export const AgentController = {
  getMyProfile,
  getMyTransactions,
};
