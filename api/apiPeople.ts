import { NextApiRequest, NextApiResponse } from 'next'
import { postJson } from './lib/apiUtil'
import { db } from './lib/databaseB2P'
import { apiArguments } from './lib/apiArguments-sidecar'
import l from 'lodash'

const table = 'b2p_people_v5'

export async function count(req: NextApiRequest, res: NextApiResponse) {
  return postJson(req, res, async (req, user) => {
    let showDeleted = apiArguments.getArgumentBoolean(req, 'showDeleted')
    let organization = user?.organization

    let query = db.from(table).select().where({ organization })

    if (!showDeleted) {
      query.where('deleted', false)
    }
    let results = await query.count()

    return { count: results[0].count }
  })
}

export async function search(req: NextApiRequest, res: NextApiResponse) {
  return postJson(req, res, async (req, user) => {
    let showDeleted = apiArguments.getArgumentBoolean(req, 'showDeleted')
    let search = apiArguments.getArgumentString(req, 'search')
    let limit = apiArguments.getArgumentInteger(req, 'limit')

    search = search.toLowerCase()
    limit = limit || 25
    let organization = user?.organization

    let searchParts = ('' + search).split(' ', 25)
    searchParts = l.filter(searchParts, (c) => !l.isNil(c) && c !== '')

    let query = db
      .from(table)
      .select()
      .where({ organization })
      .orderBy('id')
      .limit(limit)
    if (!showDeleted) {
      query.where('deleted', false)
    }
    l.forEach(searchParts, (c) => {
      query = query.where('search', 'like', '%' + c + '%')
    })

    let results = await query
    return {
      num: results.length,
      search: search,
      records: l.map(results, (c) => c),
    }
  })
}

// import { _ } from '@/common/lib/lodash'
// import * as express from 'express'

// import { ping, post } from './apiUtil'
// import { db } from './databaseB2P'
// import { calcSearchIndex, rebuildSearchIndex } from './rebuildSearchIndex'
// import uuid from 'uuid'
// import { DateTime } from 'luxon'

// export function install(app: express.Express) {
//   ping(app, '/api/people/ping')

//   post(app, '/api/people/rebuild-search-index', async (req, res) => {
//     const { skip, limit } = req.body
//     let numProcessed = await rebuildSearchIndex(skip, limit)
//     return { message: 'built-index', skip, limit, numProcessed }
//   })

//   post(app, '/api/people/get', async (req, res) => {
//     let { guid } = req.body
//     let organization = res.locals.user.organization

//     const table = 'b2p_people_v5'
//     let results = await db
//       .from(table)
//       .select()
//       .where({ organization, guid })

//     return { record: results[0] }
//   })

//   post(app, '/api/people/add', async (req, res) => {
//     // let { json } = req.body
//     let organization = res.locals.user.organization

//     // let { Guid } = json
//     let Guid = uuid.v4()
//     let json = { Guid, FullName: 'Person, New', Packages: [] }
//     const table = 'b2p_people_v5'
//     let results = await db.into(table).insert({
//       json: json,
//       search: calcSearchIndex(json),
//       guid: Guid,
//       organization,
//       created_at: DateTime.local().toISO(),
//       deleted: false,
//     })

//     return { results: results, guid: Guid }
//   })

//   post(app, '/api/people/set', async (req, res) => {
//     let { json, deleted } = req.body
//     let organization = res.locals.user.organization

//     let { Guid } = json

//     const table = 'b2p_people_v5'
//     let update = {
//       json: json,
//       deleted: deleted || false,
//       search: calcSearchIndex(json),
//       updated_at: DateTime.local().toISO(),
//     }
//     // console.log('update', update)
//     let results = await db
//       .from(table)
//       .update(update)
//       .where({ organization, guid: Guid })

//     return { results: results }
//   })

//   // app.get('/api/people', async (req, res) => {
//   //   if (!auth(req, res)) {
//   //     return
//   //   }

//   //   const { key, text, options } = req.body

//   //   let organization = res.locals.user.organization

//   //   const table = 'b2p_people_v5'
//   //   let results = await db
//   //     .from(table)
//   //     .select()
//   //     .where({ organization })
//   //     .limit(100)

//   //   res.json({
//   //     results: results,
//   //   })
//   // })
// }
