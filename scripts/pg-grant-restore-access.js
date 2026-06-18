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

function getRestoreConnectionString(env) {
  const connectionString =
    env.DB_RESTORE_CONNECTION_STRING || process.env.DB_RESTORE_CONNECTION_STRING

  if (!connectionString) {
    throw new Error(
      'Missing required environment value: DB_RESTORE_CONNECTION_STRING'
    )
  }

  return connectionString
}

function quoteIdentifier(identifier) {
  return `"${identifier.replace(/"/g, '""')}"`
}

function getConnectionStringForDatabase(connectionString, databaseName) {
  const url = new URL(connectionString)
  url.pathname = `/${encodeURIComponent(databaseName)}`
  return url.toString()
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

async function withClient(config, action) {
  const client = new Client(config)
  await client.connect()
  try {
    return await action(client)
  } finally {
    await client.end()
  }
}

async function roleExists(client, databaseUser) {
  const result = await client.query(
    'select 1 from pg_roles where rolname = $1 limit 1',
    [databaseUser]
  )
  return result.rowCount > 0
}

async function grantRestoreAccess(options) {
  const { adminConnectionString, databaseName, databaseUser } = options
  const targetConnectionString = getConnectionStringForDatabase(
    adminConnectionString,
    databaseName
  )
  const quotedDatabase = quoteIdentifier(databaseName)
  const quotedUser = quoteIdentifier(databaseUser)

  await withClient(
    getNodePgConnectionConfig(adminConnectionString),
    async (client) => {
      if (!(await roleExists(client, databaseUser))) {
        throw new Error(`Database role does not exist: ${databaseUser}`)
      }

      await client.query(
        `grant connect on database ${quotedDatabase} to ${quotedUser}`
      )
    }
  )

  await withClient(
    getNodePgConnectionConfig(targetConnectionString),
    async (client) => {
      await client.query(`grant usage, create on schema public to ${quotedUser}`)
      await client.query(
        `grant select, insert, update on all tables in schema public to ${quotedUser}`
      )
      await client.query(
        `grant usage, select, update on all sequences in schema public to ${quotedUser}`
      )
      await client.query(
        `alter default privileges in schema public grant select, insert, update on tables to ${quotedUser}`
      )
      await client.query(
        `alter default privileges in schema public grant usage, select, update on sequences to ${quotedUser}`
      )
    }
  )
}

async function main() {
  if (!fs.existsSync(envPath)) {
    throw new Error(`Missing .env.local at ${envPath}`)
  }

  const env = parseEnvFile(envPath)
  const adminConnectionString = getRestoreConnectionString(env)
  const databaseName = requireValue(env, 'DB_RESTORE_DATABASE_NAME')
  const databaseUser = requireValue(env, 'DB_GRANT_USERNAME')

  console.log(`Granting restore database access on ${databaseName} to ${databaseUser}.`)
  await grantRestoreAccess({
    adminConnectionString,
    databaseName,
    databaseUser,
  })
  console.log('Restore database access grants complete.')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
