import { NextApiRequest, NextApiResponse } from 'next'
import { postJson } from './lib/apiUtil'
import { apiRegister } from './api'
import { apiArguments } from './lib/apiArguments-sidecar'

const table = 'b2p_people_v5'
import { db } from './lib/databaseB2P'
import { l } from '../common/lib/lodash'
import { parseB2PDate, B2PDateFormat } from '../components/people/sosB2P'
import { DateTime } from 'luxon'

export function installAll() {
  apiRegister('/reports/covid-update', runReport_covidUpdate)
  apiRegister('/reports/monthly-mail-volume', runReport_monthlyMailVolume)
}

function createEmptyMonthlyMailVolume(year: number) {
  let months = l.map(l.range(1, 13), (month) => ({
    month,
    monthName: DateTime.local(year, month, 1).toFormat('LLLL'),
    booksSent: 0,
    packagesSent: 0,
    lettersScreened: 0,
  }))

  return {
    year,
    months,
    totals: {
      booksSent: 0,
      packagesSent: 0,
      lettersScreened: 0,
    },
  }
}

export async function runReport_monthlyMailVolume(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return postJson(req, res, async (req, user) => {
    let year =
      apiArguments.getArgumentInteger(req, 'year') || DateTime.local().year
    let organization = user?.organization
    let report = createEmptyMonthlyMailVolume(year)

    let results = await db
      .from(table)
      .select()
      .where({ organization })
      .where('deleted', false)
      .orderBy('id')

    l.forEach(results, (person) => {
      l.forEach(person.json.Packages || [], (p: any) => {
        if (p.IsDeleted || p.IsReturned) {
          return
        }

        let packageDate = parseB2PDate(p.Date || '')
        if (!packageDate || packageDate.year !== year) {
          return
        }

        let month = report.months[packageDate.month - 1]
        month.packagesSent++
        report.totals.packagesSent++

        l.forEach(p.Items || [], (item: any) => {
          if (!item.IsDeleted && !item.IsReturned) {
            month.booksSent++
            report.totals.booksSent++
          }
        })
      })

      l.forEach(person.json.Screens || [], (screenDate: string) => {
        let parsedScreenDate = DateTime.fromISO(screenDate)
        if (!parsedScreenDate.isValid || parsedScreenDate.year !== year) {
          return
        }

        let month = report.months[parsedScreenDate.month - 1]
        month.lettersScreened++
        report.totals.lettersScreened++
      })
    })

    return report
  })
}

export async function runReport_covidUpdate(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return postJson(req, res, async (req, user) => {
    // let guid = apiArguments.getArgumentString(req, 'guid')
    // let organization = user?.organization

    // let results = await db.from(table).select().where({ organization, guid })

    let limit = 999999999 //500000
    let organization = user?.organization

    let query = db
      .from(table)
      .select()
      .where({ organization })
      .orderBy('id')
      .limit(limit)

    query.where('deleted', false)

    // l.forEach(searchParts, (c) => {
    //   query = query.where('search', 'like', '%' + c + '%')
    // })

    let startDate = DateTime.fromISO('2019-01-01') // Jan 1 2019
    const getMostRecentOrder = (
      r: any,
    ): { recent: DateTime | null; all: string; isValid: boolean } => {
      let recent: DateTime | null = null
      let all = ''
      let isValid = false

      l.forEach(r.json.Packages, (p: any) => {
        if (!p.IsDeleted && !p.IsReturned) {
          let d = parseB2PDate(p.Date)
          if (!recent) {
            recent = d
          } else {
            if (d && d > recent) {
              recent = d
            }
          }
          if (recent && recent >= startDate) {
            isValid = true
          }
          all += p.Date + ' '
        }
      })
      return { recent, all, isValid }
    }

    let results = await query
    let processed = l.map(results, (c) => {
      let ro = getMostRecentOrder(c)
      let recent = ro.recent ? ro.recent.toFormat(B2PDateFormat) : null
      return {
        name: c.json.FullName || '',
        preferredName: c.json.PreferredName || '',
        city: c.json.City || '',
        zip: c.json.Zip || '',
        unit: c.json.Unit || '',
        state: c.json.State || '',
        address: c.json.Address || '',
        institution: c.json.Institution || '',
        notes: c.json.Notes || '',
        id: c.json.Id || '',
        aka: c.json.Aka || '',
        // numPack: c.json.NumPackagesThisYear,
        recent: recent,
        // all: ro.all,
        isValid: ro.isValid,
      }
    })
    processed = l.filter(processed, (f) => f.isValid)

    return {
      num: results.length,
      num2: processed.length,
      processed: processed,
      // records: l.map(results, (c) => c),
    }

    // return { record: { hello: 'world' } }
  })
}
