import { eq } from 'drizzle-orm'
import { ensureSettingsTable, getDb, schema } from './_lib/db.js'
import { hasDatabaseUrl } from './_lib/env.js'
import type { ApiRequest, ApiResponse } from './_lib/http.js'

const json = (response: ApiResponse, status: number, body: Record<string, unknown>) =>
  response.status(status).json(body)

const badRequest = (response: ApiResponse, error: string) => json(response, 400, { ok: false, error })

const storageUnavailable = (response: ApiResponse) =>
  json(response, 503, {
    ok: false,
    code: 'SETTINGS_DATABASE_UNAVAILABLE',
    error: 'Settings database is not configured',
  })

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method === 'GET') {
    const name = typeof request.query.name === 'string' ? request.query.name.trim() : ''

    if (!hasDatabaseUrl()) {
      return json(response, 200, name ? { ok: true, setting: null } : { ok: true, settings: [] })
    }

    try {
      const db = getDb()
      await ensureSettingsTable()

      if (name) {
        const record = await db.query.settings.findFirst({
          where: (settings, { eq }) => eq(settings.name, name),
        })

        return json(response, 200, { ok: true, setting: record ?? null })
      }

      const records = await db.select().from(schema.settings)
      return json(response, 200, { ok: true, settings: records })
    } catch (error) {
      console.error('Unable to load settings.', error)
      return json(response, 500, { ok: false, error: 'Unable to load settings' })
    }
  }

  if (request.method === 'POST' || request.method === 'PUT') {
    const name = typeof request.body?.name === 'string' ? request.body.name.trim() : ''
    const value =
      typeof request.body?.value === 'string'
        ? request.body.value
        : request.body?.value !== undefined
          ? JSON.stringify(request.body.value)
          : ''

    if (!name) {
      return badRequest(response, 'Setting name is required')
    }

    if (!hasDatabaseUrl()) {
      return storageUnavailable(response)
    }

    try {
      const db = getDb()
      await ensureSettingsTable()

      const [record] = await db
        .insert(schema.settings)
        .values({ name, value })
        .onConflictDoUpdate({
          target: schema.settings.name,
          set: { value },
        })
        .returning()

      return json(response, 200, { ok: true, setting: record })
    } catch (error) {
      console.error('Unable to save setting.', error)
      return json(response, 500, { ok: false, error: 'Unable to save setting' })
    }
  }

  if (request.method === 'DELETE') {
    const name =
      typeof request.query.name === 'string'
        ? request.query.name.trim()
        : typeof request.body?.name === 'string'
          ? request.body.name.trim()
          : ''

    if (!name) {
      return badRequest(response, 'Setting name is required')
    }

    if (!hasDatabaseUrl()) {
      return storageUnavailable(response)
    }

    try {
      const db = getDb()
      await ensureSettingsTable()

      await db.delete(schema.settings).where(eq(schema.settings.name, name))
      return json(response, 200, { ok: true })
    } catch (error) {
      console.error('Unable to delete setting.', error)
      return json(response, 500, { ok: false, error: 'Unable to delete setting' })
    }
  }

  response.setHeader('Allow', 'GET, POST, PUT, DELETE')
  return json(response, 405, { ok: false, error: 'Method not allowed' })
}
