import type { ComplianceTask, TaskStatus } from '../types/compliance'
import { STATUS_OPTIONS } from '../utils/constants'
import { isTaskOverdue } from '../utils/date'

type TaskListProps = {
  tasks: ComplianceTask[]
  onStatusChange: (taskId: string, status: TaskStatus) => void
}

export const TaskList = ({ tasks, onStatusChange }: TaskListProps) => {
  if (tasks.length === 0) {
    return <p className="text-sm text-slate-500">No tasks match the current filters.</p>
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const overdue = isTaskOverdue(task)

        return (
          <article
            key={task.id}
            className={`flex flex-col justify-between gap-3 rounded-xl border p-3 lg:flex-row ${
              overdue ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white'
            }`}
          >
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{task.description || 'No description'}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700">
                  {task.category}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700">
                  Priority: {task.priority}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    overdue
                      ? 'border border-rose-300 bg-rose-100 text-rose-700'
                      : 'border border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <label className="flex min-w-[160px] flex-col gap-1 text-xs font-medium text-slate-700">
              Status
              <select
                value={task.status}
                onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 focus:ring-2"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </article>
        )
      })}
    </div>
  )
}
