# EVzone Effect Hub Project Structure

## Purpose

This project is the TypeScript/Vite/MUI/Tailwind application shell for the EVzone Effect Hub. It packages all generated EVzone AR/effect creator pages into a routed, responsive, plug-and-play frontend.

## Tech Stack

- TypeScript
- Vite
- React
- MUI
- Tailwind CSS
- React Router
- React Query
- Zustand-ready architecture
- EVzone design tokens

## Colours

```txt
--evz-green:       #03cd8c
--evz-orange:      #f77f00
--evz-grey-medium: #a6a6a6
--evz-grey-light:  #f2f2f2
```

## Core Files

### `src/main.tsx`

Application entry. Wraps the app with:

- React Strict Mode
- React Query provider
- MUI Theme Provider
- Browser Router
- Sonner toaster

### `src/App.tsx`

Defines all page routes and uses `AppShell` as the main layout.

### `src/components/AppShell.tsx`

Premium responsive layout with:

- MUI app bar
- responsive drawer navigation
- EVzone Studio connection badge
- page search
- local snapshot action
- mobile drawer support

### `src/theme/evzoneTheme.ts`

MUI theme using EVzone colours.

### `src/styles/tokens.css`

CSS custom properties for EVzone colours, shadows, borders and gradients.

### `tailwind.config.ts`

Tailwind theme extension for EVzone colours.

## Pages Folder

`src/pages` contains every page as an isolated React component with its own premium styling. This allows quick iteration while your team connects real data, local bridge APIs, AI APIs and project storage.

## Service Expansion Plan

Recommended future service modules:

```txt
src/services/studioBridge.ts
src/services/localProjectStore.ts
src/services/resourceLibrary.ts
src/services/previewRuntime.ts
src/services/aiCreator.ts
src/services/recoveryDiagnostics.ts
src/services/internalAdmin.ts
```

## Plug-and-Play Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
