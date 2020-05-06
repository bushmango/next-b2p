import { apiRegister } from './api-sidecar'
import { apiAccount } from './apiAccount-sidecar'
import { apiPeople } from './apiPeople-sidecar'
import { apiBooks } from './apiBooks-sidecar'

export function registerAll() {
  apiRegister('/account/login', apiAccount.login)
  apiRegister('/people/count', apiPeople.count)
  apiRegister('/people/search', apiPeople.search)
  apiRegister('/people/get', apiPeople.get)
  apiRegister('/people/add', apiPeople.add)
  apiRegister('/people/set', apiPeople.set)
  apiRegister('/people/rebuildSearchIndex', apiPeople.rebuildSearchIndex)
  apiBooks.install()
}
