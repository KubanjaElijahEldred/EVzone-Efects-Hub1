# EVzone Effect Hub - Complete Page Flow and Routing Document

**Project:** EVzone Effect Hub / EVzone AR and Effect Creator Platform  
**Generated:** 2026-04-28  
**Source project folder:** `EVzone_Effect_Hub_Project.zip`  
**Primary stack:** TypeScript, Vite, React, MUI, Tailwind, React Router  
**Design tokens:** EVzone Green `#03cd8c`, EVzone Orange `#f77f00`, Medium Grey `#a6a6a6`, Light Grey `#f2f2f2`

---

## 1. Executive Summary

This document explains how every page in the EVzone Effect Hub connects to the others, how the pages are routed, and how creators, suppliers, studio operators and internal EVzone teams should use the full platform.

The project is built as a premium, responsive, web-based TypeScript application using Vite, React, MUI, Tailwind and React Router. The attached project folder contains a routed app shell where all pages live in `src/pages`, the page registry lives in `src/routes/pageRoutes.tsx`, and the main router is implemented in `src/App.tsx`.

The platform is intentionally:

- Free and studio-native.
- Connected to the existing EVzone Live Studio.
- Designed without authentication pages.
- Designed without billing, payments, payout or marketplace monetization.
- Responsive for desktop, tablets, iPads and mobile phones.
- Built so page-level failures do not break the entire app, because every route is wrapped in `ErrorBoundary`.

---

## 2. Who This Flow Is For

### Creators

Creators use the Effect Hub to create AR effects, filters, live overlays, tracking experiences, VFX, interactive mini-games, AI-generated effects, studio-ready assets and full live production effects. Their core path is from Home to New Project or Projects, into the Editor, through the Labs, into Preview and Quality, then Studio Integration and Send to Studio.

### Suppliers

Suppliers in this platform are free-resource contributors, template builders, preset creators, asset providers, technical pack creators and internal resource managers. They use the Free Resource Library, Learning Hub, Preview and Quality tools, and - when they are EVzone internal operators - the Internal Admin Center to manage templates, resources, presets, content policy, runtime rules and releases.

### Studio Operators

Studio operators care about readiness, scene/camera/overlay bindings, trigger mapping, control surfaces, fallback behavior and emergency disable. Their most important pages are Studio Connection, Studio Integration, Send to Studio, Preview and Quality, Recovery and Maintenance.

### EVzone Internal Team

The EVzone internal team uses Settings, Project Insights, Internal Admin, Recovery and Maintenance pages to maintain quality, safety, performance, releases, compatibility rules and system status.

---

## 3. Routing Architecture

The project has one main routing source of truth: `src/routes/pageRoutes.tsx`.

That file defines:

- Page id
- Page number
- Full title
- Short navigation title
- Route path
- Route group
- Page description
- Lazy-loaded component

`src/App.tsx` imports `pageRoutes` and maps every route to a React Router route. Each page is wrapped with:

- `ErrorBoundary`
- `Suspense`
- `RouteLoader`

This gives the application a safe route-level loading and error recovery model.

### App Shell Navigation

`src/components/AppShell.tsx` controls the global responsive shell. It provides:

- MUI AppBar
- Desktop permanent drawer
- Mobile/tablet temporary drawer
- Global page search
- Route groups
- `NavLink` navigation
- Current page title from `getPageByPath(location.pathname)`
- Studio status badge

### Redirects and Fallback Routes

| Legacy or Alias Route | Canonical Route | Purpose |
| --- | --- | --- |
| materials | /materials-shaders | Redirect defined in src/App.tsx |
| interactive | /interactive-effects | Redirect defined in src/App.tsx |
| ai | /ai-creator | Redirect defined in src/App.tsx |
| library | /resources | Redirect defined in src/App.tsx |
| recovery | /recovery-diagnostics | Redirect defined in src/App.tsx |
| * | /404 | Redirect defined in src/App.tsx |

The wildcard `*` route redirects to `/404`, which loads the premium missing page.

---

## 4. Master Route Table

