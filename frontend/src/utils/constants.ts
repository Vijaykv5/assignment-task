import type { TaskPriority, TaskStatus } from '../types/compliance'

export const STATUS_OPTIONS: TaskStatus[] = ['Pending', 'In Progress', 'Completed']
export const PRIORITY_OPTIONS: TaskPriority[] = ['Low', 'Medium', 'High']
export const CATEGORIES = ['Tax', 'Filing', 'Payroll', 'Audit', 'Regulatory']
export const LOCAL_STORAGE_KEY = 'compliance-tracker-data-v1'
