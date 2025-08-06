import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { Request, Response } from "express";
import { walletService } from "./wallet.service";



 const getMyWallet = catchAsync(async(req: Request, res: Response, ) =>{

     const userId = req.user.id;
     const result = await walletService.getWallet(userId)

         sendResponse(res,{
           success: true,
           statusCode: httpStatus.CREATED,
           message: "user created successfully",
           data: result
         
            
         })
 }) 



  const addMoney = catchAsync(async(req: Request, res: Response) =>{
 
      const wallet= await walletService.addMoney(req.user.id, req.body.amount)
 
          sendResponse(res,{
            success: true,
            statusCode: httpStatus.CREATED,
            message: "money added successfully",
            data: wallet
          
             
          })
  }) 

  const blockWallet = catchAsync(async(req: Request, res: Response) =>{
    const walletId = req.params.id;
    const result = await walletService.blockWallet(walletId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Wallet blocked successfully',
      data: result,
    });
  })


 export const walletController = {
    getMyWallet,
    addMoney,
    blockWallet
 } 