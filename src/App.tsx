import { useEffect, useRef, useState } from 'react'
import { initializeApp } from './services/appService'
import type { Task, TaskAttempt } from './types/database'
import SlotMachine from './components/casino/SlotMachine'
import Admin from './components/admin/Admin'
import { HashRouter, Routes, Route } from 'react-router-dom'

function App() {
  // if (window.location.pathname === '/kazik-quest/admin') {
  //   return (
  //     <main className="app">
  //       <Admin />
  //     </main>
  //   )
  // }

  const initialized = useRef(false)

  const [sessionId, setSessionId] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeAttempts, setActiveAttempts] =
    useState<TaskAttempt[]>([])
  const [completedAttempts, setCompletedAttempts] =
    useState<TaskAttempt[]>([])

  const [completedTaskIds, setCompletedTaskIds] =
    useState<string[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (initialized.current) {
      return
    }

    initialized.current = true

    async function init() {
      try {
        const data = await initializeApp()

        setSessionId(data.session.id)
        setTasks(data.tasks)
        setActiveAttempts(data.activeAttempts)
        setCompletedAttempts(data.completedAttempts)
        setCompletedTaskIds(data.completedTaskIds)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/admin"
          element={
            <main className="app">
              <Admin />
            </main>
          }
        />

        <Route
          path="/"
          element={
            <main className="app">
              {loading && <div>Загрузка...</div>}

              {!loading && tasks.length === 0 && (
                <div>Нет доступных заданий</div>
              )}

              {!loading && sessionId && tasks.length > 0 && (
                <SlotMachine
                  tasks={tasks}
                  sessionId={sessionId}
                  activeAttempts={activeAttempts}
                  completedAttempts={completedAttempts}
                  completedTaskIds={completedTaskIds}
                  onAttemptCreated={(attempt) => {
                    setActiveAttempts((prev) => [attempt, ...prev])
                  }}
                  onAttemptFinished={(attemptId) => {
                    setActiveAttempts((prev) =>
                      prev.filter((attempt) => attempt.id !== attemptId)
                    )
                  }}
                  onAttemptCompleted={(attempt) => {
                    setCompletedAttempts((prev) => [attempt, ...prev])
                  }}
                  onTaskCompleted={(taskId) => {
                    setCompletedTaskIds((prev) => [...prev, taskId])
                  }}
                />
              )}
            </main>
          }
        />
      </Routes>
    </HashRouter>
  )
}

export default App