import { apiRegister } from './api-sidecar'
import { apiAccount } from './apiAccount-sidecar'
import { apiPeople } from './apiPeople-sidecar'

export function registerAll() {
  apiRegister('/account/login', apiAccount.login)
  apiRegister('/people/count', apiPeople.count)
  apiRegister('/people/search', apiPeople.search)
}
