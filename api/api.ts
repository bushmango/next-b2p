import { NextApiRequest, NextApiResponse } from 'next'
import { apiArguments } from './lib/apiArguments-sidecar'

export async function gateway(req: NextApiRequest, res: NextApiResponse) {
  let path = apiArguments.getArgumentString(req, 'path')
  if (!path) {
    res.status(200)
    res.send('no-path')
    return
  }

  if (path.startsWith('/account')) {
  }

  if (path.startsWith('/people')) {
  }

  // return postJson(req, res, async (req, user) => {
  //   let showDeleted = apiArguments.getArgumentBoolean(req, 'showDeleted')
  //   let organization = user?.organization

  //   let query = db.from(table).select().where({ organization })

  //   if (!showDeleted) {
  //     query.where('deleted', false)
  //   }
  //   let results = await query.count()

  //   return { count: results[0].count }
  // })
}
