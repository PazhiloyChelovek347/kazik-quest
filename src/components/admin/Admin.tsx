import { useEffect, useState } from 'react'
import { createTaskSet, getTaskSets, type TaskSet } from '../../services/setService'
import {
  getSessions,
  setSessionSet,
} from '../../services/sessionService'
import type { Session } from '../../types/database'

export default function Admin() {
  const [sets, setSets] = useState<TaskSet[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [json, setJson] = useState('')
  const [selectedSet, setSelectedSet] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedSession, setSelectedSession] = useState('')

  useEffect(() => {
    Promise.all([
      getTaskSets(),
      getSessions(),
    ])
      .then(([sets, sessions]) => {
        setSets(sets)
        setSessions(sessions)
      })
      .catch(console.error)
  }, [])

  const importSet = async () => {
    try {
      setLoading(true)
      setMessage('')

      const tasks = JSON.parse(json)

      if (!Array.isArray(tasks) || tasks.length === 0) {
        throw new Error('JSON должен быть непустым массивом')
      }

      const set = await createTaskSet(
        name.trim(),
        description.trim() || null,
        tasks,
      )

      setSets((prev) => [set, ...prev])
      setName('')
      setDescription('')
      setJson('')
      setMessage(`Сет создан: ${set.name}`)
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Ошибка',
      )
    } finally {
      setLoading(false)
    }
  }

  const attachSet = async () => {
    if (!selectedSession || !selectedSet) {
      setMessage('Выбери сессию и сет')
      return
    }

    try {
      await setSessionSet(
        selectedSession,
        selectedSet,
      )

      setMessage('Сет привязан к сессии')
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Ошибка',
      )
    }
  }

  return (
    <main className="admin">
      <h1>Админка</h1>

      <h2>Создать сет</h2>

      <input
        placeholder="Название"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <textarea
        placeholder="JSON"
        value={json}
        onChange={(e) => setJson(e.target.value)}
        rows={15}
      />

      <button onClick={importSet} disabled={loading}>
        Создать сет
      </button>

      <h2>Привязать сет к сессии</h2>

      <select
        value={selectedSession}
        onChange={(e) => setSelectedSession(e.target.value)}
      >
        <option value="">Выбери сессию</option>

        {sessions.map((session) => (
          <option key={session.id} value={session.id}>
            {session.id}
          </option>
        ))}
      </select>

      <select
        value={selectedSet}
        onChange={(e) => setSelectedSet(e.target.value)}
      >
        <option value="">Выбери сет</option>

        {sets.map((set) => (
          <option key={set.id} value={set.id}>
            {set.name}
          </option>
        ))}
      </select>

      <button onClick={attachSet}>
        Привязать сет
      </button>

      {message && <p>{message}</p>}
    </main>
  )
}