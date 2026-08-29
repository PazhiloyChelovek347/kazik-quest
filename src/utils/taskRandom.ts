import type { Task } from '../types/database'

export function getRandomTask(tasks: Task[]): Task {
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