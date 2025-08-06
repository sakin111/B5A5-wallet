import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { SystemService } from './system.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';

const getCommissionRate = catchAsync(async (_req: Request, res: Response) => {
  const rate = await SystemService.getCommissionRate();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Commission rate fetched successfully',
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

export const SystemController = {
  getCommissionRate,
  setCommissionRate,
};

