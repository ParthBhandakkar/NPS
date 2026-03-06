# MedExplainer AI

A full-stack demo platform that converts medical reports into patient-friendly AI explanations and video experiences.

## What this repo contains

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express API with JWT auth
- **Demo pipeline**: Mock AWS-like stages (Textract, Comprehend Medical, Bedrock, Polly, video assembly)

## Project structure

- `client/` — web app (admin + patient portals)
- `server/` — REST API, auth middleware, mock AI pipeline, demo data
- `REAL_AI_SETUP_GUIDE.md` — checklist to replace mocks with real AI/AWS services

## Features

- Role-based auth (`admin`, `patient`)
- Admin dashboard (stats, reports, patients, audit logs)
- Report upload + status tracking pipeline
- Patient dashboard + profile + video explanation view
- Demo data seeded in memory

## Demo credentials

- **Doctor/Admin**: `admin@medexplainer.ai` / `admin123`
- **Patient**: `patient@medexplainer.ai` / `patient123`

## Prerequisites

- Node.js 18+
- npm 9+

## Quick start

### 1) Install dependencies

From repo root:

```bash
cd server && npm install
cd ../client && npm install
```

### 2) Configure backend env

Create `server/.env`:

```env
PORT=5001
JWT_SECRET=medexplainer-ai-jwt-secret-2025-hackathon
JWT_EXPIRES_IN=24h
```

### 3) Run backend

```bash
cd server
npm run dev
```

API health check: `http://localhost:5001/api/health`

### 4) Run frontend

```bash
cd client
npm run dev
```

Vite default URL: `http://localhost:5173` (or next available port).

## Build and lint

### Frontend

```bash
cd client
npm run lint
npm run build
```

### Backend

```bash
cd server
npm run dev
```

## API overview

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /api/admin/stats`
- `GET /api/admin/audit-logs`
- `GET /api/patients`
- `GET /api/patients/:id`
- `POST /api/patients/:id/profile`
- `POST /api/reports/upload`
- `GET /api/reports`
- `GET /api/reports/:id`
- `DELETE /api/reports/:id`
- `GET /api/jobs/:id/status`
- `GET /api/videos/:id/url`

## Notes

- Data is currently **in-memory** (resets on server restart).
- AI services are currently **mocked** in `server/src/services/mockAws.js`.
- See `REAL_AI_SETUP_GUIDE.md` for production AI integration steps.
