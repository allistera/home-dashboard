import { neon } from '@neondatabase/serverless'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/neon-http'
import { getDatabaseUrl } from './env'

import * as schema from '../../src/server/db/schema'

const createDb = () =>
  drizzle({
    client: neon(getDatabaseUrl()),
    schema,
  })

type Database = ReturnType<typeof createDb>

let db: Database | null = null
let settingsTableReady: Promise<void> | null = null

export const getDb = () => {
  db ??= createDb()
  return db
}

export const ensureSettingsTable = async () => {
  if (!settingsTableReady) {
    settingsTableReady = getDb()
      .execute(sql`
        CREATE TABLE IF NOT EXISTS "settings" (
          "name" text PRIMARY KEY NOT NULL,
          "value" text NOT NULL
        )
      `)
      .then(() => undefined)
      .catch((error) => {
        settingsTableReady = null
        throw error
      })
  }

  await settingsTableReady
}

export { schema }
