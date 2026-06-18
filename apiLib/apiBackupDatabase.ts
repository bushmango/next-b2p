import AdmZip from 'adm-zip'
import { NextApiRequest, NextApiResponse } from 'next'
import { apiRegister } from './api'
import { checkToken } from './apiAccount'
import { apiArguments } from './lib/apiArguments-sidecar'
import { db } from './lib/databaseB2P'
const table = 'b2p_people_v5'

const getSafeBackupTimestamp = (backupStartedAt: string) => {
  let date = new Date(backupStartedAt)
  let isoTimestamp = Number.isNaN(date.getTime())
    ? new Date().toISOString()
    : date.toISOString()
  return isoTimestamp.replace(/[^0-9A-Za-z.-]/g, '-')
}

export function installAll() {
  apiRegister('/admin/backup-database', runReport_backupDatabase)
}

export async function runReport_backupDatabase(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // let guid = apiArguments.getArgumentString(req, 'guid')
  // let organization = user?.organization
  // let results = await db.from(table).select().where({ organization, guid })

  if (req.method !== 'POST') {
    res.status(405)
    res.send('not-allowed')
    return
  }

  const token = apiArguments.getArgumentString(req, 'token')
  const min = apiArguments.getArgumentInteger(req, 'min')
  const max = apiArguments.getArgumentInteger(req, 'max')
  const group = apiArguments.getArgumentInteger(req, 'group')
  const backupStartedAt = apiArguments.getArgumentString(req, 'backupStartedAt')
  let user = checkToken(token)
  if (!user) {
    res.status(401)
    res.send('not-logged-in') // TODO: better error
    return
  }

  // TODO: download to s3 or zip or something as vercel has a 4.5 mb limit

  let skip = 0
  let limit = 9999999999999 //500000
  let organization = user?.organization

  skip = min
  limit = max - min

  let query = db
    .from(table)
    .select()
    .where({ organization })
    .orderBy('id')
    .offset(skip)
    .limit(limit)

  // query.where('deleted', false) -- include deleted data too

  let results = await query

  const backupTimestamp = getSafeBackupTimestamp(backupStartedAt)
  let name = `backup-lgbt-b2p-database-${backupTimestamp}-part-${group}`

  const sendAsZip = true
  if (sendAsZip) {
    const zip = new AdmZip()
    // add local file
    zip.addFile(
      name + '.json',
      Buffer.from(JSON.stringify(results, null, 2), 'utf8'),
    )
    // get everything as a buffer
    const zipFileContents = zip.toBuffer()
    const fileName = name + '.zip'
    const fileType = 'application/zip'
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Type': fileType,
    })
    return res.end(zipFileContents)
  } else {
    // Send results as a downloadable json file
    res.setHeader('Content-Disposition', `attachment; filename=${name}.txt`)
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(results, null, 2))
  }

  //    return {
  //    records: l.map(results, (c) => c),
  //}

  // return { record: { hello: 'world' } }
}
