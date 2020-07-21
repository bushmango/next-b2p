import { NextApiRequest, NextApiResponse } from 'next'
import { postJson } from './lib/apiUtil'
import { apiRegister } from './api'

const table = 'b2p_people_v5'
import { db } from './lib/databaseB2P'
import { l } from '../common/lib/lodash'
import { parseB2PDate, B2PDateFormat } from '../components/people/sosB2P'
import { DateTime } from 'luxon'

export function installAll() {
  apiRegister('/reports/covid-update', runReport_covidUpdate)
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
