import { DateTime } from 'luxon'
import { apiRequest } from '../../common/lib/request/apiRequest-sidecar'
import { IApiRequestState } from '../../common/lib/request/apiRequestState'
import { sos } from '../../common/lib/sos/sos-sidecar'

export type MonthlyMailVolumeMonth = {
  month: number
  monthName: string
  booksSent: number
  packagesSent: number
  lettersScreened: number
}

export type MonthlyMailVolumeReport = {
  year: number
  months: MonthlyMailVolumeMonth[]
  totals: {
    booksSent: number
    packagesSent: number
    lettersScreened: number
  }
}

export interface IStateReports {
  monthlyMailVolumeYear: number
  requestMonthlyMailVolume: IApiRequestState<MonthlyMailVolumeReport>
  monthlyMailVolumeReport: MonthlyMailVolumeReport | null
}

const getSos = sos.createLazySos2<IStateReports>('sosReports', 1, () => ({
  monthlyMailVolumeYear: { default: DateTime.local().year },
  requestMonthlyMailVolume: { default: {} },
  monthlyMailVolumeReport: { default: null },
}))

export const useSubscribe = sos.createUseSubscribe(getSos)

export function updateMonthlyMailVolumeYear(year: number) {
  getSos().change((ds) => {
    ds.monthlyMailVolumeYear = year
  })
}

export async function fetchMonthlyMailVolume() {
  let state = getSos().getState()
  let result = await apiRequest.post<MonthlyMailVolumeReport>(
    '/api/reports/monthly-mail-volume',
    { year: state.monthlyMailVolumeYear },
    (r) => {
      getSos().change((ds) => {
        ds.requestMonthlyMailVolume = r
      })
    },
  )

  if (result.isSuccess && result.response) {
    let report = result.response
    getSos().change((ds) => {
      ds.monthlyMailVolumeReport = report
    })
  }
}
