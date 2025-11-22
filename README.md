# Human Resource Management System (HRMS)

A simple HRMS built with React and Node.js.

## Prerequisites

- Node.js (v18+)
- PostgreSQL (running on localhost:5432)

## Setup

### Backend

1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env` if needed (default assumes user `postgres`, password `postgres`, db `hrms_db`).
4. Create the database `hrms_db` in PostgreSQL if it doesn't exist.
5. Run seed script (optional, resets DB):
   ```bash
   node seed.js
   ```
6. Start server:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`.

### Frontend

1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:5173` (Vite default).

## Features

- **Authentication**: Register Organisation, Login.
- **Employees**: CRUD operations.
- **Teams**: CRUD operations, Assign/Unassign employees.
- **Logging**: Audit trail of actions.

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/employees`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`
- `GET /api/teams`
- `POST /api/teams`
- `PUT /api/teams/:id`
- `DELETE /api/teams/:id`
- `POST /api/teams/:teamId/assign`
- `DELETE /api/teams/:teamId/unassign`
- `GET /api/logs`
