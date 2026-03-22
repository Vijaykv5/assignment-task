import { AddTaskForm } from './components/AddTaskForm'
import { ClientList } from './components/ClientList'
import { StatsCards } from './components/StatsCards'
import { TaskFilters } from './components/TaskFilters'
import { TaskList } from './components/TaskList'
import { useComplianceTracker } from './hooks/useComplianceTracker'

function App() {
  const {
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
  } = useComplianceTracker()

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1200px] px-4 py-6 sm:px-6">
      <header className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mini Compliance Tracker</h1>
        <p className="mt-1 text-sm text-slate-600">
          Track client compliance tasks, due dates, and completion status.
        </p>
      </header>

      <main className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)_320px]">
        <ClientList
          clients={clients}
          selectedClientId={selectedClientId}
          onSelectClient={setSelectedClientId}
        />

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {apiError ? (
            <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {apiError}
            </p>
          ) : null}

          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {selectedClient?.companyName ?? 'No client selected'}
              </h2>
              <p className="text-sm text-slate-600">
                {selectedClient ? `${selectedClient.country} • ${selectedClient.entityType}` : ''}
              </p>
            </div>
            <StatsCards stats={stats} />
          </div>

          <TaskFilters
            statusFilter={statusFilter}
            categoryFilter={categoryFilter}
            categories={categories}
            onStatusFilterChange={setStatusFilter}
            onCategoryFilterChange={setCategoryFilter}
          />

          {isLoading ? (
            <p className="text-sm text-slate-500">Loading tasks...</p>
          ) : (
            <TaskList tasks={filteredTasks} onStatusChange={handleStatusChange} />
          )}
        </section>

        <AddTaskForm
          newTask={newTask}
          formError={formError}
          onFieldChange={handleTaskFieldChange}
          onSubmit={handleAddTask}
        />
      </main>
    </div>
  )
}

export default App
