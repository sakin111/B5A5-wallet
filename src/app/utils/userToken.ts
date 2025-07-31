import { JwtPayload } from "jsonwebtoken";
import { envVar } from "../config/env";
import { IStatus, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyTokens } from "./jwt";
import httpStatus from "http-status-codes"
import AppError from "../errorBuilder/AppError";


export const createUserTokens = (user: Partial<IUser>) =>{
   const accessPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,

  }

  const accessToken = generateToken(accessPayload, envVar.JWT_ACCESS_SECRET, envVar.JWT_ACCESS_EXPIRE)
   const refreshToken = generateToken(accessPayload,envVar.JWT_REFRESH_SECRET, envVar.JWT_REFRESH_EXPIRE)

   return {
    accessToken,
    refreshToken
   }
}

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {

    const verifiedRefreshToken = verifyTokens(refreshToken, envVar.JWT_REFRESH_SECRET) as JwtPayload


    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    }
    if (isUserExist.status === IStatus.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.status}`)
    }
    

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }
    const accessToken = generateToken(jwtPayload, envVar.JWT_ACCESS_SECRET, envVar.JWT_ACCESS_EXPIRE)

    return accessToken
}