import { lazy, type LazyExoticComponent, type ComponentType } from 'react';

export type PageGroup =
  | 'Start'
  | 'Creation'
  | 'Labs'
  | 'Studio'
  | 'Resources'
  | 'Quality'
  | 'System';

export type PageRoute = {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  path: string;
  group: PageGroup;
  description: string;
  Component: LazyExoticComponent<ComponentType>;
};

export const pageRoutes: PageRoute[] = [
  {
    id: 'home',
    number: 1,
    title: 'Effect Creator Home',
    shortTitle: 'Home',
    path: '/',
    group: 'Start',
    description: 'Main entry point from EVzone Live Studio.',
    Component: lazy(() => import('../pages/EVzoneEffectCreatorHome')),
  },
  {
    id: 'studio-connection',
    number: 2,
    title: 'Studio Connection & Readiness',
    shortTitle: 'Studio Readiness',
    path: '/studio-connection',
    group: 'Studio',
    description: 'Confirms that Effect Creator is connected to EVzone Live Studio.',
    Component: lazy(() => import('../pages/EVzoneStudioConnectionReadiness')),
  },
  {
    id: 'projects',
    number: 3,
    title: 'Projects & Versions Hub',
    shortTitle: 'Projects',
    path: '/projects',
    group: 'Creation',
    description: 'Project management, versions, restore points and send-to-studio shortcuts.',
    Component: lazy(() => import('../pages/EVzoneProjectsVersionsHub')),
  },
  {
    id: 'new-project',
    number: 4,
    title: 'New Project Wizard',
    shortTitle: 'New Project',
    path: '/new-project',
    group: 'Creation',
    description: 'Start any new effect from one clean wizard.',
    Component: lazy(() => import('../pages/EVzoneNewProjectWizard')),
  },
  {
    id: 'editor',
    number: 5,
    title: 'Editor Workspace',
    shortTitle: 'Editor',
    path: '/editor',
    group: 'Creation',
    description: 'The main creation environment.',
    Component: lazy(() => import('../pages/EVzoneEditorWorkspace')),
  },
  {
    id: 'snap-lens-studio',
    number: 24,
    title: 'Snap Lens Studio',
    shortTitle: 'Snap Lenses',
    path: '/snap-lens-studio',
    group: 'Creation',
    description: 'Snap-style camera lenses, stories, capture modes and photo adjustment tools.',
    Component: lazy(() => import('../pages/EVzoneSnapLensStudio')),
  },
  {
    id: 'tracking',
    number: 6,
    title: 'Tracking Lab',
    shortTitle: 'Tracking',
    path: '/tracking',
    group: 'Labs',
    description: 'Face, hand, body, segmentation, world AR and image/object tracking.',
    Component: lazy(() => import('../pages/EVzoneTrackingLab')),
  },
  {
    id: 'visual-logic',
    number: 7,
    title: 'Visual Logic Lab',
    shortTitle: 'Visual Logic',
    path: '/visual-logic',
    group: 'Labs',
    description: 'No-code logic and interaction design.',
    Component: lazy(() => import('../pages/EVzoneVisualLogicLab')),
  },
  {
    id: 'developer',
    number: 8,
    title: 'Code & Developer Lab',
    shortTitle: 'Developer',
    path: '/developer',
    group: 'Labs',
    description: 'Advanced scripting, APIs and studio bridge development.',
    Component: lazy(() => import('../pages/EVzoneCodeDeveloperLab')),
  },
  {
    id: 'materials-shaders',
    number: 9,
    title: 'Materials & Shader Lab',
    shortTitle: 'Materials',
    path: '/materials-shaders',
    group: 'Labs',
    description: 'Premium visual look development.',
    Component: lazy(() => import('../pages/EVzoneMaterialsShaderLab')),
  },
  {
    id: 'vfx-motion',
    number: 10,
    title: 'VFX & Motion Lab',
    shortTitle: 'VFX Motion',
    path: '/vfx-motion',
    group: 'Labs',
    description: 'Particles, motion, animation, transitions and live graphics.',
    Component: lazy(() => import('../pages/EVzoneVFXMotionLab')),
  },
  {
    id: 'interactive-effects',
    number: 11,
    title: 'Interactive Effects Lab',
    shortTitle: 'Interactive',
    path: '/interactive-effects',
    group: 'Labs',
    description: 'Studio-ready interactive effects and mini-games.',
    Component: lazy(() => import('../pages/EVzoneInteractiveEffectsLab')),
  },
  {
    id: 'ai-creator',
    number: 12,
    title: 'AI Creator Hub',
    shortTitle: 'AI Creator',
    path: '/ai-creator',
    group: 'Creation',
    description: 'All AI creation tools in one place.',
    Component: lazy(() => import('../pages/EVzoneAICreatorHub')),
  },
  {
    id: 'resources',
    number: 13,
    title: 'Free Resource Library',
    shortTitle: 'Resources',
    path: '/resources',
    group: 'Resources',
    description: 'Free templates, presets, assets and examples.',
    Component: lazy(() => import('../pages/EVzoneFreeResourceLibrary')),
  },
  {
    id: 'preview-quality',
    number: 14,
    title: 'Preview & Quality Center',
    shortTitle: 'Preview Quality',
    path: '/preview-quality',
    group: 'Quality',
    description: 'Test and polish effects before sending to EVzone Studio.',
    Component: lazy(() => import('../pages/EVzonePreviewQualityCenter')),
  },
  {
    id: 'studio-integration',
    number: 15,
    title: 'Studio Integration Center',
    shortTitle: 'Studio Integration',
    path: '/studio-integration',
    group: 'Studio',
    description: 'Connect effects to the existing EVzone Live Studio.',
    Component: lazy(() => import('../pages/EVzoneStudioIntegrationCenter')),
  },
  {
    id: 'send-to-studio',
    number: 16,
    title: 'Send to Studio Wizard',
    shortTitle: 'Send to Studio',
    path: '/send-to-studio',
    group: 'Studio',
    description: 'Finalize an effect and send it into EVzone Live Studio.',
    Component: lazy(() => import('../pages/EVzoneSendToStudioWizard')),
  },
  {
    id: 'learning',
    number: 17,
    title: 'Learning & Documentation Hub',
    shortTitle: 'Learning',
    path: '/learning',
    group: 'Resources',
    description: 'Built-in education and help.',
    Component: lazy(() => import('../pages/EVzoneLearningDocumentationHub')),
  },
  {
    id: 'insights',
    number: 18,
    title: 'Project Insights',
    shortTitle: 'Insights',
    path: '/insights',
    group: 'Quality',
    description: 'Usage and quality analytics, not monetization.',
    Component: lazy(() => import('../pages/EVzoneProjectInsights')),
  },
  {
    id: 'settings',
    number: 19,
    title: 'Settings Center',
    shortTitle: 'Settings',
    path: '/settings',
    group: 'System',
    description: 'All non-account settings.',
    Component: lazy(() => import('../pages/EVzoneSettingsCenter')),
  },
  {
    id: 'internal-admin',
    number: 20,
    title: 'Internal Admin Center',
    shortTitle: 'Internal Admin',
    path: '/internal-admin',
    group: 'System',
    description: 'EVzone internal control only.',
    Component: lazy(() => import('../pages/EVzoneInternalAdminCenter')),
  },
  {
    id: 'recovery-diagnostics',
    number: 21,
    title: 'Recovery & Diagnostics Center',
    shortTitle: 'Recovery',
    path: '/recovery-diagnostics',
    group: 'System',
    description: 'One page for errors and recovery.',
    Component: lazy(() => import('../pages/EVzoneRecoveryDiagnosticsCenter')),
  },
  {
    id: 'maintenance',
    number: 22,
    title: 'Maintenance / System Update Page',
    shortTitle: 'Maintenance',
    path: '/maintenance',
    group: 'System',
    description: 'Clean system status page.',
    Component: lazy(() => import('../pages/EVzoneMaintenanceSystemUpdatePage')),
  },
  {
    id: 'missing',
    number: 23,
    title: '404 / Missing Page',
    shortTitle: '404',
    path: '/404',
    group: 'System',
    description: 'Premium missing route page.',
    Component: lazy(() => import('../pages/EVzoneMissingPage404')),
  },
];

export const pageGroups: PageGroup[] = ['Start', 'Creation', 'Labs', 'Studio', 'Resources', 'Quality', 'System'];

export function getPageByPath(pathname: string): PageRoute | undefined {
  return pageRoutes.find((route) => route.path === pathname);
}
