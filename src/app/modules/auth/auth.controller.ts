
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes";
import { authServices } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorBuilder/AppError";
import { createUserTokens } from "../../utils/userToken";
import { setAuthCookies } from "../../utils/setCookies";





const CredentialLogin = catchAsync(async (req: Request, res: Response) => {
    const loginInfo = await authServices.credentialsLogin(req.body)
  
    const user = loginInfo.user;
  
    const userToken = createUserTokens(user);
  
    setAuthCookies(res, userToken);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "user login successful",
      data: {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: user
      }
    });
  });


const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    throw new AppError(httpStatus.BAD_REQUEST, "can not found refresh token")
  }
  const tokenInfo = await authServices.getNewAccessToken(refreshToken)


  //   res.cookie("accessToken ", tokenInfo.accessToken,{
  //   httpOnly: true,
  //   secure: false
  // } )
  setAuthCookies(res, tokenInfo)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "user retrieved successfully",
    data: tokenInfo


  })
})


const logout = catchAsync(async (req: Request, res: Response) => {


  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  })



  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  })

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "user logged out successfully",
    data: null


  })
})



const resetPassword = catchAsync(async (req: Request, res: Response) => {

  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const decodedToken = req.user;
  await authServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)




  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "password changed successfully",
    data: null


  })
})




export const authController = {
  CredentialLogin,
  getNewAccessToken,
  logout,
  resetPassword,
}