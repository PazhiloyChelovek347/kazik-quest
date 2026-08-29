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

export const tasks: Task[] = [
  {
    id: 'photo-1',
    type: 'photo',
    rarity: 'common',
    title: 'Поймай момент',
    description: 'Сделай фото того, что сейчас находится прямо перед тобой.',
    weight: 60,
  },

  {
    id: 'question-1',
    type: 'question',
    rarity: 'rare',
    title: 'Честный ответ',
    description: 'Назови момент нашего знакомства, который ты помнишь лучше всего.',
    weight: 25,
  },

  {
    id: 'action-1',
    type: 'action',
    rarity: 'epic',
    title: 'Выбор за тобой',
    description: 'Выбери место, куда мы отправимся на следующее свидание.',
    weight: 12,
  },

  {
    id: 'jackpot-1',
    type: 'action',
    rarity: 'jackpot',
    title: 'JACKPOT ❤️',
    description: 'Придумай одно желание, которое мы должны исполнить вместе.',
    weight: 3,
  },
]

export function getRandomTask(): Task {
  const totalWeight = tasks.reduce(
    (sum, task) => sum + task.weight,
    0
  )

  let random = Math.random() * totalWeight

  for (const task of tasks) {
    random -= task.weight

    if (random <= 0) {
      return task
    }
  }

  return tasks[tasks.length - 1]
}
