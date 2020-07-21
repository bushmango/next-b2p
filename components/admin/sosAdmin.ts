import { sos } from '../../common/lib/sos/sos-sidecar'
import { IApiRequestState } from '../../common/lib/request/apiRequestState'
import { apiRequest } from '../../common/lib/request/apiRequest-sidecar'

export interface IStateAdmin {
  requestRebuildPeopleSearchIndex: IApiRequestState<any>
  rebuildCount: number
  requestTestConnection: IApiRequestState<any>
  requestRestoreDatabase: IApiRequestState<any>
  requestBackupDatabase: IApiRequestState<any>
  requestGrantDatabase: IApiRequestState<any>
  requestReport: IApiRequestState<any>
}

const getSos = sos.createLazySos2('sosAdmin', 1, () => ({
  requestRebuildPeopleSearchIndex: {
    default: {},
  },
  requestTestConnection: {
    default: {},
  },
  requestRestoreDatabase: {
    default: {},
  },
  requestBackupDatabase: {
    default: {},
  },
  requestGrantDatabase: {
    default: {},
  },
  requestReport: {
    default: {},
  },
  rebuildCount: {
    default: -1,
  },
}))
export const useSubscribe = sos.createUseSubscribe(getSos)

export async function rebuildPeopleSearchIndex() {
  let limit = 100
  let doContinue = true
  for (let i = 0; doContinue; i += limit) {
    let r = await apiRequest.post(
      '/api/people/rebuild-search-index',
      { skip: i, limit },
      (r) => {
        getSos().change((ds) => {
          ds.rebuildCount = i
          ds.requestRebuildPeopleSearchIndex = r
        })
      },
    )
    if (!r.isSuccess || !r.response.numProcessed) {
      doContinue = false
      break
    }
  }
  getSos().change((ds) => {
    ds.rebuildCount += limit
  })
}

export async function testConnection() {
  await apiRequest.post('/api/connection/test', {}, (r) => {
    getSos().change((ds) => {
      ds.requestTestConnection = r
    })
  })
}

export async function backupDatabase() {
  await apiRequest.getFile('/api/backup/backup', {})
}

export async function restoreDatabase() {
  await apiRequest.post('/api/backup/restore', {}, (r) => {
    getSos().change((ds) => {
      ds.requestRestoreDatabase = r
    })
  })
}

export async function grantDatabase() {
  await apiRequest.post('/api/backup/grant', {}, (r) => {
    getSos().change((ds) => {
      ds.requestGrantDatabase = r
    })
  })
}

export async function runReport_covidUpdate() {
  await apiRequest.post('/api/reports/covid-update', {}, (r) => {
    getSos().change((ds) => {
      ds.requestReport = r
    })
  })
}
