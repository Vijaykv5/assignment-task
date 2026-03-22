import { z } from 'zod'

const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'due_date must be in YYYY-MM-DD format.')
  .refine((value) => !Number.isNaN(Date.parse(value)), 'due_date must be a valid date.')

export const taskStatusSchema = z.enum(['Pending', 'In Progress', 'Completed'])
export const taskPrioritySchema = z.enum(['Low', 'Medium', 'High'])

export const createTaskBodySchema = z.object({
  client_id: z.string().trim().min(1, 'client_id is required.'),
  title: z.string().trim().min(1, 'title is required.'),
  description: z.string().trim().optional().default(''),
  category: z.string().trim().min(1, 'category is required.'),
  due_date: dateOnlySchema,
  status: taskStatusSchema.optional().default('Pending'),
  priority: taskPrioritySchema.optional().default('Medium'),
})

export const updateTaskStatusBodySchema = z.object({
  status: taskStatusSchema,
})

export const getFirstZodError = (error: z.ZodError) => error.issues[0]?.message ?? 'Validation failed.'
