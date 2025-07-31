/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorHandlerReturn } from "../interfaces/error.types"


// duplication error
export const handlerDuplicateError = (err: any) : TErrorHandlerReturn => {
  const duplicate = err.message.match(/"([^"]*)"/)
  return {
    statusCode: 400,
    message: ` ${duplicate[1]} already exist!!`
  }
}

