import { Response } from "express"
import { envVar } from "../config/env"


export interface AuthToken {
    accessToken ? : string,
    refreshToken ? : string
}

export const setAuthCookies = (res : Response, tokenInfo : AuthToken) =>{
   if(tokenInfo.accessToken){
        res.cookie("accessToken", tokenInfo.accessToken,{
        httpOnly: true,
        secure: envVar.NODE_ENV === "production",
        sameSite: "none"
      } )
   }
   if(tokenInfo.refreshToken){
          res.cookie("refreshToken", tokenInfo.refreshToken,{
        httpOnly: true,
         secure: envVar.NODE_ENV === "production",
        sameSite: "none"
      } )
   }
}