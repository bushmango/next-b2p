import fetch from 'isomorphic-unfetch'
import { l } from '../lodash'
import {
  createError,
  createRequesting,
  createSuccess,
  IApiRequestState,
} from './apiRequestState'

export async function get<T>(
  url: string,
  data: any,
  onProgress: (r: IApiRequestState<T>) => void,
) {
  return request<T>('GET', url, data, onProgress)
}
export async function post<T>(
  url: string,
  data: any,
  onProgress: (r: IApiRequestState<T>) => void,
) {
  return request<T>('POST', url, data, onProgress)
}

let authToken = ''
let authUsername = ''
if (typeof localStorage !== 'undefined') {
  authToken = localStorage.getItem('api:authToken') || ''
  authUsername = localStorage.getItem('api:authUsername') || ''
}
let onInvalidToken = () => {
  alert('Your auth token is invalid - please login again')
}
export function setOnInvalidTokenFunction(func: () => void) {
  onInvalidToken = func
}
export function setAuth(_authToken: string, _authUsername: string) {
  authToken = _authToken
  authUsername = _authUsername
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('api:authToken', authToken)
    localStorage.setItem('api:authUsername', authUsername)
  }
}
export function clearAuth() {
  setAuth('', '')
}

let doFetch = async (url: string, options: any) => {
  let result = await fetch(url, options)
  return result
}

export function overrideDoFetch(newFunc: any) {
  doFetch = newFunc
}

export async function request<T>(
  method: string,
  url: string,
  data: any,
  onProgress: (r: IApiRequestState<T>) => void,
) {
  let r = createRequesting()
  onProgress(r)

  if (!url.startsWith('/api/')) {
    throw new Error(`url must start with /api/ ${url}`)
  }

  data = l.assign(
    {},
    { token: authToken, username: authUsername, path: url },
    data,
  )
  try {
    let result = await doFetch('/api/api', {
      //url, {
      method,
      body: method === 'POST' ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (result.ok) {
      let json = await result.json()

      if (json.error || json.isError) {
        if (json.error === 'invalid-token' || json.error === 'no-token') {
          console.log('error', json.error)
          clearAuth()
          onInvalidToken()
        }
        r = createError(r, json.error)
        onProgress(r)
      } else {
        r = createSuccess(r, json)
        console.log('r', r, json)
        onProgress(r)
      }
      return r
    } else {
      r = createError(r, {
        isError: true,
        error: result.status,
        text: result.statusText,
        errorType: 'server-request',
      })
      onProgress(r)
      return r
    }
  } catch (err) {
    r = createError(r, err)
    onProgress(r)
    return r
  }
}

export async function getFile<T>(url: string, data: any) {
  return request<T>('GETFILE', url, data, () => {})
}
