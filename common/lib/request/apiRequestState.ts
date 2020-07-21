let currentRequestId = 100
export interface IApiRequestState<T> {
  isPrefetched?: boolean
  isFetching?: boolean
  isSuccess?: boolean
  response?: T
  error?: any
  startTime?: string
  endTime?: string
  requestId?: number
  params?: string
}

export const createDefault = <T extends any>(): IApiRequestState<T> => {
  return {
    isFetching: false,
    requestId: 0,
  }
}
export const createRequesting = <T extends any>(): IApiRequestState<T> => {
  return {
    isFetching: true,
    requestId: currentRequestId++,
    startTime: new Date().toISOString(),
  }
}
export const createSuccess = <T extends any>(
  request: IApiRequestState<T>,
  response: T,
): IApiRequestState<T> => {
  return {
    isFetching: false,
    requestId: request && request.requestId,
    startTime: request && request.startTime,
    endTime: new Date().toISOString(),
    response,
    isSuccess: response && (response as any).isSuccess,
  }
}
export const createError = <T extends any>(
  request: IApiRequestState<T>,
  error: any,
): IApiRequestState<T> => {
  return {
    isFetching: false,
    requestId: request && request.requestId,
    startTime: request && request.startTime,
    endTime: new Date().toISOString(),
    error,
  }
}
