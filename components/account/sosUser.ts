import { apiRequest } from '../../common/lib/request/apiRequest-sidecar'
import { IApiRequestState } from '../../common/lib/request/apiRequestState'
import { sos } from '../../common/lib/sos/sos-sidecar'
import Router from 'next/router'

export interface IStateUser {
  username: string
  password: string
  token: string
  requestLogin: IApiRequestState<any>
  // requestLogout: IApiRequestState<any>
}

const getSos = sos.createLazySos2<IStateUser>('sosUser', 1, () => {
  return {
    username: {
      default: '',
      localStorage: true,
    },
    password: {
      default: '',
    },
    token: {
      default: '',
      localStorage: true,
    },
    requestLogin: {
      default: {},
    },
  }
})
export const useSubscribe = sos.createUseSubscribe(getSos)

export async function updateForm(newState: Partial<IStateUser>) {
  getSos().patchDeep(newState)
}

export function ensureAdmin() {
  return ensureLoggedIn() // All users admins for now
}
export function ensureLoggedIn() {
  if (!getToken()) {
    // TODO: redirect
    return false
  }
  return true
}

export function getToken() {
  return getSos().getState().token
}

export async function login() {
  let state = getSos().getState()

  //apiRequest.clearAuth()
  await apiRequest.post<any>(
    '/api/account/login',
    { username: state.username, password: state.password },
    (r) => {
      getSos().change((ds) => {
        ds.requestLogin = r
        if (r.isSuccess) {
          ds.token = r.response.token

          apiRequest.setAuth(r.response.token, r.response.username)

          setTimeout(() => {
            //   route.navTo('/people/search')
            Router.push('/people/search')
          }, 1)
          getSos().change((ds) => {
            ds.password = ''
          })
        }
      })
    },
  )
}

export function logout() {
  getSos().change((ds) => {
    ds.password = ''
    ds.token = ''
    ds.username = ''
  })
  apiRequest.clearAuth()
  // TODO: redirect
}

apiRequest.setOnInvalidTokenFunction(() => {
  logout() // We need to reauthenticate
})
