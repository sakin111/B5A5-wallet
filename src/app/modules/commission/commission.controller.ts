import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { CommissionService } from './commission.service';




const getAgentCommission = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId
  const result = await CommissionService.getAgentCommissionSummary(userId);

 

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User commission retrieved successfully",
    data: result.data,
  });
});



const getAllCommissions = catchAsync(async (req: Request, res: Response) => {
  const result = await CommissionService.getAllCommissions(req.query as Record<string, string>);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All commissions fetched successfully',
    data: result.data,  
    meta: result.meta,  
  });
});

export const CommissionController = {
  getAgentCommission,
  getAllCommissions,
};
