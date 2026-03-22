# Assignment Task

This project has two parts:

- Backend is here: `backend/`
- Frontend is here: `frontend/`

## Project Structure

- `backend/` Bun + TypeScript API ()
- `frontend/` React + Vite app

## Run Locally (Step by Step)

1. Start backend

```bash
cd backend
bun install
bun run dev
```

Backend runs at: `http://localhost:3001`

2. Start frontend (open a new terminal)

```bash
cd frontend
bun install
```

Create `.env` in `frontend/`:

```bash
VITE_API_BASE_URL=http://localhost:3001/api
```

Then run:

```bash
bun run dev
```

Frontend runs on Vite default port (usually `http://localhost:5173`).

## Build Commands

Backend:

```bash
cd backend
bun install
bun run build
```

Frontend:

```bash
cd frontend
bun install 
bun run build
```

## Start Commands

Backend production start:

```bash
cd backend
bun run start
```

Frontend preview build:

```bash
cd frontend
bun run preview
```

## More Details

- Backend docs: `backend/README.md`
- Frontend docs: `frontend/README.md`