| No. | Path | Page | Group | Purpose | Component |
| --- | --- | --- | --- | --- | --- |
| 1 | / | Effect Creator Home | Start | Main entry point from EVzone Live Studio. | EVzoneEffectCreatorHome.tsx |
| 2 | /studio-connection | Studio Connection & Readiness | Studio | Confirms that Effect Creator is connected to EVzone Live Studio. | EVzoneStudioConnectionReadiness.tsx |
| 3 | /projects | Projects & Versions Hub | Creation | Project management, versions, restore points and send-to-studio shortcuts. | EVzoneProjectsVersionsHub.tsx |
| 4 | /new-project | New Project Wizard | Creation | Start any new effect from one clean wizard. | EVzoneNewProjectWizard.tsx |
| 5 | /editor | Editor Workspace | Creation | The main creation environment. | EVzoneEditorWorkspace.tsx |
| 6 | /tracking | Tracking Lab | Labs | Face, hand, body, segmentation, world AR and image/object tracking. | EVzoneTrackingLab.tsx |
| 7 | /visual-logic | Visual Logic Lab | Labs | No-code logic and interaction design. | EVzoneVisualLogicLab.tsx |
| 8 | /developer | Code & Developer Lab | Labs | Advanced scripting, APIs and studio bridge development. | EVzoneCodeDeveloperLab.tsx |
| 9 | /materials-shaders | Materials & Shader Lab | Labs | Premium visual look development. | EVzoneMaterialsShaderLab.tsx |
| 10 | /vfx-motion | VFX & Motion Lab | Labs | Particles, motion, animation, transitions and live graphics. | EVzoneVFXMotionLab.tsx |
| 11 | /interactive-effects | Interactive Effects Lab | Labs | Studio-ready interactive effects and mini-games. | EVzoneInteractiveEffectsLab.tsx |
| 12 | /ai-creator | AI Creator Hub | Creation | All AI creation tools in one place. | EVzoneAICreatorHub.tsx |
| 13 | /resources | Free Resource Library | Resources | Free templates, presets, assets and examples. | EVzoneFreeResourceLibrary.tsx |
| 14 | /preview-quality | Preview & Quality Center | Quality | Test and polish effects before sending to EVzone Studio. | EVzonePreviewQualityCenter.tsx |
| 15 | /studio-integration | Studio Integration Center | Studio | Connect effects to the existing EVzone Live Studio. | EVzoneStudioIntegrationCenter.tsx |
| 16 | /send-to-studio | Send to Studio Wizard | Studio | Finalize an effect and send it into EVzone Live Studio. | EVzoneSendToStudioWizard.tsx |
| 17 | /learning | Learning & Documentation Hub | Resources | Built-in education and help. | EVzoneLearningDocumentationHub.tsx |
| 18 | /insights | Project Insights | Quality | Usage and quality analytics, not monetization. | EVzoneProjectInsights.tsx |
| 19 | /settings | Settings Center | System | All non-account settings. | EVzoneSettingsCenter.tsx |
| 20 | /internal-admin | Internal Admin Center | System | EVzone internal control only. | EVzoneInternalAdminCenter.tsx |
| 21 | /recovery-diagnostics | Recovery & Diagnostics Center | System | One page for errors and recovery. | EVzoneRecoveryDiagnosticsCenter.tsx |
| 22 | /maintenance | Maintenance / System Update Page | System | Clean system status page. | EVzoneMaintenanceSystemUpdatePage.tsx |
| 23 | /404 | 404 / Missing Page | System | Premium missing route page. | EVzoneMissingPage404.tsx |

---

## 5. Route Groups in the AppShell

| Group | Pages | How it appears |
| --- | --- | --- |
| Start | 1. Home | Global drawer group in AppShell |
| Studio | 2. Studio Readiness, 15. Studio Integration, 16. Send to Studio | Global drawer group in AppShell |
| Creation | 3. Projects, 4. New Project, 5. Editor, 12. AI Creator | Global drawer group in AppShell |
| Labs | 6. Tracking, 7. Visual Logic, 8. Developer, 9. Materials, 10. VFX Motion, 11. Interactive | Global drawer group in AppShell |
| Resources | 13. Resources, 17. Learning | Global drawer group in AppShell |
| Quality | 14. Preview Quality, 18. Insights | Global drawer group in AppShell |
| System | 19. Settings, 20. Internal Admin, 21. Recovery, 22. Maintenance, 23. 404 | Global drawer group in AppShell |

---

## 6. Main Product Flow

### Creator Production Flow

```txt
EVzone Live Studio
  -> Effect Creator Home (/)
  -> Studio Connection & Readiness (/studio-connection)
  -> New Project Wizard (/new-project) or Projects & Versions Hub (/projects)
  -> Editor Workspace (/editor)
  -> Labs: Tracking, Visual Logic, Developer, Materials, VFX, Interactive, AI
  -> Preview & Quality Center (/preview-quality)
  -> Studio Integration Center (/studio-integration)
  -> Send to Studio Wizard (/send-to-studio)
  -> EVzone Live Studio
  -> Project Insights (/insights)
```

### Supplier and Resource Flow

```txt
Supplier / resource contributor
  -> Free Resource Library (/resources)
  -> New Project Wizard template or remix flow (/new-project)
  -> Editor Workspace validation (/editor)
  -> Preview & Quality Center live-safe testing (/preview-quality)
  -> Learning & Documentation Hub (/learning)
  -> Internal Admin Center for EVzone-managed curation (/internal-admin)
```

### Recovery Flow

```txt
Any page or workflow error
  -> ErrorBoundary protects the app
  -> Recovery & Diagnostics Center (/recovery-diagnostics)
  -> autosave recovery, dependency repair, retry preview/export/AI/bridge
  -> return to Editor, Projects, Preview, Studio Integration or Send Wizard
```

