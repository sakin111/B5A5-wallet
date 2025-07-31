import { Response } from "express"


export interface AuthToken {
    accessToken ? : string,
    refreshToken ? : string
}

export const setAuthCookies = (res : Response, tokenInfo : AuthToken) =>{
   if(tokenInfo.accessToken){
          res.cookie("accessToken ", tokenInfo.accessToken,{
        httpOnly: true,
        secure: false
      } )
   }
   if(tokenInfo.refreshToken){
          res.cookie("accessToken ", tokenInfo.refreshToken,{
        httpOnly: true,
        secure: false
      } )
   }
}