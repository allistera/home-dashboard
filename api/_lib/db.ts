import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { getDatabaseUrl } from './env'

import * as schema from '../../src/server/db/schema'

const sql = neon(getDatabaseUrl())

export const db = drizzle({ client: sql, schema })

export { schema }
