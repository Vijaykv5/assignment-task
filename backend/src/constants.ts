import type { TaskPriority, TaskStatus } from './types'

export const TASK_STATUS: TaskStatus[] = ['Pending', 'In Progress', 'Completed']
export const TASK_PRIORITY: TaskPriority[] = ['Low', 'Medium', 'High']

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
