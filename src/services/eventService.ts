import { supabase } from '../lib/supabase'

export type KazikEventType =
  | 'session_created'
  | 'spin_started'
  | 'task_selected'
  | 'task_completed'
  | 'task_skipped'

interface CreateEventParams {
  sessionId: string
  eventType: KazikEventType
  attemptId?: string
  metadata?: Record<string, unknown>
}

export async function createEvent({
  sessionId,
  eventType,
  attemptId,
  metadata,
}: CreateEventParams): Promise<void> {
  const { error } = await supabase
    .from('events_kazik')
    .insert({
      session_id: sessionId,
      attempt_id: attemptId ?? null,
      event_type: eventType,
      metadata: metadata ?? null,
    })

  if (error) {
    throw error
  }
}