import { mkdir } from 'node:fs/promises'
import type { Store } from './types'

const DATA_DIR = `${import.meta.dir}/../data`
const DATA_FILE = `${DATA_DIR}/store.json`

const seedData: Store = {
  clients: [
    { id: 'c1', company_name: 'Aster Motors Pvt Ltd', country: 'India', entity_type: 'Private Limited' },
    { id: 'c2', company_name: 'Northwind Analytics LLC', country: 'United States', entity_type: 'LLC' },
    { id: 'c3', company_name: 'Bluefin Retail Pte', country: 'Singapore', entity_type: 'Pte Ltd' },
  ],
  tasks: [
    {
      id: 't1',
      client_id: 'c1',
      title: 'GST Monthly Return',
      description: 'File GSTR-3B for current month',
      category: 'Tax',
      due_date: new Date().toISOString().slice(0, 10),
      status: 'Pending',
      priority: 'High',
    },
  ],
}

let store: Store = structuredClone(seedData)

export const getStore = () => store

export const persistStore = async () => {
  await Bun.write(DATA_FILE, JSON.stringify(store, null, 2))
}

export const initializeStore = async () => {
  await mkdir(DATA_DIR, { recursive: true })
  const file = Bun.file(DATA_FILE)

  if (await file.exists()) {
    try {
      const loaded = (await file.json()) as Partial<Store>
      if (Array.isArray(loaded.clients) && Array.isArray(loaded.tasks)) {
        store = { clients: loaded.clients, tasks: loaded.tasks }
        return
      }
    } catch {
      // Falls through to seed reset.
    }
  }

  store = structuredClone(seedData)
  await persistStore()
}
