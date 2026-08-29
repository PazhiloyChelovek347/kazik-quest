import {
  createSession,
  getSession,
  getSessionIdFromUrl,
  setSessionIdInUrl,
} from './sessionService'
import { getActiveTasks } from './taskService'
import { createEvent } from './eventService'
import type {
  Session,
  Task,
  TaskAttempt,
} from '../types/database'
import {
  getActiveAttempts,
  getCompletedTaskIds,
  getFinishedAttempts
} from './attemptService'

interface AppData {
  session: Session
  tasks: Task[]
  activeAttempts: TaskAttempt[]
  completedAttempts: TaskAttempt[]
  completedTaskIds: string[]
  isNewSession: boolean
}

export async function initializeApp(): Promise<AppData> {
  const sessionId = getSessionIdFromUrl()

  if (sessionId) {
    const session = await getSession(sessionId)
    const tasks = await getActiveTasks()
    const activeAttempts =
      await getActiveAttempts(session.id)
    const completedAttempts =
      await getFinishedAttempts(session.id)
    const completedTaskIds =
      await getCompletedTaskIds(session.id)

    return {
      session,
      tasks,
      activeAttempts,
      completedAttempts,
      completedTaskIds,
      isNewSession: false,
    }
  }

  const session = await createSession()

  setSessionIdInUrl(session.id)

  await createEvent({
    sessionId: session.id,
    eventType: 'session_created',
  })

  const tasks = await getActiveTasks()

  return {
    session,
    tasks,
    activeAttempts: [],
    completedAttempts: [],
    completedTaskIds: [],
    isNewSession: true,
  }
}