# EVzone Effect Hub Backend API Endpoints

Base URL in development: `http://localhost:3777/api/v1`.

Swagger UI: `http://localhost:3777/docs`.

## AI Creator

| Method | Endpoint |
| --- | --- |
| `POST` | `/api/v1/ai/generate` |
| `GET` | `/api/v1/ai/results` |
| `GET` | `/api/v1/ai/results/:id` |
| `POST` | `/api/v1/ai/results/:id/remix` |
| `POST` | `/api/v1/ai/results/:id/open-in-editor` |
| `POST` | `/api/v1/ai/optimize` |
| `POST` | `/api/v1/ai/fix-error` |
| `POST` | `/api/v1/ai/safety-check` |
| `GET` | `/api/v1/ai/prompts` |

## App Routes

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/routes` |
| `GET` | `/api/v1/routes/groups` |
| `GET` | `/api/v1/routes/:id` |

## Assets

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/assets` |
| `GET` | `/api/v1/assets/supported-formats` |
| `POST` | `/api/v1/assets/upload` |
| `GET` | `/api/v1/assets/:id` |
| `POST` | `/api/v1/assets/validate` |
| `POST` | `/api/v1/assets/repair` |

## Code & Developer Lab

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/developer/api-reference` |
| `GET` | `/api/v1/developer/api-reference/:topic` |
| `GET` | `/api/v1/developer/scripts` |
| `POST` | `/api/v1/developer/scripts` |
| `POST` | `/api/v1/developer/scripts/validate` |
| `POST` | `/api/v1/developer/packages/export` |

## Editor Workspace

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/editor/workspace/:projectId` |
| `PUT` | `/api/v1/editor/workspace/:projectId/layout` |
| `POST` | `/api/v1/editor/:projectId/autosave` |
| `POST` | `/api/v1/editor/:projectId/snapshot` |
| `GET` | `/api/v1/editor/:projectId/effect-stack` |
| `PUT` | `/api/v1/editor/:projectId/effect-stack` |
| `GET` | `/api/v1/editor/:projectId/console` |
| `POST` | `/api/v1/editor/:projectId/command` |

## Effect Creator Home

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/home/dashboard` |
| `GET` | `/api/v1/home/quick-actions` |
| `GET` | `/api/v1/home/updates` |

## Free Resource Library

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/resources` |
| `GET` | `/api/v1/resources/featured` |
| `GET` | `/api/v1/resources/categories` |
| `GET` | `/api/v1/resources/:id` |
| `POST` | `/api/v1/resources/:id/import` |
| `POST` | `/api/v1/resources/:id/remix` |

## Global Search

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/search` |
| `GET` | `/api/v1/search/404` |

## Health

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/health` |
| `GET` | `/api/v1/health/liveness` |
| `GET` | `/api/v1/health/readiness` |
| `GET` | `/api/v1/health/palette` |

## Interactive Effects Lab

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/interactive/presets` |
| `POST` | `/api/v1/interactive/effects` |
| `POST` | `/api/v1/interactive/test` |

## Internal Admin Center

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/admin/system-health` |
| `GET` | `/api/v1/admin/editor-usage` |
| `GET` | `/api/v1/admin/crash-reports` |
| `GET` | `/api/v1/admin/ai-usage` |
| `GET` | `/api/v1/admin/resources` |
| `PATCH` | `/api/v1/admin/resources/:id` |
| `GET` | `/api/v1/admin/templates` |
| `POST` | `/api/v1/admin/templates` |
| `PATCH` | `/api/v1/admin/templates/:id` |
| `GET` | `/api/v1/admin/presets` |
| `GET` | `/api/v1/admin/ai-safety/flagged-content` |
| `PATCH` | `/api/v1/admin/ai-safety/flagged-content/:id` |
| `GET` | `/api/v1/admin/logs` |
| `GET` | `/api/v1/admin/feature-flags` |
| `PATCH` | `/api/v1/admin/feature-flags/:key` |
| `GET` | `/api/v1/admin/rules/compatibility` |
| `PUT` | `/api/v1/admin/rules/compatibility` |
| `GET` | `/api/v1/admin/rules/runtime-budgets` |
| `PUT` | `/api/v1/admin/rules/runtime-budgets` |
| `GET` | `/api/v1/admin/rules/content-policy` |
| `GET` | `/api/v1/admin/studio-connector/logs` |
| `GET` | `/api/v1/admin/releases` |
| `POST` | `/api/v1/admin/releases` |
| `PATCH` | `/api/v1/admin/releases/:id` |
| `POST` | `/api/v1/admin/releases/:id/rollout` |

## Learning & Documentation Hub

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/learning/paths` |
| `GET` | `/api/v1/learning/paths/:id` |
| `GET` | `/api/v1/learning/docs/search` |
| `GET` | `/api/v1/learning/api-docs` |
| `GET` | `/api/v1/learning/shortcuts` |
| `GET` | `/api/v1/learning/tutorials/:id` |

## Maintenance / System Update

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/maintenance/status` |
| `PUT` | `/api/v1/maintenance/status` |
| `GET` | `/api/v1/maintenance/update-notes` |
| `GET` | `/api/v1/maintenance/timeline` |
| `POST` | `/api/v1/maintenance/local-save` |
| `GET` | `/api/v1/maintenance/checklist` |

## Materials & Shader Lab

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/materials` |
| `GET` | `/api/v1/materials/presets` |
| `GET` | `/api/v1/materials/:id` |
| `POST` | `/api/v1/materials` |
| `POST` | `/api/v1/materials/generate` |
| `POST` | `/api/v1/materials/validate-performance` |

## Preview & Quality Center

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/preview/media` |
| `POST` | `/api/v1/preview/session` |
| `POST` | `/api/v1/preview/upload` |
| `POST` | `/api/v1/preview/quality-check` |
| `POST` | `/api/v1/preview/performance-profile` |
| `POST` | `/api/v1/preview/qr` |
| `GET` | `/api/v1/preview/history` |
| `POST` | `/api/v1/preview/feedback` |