### System Update Flow

```txt
Maintenance or connector update
  -> Maintenance / System Update Page (/maintenance)
  -> local editing and safe save remain available
  -> Recovery & Diagnostics if retry fails
  -> Home or Studio Connection after service recovery
```

---

## 7. How the Pages Connect at a High Level

### 7.1 Entry and Readiness

The user enters from EVzone Live Studio or directly through the web app. The first page is **Effect Creator Home** at `/`. The Home page points to recent projects, new project creation, AI creation, templates, live-ready effects and core tools.

Before a creator sends anything to live production, the flow should pass through **Studio Connection & Readiness** at `/studio-connection`. This confirms Studio Bridge, active session, camera, microphone, GPU, browser/runtime capability, local storage and device preview status.

### 7.2 Creation and Authoring

From Home, the creator either opens an existing project in **Projects & Versions Hub** or starts through **New Project Wizard**. Both paths lead into **Editor Workspace**, which is the central authoring surface.

Editor Workspace connects outward to all specialist Labs:

- Tracking Lab for AR tracking.
- Visual Logic Lab for no-code interactivity.
- Code & Developer Lab for scripting.
- Materials & Shader Lab for premium looks.
- VFX & Motion Lab for particles, animation and transitions.
- Interactive Effects Lab for games, quizzes and live interaction.
- AI Creator Hub for generated effects, assets, scripts and graph logic.

### 7.3 Supplier and Resource Path

The **Free Resource Library** is the supplier-facing library for templates, presets, assets, shaders, scripts, VFX, sounds, overlays, LUTs, prompts and examples. Creators can import or remix resources into new projects or active editor projects.

Suppliers and EVzone internal resource managers should validate resources through Preview & Quality before they become recommended templates or featured packs.

### 7.4 Quality, Integration and Send-to-Studio

Once an effect is authored, it moves to **Preview & Quality Center**. This page tests webcam, studio camera, custom media, device frames, performance, compatibility, accessibility and runtime quality.

Then it moves to **Studio Integration Center**, where the effect is bound to scenes, cameras, overlay layers, triggers, hotkeys, studio buttons and control surfaces.

Finally, **Send to Studio Wizard** packages the effect, creates metadata, preview assets, quality report, backup, QR/private preview and sends it to EVzone Live Studio.

### 7.5 Post-Production and Analytics

After an effect is used in Studio, **Project Insights** shows quality and usage analytics. It does not show earnings, sales, payout or marketplace analytics. It is for quality and production improvement only.

### 7.6 Education and Settings

The **Learning & Documentation Hub** supports all pages with guided paths, API docs, shortcuts, troubleshooting and related templates.

The **Settings Center** controls non-account preferences: editor layout, workspace, autosave, devices, Studio Bridge, AI, storage, backups, notifications, privacy/data and experiments.

### 7.7 System, Recovery and Internal Control

The **Recovery & Diagnostics Center** consolidates error recovery instead of scattering errors across many pages.

The **Maintenance / System Update Page** communicates clean status, local editing availability and safe local save warnings during updates.

The **Internal Admin Center** is only for EVzone internal operations, including health, AI safety review, resource library management, rules, logs and releases.

The **404 / Missing Page** catches unknown routes and safely redirects users back to Home, Projects, Resources, Studio or Recovery.

---

## 8. Page-by-Page Flow Details

### 1. Effect Creator Home (`/`)

**Group:** Start  
**Component:** `src/pages/EVzoneEffectCreatorHome.tsx`  
**Purpose:** The premium landing page for the Effect Hub, launched from EVzone Live Studio.

**How creators use it:** Creators use it to create a new effect, open a recent project, start with AI, browse templates, or open live-ready effects.

**How suppliers use it:** Suppliers and library contributors use it as the visible entry point to featured free packs, templates and reusable studio assets.

**Inbound connections:** EVzone Live Studio launcher, AppShell Home route, 404 Return Home, post-success Create Another Effect.

**Outbound connections:** Studio Connection, Projects Hub, New Project Wizard, AI Creator Hub, Free Resource Library, Preview & Quality Center, Studio Integration.

**Data and service relationship:** Reads studio badge, recent projects, recommended templates, recent studio effects and pinned tool status.
### 2. Studio Connection & Readiness (`/studio-connection`)

**Group:** Studio  
**Component:** `src/pages/EVzoneStudioConnectionReadiness.tsx`  
**Purpose:** Confirms the Effect Hub is connected and technically ready before creators build or send effects.

**How creators use it:** Creators verify bridge, camera, microphone, GPU/browser capability, local storage and preview readiness before production work.

**How suppliers use it:** Suppliers can validate that imported assets and templates are being tested against the connected studio environment.

**Inbound connections:** Home, Studio Integration, Send to Studio preflight, Maintenance recovery and Recovery Diagnostics.

**Outbound connections:** Home, Editor, Studio Integration, Preview & Quality Center, Recovery Diagnostics if the bridge is not connected.

