import { corsHeaders } from './constants'

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  })

export const errorResponse = (status: number, message: string) => json({ error: message }, status)

export const parseJsonBody = async (request: Request) => {
  try {
    return await request.json()
  } catch {
    return null
  }
}

export const getTrimmedString = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
