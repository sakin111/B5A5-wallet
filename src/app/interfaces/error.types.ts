

export interface TErrorSources {
  path: string,
  message: string
}

export interface TErrorHandlerReturn {
  statusCode: number,
  message: string,
  errorSource ? : TErrorSources[]
}
