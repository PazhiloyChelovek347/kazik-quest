import { useEffect, useState } from 'react'

import type { TaskAttempt } from '../../types/database'

interface ActiveTasksProps {
  attempts: TaskAttempt[]
  completedAttempts: TaskAttempt[]
  availableTasksCount: number
  onComplete: (attempt: TaskAttempt) => void
  onSkip: (attempt: TaskAttempt) => void
}

export default function ActiveTasks({
  attempts,
  completedAttempts,
  availableTasksCount,
  onComplete,
  onSkip,
}: ActiveTasksProps) {
  const [tab, setTab] = useState<'active' | 'completed'>('active')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newAttemptId, setNewAttemptId] = useState<string | null>(null)

  useEffect(() => {
    if (attempts.length === 0) return

    setNewAttemptId(attempts[0].id)

    const timer = setTimeout(() => {
      setNewAttemptId(null)
    }, 500)

    return () => clearTimeout(timer)
  }, [attempts])

  const currentAttempts =
    tab === 'active' ? attempts : completedAttempts

  const toggleAttempt = (attemptId: string) => {
    setExpandedId((current) =>
      current === attemptId ? null : attemptId
    )
  }

  return (
    <aside className="active-tasks">
      <div className="tasks-summary">
        <div>
          <span className="tasks-summary-label">
            ДОСТУПНО
          </span>

          <strong>{availableTasksCount}</strong>
        </div>
      </div>

      <div className="tasks-tabs">
        <button
          className={tab === 'active' ? 'active' : ''}
          onClick={() => {
            setTab('active')
            setExpandedId(null)
          }}
        >
          <span>Активные</span>
          <b>{attempts.length}</b>
        </button>

        <button
          className={tab === 'completed' ? 'active' : ''}
          onClick={() => {
            setTab('completed')
            setExpandedId(null)
          }}
        >
          <span>Выполнены</span>
          <b>{completedAttempts.length}</b>
        </button>
      </div>

      <div className="tasks-list">
        {currentAttempts.length === 0 ? (
          <div className="tasks-empty">
            <span>✦</span>
            <p>
              {tab === 'active'
                ? 'Активных заданий нет'
                : 'Выполненных заданий нет'}
            </p>
          </div>
        ) : (
          currentAttempts.map((attempt) => {
            const expanded = expandedId === attempt.id
            const skipped = attempt.result === 'skipped'

            return (
              <div
                key={attempt.id}
                className={`
                  active-task
                  rarity-${attempt.task_snapshot.rarity}
                  ${expanded ? 'active-task-expanded' : ''}
                  ${skipped ? 'active-task-skipped' : ''}
                  ${newAttemptId === attempt.id
                    ? 'active-task-new'
                    : ''
                  }
                `}
              >
                <button
                  className="active-task-header"
                  onClick={() => toggleAttempt(attempt.id)}
                >
                  <div className="active-task-main">
                    <span className="active-task-title">
                      {attempt.task_snapshot.title}
                    </span>

                    <span className="active-task-meta">
                      {attempt.task_snapshot.type}
                    </span>
                  </div>

                  <div className="active-task-right">
                    <span className="active-task-rarity">
                      {attempt.task_snapshot.rarity}
                    </span>

                    {tab === 'completed' && (
                      <span
                        className={`active-task-status ${skipped ? 'skipped' : 'completed'
                          }`}
                      >
                        {skipped ? 'ПРОПУЩЕНО' : 'ВЫПОЛНЕНО'}
                      </span>
                    )}

                    <span
                      className={`active-task-chevron ${expanded ? 'expanded' : ''
                        }`}
                    >
                      ↓
                    </span>
                  </div>
                </button>

                {expanded && (
                  <div className="active-task-details">
                    <p>
                      {attempt.task_snapshot.description}
                    </p>

                    {tab === 'active' && (
                      <div className="active-task-actions">
                        <button
                          className="task-complete-button"
                          onClick={() => onComplete(attempt)}
                        >
                          <span>✓</span>
                          Выполнил
                        </button>

                        <button
                          className="task-skip-button"
                          onClick={() => onSkip(attempt)}
                        >
                          Пропустить
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </aside>
  )
}