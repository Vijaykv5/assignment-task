export type TaskStatus = 'Pending' | 'In Progress' | 'Completed'
export type TaskPriority = 'Low' | 'Medium' | 'High'

export type Client = {
  id: string
  companyName: string
  country: string
  entityType: string
}

export type ComplianceTask = {
  id: string
  clientId: string
  title: string
  description: string
  category: string
  dueDate: string
  status: TaskStatus
  priority: TaskPriority
}

export type NewTaskForm = {
  title: string
  description: string
  category: string
  dueDate: string
  priority: TaskPriority
}
