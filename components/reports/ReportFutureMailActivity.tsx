import React, { useEffect } from 'react'
import { Button } from '../../common/components/button/Button'
import { InternalLink } from '../../common/components/internal-link/InternalLink'
import { Loader } from '../../common/components/loader/Loader'
import { ClientOnlyLoggedIn } from '../account/ClientOnlyLoggedIn'
import { Layout } from '../layout/Layout'
import { sosReports } from './sosReports-sidecar'

export const ReportFutureMailActivity = () => {
  return (
    <Layout title='Future Mail Activity'>
      <ClientOnlyLoggedIn>
        <ReportFutureMailActivityContent />
      </ClientOnlyLoggedIn>
    </Layout>
  )
}

const ReportFutureMailActivityContent = () => {
  let state = sosReports.useSubscribe()
  let report = state.futureMailActivityReport

  useEffect(() => {
    sosReports.fetchFutureMailActivity()
  }, [])

  return (
    <div>
      <h1>Future Mail Activity</h1>

      <div>
        <Button onClick={() => sosReports.fetchFutureMailActivity()}>
          Refresh
        </Button>
      </div>

      <Loader isLoading={!!state.requestFutureMailActivity.isFetching} />

      {state.requestFutureMailActivity.error && (
        <div>Error loading future mail activity report.</div>
      )}

      {report && (
        <>
          <p>
            Found {report.count} package, book, or screened letter date(s) after{' '}
            {report.today}.
          </p>

          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Date</th>
                <th>Person</th>
                <th>Location</th>
                <th>Details</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {report.rows.map((row, index) => (
                <tr key={`${row.guid}-${row.type}-${row.isoDate}-${index}`}>
                  <td>{row.type}</td>
                  <td>{row.date}</td>
                  <td>
                    <InternalLink href={`/people/edit/${row.guid}`}>
                      {row.personName || row.guid}
                    </InternalLink>
                  </td>
                  <td>{row.location}</td>
                  <td>{row.details}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
              {report.rows.length === 0 && (
                <tr>
                  <td colSpan={6}>No future mail activity found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
