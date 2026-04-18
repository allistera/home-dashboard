import type { VercelRequest, VercelResponse } from '@vercel/node'

const normalizeUrl = (value: string) => value.trim().replace(/\/+$/, '')

const isHttpUrl = (value: string) => {
  try {
    const parsedUrl = new URL(value)
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch {
    return false
  }
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const url = normalizeUrl(typeof request.body?.url === 'string' ? request.body.url : '')
  const apiKey = typeof request.body?.apiKey === 'string' ? request.body.apiKey.trim() : ''

  if (!url || !apiKey || !isHttpUrl(url)) {
    return response.status(400).json({ ok: false, error: 'Invalid Home Assistant settings' })
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)

  try {
    const upstreamResponse = await fetch(`${url}/api/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
    })

    return response.status(upstreamResponse.ok ? 200 : upstreamResponse.status).json({
      ok: upstreamResponse.ok,
      status: upstreamResponse.status,
    })
  } catch (error) {
    console.error('Unable to connect to Home Assistant.', error)
    return response.status(502).json({ ok: false, error: 'Unable to reach Home Assistant' })
  } finally {
    clearTimeout(timeoutId)
  }
}
