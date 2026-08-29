import { useEffect, useState } from 'react'

import type { Task } from '../../types/database'

interface SlotReelProps {
  selectedTask: Task
  tasks: Task[]
  spinning: boolean
  spinId: number
  onFinish: () => void
}

const rarityLabel = {
  common: 'COMMON',
  rare: 'RARE',
  epic: 'EPIC',
  jackpot: 'JACKPOT',
}

function TaskCard({ task }: { task: Task }) {
  return (
    <div className="reel-card">
      <div className={`rarity rarity-${task.rarity}`}>
        {rarityLabel[task.rarity]}
      </div>

      <div className="task-icon">
        {task.type === 'photo' && '📸'}
        {task.type === 'question' && '❓'}
        {task.type === 'action' && '♥'}
      </div>

      <h2>{task.title}</h2>

      <p>{task.description}</p>
    </div>
  )
}

export default function SlotReel({
  selectedTask,
  tasks,
  spinning,
  spinId,
  onFinish,
}: SlotReelProps) {
  const [items, setItems] = useState<Task[]>([])

  useEffect(() => {
    const randomItems = Array.from(
      { length: 28 },
      () => tasks[Math.floor(Math.random() * tasks.length)]
    )

    setItems([...randomItems, selectedTask])
  }, [spinId, selectedTask])

  const [offset, setOffset] = useState(0)
  const [stopping, setStopping] = useState(false)

  useEffect(() => {
    if (!spinning || items.length === 0) return

    setOffset(0)

    const timer = requestAnimationFrame(() => {
      setOffset(items.length - 3)

      setTimeout(() => {
        setOffset(items.length - 2)

        setTimeout(() => {
          setOffset(items.length - 1)
        }, 350)
      }, 300)
    })

    const finishTimer = window.setTimeout(() => {
      setStopping(true)

      setTimeout(() => {
        setStopping(false)
        onFinish()
      }, 180)
    }, 4950)

    return () => {
      cancelAnimationFrame(timer)
      clearTimeout(finishTimer)
    }
  }, [spinning, items.length, onFinish])

  return (
    <div className="reel-window">
      <div
        className={`reel ${stopping ? 'reel-stopping' : ''}`}
        style={{
          transform: `translateY(-${offset * 330}px)`,
        }}
      >
        {items.map((task, index) => (
          <TaskCard
            key={`${task.id}-${index}`}
            task={task}
          />
        ))}
      </div>

      <div className="reel-fade reel-fade-top" />
      <div className="reel-fade reel-fade-bottom" />

      <div className="reel-indicator">
        <span />
      </div>
    </div>
  )
}