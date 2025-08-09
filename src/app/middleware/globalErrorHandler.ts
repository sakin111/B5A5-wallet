/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { envVar } from "../config/env"
import { handlerDuplicateError } from "../helperError/handleDuplicateError"
import { handleCastError } from "../helperError/handleCastError"
import { handleZodError } from "../helperError/handleZodError"
import { handleValidationError } from "../helperError/handleValidationError"
import AppError from "../errorBuilder/AppError"











export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {


  let statusCode = 500
  let message = `something went wrong ${err.message}from global error`

  let errorSource: any = []

  // duplicate error
  if (err.code === 11000) {
    const simplifyError = handlerDuplicateError(err)
    statusCode = simplifyError.statusCode
    message = simplifyError.message
  }


  // cast error
  else if (err.name === "CastError") {

    const castThat = handleCastError(err)
    statusCode = castThat.statusCode
    message = castThat.message
  }

  // zod error
  else if (err.name === "ZodError") {
    const simplifyError = handleZodError(err)
    statusCode = simplifyError.statusCode
    errorSource = simplifyError.errorSource
    message = simplifyError.message
  }


  // mongoose validation error
  else if (err.name === "ValidationError") {
    const simpleValidation = handleValidationError(err)
    statusCode = simpleValidation.statusCode
    errorSource = simpleValidation.errorSource
    message = simpleValidation.message
  }
  else if (err instanceof AppError) {
    statusCode = err.statusCode
    message = err.message
  }
  else if (err instanceof Error) {
    statusCode = 500
    message = err.message
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    err: envVar.NODE_ENV === "development" ? err : null,
    stack: envVar.NODE_ENV === "development" ? err.stack : null


  })
}