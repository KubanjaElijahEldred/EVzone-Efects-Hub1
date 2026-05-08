# Frontend Integration Guide

This backend is built to match the EVzone Effect Hub frontend routes and service stubs.

## Environment variables

Add this to the frontend `.env`:

```bash
VITE_EVZONE_API_URL=http://localhost:3777/api/v1
VITE_EVZONE_STUDIO_BRIDGE_URL=ws://localhost:3777/studio-bridge
```

## Suggested service replacements

Replace the current frontend service stubs with fetch calls:

| Frontend Service | Backend Endpoints |
| --- | --- |
| `studioBridge.ts` | `/studio-bridge/status`, `/studio-bridge/connect`, `/studio-bridge/reconnect`, WebSocket `/studio-bridge` |
| `localProjectStore.ts` | `/projects`, `/projects/:id`, `/projects/:id/versions`, `/editor/:projectId/autosave` |
| `diagnostics.ts` | `/recovery/issues`, `/recovery/logs`, `/recovery/support-package`, `/recovery/diagnostics` |
| `resourceLibrary.ts` | `/resources`, `/resources/featured`, `/resources/:id/import`, `/resources/:id/remix` |
| `aiCreator.ts` | `/ai/generate`, `/ai/results`, `/ai/optimize`, `/ai/fix-error`, `/ai/safety-check` |
| `settingsStore.ts` | `/settings`, `/settings/reset-layout`, `/settings/clear-cache`, `/settings/export-local-data` |

## Route alignment

The backend exposes `/routes` so the frontend can validate page routes and support the premium 404 recovery page.

## No auth / no billing

The backend intentionally avoids login, password, billing, payouts, sales, and marketplace endpoints.
