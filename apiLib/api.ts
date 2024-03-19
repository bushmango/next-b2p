import { NextApiRequest, NextApiResponse } from 'next'
import { registerAll } from './apiGateway'
import { apiArguments } from './lib/apiArguments-sidecar'
import { apiBackupDatabase } from './apiBackupDatabase-sidecar'

type ActionFunction = (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<any>
let _paths: { [k: string]: ActionFunction } = {}
export function apiRegister(path: string, action: ActionFunction) {
  if (_paths[path]) {
    let err = `path ${path} is already registered`
    console.error(err)
    throw new Error(err)
  }
  _paths[path] = action
}

apiRegister('/ping', async (req, res) => {
  res.status(200)
  res.send('pong')
})

registerAll()

export async function gateway(req: NextApiRequest, res: NextApiResponse) {
  let path = apiArguments.getArgumentString(req, 'path')

  console.log('gateway:', path)

  if (!path) {
    res.status(200)
    res.send('no-path')
    return
  }

  if (path.startsWith('backup-database')) {
    // TODO: make sure logged in
    console.log('backup-database hit')
    apiBackupDatabase.runReport_backupDatabase(req, res)
    return
  }

  if (!path.startsWith('/api')) {
    res.status(200)
    res.send('no-api')
    return
  }
  path = path.substring('/api'.length)

  let pathAction = _paths[path]
  if (!pathAction) {
    res.status(404)
    res.send('404-' + path)
    return
  }

  await pathAction(req, res)

  // if (path === '/ping') {
  //   return
  // }

  // if (path.startsWith('/account')) {
  //   if (path === '/account/login') {
  //     await apiAccount.login(req, res)
  //     return
  //   }
  // }

  // if (path.startsWith('/people')) {
  //   if (path === '/people/count') {
  //     await apiPeople.count(req, res)
  //     return
  //   }
  //   if (path === '/people/search') {
  //     await apiPeople.search(req, res)
  //     return
  //   }
  // }

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
