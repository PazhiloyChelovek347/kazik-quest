import { supabase } from '../lib/supabase'
import type { Session } from '../types/database'

const SESSION_PARAM = 'session'

export async function createSession(): Promise<Session> {
  const { data, error } = await supabase
    .from('sessions_kazik')
    .insert({})
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function getSession(
  sessionId: string
): Promise<Session> {
  const { data, error } = await supabase
    .from('sessions_kazik')
    .select('*')
    .eq('id', sessionId)
    .single()

  if (error) {
    throw error
  }

  return data
}

export function getSessionIdFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search)

  return params.get(SESSION_PARAM)
}

export function setSessionIdInUrl(sessionId: string): void {
  const url = new URL(window.location.href)

  url.searchParams.set(SESSION_PARAM, sessionId)

  window.history.replaceState({}, '', url)
}