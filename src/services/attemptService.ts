import { supabase } from '../lib/supabase'
import type { Task, TaskAttempt } from '../types/database'

export async function createTaskAttempt(
  sessionId: string,
  task: Task
): Promise<TaskAttempt> {
  const { data, error } = await supabase
    .from('task_attempts_kazik')
    .insert({
      session_id: sessionId,
      task_id: task.id,
      task_snapshot: task,
      result: 'active',
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateTaskAttempt(
  attemptId: string,
  result: 'completed' | 'skipped'
): Promise<TaskAttempt> {
  const { data, error } = await supabase
    .from('task_attempts_kazik')
    .update({
      result,
      completed_at: new Date().toISOString(),
    })
    .eq('id', attemptId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function getSessionAttempts(
  sessionId: string
): Promise<TaskAttempt[]> {
  const { data, error } = await supabase
    .from('task_attempts_kazik')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', {
      ascending: true,
    })

  if (error) {
    throw error
  }

  return data
}

export async function getActiveAttempts(
  sessionId: string
): Promise<TaskAttempt[]> {
  const { data, error } = await supabase
    .from('task_attempts_kazik')
    .select('*')
    .eq('session_id', sessionId)
    .eq('result', 'active')
    .order('created_at', {
      ascending: false,
    })

  if (error) {
    throw error
  }

  return data
}

export async function getCompletedTaskIds(
  sessionId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from('task_attempts_kazik')
    .select('task_id')
    .eq('session_id', sessionId)
    .eq('result', 'completed')

  if (error) {
    throw error
  }

  return data
    .map((attempt) => attempt.task_id)
    .filter((taskId): taskId is string => taskId !== null)
}

export async function getFinishedAttempts(
  sessionId: string
): Promise<TaskAttempt[]> {
  const { data, error } = await supabase
    .from('task_attempts_kazik')
    .select('*')
    .eq('session_id', sessionId)
    .in('result', ['completed', 'skipped'])
    .order('created_at', {
      ascending: false,
    })

  if (error) {
    throw error
  }

  return data
}