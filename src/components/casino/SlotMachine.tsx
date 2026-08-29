import { useState } from 'react'

import { getRandomTask } from '../../utils/taskRandom'
import type { Task, TaskAttempt } from '../../types/database'

import SlotReel from './SlotReel'
import ActiveTasks from './ActiveTasks'

import {
  createTaskAttempt,
  updateTaskAttempt,
} from '../../services/attemptService'

import { createEvent } from '../../services/eventService'

interface SlotMachineProps {
  tasks: Task[]
  sessionId: string
  activeAttempts: TaskAttempt[]
  completedAttempts: TaskAttempt[]
  completedTaskIds: string[]
  onAttemptCreated: (attempt: TaskAttempt) => void
  onAttemptFinished: (attemptId: string) => void
  onAttemptCompleted: (attempt: TaskAttempt) => void
  onTaskCompleted: (taskId: string) => void
}

export default function SlotMachine({
  tasks,
  sessionId,
  activeAttempts,
  completedAttempts,
  completedTaskIds,
  onAttemptCreated,
  onAttemptFinished,
  onAttemptCompleted,
  onTaskCompleted,
}: SlotMachineProps) {
  const [currentTask, setCurrentTask] =
    useState<Task | null>(null)

  const [spinning, setSpinning] =
    useState(false)

  const [spinId, setSpinId] = useState(0)

  const [pendingAttempt, setPendingAttempt] =
    useState<TaskAttempt | null>(null)

  const completeAttempt = async (
    attempt: TaskAttempt
  ) => {
    const updatedAttempt = await updateTaskAttempt(
      attempt.id,
      'completed'
    )

    await createEvent({
      sessionId,
      eventType: 'task_completed',
      attemptId: attempt.id,
    })

    onAttemptFinished(attempt.id)
    onAttemptCompleted(updatedAttempt)
    onTaskCompleted(attempt.task_id ?? '')
  }

  const skipAttempt = async (
    attempt: TaskAttempt
  ) => {
    const updatedAttempt = await updateTaskAttempt(
      attempt.id,
      'skipped'
    )

    await createEvent({
      sessionId,
      eventType: 'task_skipped',
      attemptId: attempt.id,
    })

    onAttemptFinished(attempt.id)
    onAttemptCompleted(updatedAttempt)
  }

  const availableTasks = tasks.filter(
    (task) => !completedTaskIds.includes(task.id)
  )

  const spin = async () => {
    if (
      spinning ||
      availableTasks.length === 0
    ) {
      return
    }

    try {
      const task = getRandomTask(availableTasks)

      await createEvent({
        sessionId,
        eventType: 'spin_started',
      })

      const attempt = await createTaskAttempt(
        sessionId,
        task
      )

      setPendingAttempt(attempt)

      await createEvent({
        sessionId,
        eventType: 'task_selected',
        attemptId: attempt.id,
      })

      setCurrentTask(task)
      setSpinId((id) => id + 1)
      setSpinning(true)
    } catch (error) {
      console.error(error)
    }
  }

  const finishSpin = () => {
    setSpinning(false)

    if (pendingAttempt) {
      onAttemptCreated(pendingAttempt)
      setPendingAttempt(null)
    }
  }

  return (
    <div className="casino-layout">
      <div className="slot-machine">
        <div className="slot-header">
          <span>✦</span>
          <span>OUR CASINO</span>
          <span>✦</span>
        </div>

        {(currentTask || availableTasks.length > 0) && (
          <SlotReel
            key={spinId}
            selectedTask={currentTask ?? availableTasks[0]}
            tasks={tasks}
            spinning={spinning}
            spinId={spinId}
            onFinish={finishSpin}
          />
        )}

        <button
          className="spin-button"
          onClick={spin}
          disabled={
            spinning ||
            availableTasks.length === 0
          }
        >
          {spinning
            ? 'КРУТИМ...'
            : 'КРУТИТЬ'}
        </button>
      </div>

      <ActiveTasks
        attempts={activeAttempts}
        completedAttempts={completedAttempts}
        availableTasksCount={availableTasks.length}
        onComplete={completeAttempt}
        onSkip={skipAttempt}
      />
    </div>
  )
}