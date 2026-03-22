import type { ComplianceTask } from '../types/compliance'

export const toISODate = (date: Date) => date.toISOString().split('T')[0]

export const isTaskOverdue = (task: ComplianceTask) => {
  if (task.status === 'Completed') return false

  const due = new Date(task.dueDate)
  const now = new Date()
  due.setHours(0, 0, 0, 0)
  now.setHours(0, 0, 0, 0)

  return due < now
}
