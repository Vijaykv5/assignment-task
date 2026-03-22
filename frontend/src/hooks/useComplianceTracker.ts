import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { Client, ComplianceTask, NewTaskForm, TaskPriority, TaskStatus } from '../types/compliance'
import { CATEGORIES } from '../utils/constants'
import { isTaskOverdue } from '../utils/date'
import { createTask, getClients, getTasksForClient, updateTaskStatus } from '../utils/api'

const defaultTaskForm: NewTaskForm = {
  title: '',
  description: '',
  category: CATEGORIES[0],
  dueDate: '',
  priority: 'Medium',
}

export const useComplianceTracker = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [tasks, setTasks] = useState<ComplianceTask[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [newTask, setNewTask] = useState<NewTaskForm>(defaultTaskForm)
  const [formError, setFormError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [apiError, setApiError] = useState<string>('')

  useEffect(() => {
    let cancelled = false

    const loadClients = async () => {
      setIsLoading(true)
      setApiError('')

      try {
        const fetchedClients = await getClients()
        if (cancelled) return

        setClients(fetchedClients)
        setSelectedClientId((current) => current || fetchedClients[0]?.id || '')
      } catch (error) {
        if (!cancelled) {
          setApiError(error instanceof Error ? error.message : 'Failed to load clients.')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void loadClients()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!selectedClientId) {
      setTasks([])
      return
    }

    let cancelled = false

    const loadTasks = async () => {
      setIsLoading(true)
      setApiError('')

      try {
        const fetchedTasks = await getTasksForClient(selectedClientId)
        if (!cancelled) setTasks(fetchedTasks)
      } catch (error) {
        if (!cancelled) {
          setApiError(error instanceof Error ? error.message : 'Failed to load tasks.')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void loadTasks()

    return () => {
      cancelled = true
    }
  }, [selectedClientId])

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === selectedClientId) ?? null,
    [clients, selectedClientId],
  )

  const clientTasks = tasks

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
    const previousTasks = tasks
    setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status } : task)))
    setApiError('')

    void updateTaskStatus(taskId, status)
      .then((updatedTask) => {
        setTasks((current) => current.map((task) => (task.id === taskId ? updatedTask : task)))
      })
      .catch((error) => {
        setTasks(previousTasks)
        setApiError(error instanceof Error ? error.message : 'Failed to update task status.')
      })
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

    setFormError('')
    setApiError('')

    void createTask(selectedClientId, {
      ...newTask,
      title: newTask.title.trim(),
      description: newTask.description.trim(),
    })
      .then((createdTask) => {
        setTasks((current) => [createdTask, ...current])
        setNewTask(defaultTaskForm)
      })
      .catch((error) => {
        setFormError(error instanceof Error ? error.message : 'Failed to create task.')
      })
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
    isLoading,
    apiError,
    handleTaskFieldChange,
    handleAddTask,
    handleStatusChange,
  }
}
