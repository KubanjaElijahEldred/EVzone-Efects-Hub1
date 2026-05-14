# EVzone Effect Hub Services

The project includes typed service stubs so the team can connect the UI to real EVzone systems without rewriting the page layer.

## `src/services/studioBridge.ts`

Local WebSocket bridge client for EVzone Live Studio. Use this to connect scene binding, camera binding, runtime limits, send-to-studio actions and control-surface events.

## `src/services/localProjectStore.ts`

Dexie-powered IndexedDB store for local projects, versions and metadata.

## `src/services/diagnostics.ts`

Local diagnostics collector for recovery, error logs and internal support packages.

## `src/services/resourceLibrary.ts`

Starter resource library search service for free templates, presets and assets.

## `src/services/aiCreator.ts`

Typed AI generation request/result interface. Connect this to your secure backend AI service. Do not expose AI API keys in the browser.

## `src/services/settingsStore.ts`

Local settings load/save helpers with the EVzone palette embedded.

## `src/store/useEffectHubStore.ts`

Zustand store for shared UI state such as active project and Studio connection.
