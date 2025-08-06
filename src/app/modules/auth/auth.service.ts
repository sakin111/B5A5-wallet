/* eslint-disable @typescript-eslint/no-unused-vars */
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs"
import { envVar } from "../../config/env"
import { JwtPayload } from "jsonwebtoken"
import AppError from "../../errorBuilder/AppError"
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userToken"


const credentialsLogin = async (payload: Partial<IUser>) => {
    
      if (!payload || !payload.email || !payload.password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email and password are required");
  }
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
    }

    const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string)

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    const userTokens = createUserTokens(isUserExist)

    const { password: pass, ...rest } = isUserExist.toObject()

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }

}


const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    return {
        accessToken: newAccessToken
    }

}


const resetPassword = async (oldPassword : string, newPassword : string, decodedToken: JwtPayload) => {
   

  const user = await User.findById(decodedToken.userId)

  const oldPasswordMatch = await bcrypt.compare(oldPassword, user?.password as string)
      if (!oldPasswordMatch) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    if (user) {
        user.password = await bcrypt.hash(newPassword, Number(envVar.BCRYPT_SALT_ROUND));
        await user.save();
    } else {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    }
}

 export const authServices = {
   credentialsLogin,
    getNewAccessToken,
    resetPassword
}