**Data and service relationship:** Uses studioBridge service, runtime limits, device readiness and local cache diagnostics.
### 3. Projects & Versions Hub (`/projects`)

**Group:** Creation  
**Component:** `src/pages/EVzoneProjectsVersionsHub.tsx`  
**Purpose:** Central project management, versions, drafts, collections, restore points and studio status.

**How creators use it:** Creators search, filter, duplicate, restore, archive, compare versions and send projects to Studio.

**How suppliers use it:** Suppliers can review example projects, template-derived projects and assets used by creator projects.

**Inbound connections:** Home recent projects, 404 project search, Learning examples, Recovery restored drafts, Project Insights links.

**Outbound connections:** Editor, New Project Wizard, Send to Studio Wizard, Project Insights, Recovery Diagnostics, Resource Library.

**Data and service relationship:** Uses localProjectStore, version metadata, missing asset warnings and autosave recovery notices.
### 4. New Project Wizard (`/new-project`)

**Group:** Creation  
**Component:** `src/pages/EVzoneNewProjectWizard.tsx`  
**Purpose:** A unified wizard for starting any new effect from blank, AI, template, import, remix or existing studio overlay.

**How creators use it:** Creators choose creation method, project type, target studio layer, settings and then open the editor.

**How suppliers use it:** Suppliers provide templates and starter assets that appear as selectable sources inside the wizard.

**Inbound connections:** Home quick action, Resource Library template import, Projects duplicate/remix, Learning first effect guide.

**Outbound connections:** Editor Workspace, AI Creator Hub, Resource Library, Studio Connection if target readiness is needed.

**Data and service relationship:** Uses resourceLibrary, aiCreator, localProjectStore and studioBridge target metadata.
### 5. Editor Workspace (`/editor`)

**Group:** Creation  
**Component:** `src/pages/EVzoneEditorWorkspace.tsx`  
**Purpose:** The main creation environment with hierarchy, viewport, preview, inspector, assets, visual scripting, effect stack and console.

**How creators use it:** Creators assemble effects, import assets, adjust components, script interactions, test visually and snapshot versions.

**How suppliers use it:** Suppliers can validate how free assets, templates, shaders and presets behave inside real projects.

**Inbound connections:** New Project Wizard, Projects Hub, Recovery restored drafts, Resource Library import, AI results.

**Outbound connections:** Tracking Lab, Visual Logic Lab, Developer Lab, Materials Lab, VFX Lab, Interactive Lab, AI Creator, Preview & Quality, Studio Integration, Send to Studio.

**Data and service relationship:** Consumes assets, project state, studio preview feeds, component settings, local autosave and version snapshots.
### 6. Tracking Lab (`/tracking`)

**Group:** Labs  
**Component:** `src/pages/EVzoneTrackingLab.tsx`  
**Purpose:** All AR tracking tools in one place: face, hand, pose, segmentation, world AR, image and object tracking.

**How creators use it:** Creators configure tracking sources, expression triggers, gestures, body pose, segmentation and calibration.

**How suppliers use it:** Suppliers create or validate gesture presets, tracking templates and try-on style assets.

**Inbound connections:** Editor Workspace, New Project tracking types, Resource Library gesture presets, Recovery tracking error.

**Outbound connections:** Editor Workspace, Visual Logic Lab for triggers, Preview & Quality Center for stability tests, Interactive Effects Lab.

**Data and service relationship:** Uses tracking runtime, preview media, camera sources and calibration/stability score data.
### 7. Visual Logic Lab (`/visual-logic`)

**Group:** Labs  
**Component:** `src/pages/EVzoneVisualLogicLab.tsx`  
**Purpose:** No-code logic and interaction design through a node graph, variables, subgraphs, triggers and state machines.

**How creators use it:** Creators build interactive behavior without code: triggers, actions, conditions, state machines, timers and studio controls.

**How suppliers use it:** Suppliers contribute reusable subgraphs and interaction presets for free resource packs.

**Inbound connections:** Editor, Tracking Lab, Interactive Effects Lab, AI node graph generator, Resource Library subgraphs.

**Outbound connections:** Editor, Developer Lab for advanced scripts, Preview & Quality, Studio Integration for control mapping.

**Data and service relationship:** Uses graph state, studio control nodes, gesture nodes, audio nodes and reusable presets.
### 8. Code & Developer Lab (`/developer`)

**Group:** Labs  
**Component:** `src/pages/EVzoneCodeDeveloperLab.tsx`  
**Purpose:** Advanced scripting, APIs, packages, plugins, logs, runtime events and Studio Bridge development.

**How creators use it:** Advanced creators write scripts, inspect events, use snippets and export SDK packages.

**How suppliers use it:** Technical suppliers can provide scripts, plugins, snippets and integration examples.

**Inbound connections:** Editor, Visual Logic Lab advanced path, Recovery script error, Learning API docs.

