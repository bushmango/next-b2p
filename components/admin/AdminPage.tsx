import React from 'react'

import { Layout } from '../layout/Layout'
import { ApiTest } from './ApiTest'
import { sosAdmin } from './sosAdmin-sidecar'
import { sosUser } from '../account/sosUser-sidecar'
import { sosB2P } from '../people/sosB2P-sidecar'
import { Button } from '../../common/components/button/Button'

export const AdminPage = () => {
  if (!sosUser.ensureAdmin()) {
    return null
  }

  let state = sosB2P.useSubscribe()
  let stateAdmin = sosAdmin.useSubscribe()

  return (
    <Layout title='Admin'>
      <h1>Admin</h1>

      <ApiTest
        func={sosB2P.fetchPeopleCount}
        label='People Count'
        request={state.requestPeopleCount}
      />
      <Button
        onClick={() => {
          // var file_path = 'host/path/file.ext'
          let a = document.createElement('a')
          a.href =
            '/api/api?path=backup-database&token=' +
            encodeURIComponent(sosUser.getToken())
          // a.download =
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }}
      >
        Backup Database to JSON file
      </Button>
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
