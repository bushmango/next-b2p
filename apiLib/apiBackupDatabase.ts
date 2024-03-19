import AdmZip from 'adm-zip'
import { NextApiRequest, NextApiResponse } from 'next'
import { checkToken } from './apiAccount'
import { db } from './lib/databaseB2P'
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

  // TODO: download to s3 or zip or something as vercel has a 4.5 mb limit

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

  const sendAsZip = true
  if (sendAsZip) {
    var zip = new AdmZip()
    // add local file
    zip.addFile(
      'backup-lgbt-b2p-database.json',
      Buffer.from(JSON.stringify(results), 'utf8'),
    )
    // get everything as a buffer
    var zipFileContents = zip.toBuffer()
    const fileName = 'backup-lgbt-b2p-database.zip'
    const fileType = 'application/zip'
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Type': fileType,
    })
    return res.end(zipFileContents)
  } else {
    // Send results as a downloadable json file
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=backup-lgbt-b2p-database.txt',
    )
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(results, null, 2))
  }

  //    return {
  //    records: l.map(results, (c) => c),
  //}

  // return { record: { hello: 'world' } }
}
