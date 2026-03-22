export type TaskStatus = 'Pending' | 'In Progress' | 'Completed'
export type TaskPriority = 'Low' | 'Medium' | 'High'

export type Client = {
  id: string
  company_name: string
  country: string
  entity_type: string
}

export type ComplianceTask = {
  id: string
  client_id: string
  title: string
  description: string
  category: string
  due_date: string
  status: TaskStatus
  priority: TaskPriority
}

export type Store = {
  clients: Client[]
  tasks: ComplianceTask[]
}
