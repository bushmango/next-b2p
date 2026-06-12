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

async function main() {
  if (!fs.existsSync(envPath)) {
    throw new Error(`Missing .env.local at ${envPath}`)
  }

  const env = parseEnvFile(envPath)
  const dbName = requireValue(env, 'DBV_NAME')
  const host = requireValue(env, 'DB_HOST')
  const user = requireValue(env, 'DB_USERNAME')
  const password = requireValue(env, 'DB_PASSWORD')
  const sslMode = env.DB_SSLMODE || process.env.DB_SSLMODE || 'require'

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

  console.log(`Writing pg_dump backup to ${outputPath}`)

  const pgDump = spawn('pg_dump', args, {
    env: {
      ...process.env,
      PGPASSWORD: password,
      PGSSLMODE: sslMode,
    },
    stdio: 'inherit',
    shell: false,
  })

  await new Promise((resolve, reject) => {
    pgDump.on('error', reject)
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
