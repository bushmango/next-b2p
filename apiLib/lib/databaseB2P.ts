import knex from 'knex'

function getDatabaseNameFromConnectionString(connectionString: string) {
  try {
    let url = new URL(connectionString)
    return decodeURIComponent(url.pathname.replace(/^\//, ''))
  } catch {
    return ''
  }
}

function getKnexConnectionFromConnectionString(connectionString: string) {
  let url = new URL(connectionString)
  let sslMode = url.searchParams.get('sslmode') || ''
  url.searchParams.delete('sslmode')

  return {
    connectionString: url.toString(),
    ...(sslMode && sslMode !== 'disable'
      ? { ssl: { rejectUnauthorized: false } }
      : {}),
  }
}

const connectionString = process.env.DB_CONNECTION_STRING
const connection = connectionString
  ? getKnexConnectionFromConnectionString(connectionString)
  : {
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    }

const knexConfig = {
  client: 'postgresql',
  connection,
  pool: {
    min: 1,
    max: 1,
  },
}

export const db = knex(knexConfig)
export const dbName = connectionString
  ? getDatabaseNameFromConnectionString(connectionString)
  : process.env.DB_NAME
