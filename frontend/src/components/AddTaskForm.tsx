import type { FormEvent } from 'react'
import type { NewTaskForm, TaskPriority } from '../types/compliance'
import { CATEGORIES, PRIORITY_OPTIONS } from '../utils/constants'

type AddTaskFormProps = {
  newTask: NewTaskForm
  formError: string
  onFieldChange: (field: keyof NewTaskForm, value: string | TaskPriority) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export const AddTaskForm = ({ newTask, formError, onFieldChange, onSubmit }: AddTaskFormProps) => {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Add Task</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
          Title
          <input
            value={newTask.title}
            onChange={(event) => onFieldChange('title', event.target.value)}
            placeholder="e.g. Annual ROC Filing"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 focus:ring-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
          Description
          <textarea
            value={newTask.description}
            onChange={(event) => onFieldChange('description', event.target.value)}
            rows={3}
            placeholder="Optional details"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 focus:ring-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
          Category
          <select
            value={newTask.category}
            onChange={(event) => onFieldChange('category', event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 focus:ring-2"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
          Due Date
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(event) => onFieldChange('dueDate', event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 focus:ring-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
          Priority
          <select
            value={newTask.priority}
            onChange={(event) => onFieldChange('priority', event.target.value as TaskPriority)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 focus:ring-2"
          >
            {PRIORITY_OPTIONS.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>

        {formError ? <p className="text-xs text-rose-700">{formError}</p> : null}

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Create Task
        </button>
      </form>
    </aside>
  )
}