## Project Insights

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/insights/projects/:projectId` |
| `GET` | `/api/v1/insights/projects/:projectId/usage` |
| `GET` | `/api/v1/insights/projects/:projectId/quality` |
| `GET` | `/api/v1/insights/projects/:projectId/reliability` |
| `GET` | `/api/v1/insights/projects/:projectId/reports` |

## Projects

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/projects` |
| `GET` | `/api/v1/projects/recent` |
| `GET` | `/api/v1/projects/drafts` |
| `GET` | `/api/v1/projects/live-ready` |
| `GET` | `/api/v1/projects/autosaves` |
| `POST` | `/api/v1/projects` |
| `POST` | `/api/v1/projects/wizard/create` |
| `GET` | `/api/v1/projects/:id` |
| `PATCH` | `/api/v1/projects/:id` |
| `DELETE` | `/api/v1/projects/:id` |
| `POST` | `/api/v1/projects/:id/duplicate` |
| `POST` | `/api/v1/projects/:id/archive` |
| `POST` | `/api/v1/projects/:id/restore` |
| `GET` | `/api/v1/projects/:id/assets` |
| `GET` | `/api/v1/projects/:id/notes` |
| `POST` | `/api/v1/projects/:id/notes` |
| `GET` | `/api/v1/projects/:id/versions` |
| `POST` | `/api/v1/projects/:id/versions` |
| `POST` | `/api/v1/projects/:id/versions/:versionId/restore` |
| `GET` | `/api/v1/projects/:id/versions/compare/:fromVersionId/:toVersionId` |

## Recovery & Diagnostics Center

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/recovery/issues` |
| `POST` | `/api/v1/recovery/diagnostics` |
| `GET` | `/api/v1/recovery/autosaves` |
| `GET` | `/api/v1/recovery/autosaves/:id/compare` |
| `POST` | `/api/v1/recovery/autosaves/:id/restore` |
| `POST` | `/api/v1/recovery/dependencies/repair` |
| `POST` | `/api/v1/recovery/retry/:issueId` |
| `GET` | `/api/v1/recovery/logs` |
| `POST` | `/api/v1/recovery/support-package` |
| `POST` | `/api/v1/recovery/diagnostic-package` |
| `POST` | `/api/v1/recovery/bridge/reconnect` |

## Send to Studio Wizard

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/send-to-studio/:projectId/status` |
| `POST` | `/api/v1/send-to-studio/:projectId/metadata` |
| `POST` | `/api/v1/send-to-studio/:projectId/preview-assets` |
| `POST` | `/api/v1/send-to-studio/:projectId/final-quality-check` |
| `POST` | `/api/v1/send-to-studio/:projectId/target` |
| `POST` | `/api/v1/send-to-studio/:projectId/export-package` |
| `POST` | `/api/v1/send-to-studio/:projectId/send` |

## Settings Center

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/settings` |
| `PUT` | `/api/v1/settings` |
| `PATCH` | `/api/v1/settings/:section` |
| `POST` | `/api/v1/settings/reset-layout` |
| `POST` | `/api/v1/settings/clear-cache` |
| `POST` | `/api/v1/settings/export-local-data` |
| `POST` | `/api/v1/settings/backup` |
| `POST` | `/api/v1/settings/restore` |

## Studio Bridge

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/studio-bridge/status` |
| `POST` | `/api/v1/studio-bridge/connect` |
| `POST` | `/api/v1/studio-bridge/reconnect` |
| `POST` | `/api/v1/studio-bridge/disconnect` |
| `GET` | `/api/v1/studio-bridge/diagnostics` |
| `GET` | `/api/v1/studio-bridge/runtime-limits` |
| `GET` | `/api/v1/studio-bridge/scenes` |
| `GET` | `/api/v1/studio-bridge/cameras` |
| `GET` | `/api/v1/studio-bridge/overlays` |
| `POST` | `/api/v1/studio-bridge/events` |

## Studio Integration Center

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/studio-integration/status` |
| `GET` | `/api/v1/studio-integration/bindings/:projectId` |
| `PUT` | `/api/v1/studio-integration/bindings/:projectId` |
| `POST` | `/api/v1/studio-integration/triggers` |
| `GET` | `/api/v1/studio-integration/control-surface/:projectId` |
| `PUT` | `/api/v1/studio-integration/control-surface/:projectId` |
| `POST` | `/api/v1/studio-integration/sync-assets` |
| `POST` | `/api/v1/studio-integration/live-preview` |
| `POST` | `/api/v1/studio-integration/emergency-disable` |

## Tracking Lab

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/tracking/capabilities` |
| `GET` | `/api/v1/tracking/presets` |
| `POST` | `/api/v1/tracking/calibrate` |
| `POST` | `/api/v1/tracking/test` |

## VFX & Motion Lab

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/vfx/presets` |
| `GET` | `/api/v1/vfx/effects/:id` |
| `POST` | `/api/v1/vfx/effects` |
| `POST` | `/api/v1/vfx/test` |

## Visual Logic Lab

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/v1/visual-logic/node-types` |
| `GET` | `/api/v1/visual-logic/graphs` |
| `GET` | `/api/v1/visual-logic/graphs/:id` |
| `POST` | `/api/v1/visual-logic/graphs` |
| `POST` | `/api/v1/visual-logic/generate` |
| `POST` | `/api/v1/visual-logic/debug` |

