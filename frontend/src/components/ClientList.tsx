import type { Client } from '../types/compliance'

type ClientListProps = {
  clients: Client[]
  selectedClientId: string
  onSelectClient: (clientId: string) => void
}

export const ClientList = ({ clients, selectedClientId, onSelectClient }: ClientListProps) => {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Clients</h2>
      <div className="space-y-2">
        {clients.map((client) => {
          const isActive = client.id === selectedClientId

          return (
            <button
              key={client.id}
              type="button"
              onClick={() => onSelectClient(client.id)}
              className={`w-full rounded-xl border p-3 text-left transition ${
                isActive
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/40'
              }`}
            >
              <p className="text-sm font-semibold text-slate-900">{client.companyName}</p>
              <p className="mt-1 text-xs text-slate-600">
                {client.country} • {client.entityType}
              </p>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
