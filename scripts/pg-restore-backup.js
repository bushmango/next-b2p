const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { Client } = require('pg')

const rootDir = path.resolve(__dirname, '..')
const envPath = path.join(rootDir, '.env.local')
const backupsDir = path.join(rootDir, 'backups')

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

function getPostgresExecutable(env, executableBaseName) {
  const executableName =
    process.platform === 'win32'
      ? `${executableBaseName}.exe`
      : executableBaseName
  const toolsLocation = env.PG_TOOLS_LOCATION || process.env.PG_TOOLS_LOCATION

  if (!toolsLocation) {
    return executableName
  }

  const resolvedToolsLocation = path.resolve(toolsLocation)
  const stats = fs.existsSync(resolvedToolsLocation)
    ? fs.statSync(resolvedToolsLocation)
    : null

  if (stats && stats.isFile()) {
    const executablePath = path.join(
      path.dirname(resolvedToolsLocation),
      executableName
    )
    if (!fs.existsSync(executablePath)) {
      throw new Error(
        `PG_TOOLS_LOCATION points to a file, but ${executableName} was not found next to it at ${executablePath}`
      )
    }
    return executablePath
  }

  const executablePath = path.join(resolvedToolsLocation, executableName)
  if (!fs.existsSync(executablePath)) {
    throw new Error(
      `PG_TOOLS_LOCATION is set, but ${executableName} was not found at ${executablePath}`
    )
  }

  return executablePath
}

function getExecutableNotFoundMessage(executable) {
  const examples =
    process.platform === 'win32'
      ? [
          'PG_TOOLS_LOCATION="C:\\Program Files\\PostgreSQL\\16\\bin"',
          'PG_TOOLS_LOCATION="C:\\Program Files\\PostgreSQL\\16\\bin\\pg_dump.exe"',
        ]
      : [
          'PG_TOOLS_LOCATION="/usr/local/pgsql/bin"',
          'PG_TOOLS_LOCATION="/usr/local/pgsql/bin/pg_dump"',
        ]

  return [
    `Could not start ${executable}.`,
    'Install PostgreSQL client tools or set PG_TOOLS_LOCATION in .env.local.',
    'Examples:',
    ...examples.map((example) => `  ${example}`),
  ].join('\n')
}

function getNewestDumpPath() {
  if (!fs.existsSync(backupsDir)) {
    throw new Error(`Backups folder does not exist: ${backupsDir}`)
  }

  const dumpFiles = fs
    .readdirSync(backupsDir)
    .filter((fileName) => fileName.toLowerCase().endsWith('.dump'))
    .map((fileName) => {
      const filePath = path.join(backupsDir, fileName)
      const stats = fs.statSync(filePath)
      return { filePath, mtimeMs: stats.mtimeMs }
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs)

  if (!dumpFiles.length) {
    throw new Error(`No .dump files found in ${backupsDir}`)
  }

  return dumpFiles[0].filePath
}

function resolveDumpPath(inputPath) {
  if (!inputPath) {
    return getNewestDumpPath()
  }

  const resolvedPath = path.resolve(rootDir, inputPath)
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Dump file does not exist: ${resolvedPath}`)
  }

  return resolvedPath
}

function quoteIdentifier(identifier) {
  return `"${identifier.replace(/"/g, '""')}"`
}

function getConnectionParts(connectionString) {
  const url = new URL(connectionString)
  return {
    host: url.hostname,
    port: url.port,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    sslMode: url.searchParams.get('sslmode') || '',
  }
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

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  try {
    const answer = await new Promise((resolve) => {
      rl.question(question, resolve)
    })
    return String(answer).trim().toLowerCase() === 'y'
  } finally {
    rl.close()
  }
}

async function databaseExists(client, databaseName) {
  const result = await client.query(
    'select 1 from pg_database where datname = $1 limit 1',
    [databaseName]
  )
  return result.rowCount > 0
}

