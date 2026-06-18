import React from 'react'
import { InternalLink } from '../../common/components/internal-link/InternalLink'
import { b2pDebugDefs } from '../../lib/b2pDebugDefs'
import { ClientOnlyLoggedIn } from '../account/ClientOnlyLoggedIn'
import { Layout } from '../layout/Layout'

export const ReportsPage = () => {
  return (
    <Layout title='Reports'>
      <ClientOnlyLoggedIn>
        <ReportsPageContent />
      </ClientOnlyLoggedIn>
    </Layout>
  )
}

const ReportsPageContent = () => {
  return (
    <div>
      <h1>Reports</h1>
      <table>
        <thead>
          <tr>
            <th>Report</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <InternalLink href='/reports/monthly-mail-volume'>
                Monthly Mail Volume
              </InternalLink>
            </td>
            <td>
              Books sent, packages sent, and letters screened by month for a
              selected year.
            </td>
          </tr>
          <tr>
            <td>
              <InternalLink href='/reports/future-mail-activity'>
                Future Mail Activity
              </InternalLink>
            </td>
            <td>
              Packages, books, and screened letters dated after today.
            </td>
          </tr>
          {b2pDebugDefs.featureFlag_allowCovidReport && (
            <tr>
              <td>
                <InternalLink href='/reports/covid-update'>
                  Covid Update Report
                </InternalLink>
              </td>
              <td>Export people with recent package activity for mailing.</td>
            </tr>
          )}
          {/* <tr>
            <td>
              <InternalLink href='/reports/covid-update'>
                Covid Update Report
              </InternalLink>
            </td>
            <td>Export people with recent package activity for mailing.</td>
          </tr> */}
        </tbody>
      </table>
    </div>
  )
}