**Outbound connections:** Editor, Preview & Quality, Studio Integration, Recovery Diagnostics, Internal Admin logs if internal.

**Data and service relationship:** Uses local script files, Studio Bridge API, runtime event viewer, network/data test panel and logs.
### 9. Materials & Shader Lab (`/materials-shaders`)

**Group:** Labs  
**Component:** `src/pages/EVzoneMaterialsShaderLab.tsx`  
**Purpose:** Material, shader, PBR, texture, LUT and broadcast-quality look development.

**How creators use it:** Creators build premium visuals including skin, makeup, glow, hologram, glass and color grading.

**How suppliers use it:** Suppliers contribute materials, shaders, LUTs and texture packs to the free library.

**Inbound connections:** Editor, AI material generation, Resource Library materials, VFX Lab and Learning guides.

**Outbound connections:** Editor, VFX & Motion Lab, Preview & Quality for performance and texture budget checks.

**Data and service relationship:** Uses material presets, texture assignments, shader graph nodes and performance warnings.
### 10. VFX & Motion Lab (`/vfx-motion`)

**Group:** Labs  
**Component:** `src/pages/EVzoneVFXMotionLab.tsx`  
**Purpose:** Particles, VFX, animation, motion, transitions, physics and live graphics.

**How creators use it:** Creators build confetti, sparkles, transitions, lower-third motion and audio-reactive effects.

**How suppliers use it:** Suppliers produce VFX packs, animated overlays and transition presets.

**Inbound connections:** Editor, Materials Lab, Interactive Lab, AI Creator, Resource Library VFX.

**Outbound connections:** Editor, Visual Logic Lab for triggers, Preview & Quality, Studio Integration for live triggers.

**Data and service relationship:** Uses particle settings, animation timelines, audio metrics, physics presets and performance checks.
### 11. Interactive Effects Lab (`/interactive-effects`)

**Group:** Labs  
**Component:** `src/pages/EVzoneInteractiveEffectsLab.tsx`  
**Purpose:** Studio-ready interactive effects, mini-games, quizzes, polls, scoreboards and live-safe fallbacks.

**How creators use it:** Creators build live interactive segments with inputs from touch, keyboard, studio buttons, gestures, audio and timers.

**How suppliers use it:** Suppliers create game templates, quiz packs, poll presets and control surface examples.

**Inbound connections:** Editor, Visual Logic Lab, VFX Lab, Resource Library, New Project interactive types.

**Outbound connections:** Preview & Quality, Studio Integration, Send to Studio, Project Insights after studio use.

**Data and service relationship:** Uses game states, local leaderboard, input mappings, trigger logic and fallback behavior.
### 12. AI Creator Hub (`/ai-creator`)

**Group:** Creation  
**Component:** `src/pages/EVzoneAICreatorHub.tsx`  
**Purpose:** All AI creation tools in one place, from prompt-to-effect to AI optimization and error fixing.

**How creators use it:** Creators generate effects, filters, backgrounds, overlays, VFX, materials, scripts, node graphs and animations.

**How suppliers use it:** Suppliers can create reusable AI prompt presets and generate asset variations for the free library.

**Inbound connections:** Home Create with AI, New Project Wizard, Editor, Materials Lab, Visual Logic Lab, Learning AI path.

**Outbound connections:** Editor, Resource Library, Visual Logic Lab, Developer Lab, Materials Lab, Preview & Quality.

**Data and service relationship:** Uses aiCreator service, result history, prompt presets, AI safety checker and generated asset storage.
### 13. Free Resource Library (`/resources`)

**Group:** Resources  
**Component:** `src/pages/EVzoneFreeResourceLibrary.tsx`  
**Purpose:** One free resource library for templates, presets, 3D models, textures, VFX, sounds, UI kits and examples.

**How creators use it:** Creators search, preview, import and remix free resources into active projects.

**How suppliers use it:** This is the main supplier-facing area for reusable free assets, templates, prompts, snippets and example projects.

**Inbound connections:** Home, New Project Wizard, Editor, Learning, 404 Resource search.

**Outbound connections:** New Project Wizard, Editor, AI Creator, Learning guides, Preview & Quality for asset validation.

**Data and service relationship:** Uses resourceLibrary service, asset validation, license notes, tags and local import workflows.
### 14. Preview & Quality Center (`/preview-quality`)

**Group:** Quality  
**Component:** `src/pages/EVzonePreviewQualityCenter.tsx`  
**Purpose:** Quality and preview testing before sending effects to EVzone Studio.

**How creators use it:** Creators test webcam/studio camera preview, media subjects, before/after, device frames, QR preview and performance.

**How suppliers use it:** Suppliers validate that resources and templates are live-safe and performant before wider use.

**Inbound connections:** Editor, Labs, Studio Integration, Send Wizard preflight, Project Insights quality review.

**Outbound connections:** Studio Integration, Send to Studio, Recovery Diagnostics for preview/export failures, Editor for fixes.

