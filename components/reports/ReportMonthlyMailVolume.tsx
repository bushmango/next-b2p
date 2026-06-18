import React, { useEffect } from 'react'
import { Button } from '../../common/components/button/Button'
import { Input } from '../../common/components/input/Input'
import { Loader } from '../../common/components/loader/Loader'
import { ClientOnlyLoggedIn } from '../account/ClientOnlyLoggedIn'
import { Layout } from '../layout/Layout'
import { sosReports } from './sosReports-sidecar'

export const ReportMonthlyMailVolume = () => {
  return (
    <Layout title='Monthly Mail Volume'>
      <ClientOnlyLoggedIn>
        <ReportMonthlyMailVolumeContent />
      </ClientOnlyLoggedIn>
    </Layout>
  )
}

const ReportMonthlyMailVolumeContent = () => {
  let state = sosReports.useSubscribe()
  let report = state.monthlyMailVolumeReport

  useEffect(() => {
    sosReports.fetchMonthlyMailVolume()
  }, [])

  return (
    <div>
      <h1>Monthly Mail Volume</h1>

      <div>
        <label>
          Year{' '}
          <Input
            value={'' + state.monthlyMailVolumeYear}
            onChangeImmediate={(newVal) => {
              let year = parseInt(newVal, 10)
              if (!isNaN(year)) {
                sosReports.updateMonthlyMailVolumeYear(year)
              }
            }}
            width='80px'
          />
        </label>
        <Button onClick={() => sosReports.fetchMonthlyMailVolume()}>
          Refresh
        </Button>
      </div>

      <Loader isLoading={!!state.requestMonthlyMailVolume.isFetching} />

      {state.requestMonthlyMailVolume.error && (
        <div>Error loading monthly mail volume report.</div>
      )}

      {report && (
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Books Sent</th>
              <th>Packages Sent</th>
              <th>Letters Screened</th>
            </tr>
          </thead>
          <tbody>
            {report.months.map((month) => (
              <tr key={month.month}>
                <td>{month.monthName}</td>
                <td>{month.booksSent}</td>
                <td>{month.packagesSent}</td>
                <td>{month.lettersScreened}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
              <th>{report.totals.booksSent}</th>
              <th>{report.totals.packagesSent}</th>
              <th>{report.totals.lettersScreened}</th>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  )
}
