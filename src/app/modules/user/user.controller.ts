

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";






 const createUser = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{


     const result = await userService.createUser(req.body)


         sendResponse(res,{
           success: true,
           statusCode: httpStatus.CREATED,
           message: "user created successfully",
           data: result
         
            
         })
 }) 
 const updatedUser = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{

  const userId = req.params.id
  const verifyToken = req.user

     const payload = req.body
     const result = await userService.updateUser(userId, payload, verifyToken)

         sendResponse(res,{
           success: true,
           statusCode: httpStatus.CREATED,
           message: "user updated  successfully",
           data: result
         
            
         })
 }) 

const  getAllUser = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
        const result = await userService.getAllUser()
        sendResponse(res,{
           success: true,
           statusCode: httpStatus.OK,
           message: "user retrieve successfully",
           data: result.data,
           meta: result.meta
         
            
         })
})



export const UserController ={
    createUser,
    getAllUser,
    updatedUser
    
}