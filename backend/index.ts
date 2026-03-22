import { corsHeaders } from './src/constants'
import { errorResponse, json, parseJsonBody } from './src/http'
import { getStore, initializeStore, persistStore } from './src/store'
import type { ComplianceTask } from './src/types'
import {
  createTaskBodySchema,
  getFirstZodError,
  updateTaskStatusBodySchema,
} from './src/validators'

const handleGetClients = () => {
  const store = getStore()
  return json(store.clients)
}

const handleGetTasksForClient = (clientId: string, url: URL) => {
  const store = getStore()
  const client = store.clients.find((item) => item.id === clientId)
  if (!client) return errorResponse(404, 'Client not found.')

  const statusFilter = url.searchParams.get('status')
  const categoryFilter = url.searchParams.get('category')

  const tasks = store.tasks.filter((task) => {
    const belongsToClient = task.client_id === clientId
    const statusMatch = !statusFilter || task.status === statusFilter
    const categoryMatch = !categoryFilter || task.category === categoryFilter
    return belongsToClient && statusMatch && categoryMatch
  })

  return json(tasks)
}

const handleCreateTask = async (request: Request) => {
  const rawBody = await parseJsonBody(request)
  if (!rawBody || typeof rawBody !== 'object') return errorResponse(400, 'Invalid JSON request body.')

  const parsedBody = createTaskBodySchema.safeParse(rawBody)
  if (!parsedBody.success) return errorResponse(400, getFirstZodError(parsedBody.error))

  const body = parsedBody.data

  const store = getStore()

  if (!store.clients.some((client) => client.id === body.client_id)) {
    return errorResponse(400, 'client_id does not reference an existing client.')
  }

  const newTask: ComplianceTask = {
    id: `t-${Date.now()}`,
    client_id: body.client_id,
    title: body.title,
    description: body.description,
    category: body.category,
    due_date: body.due_date,
    status: body.status,
    priority: body.priority,
  }

  store.tasks.unshift(newTask)
  await persistStore()
  return json(newTask, 201)
}

const handleUpdateTaskStatus = async (taskId: string, request: Request) => {
  const rawBody = await parseJsonBody(request)
  if (!rawBody || typeof rawBody !== 'object') return errorResponse(400, 'Invalid JSON request body.')

  const parsedBody = updateTaskStatusBodySchema.safeParse(rawBody)
  if (!parsedBody.success) return errorResponse(400, getFirstZodError(parsedBody.error))

  const body = parsedBody.data

  const store = getStore()
  const taskIndex = store.tasks.findIndex((task) => task.id === taskId)
  if (taskIndex < 0) return errorResponse(404, 'Task not found.')

  const existingTask = store.tasks[taskIndex]
  if (!existingTask) return errorResponse(404, 'Task not found.')

  store.tasks[taskIndex] = { ...existingTask, status: body.status }
  await persistStore()
  return json(store.tasks[taskIndex])
}

await initializeStore()

const port = Number(Bun.env.PORT ?? 3001)

Bun.serve({
  port,
  async fetch(request) {
    try {
      const url = new URL(request.url)
      const path = url.pathname
      const method = request.method

      if (method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders })
      }

      if (method === 'GET' && path === '/api/health') return json({ ok: true })
      if (method === 'GET' && path === '/api/clients') return handleGetClients()

      const clientTasksMatch = path.match(/^\/api\/clients\/([^/]+)\/tasks$/)
      if (method === 'GET' && clientTasksMatch?.[1]) {
        return handleGetTasksForClient(clientTasksMatch[1], url)
      }

      if (method === 'POST' && path === '/api/tasks') return handleCreateTask(request)

      const taskStatusMatch = path.match(/^\/api\/tasks\/([^/]+)\/status$/)
      if (method === 'PATCH' && taskStatusMatch?.[1]) {
        return handleUpdateTaskStatus(taskStatusMatch[1], request)
      }

      return errorResponse(404, 'Route not found.')
    } catch {
      return errorResponse(500, 'Internal server error.')
    }
  },
})

console.log(`Compliance API running on http://localhost:${port}`)
