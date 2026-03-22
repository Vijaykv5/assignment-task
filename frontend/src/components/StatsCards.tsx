type Stats = {
  total: number
  pending: number
  overdue: number
}

type StatsCardsProps = {
  stats: Stats
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 sm:min-w-[280px]">
      <article className="rounded-xl border border-slate-200 bg-slate-50 p-2">
        <p className="text-xs text-slate-500">Total</p>
        <p className="text-lg font-bold text-slate-900">{stats.total}</p>
      </article>
      <article className="rounded-xl border border-slate-200 bg-slate-50 p-2">
        <p className="text-xs text-slate-500">Open</p>
        <p className="text-lg font-bold text-slate-900">{stats.pending}</p>
      </article>
      <article className="rounded-xl border border-slate-200 bg-slate-50 p-2">
        <p className="text-xs text-slate-500">Overdue</p>
        <p className={`text-lg font-bold ${stats.overdue > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
          {stats.overdue}
        </p>
      </article>
    </div>
  )
}
