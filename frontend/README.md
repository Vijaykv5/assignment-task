# Mini Compliance Tracker Frontend


## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS (via `@tailwindcss/vite`)


## Backend Integration

The frontend consumes these backend APIs:

- `GET /api/clients`
- `GET /api/clients/:clientId/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:taskId/status`

## Environment Variables

Create `.env` in this folder:

```bash
VITE_API_BASE_URL=http://localhost:3001/api
```

If this variable is missing, the same default (`http://localhost:3001/api`) is used.

## Run Locally

Install dependencies:

```bash
bun install
```

Start dev server:

```bash
bun run dev
```

Build:

```bash
bun run build
```
