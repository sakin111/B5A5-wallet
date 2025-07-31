/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose"
import { TErrorHandlerReturn } from "../interfaces/error.types"


// cast error
export const handleCastError = (err: mongoose.Error.CastError) : TErrorHandlerReturn => {
  return {
    statusCode: 400,
    message: "invalid mongoDB objectId please provide valid Id"
  }
}