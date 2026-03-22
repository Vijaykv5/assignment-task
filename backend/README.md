# backend

To install dependencies:

```bash
bun install
```

To run in dev mode:

```bash
bun run dev
```

To run once:

```bash
bun run start
```

API base URL: `http://localhost:3001`

Endpoints:

- `GET /api/health`
- `GET /api/clients`
- `GET /api/clients/:clientId/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:taskId/status`

Example create task request:

```json
{
  "client_id": "c1",
  "title": "ROC Annual Filing",
  "description": "File annual return with registrar",
  "category": "Filing",
  "due_date": "2026-04-30",
  "status": "Pending",
  "priority": "High"
}
```

Example update status request:

```json
{
  "status": "Completed"
}
```

Persistence:

- Data is stored in `backend/data/store.json`.
- Seed data is written automatically on first run.
