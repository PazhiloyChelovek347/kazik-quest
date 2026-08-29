import { supabase } from '../lib/supabase'
import type { Task } from '../types/database'

export interface TaskSet {
    id: string
    name: string
    description: string | null
    created_at: string
}

export async function getTaskSets(): Promise<TaskSet[]> {
    const { data, error } = await supabase
        .from('task_sets_kazik')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        throw error
    }

    return data
}

export async function createTaskSet(
    name: string,
    description: string | null,
    tasks: Omit<Task, 'id' | 'created_at' | 'active'>[],
): Promise<TaskSet> {
    const { data: set, error: setError } = await supabase
        .from('task_sets_kazik')
        .insert({
            name,
            description,
        })
        .select()
        .single()

    if (setError) {
        throw setError
    }

    const tasksToInsert = tasks.map((task) => ({
        ...task,
        active: true,
    }))

    const { data: createdTasks, error: tasksError } = await supabase
        .from('tasks_kazik')
        .insert(tasksToInsert)
        .select()

    if (tasksError) {
        throw tasksError
    }

    const items = createdTasks.map((task) => ({
        set_id: set.id,
        task_id: task.id,
    }))

    const { error: itemsError } = await supabase
        .from('task_set_items_kazik')
        .insert(items)

    if (itemsError) {
        throw itemsError
    }

    return set
}

export async function getTasksForSet(
    setId: string,
): Promise<Task[]> {
    const { data: items, error: itemsError } = await supabase
        .from('task_set_items_kazik')
        .select('task_id')
        .eq('set_id', setId)

    if (itemsError) {
        throw itemsError
    }

    if (items.length === 0) {
        return []
    }

    const taskIds = items.map((item) => item.task_id)

    const { data: tasks, error: tasksError } = await supabase
        .from('tasks_kazik')
        .select('*')
        .in('id', taskIds)
        .eq('active', true)

    if (tasksError) {
        throw tasksError
    }

    return tasks
}

export async function getSetForSession(
    sessionId: string,
): Promise<TaskSet | null> {
    const { data: item, error: itemError } = await supabase
        .from('session_sets_kazik')
        .select('set_id')
        .eq('session_id', sessionId)
        .limit(1)
        .maybeSingle()

    if (itemError) {
        throw itemError
    }

    if (!item) {
        return null
    }

    const { data: set, error: setError } = await supabase
        .from('task_sets_kazik')
        .select('*')
        .eq('id', item.set_id)
        .single()

    if (setError) {
        throw setError
    }

    return set
}
