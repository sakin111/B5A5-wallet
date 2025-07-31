/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorHandlerReturn, TErrorSources } from "../interfaces/error.types"



export const handleZodError = (err: any) : TErrorHandlerReturn =>{

  const errorSource: TErrorSources[] = []
  err.issues.forEach((issue: any) => {
      errorSource.push({
        path: issue.path[issue.path.length - 1],
        message: issue.message
      })
    })

    return{
      statusCode : 400,
      message: "zod error",
      errorSource
    }
}