**Data and service relationship:** Uses preview runtime, performance profiler, compatibility report, accessibility checks and test history.
### 15. Studio Integration Center (`/studio-integration`)

**Group:** Studio  
**Component:** `src/pages/EVzoneStudioIntegrationCenter.tsx`  
**Purpose:** Connects the effect to the existing EVzone Live Studio scenes, cameras, overlays, triggers and control surfaces.

**How creators use it:** Creators map where the effect appears in live production and how operators control it.

**How suppliers use it:** Suppliers validate that templates include proper scene, camera and control surface defaults.

**Inbound connections:** Editor, Preview & Quality, Studio Connection, Interactive Lab and Send Wizard.

**Outbound connections:** Send to Studio Wizard, Preview & Quality, Recovery Diagnostics, EVzone Studio.

**Data and service relationship:** Uses studioBridge, scene bindings, camera bindings, control surface mapping, runtime settings and sync logs.
### 16. Send to Studio Wizard (`/send-to-studio`)

**Group:** Studio  
**Component:** `src/pages/EVzoneSendToStudioWizard.tsx`  
**Purpose:** Final packaging wizard that sends an effect into EVzone Live Studio.

**How creators use it:** Creators complete metadata, preview assets, final quality check, studio target, package export and success actions.

**How suppliers use it:** Suppliers can package templates or example projects for internal studio use without marketplace monetization.

**Inbound connections:** Studio Integration, Preview & Quality, Projects Hub, Editor.

**Outbound connections:** EVzone Studio, Project Insights, Editor, New Project Wizard, Recovery Diagnostics on failure.

**Data and service relationship:** Uses project metadata, preview assets, quality report, studio target, backup, QR/private preview and package generator.
### 17. Learning & Documentation Hub (`/learning`)

**Group:** Resources  
**Component:** `src/pages/EVzoneLearningDocumentationHub.tsx`  
**Purpose:** Built-in education, documentation, tutorials, API docs, shortcuts and troubleshooting.

**How creators use it:** Creators follow guided learning paths and open related templates or example projects.

**How suppliers use it:** Suppliers use guides to build compatible resources and example projects for creators.

**Inbound connections:** AppShell navigation, Home, Resource Library, 404 help paths.

**Outbound connections:** Resource Library, New Project Wizard, Editor, Labs, Studio Integration, Recovery Diagnostics.

**Data and service relationship:** Uses tutorial metadata, related templates, API docs, keyboard shortcuts and troubleshooting guides.
### 18. Project Insights (`/insights`)

**Group:** Quality  
**Component:** `src/pages/EVzoneProjectInsights.tsx`  
**Purpose:** Usage and quality analytics for projects, not monetization.

**How creators use it:** Creators review use counts, scene/camera usage, trigger frequency, FPS history and quality trends.

**How suppliers use it:** Suppliers understand which templates and assets perform well in studio without earnings or marketplace analytics.

**Inbound connections:** Projects Hub, Send success, Studio Integration and internal review flows.

**Outbound connections:** Projects Hub, Preview & Quality for optimization, Export Reports, Internal Admin for internal monitoring.

**Data and service relationship:** Uses internal usage, quality scores, crash history, failed preview/export history and version comparisons.
### 19. Settings Center (`/settings`)

**Group:** System  
**Component:** `src/pages/EVzoneSettingsCenter.tsx`  
**Purpose:** All non-account settings for the Effect Hub.

**How creators use it:** Creators configure language, region, editor layout, autosave, devices, AI, cache, backups and privacy controls.

**How suppliers use it:** Suppliers use local settings for consistent asset testing, backups and resource validation.

**Inbound connections:** AppShell navigation and settings shortcuts from any page.

**Outbound connections:** Returns to prior page; affects Editor, Studio Bridge, AI, Storage, Recovery and Device Preview behavior.

**Data and service relationship:** Uses settingsStore and local preferences; excludes password, profile, billing and authentication settings.
### 20. Internal Admin Center (`/internal-admin`)

**Group:** System  
**Component:** `src/pages/EVzoneInternalAdminCenter.tsx`  
**Purpose:** Internal EVzone control center for health, usage, library management, safety, rules, logs and releases.

**How creators use it:** Creators do not normally use this page. It protects platform reliability and content quality behind internal operations.

**How suppliers use it:** Internal supplier/resource managers use it to manage library content, templates, presets and content policy review.

**Inbound connections:** Internal admin route, quality/admin operations, AI safety escalation, release workflows.

**Outbound connections:** Resource Library management, AI safety queue, logs, rule updates, release management.

**Data and service relationship:** Uses internal diagnostics, resource metadata, feature flags, compatibility rules, runtime budgets and connector logs.
### 21. Recovery & Diagnostics Center (`/recovery-diagnostics`)

**Group:** System  
**Component:** `src/pages/EVzoneRecoveryDiagnosticsCenter.tsx`  
**Purpose:** One recovery page for autosave, offline, import, preview, export, AI, script, tracking and bridge errors.

