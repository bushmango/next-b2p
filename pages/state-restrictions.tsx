import React from 'react'
import { StateRestrictionsPage } from '../components/stateRestrictions/StateRestrictionsPage'
import { b2pDebugDefs } from '../lib/b2pDebugDefs'
import { Layout } from '../components/layout/Layout'

export default function StateRestrictions() {
  if (!b2pDebugDefs.featureFlag_allowStateRestrictionsPage) {
    return (
      <Layout title='State Restrictions'>
        <div>State Restrictions are not enabled.</div>
      </Layout>
    )
  }

  return <StateRestrictionsPage />
}
