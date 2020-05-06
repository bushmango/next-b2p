import { NextApiRequest, NextApiResponse } from 'next'
import { postJson } from './lib/apiUtil'
import { db } from './lib/databaseB2P'
import { apiArguments } from './lib/apiArguments-sidecar'
import l from 'lodash'
import { generateUuidV4 } from '../common/lib/generateId'
import { DateTime } from 'luxon'
import { searchIndex } from './lib/searchIndex-sidecar'

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

export async function get(req: NextApiRequest, res: NextApiResponse) {
  return postJson(req, res, async (req, user) => {
    let guid = apiArguments.getArgumentString(req, 'guid')
    let organization = user?.organization

    let results = await db.from(table).select().where({ organization, guid })

    return { record: results[0] }
  })
}

export async function add(req: NextApiRequest, res: NextApiResponse) {
  return postJson(req, res, async (req, user) => {
    let organization = user?.organization
    let Guid = generateUuidV4()

    let json = { Guid, FullName: 'Person, New', Packages: [] }
    let results = await db.into(table).insert({
      json: json,
      search: searchIndex.calcSearchIndex(json),
      guid: Guid,
      organization,
      created_at: DateTime.local().toISO(),
      deleted: false,
    })

    return { results: results, guid: Guid }
  })
}

export async function rebuildSearchIndex(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return postJson(req, res, async (req, user) => {
    let skip = apiArguments.getArgumentInteger(req, 'skip') || 0
    let limit = apiArguments.getArgumentInteger(req, 'limit') || 100

    let numProcessed = await searchIndex.rebuildSearchIndex(skip, limit)
    return { message: 'built-index', skip, limit, numProcessed }
  })
}

// export async function name(req: NextApiRequest, res: NextApiResponse) {
//   return postJson(req, res, async (req, user) => {})
// }

export async function set(req: NextApiRequest, res: NextApiResponse) {
  return postJson(req, res, async (req, user) => {
    let json = apiArguments.getArgumentJson(req, 'json')
    let deleted = apiArguments.getArgumentBoolean(req, 'deleted')

    let organization = user?.organization

    let { Guid } = json

    let update = {
      json: json,
      deleted: deleted || false,
      search: searchIndex.calcSearchIndex(json),
      updated_at: DateTime.local().toISO(),
    }
    let results = await db
      .from(table)
      .update(update)
      .where({ organization, guid: Guid })

    return { results: results }
  })
}
