import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { CommissionService } from './commission.service';



const getAgentCommission = catchAsync(async (req : Request, res: Response) => {
  const agentId = req.user.userId
  const singleCommission = await CommissionService.getAgentCommissionSummary(agentId);
    sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'agent commissions fetched successfully',
    data: singleCommission,
  });
});


const getAllCommissions = catchAsync(async (req: Request, res: Response) => {
  const commissions = await CommissionService.getAllCommissions();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All commissions fetched successfully',
    data: commissions,
  });
});

export const CommissionController = {
  getAgentCommission,
  getAllCommissions,
};
