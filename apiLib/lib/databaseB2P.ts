import knex from 'knex'

function getDatabaseNameFromConnectionString(connectionString: string) {
  try {
    let url = new URL(connectionString)
    return decodeURIComponent(url.pathname.replace(/^\//, ''))
  } catch {
    return ''
  }
}

const connectionString = process.env.DB_CONNECTION_STRING
const connection = connectionString
  ? {
      connectionString,
      ssl: { rejectUnauthorized: false },
    }
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
