export type TaskType = 'photo' | 'question' | 'action'

export type TaskRarity =
  | 'common'
  | 'rare'
  | 'epic'
  | 'jackpot'

export interface Task {
  id: string
  created_at: string
  type: TaskType
  title: string
  description: string
  rarity: TaskRarity
  weight: number
  active: boolean
}

export interface Session {
  id: string
  created_at: string
  status: string
}

export interface TaskAttempt {
  id: string
  session_id: string
  task_id: string | null
  task_snapshot: Task
  result: 'active' | 'completed' | 'skipped'
  created_at: string
  completed_at: string | null
}