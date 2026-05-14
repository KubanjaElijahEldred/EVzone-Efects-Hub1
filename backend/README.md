# EVzone Effect Hub Backend

A complete **NestJS + TypeScript** backend for the EVzone Effect Hub / AR Effect Creator platform.

This backend is designed to plug into the existing EVzone Effect Hub frontend and EVzone Live Studio bridge.

## Core principles

- TypeScript only.
- NestJS API with Swagger documentation.
- File-backed local data store for plug-and-play development.
- No standalone user authentication.
- No billing.
- No payouts.
- No paid marketplace flows.
- Internal admin endpoints are optionally protected by `EVZONE_INTERNAL_ADMIN_KEY`.
- EVzone colours embedded in the response layer and health endpoint:
  - Green: `#03cd8c`
  - Orange: `#f77f00`
  - Medium Grey: `#a6a6a6`
  - Light Grey: `#f2f2f2`

## Quick start

```bash
cd EVzone_Effect_Hub_Backend
cp .env.example .env
npm install
npm run start:dev
```

Open:

```bash
http://localhost:3777/docs
```

API base URL:

```bash
http://localhost:3777/api/v1
```

## Connect to the frontend

In the Vite frontend `.env` file, add:

```bash
VITE_EVZONE_API_URL=http://localhost:3777/api/v1
VITE_EVZONE_STUDIO_BRIDGE_URL=ws://localhost:3777/studio-bridge
```

## Data storage

The backend stores local demo/development state in:

```bash
./data/evzone-effect-hub-backend.json
```

The file is created automatically at startup. Delete it to reseed demo data.

## Included modules

- Health and palette
- Effect Creator Home
- App routes
- Studio Bridge HTTP + WebSocket gateway
- Projects and versions
- Editor workspace
- Assets and dependency repair
- Free resource library
- AI Creator
- Tracking Lab
- Visual Logic Lab
- Code & Developer Lab
- Materials & Shader Lab
- VFX & Motion Lab
- Interactive Effects Lab
- Preview & Quality Center
- Studio Integration Center
- Send to Studio Wizard
- Learning & Documentation Hub
- Project Insights
- Settings Center
- Internal Admin Center
- Recovery & Diagnostics Center
- Maintenance / System Update
- Global Search and 404 recovery search

## API surface

This project currently exposes **185 endpoints**.

See [`docs/API_ENDPOINTS.md`](./docs/API_ENDPOINTS.md) for the full endpoint list.

## WebSocket bridge

Namespace:

```bash
ws://localhost:3777/studio-bridge
```

Events:

- `bridge.ping`
- `studio.event`
- `bridge.status`
- `studio.event.received`

## Internal admin protection

By default, admin routes run without auth for local plug-and-play development.

To protect admin routes, set:

```bash
EVZONE_INTERNAL_ADMIN_KEY=your-internal-key
```

Then send:

```bash
x-evzone-internal-key: your-internal-key
```

## Frontend integration examples

```ts
const API = import.meta.env.VITE_EVZONE_API_URL;

export async function listProjects() {
  const response = await fetch(`${API}/projects`);
  return response.json();
}

export async function createAIGeneration(prompt: string) {
  const response = await fetch(`${API}/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target: 'effect', prompt }),
  });
  return response.json();
}
```

## Notes for production hardening

For production, connect these modules to your real EVzone systems:

- Replace file-backed store with PostgreSQL, Redis, or your existing EVzone storage.
- Point Studio Bridge endpoints to the actual EVzone Live Studio connector.
- Run AI endpoints through a secure server-side AI gateway.
- Keep API keys server-side only.
- Add IP allowlists or internal key protection for admin routes.
- Wire file uploads to internal storage.
- Add integration tests around send-to-studio and recovery flows.
