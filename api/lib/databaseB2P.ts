import knex from 'knex'

const knexConfig = {
  client: 'postgresql',
  connection: {
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  pool: {
    min: 1,
    max: 1,
  },
}

export const db = knex(knexConfig)
export const dbName = knexConfig.connection.database
