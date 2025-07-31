/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose"
import { TErrorHandlerReturn, TErrorSources } from "../interfaces/error.types"


export const handleValidationError = (err: mongoose.Error.ValidationError) : TErrorHandlerReturn => {

  const errorSource: TErrorSources[] = []
  const errors = Object.values(err.errors)

  errors.forEach((errorObject: any) => errorSource.push({
    path: errorObject.path,
    message: errorObject.message

  }))
  return {
    statusCode: 400,
    message: "validation error",
    errorSource
  }
}

