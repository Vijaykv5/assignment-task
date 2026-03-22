import type { Client, ComplianceTask, NewTaskForm, TaskStatus } from '../types/compliance'

type ApiClient = {
  id: string
  company_name: string
  country: string
  entity_type: string
}

type ApiTask = {
  id: string
  client_id: string
  title: string
  description: string
  category: string
  due_date: string
  status: TaskStatus
  priority: 'Low' | 'Medium' | 'High'
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ??
  'http://localhost:3001/api'

const mapClientFromApi = (client: ApiClient): Client => ({
  id: client.id,
  companyName: client.company_name,
  country: client.country,
  entityType: client.entity_type,
})

const mapTaskFromApi = (task: ApiTask): ComplianceTask => ({
  id: task.id,
  clientId: task.client_id,
  title: task.title,
  description: task.description,
  category: task.category,
  dueDate: task.due_date,
  status: task.status,
  priority: task.priority,
})

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  })

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`
    try {
      const parsed = (await response.json()) as { error?: string }
      if (parsed.error) errorMessage = parsed.error
    } catch {
      // Use generic message.
    }
    throw new Error(errorMessage)
  }

  return (await response.json()) as T
}

export const getClients = async () => {
  const clients = await request<ApiClient[]>('/clients')
  return clients.map(mapClientFromApi)
}

export const getTasksForClient = async (clientId: string) => {
  const tasks = await request<ApiTask[]>(`/clients/${clientId}/tasks`)
  return tasks.map(mapTaskFromApi)
}

export const createTask = async (clientId: string, task: NewTaskForm) => {
  const created = await request<ApiTask>('/tasks', {
    method: 'POST',
    body: JSON.stringify({
      client_id: clientId,
      title: task.title,
      description: task.description,
      category: task.category,
      due_date: task.dueDate,
      status: 'Pending',
      priority: task.priority,
    }),
  })

  return mapTaskFromApi(created)
}

export const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
  const updated = await request<ApiTask>(`/tasks/${taskId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })

  return mapTaskFromApi(updated)
}
