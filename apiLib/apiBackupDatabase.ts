import { NextApiRequest, NextApiResponse } from 'next'
import { l } from '../common/lib/lodash'
import { apiRegister } from './api'
import { postJson } from './lib/apiUtil'
import { db } from './lib/databaseB2P'
import { checkToken } from './apiAccount'

const table = 'b2p_people_v5'

export function installAll() {
  // apiRegister('/admin/backup-database', runReport_backupDatabase)
}

export async function runReport_backupDatabase(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // let guid = apiArguments.getArgumentString(req, 'guid')
  // let organization = user?.organization
  // let results = await db.from(table).select().where({ organization, guid })

  const token = req.query['token'] as string
  let user = checkToken(token)
  if (!user) {
    res.status(200)
    res.send('not-logged-in') // TODO: better error
    return
  }

  let limit = 9999999999999 //500000
  let organization = user?.organization

  let query = db
    .from(table)
    .select()
    .where({ organization })
    .orderBy('id')
    .limit(limit)

  // query.where('deleted', false) -- include deleted data too

  let results = await query

  // Send results as a downloadable json file
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=backup-lgbt-b2p-database.txt',
  )
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(results, null, 2))

  //    return {
  //    records: l.map(results, (c) => c),
  //}

  // return { record: { hello: 'world' } }
}
