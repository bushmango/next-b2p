import React, { useEffect, useState } from 'react'

import { Layout } from '../layout/Layout'
import { sosUser } from '../account/sosUser-sidecar'
import { sosB2P } from '../people/sosB2P-sidecar'
import { Button } from '../../common/components/button/Button'
import { ClientOnlyLoggedIn } from '../account/ClientOnlyLoggedIn'
import { sosStateRestrictions } from '../stateRestrictions/sosStateRestrictions-sidecar'
import { b2pDebugDefs } from '../../lib/b2pDebugDefs'

type BackupBucket = {
  min: number
  max: number
  group: number
}

export const AdminPage = () => {
  return (
    <Layout title='Admin'>
      <ClientOnlyLoggedIn>
        <AdminPageContent />
      </ClientOnlyLoggedIn>
    </Layout>
  )
}

const getFilenameFromContentDisposition = (contentDisposition: string) => {
  let match = contentDisposition.match(/filename="([^"]+)"/)
  if (match) {
    return match[1]
  }

  match = contentDisposition.match(/filename=([^;]+)/)
  return match ? match[1].trim() : ''
}

const saveBlob = (blob: Blob, fileName: string) => {
  let a = document.createElement('a')
  let objectUrl = URL.createObjectURL(blob)
  a.href = objectUrl
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(objectUrl)
}

const downloadBackupBucket = async (
  bucket: BackupBucket,
  backupStartedAt: string,
) => {
  let result = await fetch(
    '/api/api?p=' + encodeURIComponent('/api/admin/backup-database'),
    {
      method: 'POST',
      body: JSON.stringify({
        path: '/api/admin/backup-database',
        token: sosUser.getToken(),
        group: bucket.group,
        min: bucket.min,
        max: bucket.max,
        backupStartedAt,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  if (!result.ok) {
    throw new Error(`Backup download failed with status ${result.status}`)
  }

  let blob = await result.blob()
  let fileName =
    getFilenameFromContentDisposition(
      result.headers.get('Content-Disposition') || '',
    ) || `backup-lgbt-b2p-database-${bucket.group}.zip`
  saveBlob(blob, fileName)
}

const downloadBackupBucketsInSequence = async (
  buckets: BackupBucket[],
  backupStartedAt: string,
  onProgress: (completed: number) => void,
) => {
  onProgress(0)
  for (const bucket of buckets) {
    await downloadBackupBucket(bucket, backupStartedAt)
    onProgress(bucket.group)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}

const AdminPageContent = () => {
  let state = sosB2P.useSubscribe()
  let stateRestrictionsState = sosStateRestrictions.useSubscribe()
  const [backupProgress, setBackupProgress] = useState({
    isRunning: false,
    completed: 0,
  })

  useEffect(() => {
    sosB2P.fetchPeopleCount()
  }, [])

  let buckets: BackupBucket[] = []
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
    <React.Fragment>
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

      {b2pDebugDefs.featureFlag_allowStateRestrictionsSeed && (
        <div>
          <Button onClick={() => sosStateRestrictions.setupAndSeed()}>
            Setup/seed state restrictions
          </Button>
          {stateRestrictionsState.requestSetupSeed.isFetching && (
            <span> Setting up...</span>
          )}
          {stateRestrictionsState.requestSetupSeed.error && (
            <span>
              {' '}
              Setup failed:{' '}
              {stateRestrictionsState.requestSetupSeed.error.message ||
                stateRestrictionsState.requestSetupSeed.error}
            </span>
          )}
          {stateRestrictionsState.requestSetupSeed.isSuccess && (
            <span>
              {' '}
              {stateRestrictionsState.requestSetupSeed.response.message ||
                `Seeded ${stateRestrictionsState.requestSetupSeed.response.insertedStates} states`}
            </span>
          )}
        </div>
      )}

      {state.requestPeopleCount.isSuccess && buckets.length > 0 && (
        <div>
          <Button
            onClick={async () => {
              if (backupProgress.isRunning) {
                return
              }
              const backupStartedAt = new Date().toISOString()
              setBackupProgress({ isRunning: true, completed: 0 })
              await downloadBackupBucketsInSequence(
                buckets,
                backupStartedAt,
                (completed) => {
                  setBackupProgress({ isRunning: true, completed })
                },
              )
              setBackupProgress({
                isRunning: false,
                completed: buckets.length,
              })
            }}
          >
            Backup Database to JSON (All Parts)
          </Button>
          {(backupProgress.isRunning || backupProgress.completed > 0) && (
            <span>
              {' '}
              {backupProgress.isRunning ? 'Downloading' : 'Downloaded'}{' '}
              {backupProgress.completed} / {buckets.length}
            </span>
          )}
        </div>
      )}

      {state.requestPeopleCount.isSuccess &&
        buckets.map((bucket) => (
          <div key={bucket.group}>
            <Button
              onClick={async () => {
                await downloadBackupBucket(bucket, new Date().toISOString())
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
    </React.Fragment>
  )
}
