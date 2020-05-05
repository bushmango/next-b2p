import { NextApiRequest, NextApiResponse } from 'next'
import { registerAll } from './apiGateway'
import { apiArguments } from './lib/apiArguments-sidecar'

type ActionFunction = (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<any>
let paths: { [k: string]: ActionFunction } = {}
export function apiRegister(path: string, action: ActionFunction) {
  if (paths[path]) {
    let err = `path ${path} is already registered`
    console.error(err)
    throw new Error(err)
  }
  paths[path] = action
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

  if (!path.startsWith('/api')) {
    res.status(200)
    res.send('no-api')
    return
  }
  path = path.substring('/api'.length)

  let pathAction = paths[path]
  if (!pathAction) {
    res.status(200)
    res.send('404')
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
