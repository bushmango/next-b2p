import React from 'react'
import { sosUser } from '../account/sosUser-sidecar'
import { ApiTest } from '../admin/ApiTest'
import { sosAdmin } from '../admin/sosAdmin-sidecar'
import { Layout } from '../layout/Layout'
import { sosB2P } from '../people/sosB2P-sidecar'

export const ReportCovidUpdate = () => {
  if (!sosUser.ensureAdmin()) {
    return null
  }

  let state = sosB2P.useSubscribe()
  let stateAdmin = sosAdmin.useSubscribe()

  return (
    <Layout title='Report Covid Update'>
      <h1>Report</h1>
      <div>
        LGBT Books to Prisoners is looking to do a mass mailing to people who
        have written to us just to give them a little note and an update on the
        project's status during the pandemic. Is it possible to export the
        database into a spreadsheet we could use to more easily facilitate this
        process? The most important information we would need is the Name,
        preferred name, address fields, and when their most recent order was (we
        will be pulling from the last year or so... Jan 2019 on). If the export
        contains a lot of other information you don't need to worry about
        cleaning it, we can handle that, as long as those fields are available
        to us. Thank you for your help (as always!) with the database, we
        greatly appreciate it. If you need anything from us please let me know.
      </div>
      <br />
      <div>
        Name, preferred name, address fields, and when their most recent order
        was (we will be pulling from the last year or so... Jan 2019 on)
      </div>
      {/* <Button onClick={() => {}}>Run report</Button> */}

      <ApiTest
        func={sosAdmin.runReport_covidUpdate}
        label='Run Covid Update Report'
        request={stateAdmin.requestReport}
      />
    </Layout>
  )
}
