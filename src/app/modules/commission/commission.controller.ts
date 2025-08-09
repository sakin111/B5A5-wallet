import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { CommissionService } from './commission.service';
import { userService } from '../user/user.service';



const getAgentCommission = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const result = await userService.getAgentCommissionById(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User commission retrieved successfully",
    data: result.data,
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
