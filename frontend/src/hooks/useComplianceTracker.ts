import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { Client, ComplianceTask, NewTaskForm, TaskPriority, TaskStatus } from '../types/compliance'
import { CATEGORIES, LOCAL_STORAGE_KEY } from '../utils/constants'
import { isTaskOverdue } from '../utils/date'
import { seedClients, seedTasks } from '../utils/seedData'

type StoredData = {
  clients: Client[]
  tasks: ComplianceTask[]
}

const getInitialData = (): StoredData => {
  const fallback = { clients: seedClients, tasks: seedTasks }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) return fallback

    const parsed = JSON.parse(raw) as { clients?: Client[]; tasks?: ComplianceTask[] }
    if (!parsed.clients || !parsed.tasks) return fallback

    return { clients: parsed.clients, tasks: parsed.tasks }
  } catch {
    return fallback
  }
}

const defaultTaskForm: NewTaskForm = {
  title: '',
  description: '',
  category: CATEGORIES[0],
  dueDate: '',
  priority: 'Medium',
}

export const useComplianceTracker = () => {
  const initialData = getInitialData()

  const [clients] = useState<Client[]>(initialData.clients)
  const [tasks, setTasks] = useState<ComplianceTask[]>(initialData.tasks)
  const [selectedClientId, setSelectedClientId] = useState<string>(initialData.clients[0]?.id ?? '')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [newTask, setNewTask] = useState<NewTaskForm>(defaultTaskForm)
  const [formError, setFormError] = useState<string>('')

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ clients, tasks }))
  }, [clients, tasks])

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === selectedClientId) ?? null,
    [clients, selectedClientId],
  )

  const clientTasks = useMemo(
    () => tasks.filter((task) => task.clientId === selectedClientId),
    [tasks, selectedClientId],
  )

  const categories = useMemo(() => {
    const all = new Set<string>(CATEGORIES)
    clientTasks.forEach((task) => all.add(task.category))
    return ['All', ...Array.from(all)]
  }, [clientTasks])

  const filteredTasks = useMemo(
    () =>
      clientTasks.filter((task) => {
        const statusMatch = statusFilter === 'All' || task.status === statusFilter
        const categoryMatch = categoryFilter === 'All' || task.category === categoryFilter
        return statusMatch && categoryMatch
      }),
    [clientTasks, statusFilter, categoryFilter],
  )

  const stats = useMemo(() => {
    const total = clientTasks.length
    const pending = clientTasks.filter((task) => task.status !== 'Completed').length
    const overdue = clientTasks.filter((task) => isTaskOverdue(task)).length
    return { total, pending, overdue }
  }, [clientTasks])

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status } : task)))
  }

  const handleTaskFieldChange = (field: keyof NewTaskForm, value: string | TaskPriority) => {
    setNewTask((current) => ({ ...current, [field]: value }))
  }

  const handleAddTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!newTask.title.trim()) {
      setFormError('Task title is required.')
      return
    }

    if (!newTask.dueDate) {
      setFormError('Due date is required.')
      return
    }

    if (!selectedClientId) {
      setFormError('Select a client before adding tasks.')
      return
    }

    const createdTask: ComplianceTask = {
      id: `t-${Date.now()}`,
      clientId: selectedClientId,
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      category: newTask.category,
      dueDate: newTask.dueDate,
      status: 'Pending',
      priority: newTask.priority,
    }

    setTasks((current) => [createdTask, ...current])
    setNewTask(defaultTaskForm)
    setFormError('')
  }

  return {
    clients,
    selectedClient,
    selectedClientId,
    setSelectedClientId,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    categories,
    filteredTasks,
    stats,
    newTask,
    formError,
    handleTaskFieldChange,
    handleAddTask,
    handleStatusChange,
  }
}
