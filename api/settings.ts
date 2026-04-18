import { eq } from 'drizzle-orm'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db, schema } from './_lib/db'

const json = (response: VercelResponse, status: number, body: Record<string, unknown>) =>
  response.status(status).json(body)

const badRequest = (response: VercelResponse, error: string) => json(response, 400, { ok: false, error })

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method === 'GET') {
    const name = typeof request.query.name === 'string' ? request.query.name.trim() : ''

    try {
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

    try {
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

    try {
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
