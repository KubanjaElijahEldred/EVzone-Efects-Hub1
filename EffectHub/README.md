# EVzone Effect Hub

A premium, studio-native AR/effect creator platform built with **TypeScript + Vite + MUI + Tailwind**.

This project is designed to be plug-and-play for the EVzone Live Studio team. It includes the complete page inventory generated for the EVzone Effect Creator / Effect Hub, responsive navigation, embedded EVzone colour tokens, page routes, local-safe recovery concepts, and no authentication or monetization dependencies.

## EVzone Colours

The EVzone palette is embedded in:

- `src/styles/tokens.css`
- `src/theme/evzoneTheme.ts`
- `tailwind.config.ts`

```txt
Green:       #03cd8c
Orange:      #f77f00
Medium Grey: #a6a6a6
Light Grey:  #f2f2f2
```

## Quick Start

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:5173
```

## Backend Connection

The NestJS backend from `EVzone_Effect_Hub_Backend_NestJS (3).zip` has been unpacked beside this frontend as:

```txt
../EVzone_Effect_Hub_Backend
```

The frontend reads these values from `.env`:

```bash
VITE_EVZONE_API_URL=http://localhost:3777/api/v1
VITE_EVZONE_STUDIO_BRIDGE_URL=ws://localhost:3777/studio-bridge
```

Run the backend and frontend in separate terminals:

```bash
npm run backend:dev
npm run dev
```

Backend API docs will be available at:

```txt
http://localhost:3777/docs
```

## Production Build

```bash
npm run build
npm run preview
```

## Included Pages

| # | Route | Page |
|---:|---|---|
| 1 | `/` | Effect Creator Home |
| 2 | `/studio-connection` | Studio Connection & Readiness |
| 3 | `/projects` | Projects & Versions Hub |
| 4 | `/new-project` | New Project Wizard |
| 5 | `/editor` | Editor Workspace |
| 6 | `/tracking` | Tracking Lab |
| 7 | `/visual-logic` | Visual Logic Lab |
| 8 | `/developer` | Code & Developer Lab |
| 9 | `/materials` | Materials & Shader Lab |
| 10 | `/vfx-motion` | VFX & Motion Lab |
| 11 | `/interactive` | Interactive Effects Lab |
| 12 | `/ai` | AI Creator Hub |
| 13 | `/library` | Free Resource Library |
| 14 | `/preview-quality` | Preview & Quality Center |
| 15 | `/studio-integration` | Studio Integration Center |
| 16 | `/send-to-studio` | Send to Studio Wizard |
| 17 | `/learning` | Learning & Documentation Hub |
| 18 | `/insights` | Project Insights |
| 19 | `/settings` | Settings Center |
| 20 | `/internal-admin` | Internal Admin Center |
| 21 | `/recovery` | Recovery & Diagnostics Center |
| 22 | `/maintenance` | Maintenance / System Update Page |
| 23 | `*` and `/404` | 404 / Missing Page |

## Project Structure

```txt
EVzone_Effect_Hub/
├── docs/
│   └── PROJECT_STRUCTURE.md
├── public/
│   ├── manifest.webmanifest
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── AppShell.tsx
│   │   ├── BrandMark.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── PageLoader.tsx
│   ├── config/
│   │   └── navigation.ts
│   ├── hooks/
│   │   └── useLocalWorkspace.ts
│   ├── pages/
│   │   └── 23 premium EVzone pages
│   ├── services/
│   │   ├── aiCreator.ts
│   │   ├── diagnostics.ts
│   │   ├── localProjectStore.ts
│   │   ├── resourceLibrary.ts
│   │   ├── settingsStore.ts
│   │   └── studioBridge.ts
│   ├── store/
│   │   └── useEffectHubStore.ts
│   ├── styles/
│   │   ├── globals.css
│   │   ├── index.css
│   │   └── tokens.css
│   ├── theme/
│   │   └── evzoneTheme.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── format.ts
│   ├── App.tsx
│   └── main.tsx
├── .postcssrc.json
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Important Product Rules

This platform is intentionally:

- Free.
- Studio-native.
- Connected to the existing EVzone Live Studio.
- No authentication.
- No account panel.
- No billing.
- No marketplace monetization.
- No payouts.
- No sales analytics.

## Notes for the Team

The included pages are currently UI-ready and interaction-ready mock interfaces. To connect them to real services, wire the local EVzone Studio Bridge into:

- `src/hooks/useLocalWorkspace.ts`
- `src/services/studioBridge.ts`
- `src/services/localProjectStore.ts`
- `src/services/aiCreator.ts`

The UI is responsive and uses premium light-mode-first EVzone styling throughout.