**How creators use it:** Creators restore drafts, repair missing dependencies, retry failures and package diagnostics without losing work.

**How suppliers use it:** Suppliers use diagnostics to repair asset packages, unsupported formats and template dependencies.

**Inbound connections:** Any error state, ErrorBoundary support flow, Preview/Export failures, Studio Bridge failures, Maintenance.

**Outbound connections:** Original page, Projects Hub, Editor, Preview & Quality, Studio Connection, Internal Support Package.

**Data and service relationship:** Uses diagnostics service, logs, autosave snapshots, dependency repair, bridge diagnostics and support packages.
### 22. Maintenance / System Update Page (`/maintenance`)

**Group:** System  
**Component:** `src/pages/EVzoneMaintenanceSystemUpdatePage.tsx`  
**Purpose:** Clean maintenance and system update status page.

**How creators use it:** Creators see what remains available, when recovery is expected and how to save safely during updates.

**How suppliers use it:** Suppliers know whether local resource work can continue while connector or library services update.

**Inbound connections:** System status, AppShell banner, Recovery Diagnostics and admin release updates.

**Outbound connections:** Home, Recovery Diagnostics, local save flow, Studio Connection after recovery.

**Data and service relationship:** Uses connector status, local save warnings, update notes and recovery timeline.
### 23. 404 / Missing Page (`/404`)

**Group:** System  
**Component:** `src/pages/EVzoneMissingPage404.tsx`  
**Purpose:** Premium missing route page that catches unavailable or unknown URLs.

**How creators use it:** Creators recover from broken links by returning home, searching projects/resources, opening Studio or recovering recent work.

**How suppliers use it:** Suppliers can find resource library content or recover recent asset/project work from a missing route.

**Inbound connections:** Wildcard route from App.tsx, invalid browser URL, moved route, old bookmark.

**Outbound connections:** Home, Projects Hub, Resource Library, EVzone Studio, Recovery Diagnostics.

**Data and service relationship:** Uses search over safe destinations, recent recoveries and route check messaging.


---

## 9. Services and Shared State Connections

| File | Role | How it connects pages |
| --- | --- | --- |
| src/routes/pageRoutes.tsx | Route source of truth | Defines id, number, path, group, title, description and lazy page component for all 23 pages. |
| src/App.tsx | Router | Creates the AppShell layout route, maps every PageRoute into a React Router <Route>, wraps each page in ErrorBoundary and Suspense/RouteLoader, and redirects aliases to canonical routes. |
| src/components/AppShell.tsx | Responsive shell | MUI AppBar, permanent desktop drawer, temporary mobile/tablet drawer, page search, NavLink navigation, current page title and StudioStatusBadge. |
| src/components/ErrorBoundary.tsx | Crash containment | Prevents a broken page from breaking the full app. It resets when the route changes. |
| src/components/RouteLoader.tsx | Lazy loading state | Premium loading UI shown while lazy page chunks load. |
| src/components/StudioStatusBadge.tsx | Studio state indicator | Displays Studio connection readiness in the app chrome. |
| src/services/studioBridge.ts | Studio bridge stub | Connect scene binding, camera binding, runtime limits, send-to-studio actions and control surface events. |
| src/services/localProjectStore.ts | Local project storage stub | Connect local projects, versions, recent projects, restore points and metadata using IndexedDB/Dexie. |
| src/services/resourceLibrary.ts | Free resource search stub | Connect templates, presets, VFX, LUTs, assets, snippets and example projects. |
| src/services/aiCreator.ts | AI service interface | Connect prompt-to-effect, AI safety, generation history and optimization to a secure backend. |
| src/services/diagnostics.ts | Diagnostics collector | Connect recovery logs, support packages, crash reports and preview/export failure records. |
| src/services/settingsStore.ts | Local settings | Persist non-account settings, local privacy, bridge preferences, editor layout and AI defaults. |
| src/store/useEffectHubStore.ts | Shared state | Global active project and Studio connection state for page-to-page continuity. |

---

## 10. Practical End-to-End User Journeys

### Journey A: Creator Builds a New Effect

1. Start at **Effect Creator Home** (`/`).
2. Check system readiness in **Studio Connection** (`/studio-connection`).
3. Create a project in **New Project Wizard** (`/new-project`).
4. Open the project in **Editor Workspace** (`/editor`).
5. Use specialist labs as needed:
   - Tracking for AR behavior.
   - Visual Logic for interactions.
   - Materials and VFX for look and motion.
   - AI Creator for generated assets or scripts.
6. Test in **Preview & Quality Center** (`/preview-quality`).
7. Map to live production in **Studio Integration Center** (`/studio-integration`).
8. Finalize with **Send to Studio Wizard** (`/send-to-studio`).
9. Review usage in **Project Insights** (`/insights`).

### Journey B: Creator Opens and Improves an Existing Project

