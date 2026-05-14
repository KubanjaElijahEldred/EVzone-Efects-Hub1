# Backend Architecture

## Stack

- NestJS
- TypeScript
- Swagger
- ValidationPipe
- Helmet
- Compression
- File-backed local state
- WebSocket gateway for Studio Bridge
- OpenAI Node SDK for backend-only AI image generation

## Directory structure

```text
src/
  common/
  database/
  modules/
    health/
    home/
    app-routes/
    studio-bridge/
    projects/
    editor/
    assets/
    resources/
    ai/
    tracking/
    visual-logic/
    developer/
    materials/
    vfx/
    interactive/
    preview/
    studio-integration/
    send-to-studio/
    learning/
    insights/
    settings/
    admin/
    recovery/
    maintenance/
    search/
```

## Data model

The data model is centralized in `src/common/types/domain.types.ts`.

## Local data persistence

`AppStateService` loads from and writes to `EVZONE_DATA_FILE`.

This keeps the backend plug-and-play while giving the team a single place to replace with a real database later.

## Library inventory alignment

The local `EVzone_Library_Inventory` document is treated as the platform package map. The app should stay free, studio-native, and accountless:

- No authentication libraries in Effect Hub.
- No Stripe, billing, payout, marketplace, creator earnings, or revenue analytics packages.
- No AI API keys in frontend code or Vite environment files.
- AI image generation runs through this backend only.

Already covered in the current implementation:

- Frontend shell: React, TypeScript, Vite, React Router, Zustand, React Query, MUI, Framer Motion, Sonner.
- Creator tools: Three.js, React Three Fiber, Drei, XYFlow, Monaco, MediaPipe Tasks Vision.
- Storage and exports: Dexie, LocalForage, JSZip, File Saver, PapaParse, Recharts, jsPDF, html2canvas.
- Backend: NestJS, Swagger, Helmet, Compression, WebSocket gateway, file-backed local state.
- AI: OpenAI Node SDK from the backend, with `OPENAI_API_KEY` stored only in `EVzone_Effect_Hub_Backend/.env`.

Deferred until a feature needs them:

- Radix UI, command palette, hotkeys, drag-and-drop, and virtualization packages.
- Pixi/Konva, audio-analysis, video/GIF export, desktop bridge, and browser testing packages.
- TensorFlow/OpenCV tracking extras beyond the current MediaPipe base.

## AI image generation

`src/modules/ai/ai.controller.ts` owns AI generation. If `OPENAI_API_KEY` is missing, the endpoint returns a successful EVzone response with `requiresApiKey: true`, so the frontend can explain what is needed without crashing.

Backend environment keys:

```text
OPENAI_API_KEY=
OPENAI_IMAGE_MODEL=gpt-image-1.5
OPENAI_IMAGE_SIZE=1024x1024
OPENAI_IMAGE_QUALITY=medium
```

OpenAI API usage is paid usage on the OpenAI account that owns the key.
