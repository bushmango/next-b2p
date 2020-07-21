import { sos } from '../../common/lib/sos/sos-sidecar'
import { IApiRequestState } from '../../common/lib/request/apiRequestState'
import { apiRequest } from '../../common/lib/request/apiRequest-sidecar'
import { l } from '../../common/lib/lodash'

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
    if (!r.isSuccess || !(r.response as any).numProcessed) {
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
  let result = await apiRequest.post('/api/reports/covid-update', {}, (r) => {
    getSos().change((ds) => {
      // ds.requestReport = r
      ds.requestReport = { s: r.response ? (r.response as any).num2 : '' }
    })
  })

  // see: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side

  let processed = (result.response as any).processed
  console.log('pp', processed)

  const headers = [
    'name',
    'preferredName',
    'recent',
    'city',
    'state',
    'zip',
    'address',
    'unit',
    'institution',
    'notes',
  ]

  function encodeCsv(s: string) {
    if (!s) {
      s = ''
    }
    s = '"' + s.replace(/\"/g, '-') + '"'
    return s
  }

  // let csvContent = 'data:text/csv;charset=utf-8,'
  let csvContent = ''
  l.forEach(headers, (h) => {
    csvContent += encodeCsv(h) + ','
  })
  csvContent += '\r\n'
  l.forEach(processed, (c) => {
    let r = ''
    l.forEach(headers, (h) => {
      r += encodeCsv(c[h]) + ','
    })
    csvContent += r + '\r\n'
  })
  console.log(csvContent)

  var blob = new Blob(['\ufeff', csvContent])
  var url = URL.createObjectURL(blob)

  var encodedUri = encodeURI(csvContent)
  var link = document.createElement('a')
  // link.setAttribute('href', encodedUri)
  link.setAttribute('href', url)
  link.setAttribute('download', 'report.csv')
  document.body.appendChild(link) // Required for FF
  link.click() // This will download the data file named "my_data.csv".
}
