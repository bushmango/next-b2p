import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { DateTime } from 'luxon'
import l from 'lodash'
import { generateId } from '../common/lib/generateId'
import { apiArguments } from './lib/apiArguments-sidecar'
import { postJson } from './lib/apiUtil'
import { db } from './lib/databaseB2P'

const table = 'b2p_state_restrictions_v1'
const maxSearchDisplayLimit = 50

type FacilityRestriction = {
  id: string
  FacilityName: string
  Restrictions: string
  PaperMailLocation: string
  Packages: string
  Notes: string
  deleted: boolean
}

type StateRestrictionJson = {
  StateCode: string
  FullName: string
  Restrictions: string
  PaperMailLocation: string
  Packages: string
  Notes: string
  Facilities: FacilityRestriction[]
}

const stateNames: { [code: string]: string } = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  IA: 'Iowa',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  MA: 'Massachusetts',
  MD: 'Maryland',
  ME: 'Maine',
  MI: 'Michigan',
  MN: 'Minnesota',
  MO: 'Missouri',
  MS: 'Mississippi',
  MT: 'Montana',
  NC: 'North Carolina',
  ND: 'North Dakota',
  NE: 'Nebraska',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NV: 'Nevada',
  NY: 'New York',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VA: 'Virginia',
  VT: 'Vermont',
  WA: 'Washington',
  WI: 'Wisconsin',
  WV: 'West Virginia',
  WY: 'Wyoming',
}

function cleanText(value: string): string {
  return (value || '').replace(/\r\n/g, '\n').trim()
}

function createEmptyState(
  stateCode: string,
  fullName: string,
): StateRestrictionJson {
  return {
    StateCode: stateCode,
    FullName: fullName,
    Restrictions: '',
    PaperMailLocation: '',
    Packages: '',
    Notes: '',
    Facilities: [],
  }
}

function createFacility(
  facilityName: string,
  restrictions: string,
  paperMailLocation: string,
  packages: string,
): FacilityRestriction {
  return {
    id: generateId(),
    FacilityName: facilityName,
    Restrictions: restrictions,
    PaperMailLocation: paperMailLocation,
    Packages: packages,
    Notes: '',
    deleted: false,
  }
}

function parseCsvRows(csv: string): string[][] {
  let rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < csv.length; i++) {
    let char = csv[i]
    let next = csv[i + 1]

    if (char === '"' && inQuotes && next === '"') {
      cell += '"'
      i++
    } else if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      row.push(cell)
      cell = ''
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        i++
      }
      row.push(cell)
      if (l.some(row, (c) => c.trim() !== '')) {
        rows.push(row)
      }
      row = []
      cell = ''
    } else {
      cell += char
    }
  }

  row.push(cell)
  if (l.some(row, (c) => c.trim() !== '')) {
    rows.push(row)
  }

  return rows
}

function normalizeStateCell(cell: string): {
  stateCode: string
  fullName: string
  facilityName: string
  restrictions: string
} {
  let lines = l.filter(
    cleanText(cell).split('\n'),
    (line) => line.trim() !== '',
  )
  let firstLine = (lines[0] || '').trim()
  let restrictionLines = lines.slice(1)
  let stateCode = ''
  let fullName = ''
  let facilityName = ''

  let parenthesized = firstLine.match(/^(.+?)\s*\(([A-Z]{2})\)(.*)$/)
  let codeFacility = firstLine.match(/^([A-Z]{2})\s*-\s*(.+)$/)

  if (parenthesized) {
    fullName = parenthesized[1].trim()
    stateCode = parenthesized[2].trim()
    facilityName = parenthesized[3]
      .replace(/^\s*-\s*/, '')
      .replace(/^\s*\((.*)\)\s*$/, '$1')
      .trim()
  } else if (codeFacility) {
    stateCode = codeFacility[1].trim()
    fullName = stateNames[stateCode] || stateCode
    facilityName = codeFacility[2].trim()
  } else {
    stateCode = firstLine
    fullName = firstLine
  }

  return {
    stateCode,
    fullName,
    facilityName,
    restrictions: cleanText(restrictionLines.join('\n')),
  }
}

function parseSeedData(csv: string): StateRestrictionJson[] {
  let rows = parseCsvRows(csv)
  let dataRows = rows.slice(1)
  let byStateCode: { [stateCode: string]: StateRestrictionJson } = {}

  l.forEach(dataRows, (row) => {
    let parsedState = normalizeStateCell(row[0] || '')
    let paperMailLocation = cleanText(row[1] || '')
    let packages = cleanText(row[2] || '')

    if (!parsedState.stateCode) {
      return
    }

    let state =
      byStateCode[parsedState.stateCode] ||
      createEmptyState(parsedState.stateCode, parsedState.fullName)
    byStateCode[parsedState.stateCode] = state

    if (!state.FullName && parsedState.fullName) {
      state.FullName = parsedState.fullName
    }

    if (parsedState.facilityName) {
      state.Facilities.push(
        createFacility(
          parsedState.facilityName,
          parsedState.restrictions,
          paperMailLocation,
          packages,
        ),
      )
      return
    }

    state.Restrictions = parsedState.restrictions
    state.PaperMailLocation = paperMailLocation
    state.Packages = packages
  })

  return l.sortBy(l.values(byStateCode), (state) => state.StateCode)
}

