import React, { useEffect } from 'react'

import { Layout } from '../layout/Layout'
import { ApiTest } from './ApiTest'
import { sosAdmin } from './sosAdmin-sidecar'
import { sosUser } from '../account/sosUser-sidecar'
import { sosB2P } from '../people/sosB2P-sidecar'
import { Button } from '../../common/components/button/Button'
import { group } from 'console'

export const AdminPage = () => {
  if (!sosUser.ensureAdmin()) {
    return null
  }

  let state = sosB2P.useSubscribe()
  let stateAdmin = sosAdmin.useSubscribe()

  useEffect(() => {
    sosB2P.fetchPeopleCount()
  }, [])

  let buckets = []
  let maxGroups = 0
  if (state.requestPeopleCount.isSuccess) {
    const bAmount = 7500
    let bMin = 0
    let bMax = bAmount - 1
    let iGroup = 1
    while (bMin <= state.requestPeopleCount.response.count) {
      maxGroups = iGroup
      buckets.push({ min: bMin, max: bMax, group: iGroup })
      bMin = bMax
      bMax += bAmount
      iGroup++
    }
  }

  return (
    <Layout title='Admin'>
      <h1>Admin</h1>

      {/* <ApiTest
        func={sosB2P.fetchPeopleCount}
        label='People Count'
        request={state.requestPeopleCount}
      /> */}

      {state.requestPeopleCount.isFetching && (
        <div>Fetching database people count...</div>
      )}
      {state.requestPeopleCount.error && <div>People count error :(</div>}
      {state.requestPeopleCount.isSuccess && (
        <div>People Count: {state.requestPeopleCount.response.count}</div>
      )}

      {state.requestPeopleCount.isSuccess &&
        buckets.map((bucket) => (
          <div>
            <Button
              onClick={() => {
                // var file_path = 'host/path/file.ext'
                let a = document.createElement('a')
                a.href =
                  `/api/api?path=backup-database&group=${encodeURIComponent(
                    bucket.group,
                  )}&min=${encodeURIComponent(
                    bucket.min,
                  )}&max=${encodeURIComponent(
                    bucket.max,
                  )}&token=${encodeURIComponent(sosUser.getToken())}` +
                  // a.download =
                  document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              }}
            >
              Backup Database to JSON file Part {bucket.group} / {maxGroups}
            </Button>
          </div>
        ))}

      {/* 
      <ApiTest
        func={sosAdmin.backupDatabase}
        label='Backup Database2'
        request={stateAdmin.requestBackupDatabase}
      /> */}

      {/* <ApiTest
        func={sosAdmin.testConnection}
        label='Test Connection'
        request={stateAdmin.requestTestConnection}
      /> */}

      {/* <ApiTest
        func={sosAdmin.rebuildPeopleSearchIndex}
        label={`Rebuild Index - ${stateAdmin.rebuildCount}`}
        request={stateAdmin.requestRebuildPeopleSearchIndex}
      />

      <ApiTest
        func={sosAdmin.restoreDatabase}
        label='Restore Database'
        request={stateAdmin.requestRestoreDatabase}
      />

      <ApiTest
        func={sosAdmin.backupDatabase}
        label='Backup Database'
        request={stateAdmin.requestBackupDatabase}
      />

      <ApiTest
        func={sosAdmin.grantDatabase}
        label='Grant to Bushmango'
        request={stateAdmin.requestGrantDatabase}
      /> */}
    </Layout>
  )
}