async function createDatabase(connectionString, databaseName) {
  const client = new Client(getNodePgConnectionConfig(connectionString))

  await client.connect()
  try {
    if (await databaseExists(client, databaseName)) {
      throw new Error(
        `Restore database already exists: ${databaseName}. Refusing to overwrite it.`
      )
    }

    await client.query(`create database ${quoteIdentifier(databaseName)}`)
  } finally {
    await client.end()
  }
}

async function waitForDatabaseReady(connectionString, databaseName) {
  const targetConnectionString = getConnectionStringForDatabase(
    connectionString,
    databaseName
  )
  const timeoutMs = 60000
  const retryDelayMs = 2000
  const startedAt = Date.now()
  let lastError = null

  while (Date.now() - startedAt < timeoutMs) {
    const client = new Client(getNodePgConnectionConfig(targetConnectionString))
    try {
      await client.connect()
      await client.query('select 1')
      await client.end()
      return
    } catch (error) {
      lastError = error
      try {
        await client.end()
      } catch {
        // Ignore cleanup errors while retrying the readiness probe.
      }
      await delay(retryDelayMs)
    }
  }

  throw new Error(
    `Timed out waiting for restore database to accept connections: ${databaseName}. Last error: ${
      lastError ? lastError.message : 'unknown'
    }`
  )
}

async function runPgRestore(options) {
  const { env, dumpPath, restoreConnectionString, databaseName } = options
  const pgRestoreExecutable = getPostgresExecutable(env, 'pg_restore')
  const connectionParts = getConnectionParts(restoreConnectionString)
  const sslMode =
    connectionParts.sslMode || env.DB_SSLMODE || process.env.DB_SSLMODE || ''

  const args = [
    '-h',
    connectionParts.host,
    '-U',
    connectionParts.user,
    '-d',
    databaseName,
    '--no-owner',
    '--no-acl',
  ]

  if (connectionParts.port) {
    args.push('-p', connectionParts.port)
  }

  args.push(dumpPath)

  const pgRestore = spawn(pgRestoreExecutable, args, {
    env: {
      ...process.env,
      PGPASSWORD: connectionParts.password,
      ...(sslMode ? { PGSSLMODE: sslMode } : {}),
    },
    stdio: 'inherit',
    shell: false,
  })

  await new Promise((resolve, reject) => {
    pgRestore.on('error', (error) => {
      if (error.code === 'ENOENT') {
        reject(new Error(getExecutableNotFoundMessage(pgRestoreExecutable)))
        return
      }

      reject(error)
    })
    pgRestore.on('close', (code) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(new Error(`pg_restore exited with code ${code}`))
    })
  })
}

async function main() {
  if (!fs.existsSync(envPath)) {
    throw new Error(`Missing .env.local at ${envPath}`)
  }

  const env = parseEnvFile(envPath)
  const restoreConnectionString = requireValue(
    env,
    'DB_RESTORE_CONNECTION_STRING'
  )
  const databaseName = requireValue(env, 'DB_RESTORE_DATABASE_NAME')
  const dumpPath = resolveDumpPath(process.argv[2])

  console.log(`Restore target database: ${databaseName}`)
  console.log(`Restore dump file: ${dumpPath}`)
  console.log('The target database must not already exist.')

  const confirmed = await askConfirmation('Create and restore this database? y/N ')
  if (!confirmed) {
    console.log('Restore cancelled.')
    return
  }

  console.log(`Creating database ${databaseName}...`)
  await createDatabase(restoreConnectionString, databaseName)

  console.log(`Waiting for database ${databaseName} to accept connections...`)
  await waitForDatabaseReady(restoreConnectionString, databaseName)

  console.log(`Restoring ${dumpPath} into ${databaseName}...`)
  await runPgRestore({
    env,
    dumpPath,
    restoreConnectionString,
    databaseName,
  })

  console.log('Restore complete.')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
