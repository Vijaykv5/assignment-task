import { STATUS_OPTIONS } from '../utils/constants'

type TaskFiltersProps = {
  statusFilter: string
  categoryFilter: string
  categories: string[]
  onStatusFilterChange: (value: string) => void
  onCategoryFilterChange: (value: string) => void
}

export const TaskFilters = ({
  statusFilter,
  categoryFilter,
  categories,
  onStatusFilterChange,
  onCategoryFilterChange,
}: TaskFiltersProps) => {
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
        Status
        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 focus:ring-2"
        >
          <option value="All">All</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
        Category
        <select
          value={categoryFilter}
          onChange={(event) => onCategoryFilterChange(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 focus:ring-2"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
