export type TaskRarity = 'common' | 'rare' | 'epic' | 'jackpot'

export type TaskType = 'photo' | 'question' | 'action'

export interface Task {
  id: string
  type: TaskType
  rarity: TaskRarity
  title: string
  description: string
  weight: number
}