function calcSearchIndex(json: StateRestrictionJson, includeDeleted = false) {
  let parts = [
    json.StateCode,
    json.FullName,
    json.Restrictions,
    json.PaperMailLocation,
    json.Packages,
    json.Notes,
  ]

  l.forEach(json.Facilities || [], (facility) => {
    if (facility.deleted && !includeDeleted) {
      return
    }
    parts.push(
      facility.FacilityName,
      facility.Restrictions,
      facility.PaperMailLocation,
      facility.Packages,
      facility.Notes,
    )
  })

  return parts.join(' ').toLowerCase()
}

async function ensureStateRestrictionsTable() {
  let exists = await db.schema.hasTable(table)
  if (exists) {
    return false
  }

  await db.schema.createTable(table, (t) => {
    t.increments('id').primary()
    t.string('organization').notNullable()
    t.string('state_code').notNullable()
    t.jsonb('json').notNullable()
    t.text('search').notNullable()
    t.timestamp('created_at')
    t.timestamp('updated_at')
    t.boolean('deleted').notNullable().defaultTo(false)
    t.index(['organization'])
    t.index(['organization', 'state_code'])
  })

  return true
}

export async function setupAndSeed(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return postJson(req, res, async (req, user) => {
    let organization = user?.organization || ''
    let createdTable = await ensureStateRestrictionsTable()
    let existingRows = await db.from(table).where({ organization }).count()
    let rowCount = parseInt('' + existingRows[0].count, 10)

    if (rowCount > 0) {
      return {
        error: 'State restrictions already contain data; seed skipped.',
        createdTable,
        seeded: false,
        rowCount,
      }
    }

    let seedPath = path.join(process.cwd(), 'todo', 'todo-state-seed-data.txt')
    let seedCsv = fs.readFileSync(seedPath, 'utf8')
    let seedRecords = parseSeedData(seedCsv)
    let now = DateTime.local().toISO()

    if (!seedRecords.length) {
      return { error: 'no-state-restriction-seed-data' }
    }

    await db.into(table).insert(
      l.map(seedRecords, (json) => ({
        organization,
        state_code: json.StateCode,
        json,
        search: calcSearchIndex(json),
        created_at: now,
        updated_at: now,
        deleted: false,
      })),
    )

    return {
      createdTable,
      seeded: true,
      insertedStates: seedRecords.length,
      insertedFacilities: l.sumBy(seedRecords, (state) =>
        (state.Facilities || []).length,
      ),
    }
  })
}

export async function search(req: NextApiRequest, res: NextApiResponse) {
  return postJson(req, res, async (req, user) => {
    await ensureStateRestrictionsTable()
    let showDeleted = apiArguments.getArgumentBoolean(req, 'showDeleted')
    let search = apiArguments.getArgumentString(req, 'search')
    let limit = apiArguments.getArgumentInteger(req, 'limit')

    search = search.toLowerCase()
    limit = limit || maxSearchDisplayLimit
    limit = Math.max(1, Math.min(limit, maxSearchDisplayLimit))

    let organization = user?.organization
    let searchParts = l.filter(
      ('' + search).split(' ', 25),
      (c) => !l.isNil(c) && c !== '',
    )

    let query = db
      .from(table)
      .select()
      .where({ organization })
      .orderBy('state_code')
      .limit(limit + 1)

    if (!showDeleted) {
      query.where('deleted', false)
    }

    if (searchParts.length) {
      query.where((builder) => {
        l.forEach(searchParts, (part) => {
          builder.orWhere('search', 'like', '%' + part + '%')
        })
      })
    }

    let results = await query
    let records = l.take(results, limit)

    return {
      num: records.length,
      displayLimit: limit,
      hasMoreThanLimit: results.length > limit,
      records,
    }
  })
}

export async function set(req: NextApiRequest, res: NextApiResponse) {
  return postJson(req, res, async (req, user) => {
    await ensureStateRestrictionsTable()
    let id = apiArguments.getArgumentInteger(req, 'id')
    let json = apiArguments.getArgumentJson(req, 'json')
    let deleted = apiArguments.getArgumentBoolean(req, 'deleted')
    let organization = user?.organization
    let now = DateTime.local().toISO()

    let results = await db
      .from(table)
      .update({
        state_code: json.StateCode,
        json,
        deleted: deleted || false,
        search: deleted ? '' : calcSearchIndex(json),
        updated_at: now,
      })
      .where({ id, organization })

    return { results }
  })
}

export async function add(req: NextApiRequest, res: NextApiResponse) {
  return postJson(req, res, async (req, user) => {
    await ensureStateRestrictionsTable()
    let organization = user?.organization || ''
    let stateCode = apiArguments.getArgumentString(req, 'stateCode') || 'NEW'
    let now = DateTime.local().toISO()
    let json = createEmptyState(stateCode.toUpperCase(), 'New State')
    let inserted = await db.into(table).insert({
      organization,
      state_code: json.StateCode,
      json,
      search: calcSearchIndex(json),
      created_at: now,
      updated_at: now,
      deleted: false,
    })

    return { inserted }
  })
}
