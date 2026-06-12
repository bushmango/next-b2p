const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

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

function timestampForFilename(date) {
  return date.toISOString().replace(/[:.]/g, '-')
}

function safeFilenamePart(value) {
  return value.replace(/[^a-zA-Z0-9._-]/g, '_')
}

function getPgDumpExecutable(env) {
  const toolsLocation = env.PG_TOOLS_LOCATION || process.env.PG_TOOLS_LOCATION
  if (!toolsLocation) {
    return process.platform === 'win32' ? 'pg_dump.exe' : 'pg_dump'
  }

  const resolvedToolsLocation = path.resolve(toolsLocation)
  const stats = fs.existsSync(resolvedToolsLocation)
    ? fs.statSync(resolvedToolsLocation)
    : null

  if (stats && stats.isFile()) {
    return resolvedToolsLocation
  }

  const executableName = process.platform === 'win32' ? 'pg_dump.exe' : 'pg_dump'
  const executablePath = path.join(resolvedToolsLocation, executableName)

  if (!fs.existsSync(executablePath)) {
    throw new Error(
      `PG_TOOLS_LOCATION is set, but ${executableName} was not found at ${executablePath}`
    )
  }

  return executablePath
}

function getPgDumpNotFoundMessage(pgDumpExecutable) {
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
    `Could not start ${pgDumpExecutable}.`,
    'Install PostgreSQL client tools or set PG_TOOLS_LOCATION in .env.local.',
    'Examples:',
    ...examples.map((example) => `  ${example}`),
  ].join('\n')
}

function getDumpTables(env) {
  const rawTables =
    env.PG_DUMP_TABLES || process.env.PG_DUMP_TABLES || 'public.b2p_people_v5'
  if (rawTables.trim() === '*') {
    return []
  }

  return rawTables
    .split(',')
    .map((table) => table.trim())
    .filter(Boolean)
}

async function main() {
  if (!fs.existsSync(envPath)) {
    throw new Error(`Missing .env.local at ${envPath}`)
  }

  const env = parseEnvFile(envPath)
  const dbName = requireValue(env, 'DB_NAME')
  const host = requireValue(env, 'DB_HOST')
  const user = requireValue(env, 'DB_USERNAME')
  const password = requireValue(env, 'DB_PASSWORD')
  const sslMode = env.DB_SSLMODE || process.env.DB_SSLMODE || 'require'
  const pgDumpExecutable = getPgDumpExecutable(env)
  const dumpTables = getDumpTables(env)

  fs.mkdirSync(backupsDir, { recursive: true })

  const outputPath = path.join(
    backupsDir,
    `${safeFilenamePart(dbName)}-${timestampForFilename(new Date())}.dump`
  )

  const args = [
    '-h',
    host,
    '-U',
    user,
    '-d',
    dbName,
    '-Fc',
    '--no-owner',
    '--no-acl',
    '-f',
    outputPath,
  ]

  for (const table of dumpTables) {
    args.push('--table', table)
  }

  console.log(`Writing pg_dump backup to ${outputPath}`)
  if (dumpTables.length) {
    console.log(`Dumping tables: ${dumpTables.join(', ')}`)
  }

  const pgDump = spawn(pgDumpExecutable, args, {
    env: {
      ...process.env,
      PGPASSWORD: password,
      PGSSLMODE: sslMode,
    },
    stdio: 'inherit',
    shell: false,
  })

  await new Promise((resolve, reject) => {
    pgDump.on('error', (error) => {
      if (error.code === 'ENOENT') {
        reject(new Error(getPgDumpNotFoundMessage(pgDumpExecutable)))
        return
      }

      reject(error)
    })
    pgDump.on('close', (code) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(new Error(`pg_dump exited with code ${code}`))
    })
  })

  console.log('Backup complete.')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
