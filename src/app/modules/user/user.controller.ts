

import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { IUser } from "./user.interface";






 const createUser = catchAsync(async(req: Request, res: Response) =>{


     const result = await userService.createUser(req.body)


         sendResponse(res,{
           success: true,
           statusCode: httpStatus.CREATED,
           message: "user created successfully",
           data: result
         
            
         })
 }) 
 const updatedUser = catchAsync(async(req: Request, res: Response) =>{

  const userId = req.params.id
  const verifyToken = req.user
 const payload: Partial<IUser> = req.body;

     const result = await userService.updateUser(userId, payload, verifyToken)

         sendResponse(res,{
           success: true,
           statusCode: httpStatus.OK,
           message: "user updated  successfully",
           data: result
         
            
         })
 }) 

const  getAllUser = catchAsync(async(req: Request, res: Response) =>{
        const result = await userService.getAllUser()
        sendResponse(res,{
           success: true,
           statusCode: httpStatus.OK,
           message: "user retrieve successfully",
           data: result.data,
           meta: result.meta
         
            
         })
})


const  getUserById = catchAsync(async(req: Request, res: Response) =>{
        const userId = req.params.id;
 
        const result = await userService.getUserById(userId)
        sendResponse(res,{
           success: true,
           statusCode: httpStatus.OK,
           message: "user retrieve successfully",
           data: result.data,

         
            
         })
})


const  getMe = catchAsync(async(req: Request, res: Response) =>{
        const userId = req.user.userId;
 
        const result = await userService.getMeService(userId)
        sendResponse(res,{
           success: true,
           statusCode: httpStatus.OK,
           message: "user retrieve successfully",
           data: result.data,

         
            
         })
})





export const UserController ={
    createUser,
    getAllUser,
    updatedUser,
    getUserById,
    getMe
}