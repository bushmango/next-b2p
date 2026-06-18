const fs = require('fs')
const path = require('path')
const { Client } = require('pg')

const rootDir = path.resolve(__dirname, '..')
const envPath = path.join(rootDir, '.env.local')

function parseEnvFile(filePath) {
  const env = {}
  const contents = fs.readFileSync(filePath, 'utf8')

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) {
      continue
    }

    const equalsIndex = line.indexOf('=')
    if (equalsIndex === -1) {
      continue
    }

    const key = line.slice(0, equalsIndex).trim()
    let value = line.slice(equalsIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    env[key] = value
  }

  return env
}

function requireValue(env, key) {
  const value = env[key] || process.env[key]
  if (!value) {
    throw new Error(`Missing required environment value: ${key}`)
  }
  return value
}

function quoteIdentifier(identifier) {
  return `"${identifier.replace(/"/g, '""')}"`
}

function getNodePgConnectionConfig(connectionString) {
  const url = new URL(connectionString)
  const sslMode = url.searchParams.get('sslmode') || ''
  url.searchParams.delete('sslmode')

  return {
    connectionString: url.toString(),
    ...(sslMode && sslMode !== 'disable'
      ? { ssl: { rejectUnauthorized: false } }
      : {}),
  }
}

function getConnectionStringForDatabase(connectionString, databaseName) {
  const url = new URL(connectionString)
  url.pathname = `/${encodeURIComponent(databaseName)}`
  return url.toString()
}

function getDatabaseNameFromConnectionString(connectionString) {
  const url = new URL(connectionString)
  return decodeURIComponent(url.pathname.replace(/^\//, ''))
}

function getSourceConnectionConfig(env) {
  const connectionString = env.DB_CONNECTION_STRING || process.env.DB_CONNECTION_STRING
  if (connectionString) {
    return getNodePgConnectionConfig(connectionString)
  }

  const sslMode = env.DB_SSLMODE || process.env.DB_SSLMODE || 'require'

  return {
    host: requireValue(env, 'DB_HOST'),
    database: requireValue(env, 'DB_NAME'),
    user: requireValue(env, 'DB_USERNAME'),
    password: requireValue(env, 'DB_PASSWORD'),
    ...(sslMode && sslMode !== 'disable'
      ? { ssl: { rejectUnauthorized: false } }
      : {}),
  }
}

function getSourceDatabaseName(env) {
  const connectionString = env.DB_CONNECTION_STRING || process.env.DB_CONNECTION_STRING
  if (connectionString) {
    return getDatabaseNameFromConnectionString(connectionString)
  }

  return requireValue(env, 'DB_NAME')
}

function getRestoreConnectionConfig(env) {
  const restoreConnectionString = requireValue(env, 'DB_RESTORE_CONNECTION_STRING')
  const databaseName = requireValue(env, 'DB_RESTORE_DATABASE_NAME')
  const targetConnectionString = getConnectionStringForDatabase(
    restoreConnectionString,
    databaseName
  )

  return getNodePgConnectionConfig(targetConnectionString)
}

async function withClient(config, action) {
  const client = new Client(config)
  await client.connect()
  try {
    return await action(client)
  } finally {
    await client.end()
  }
}

async function getPublicTables(client) {
  const result = await client.query(`
    select table_schema, table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_type = 'BASE TABLE'
    order by table_schema, table_name
  `)

  return result.rows.map((row) => ({
    schema: row.table_schema,
    table: row.table_name,
    key: `${row.table_schema}.${row.table_name}`,
  }))
}

async function getTableStats(client, table) {
  const tableName = `${quoteIdentifier(table.schema)}.${quoteIdentifier(
    table.table
  )}`
  const result = await client.query(`
    select
      count(*)::text as row_count,
      md5(coalesce(string_agg(row_hash, '' order by row_hash), '')) as checksum
    from (
      select md5(row_to_json(t)::text) as row_hash
      from ${tableName} t
    ) rows
  `)

  return {
    rowCount: result.rows[0].row_count,
    checksum: result.rows[0].checksum,
  }
}

function sortTables(tablesByKey) {
  return [...tablesByKey.values()].sort((a, b) => a.key.localeCompare(b.key))
}

async function getDatabaseStats(config) {
  return await withClient(config, async (client) => {
    const tables = await getPublicTables(client)
    const stats = new Map()

    for (const table of tables) {
      stats.set(table.key, {
        ...table,
        ...(await getTableStats(client, table)),
      })
    }

    return stats
  })
}

function printReport(sourceStats, restoreStats) {
  const allTables = new Map()
  for (const table of sourceStats.values()) {
    allTables.set(table.key, table)
  }
  for (const table of restoreStats.values()) {
    allTables.set(table.key, table)
  }

  let mismatches = 0
  console.log('')
  console.log('Table comparison:')
  console.log(
    'Status | Table | Source rows | Restore rows | Source checksum | Restore checksum'
  )

  for (const table of sortTables(allTables)) {
    const source = sourceStats.get(table.key)
    const restore = restoreStats.get(table.key)
    const rowCountsMatch = source && restore && source.rowCount === restore.rowCount
    const checksumsMatch = source && restore && source.checksum === restore.checksum
    const status = rowCountsMatch && checksumsMatch ? 'OK' : 'DIFF'

    if (status !== 'OK') {
      mismatches++
    }

    console.log(
      [
        status,
        table.key,
        source ? source.rowCount : 'missing',
        restore ? restore.rowCount : 'missing',
        source ? source.checksum : 'missing',
        restore ? restore.checksum : 'missing',
      ].join(' | ')
    )
  }

  console.log('')
  if (mismatches) {
    console.log(`Restore verification failed. Mismatched tables: ${mismatches}`)
    process.exitCode = 1
  } else {
    console.log('Restore verification passed. Table counts and checksums match.')
  }
}

async function main() {
  if (!fs.existsSync(envPath)) {
    throw new Error(`Missing .env.local at ${envPath}`)
  }

  const env = parseEnvFile(envPath)
  const sourceDatabase = getSourceDatabaseName(env)
  const restoreDatabase = requireValue(env, 'DB_RESTORE_DATABASE_NAME')

  console.log(`Comparing source database ${sourceDatabase} to ${restoreDatabase}.`)
  console.log('This is read-only and does not modify either database.')

  const sourceStats = await getDatabaseStats(getSourceConnectionConfig(env))
  const restoreStats = await getDatabaseStats(getRestoreConnectionConfig(env))

  printReport(sourceStats, restoreStats)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
