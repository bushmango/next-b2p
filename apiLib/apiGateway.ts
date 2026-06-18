import { apiRegister } from './api'
import { apiAccount } from './apiAccount-sidecar'
import { apiPeople } from './apiPeople-sidecar'
import { apiBooks } from './apiBooks-sidecar'
import { apiReports } from './apiReports-sidecar'
import { apiBackupDatabase } from './apiBackupDatabase-sidecar'
import { apiGiphy } from './apiGiphy-sidecar'
import { apiStateRestrictions } from './apiStateRestrictions-sidecar'

export function registerAll() {
  apiRegister('/account/login', apiAccount.login)
  apiRegister('/people/count', apiPeople.count)
  apiRegister('/people/search', apiPeople.search)
  apiRegister('/people/get', apiPeople.get)
  apiRegister('/people/add', apiPeople.add)
  apiRegister('/people/set', apiPeople.set)
  apiRegister('/people/rebuildSearchIndex', apiPeople.rebuildSearchIndex)
  apiRegister('/giphy/random', apiGiphy.random)
  apiRegister('/stateRestrictions/search', apiStateRestrictions.search)
  apiRegister('/stateRestrictions/set', apiStateRestrictions.set)
  apiRegister('/stateRestrictions/add', apiStateRestrictions.add)
  apiRegister(
    '/stateRestrictions/setupAndSeed',
    apiStateRestrictions.setupAndSeed,
  )
  apiReports.installAll()
  apiBooks.installAll()
  apiBackupDatabase.installAll()
}
