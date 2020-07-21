import { NextApiRequest, NextApiResponse } from 'next'
import { postJson } from './lib/apiUtil'
import { apiRegister } from './api'

const table = 'b2p_people_v5'

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

    return { record: { hello: 'world' } }
  })
}
