import { supabase } from '../lib/supabase'
import type { Task } from '../types/database'

export async function getActiveTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks_kazik')
    .select('*')
    .eq('active', true)

  if (error) {
    throw error
  }

  return data
}