1. Start at Home or go directly to **Projects & Versions Hub** (`/projects`).
2. Search or filter existing projects.
3. Open a selected project in **Editor Workspace**.
4. Restore or compare versions if necessary.
5. Use Labs for improvements.
6. Run Preview & Quality.
7. Send updated version to Studio.

### Journey C: Supplier Adds a Free Resource

1. Use **Free Resource Library** (`/resources`) as the destination for supplier templates, presets and assets.
2. Test resource in **New Project Wizard** or **Editor Workspace**.
3. Validate performance in **Preview & Quality Center**.
4. Add learning or example links in **Learning & Documentation Hub**.
5. EVzone internal teams manage approval, policy and publishing through **Internal Admin Center**.

### Journey D: Operator Needs Live Studio Control

1. Confirm readiness in **Studio Connection**.
2. Open **Studio Integration Center**.
3. Bind scene, camera and overlay layer.
4. Configure hotkeys, triggers, studio buttons and fallback behavior.
5. Open **Send to Studio Wizard**.
6. Test in EVzone Studio.
7. Use **Recovery & Diagnostics** if bridge or preview issues occur.

### Journey E: Page or Route Fails

1. React Router wildcard sends unknown URLs to `/404`.
2. The 404 page offers Home, Projects, Resource Library, Studio and Recovery paths.
3. If there is a real error, **Recovery & Diagnostics Center** handles autosave, dependency repair, retry actions and internal support packages.

---

## 11. Responsive Behavior

The project is built for responsive web use across desktop, tablets, iPads and mobile phones.

### Desktop

- Permanent MUI drawer is shown on large screens.
- Page groups and route search stay visible.
- Main content is offset by drawer width.

### Tablet and iPad

- AppBar remains visible.
- Navigation becomes a temporary drawer.
- Pages use responsive grids that collapse into fewer columns.

### Mobile Phones

- Drawer opens from the menu icon.
- Cards and panels stack vertically.
- All routes remain accessible through AppShell search and grouped navigation.
- Page content should remain usable without horizontal scrolling.

---

## 12. Project-Wide Principles

1. **Studio-native first:** Everything connects back to EVzone Live Studio.
2. **No authentication:** The Effect Hub is launched from an already-produced Studio environment.
3. **No monetization:** No billing, payout, marketplace, checkout or earnings flows.
4. **Free resource model:** Templates, presets and assets are free and curated for studio use.
5. **Recovery-first:** Errors should route to Recovery & Diagnostics rather than breaking the app.
6. **Quality-first:** Every production effect should pass Preview & Quality before Send to Studio.
7. **Supplier support:** Suppliers contribute value through free resources, templates, presets, examples and validated packs.
8. **Responsive by default:** All layouts should support mobile, tablet and desktop.
9. **Internal control separated:** Internal Admin is clearly separated from creator workflows.
10. **Local safety:** Local autosave, backups, diagnostics and safe local saves protect creator work.

---

## 13. Implementation Notes for the Team

### Page Buttons and Real Navigation

The global navigation is already implemented through `AppShell` and `pageRoutes`. Some page-level buttons are currently premium UI flows and should be connected by the team using `useNavigate()` or service actions.

Recommended action wiring:

- `Create New Effect` -> `/new-project`
- `Open Project` -> `/projects`
- `Create with AI` -> `/ai-creator`
- `Browse Templates` -> `/resources`
- `Open in Editor` -> `/editor`
- `Run Quality Check` -> `/preview-quality`
- `Map to Studio` -> `/studio-integration`
- `Send to Studio` -> `/send-to-studio`
- `Recover Draft` -> `/recovery-diagnostics`
- `Open Documentation` -> `/learning`

### Service Wiring Priority

1. Studio Bridge service.
2. Local Project Store.
3. Resource Library service.
4. Preview and diagnostics services.
5. AI Creator backend integration.
6. Internal Admin service.

### Suggested Data Ownership

- Projects and versions: `localProjectStore`
- Studio state and bindings: `studioBridge`
- Assets and templates: `resourceLibrary`
- AI requests and history: `aiCreator`
- Logs and recovery packages: `diagnostics`
- User preferences: `settingsStore`
- Cross-page UI state: `useEffectHubStore`

---

## 14. Final Summary

The EVzone Effect Hub is organized as a full creator lifecycle:

```txt
Start -> Readiness -> Project Management -> Creation -> Labs -> Preview -> Studio Integration -> Send -> Insights
        \-------------------------------------------------------------/
                         Recovery, Settings, Learning and System Support
```

For creators, the platform provides a complete premium toolchain for making live-ready effects.  
For suppliers, the platform provides a structured way to contribute free resources, templates, presets and example projects.  
For EVzone, the platform provides a safe, high-quality, internally controllable ecosystem connected to the existing EVzone Live Studio.

The result is a free, premium, studio-native effect creator platform designed to scale without authentication, billing or marketplace complexity.
