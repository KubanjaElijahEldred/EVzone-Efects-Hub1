import type { AppState, EffectAsset, EffectProject, FreeResource, LearningPath, PageRouteInfo } from '../common/types/domain.types';

const now = () => new Date().toISOString();

export const pageRoutesSeed: PageRouteInfo[] = [
  ['home', 1, 'Effect Creator Home', 'Home', '/', 'Start', 'Main entry point from EVzone Live Studio.'],
  ['studio-connection', 2, 'Studio Connection & Readiness', 'Studio Readiness', '/studio-connection', 'Studio', 'Confirms that Effect Creator is connected to EVzone Live Studio.'],
  ['projects', 3, 'Projects & Versions Hub', 'Projects', '/projects', 'Creation', 'Project management, versions, restore points and send-to-studio shortcuts.'],
  ['new-project', 4, 'New Project Wizard', 'New Project', '/new-project', 'Creation', 'Start any new effect from one clean wizard.'],
  ['editor', 5, 'Editor Workspace', 'Editor', '/editor', 'Creation', 'The main creation environment.'],
  ['tracking', 6, 'Tracking Lab', 'Tracking', '/tracking', 'Labs', 'Face, hand, body, segmentation, world AR and image/object tracking.'],
  ['visual-logic', 7, 'Visual Logic Lab', 'Visual Logic', '/visual-logic', 'Labs', 'No-code logic and interaction design.'],
  ['developer', 8, 'Code & Developer Lab', 'Developer', '/developer', 'Labs', 'Advanced scripting, APIs and studio bridge development.'],
  ['materials-shaders', 9, 'Materials & Shader Lab', 'Materials', '/materials-shaders', 'Labs', 'Premium visual look development.'],
  ['vfx-motion', 10, 'VFX & Motion Lab', 'VFX Motion', '/vfx-motion', 'Labs', 'Particles, motion, animation, transitions and live graphics.'],
  ['interactive-effects', 11, 'Interactive Effects Lab', 'Interactive', '/interactive-effects', 'Labs', 'Studio-ready interactive effects and mini-games.'],
  ['ai-creator', 12, 'AI Creator Hub', 'AI Creator', '/ai-creator', 'Creation', 'All AI creation tools in one place.'],
  ['resources', 13, 'Free Resource Library', 'Resources', '/resources', 'Resources', 'Free templates, presets, assets and examples.'],
  ['preview-quality', 14, 'Preview & Quality Center', 'Preview Quality', '/preview-quality', 'Quality', 'Test and polish effects before sending to EVzone Studio.'],
  ['studio-integration', 15, 'Studio Integration Center', 'Studio Integration', '/studio-integration', 'Studio', 'Connect effects to the existing EVzone Live Studio.'],
  ['send-to-studio', 16, 'Send to Studio Wizard', 'Send to Studio', '/send-to-studio', 'Studio', 'Finalize an effect and send it into EVzone Live Studio.'],
  ['learning', 17, 'Learning & Documentation Hub', 'Learning', '/learning', 'Resources', 'Built-in education and help.'],
  ['insights', 18, 'Project Insights', 'Insights', '/insights', 'Quality', 'Usage and quality analytics, not monetization.'],
  ['settings', 19, 'Settings Center', 'Settings', '/settings', 'System', 'All non-account settings.'],
  ['internal-admin', 20, 'Internal Admin Center', 'Internal Admin', '/internal-admin', 'System', 'EVzone internal control only.'],
  ['recovery-diagnostics', 21, 'Recovery & Diagnostics Center', 'Recovery', '/recovery-diagnostics', 'System', 'One page for errors and recovery.'],
  ['maintenance', 22, 'Maintenance / System Update Page', 'Maintenance', '/maintenance', 'System', 'Clean system status page.'],
  ['missing', 23, '404 / Missing Page', '404', '/404', 'System', 'Premium missing route page.'],
].map(([id, number, title, shortTitle, path, group, description]) => ({
  id: String(id),
  number: Number(number),
  title: String(title),
  shortTitle: String(shortTitle),
  path: String(path),
  group: String(group),
  description: String(description),
}));

const sampleAssets = (projectId: string): EffectAsset[] => [
  { id: `${projectId}-asset-1`, projectId, name: 'emerald_hologram_material.evzmat', type: 'Material', sizeBytes: 1300000, status: 'ready', owner: 'Materials Lab', createdAt: now() },
  { id: `${projectId}-asset-2`, projectId, name: 'scanline_mask.png', type: 'Texture', sizeBytes: 480000, status: 'missing', owner: 'Emerald Hologram Material', createdAt: now() },
  { id: `${projectId}-asset-3`, projectId, name: 'soft_hit_stinger.wav', type: 'Audio', sizeBytes: 420000, status: 'needs-review', owner: 'Audio Trigger', createdAt: now() },
];

export function createSeedState(): AppState {
  const projectA: EffectProject = {
    id: 'proj-emerald-hologram',
    name: 'Emerald Hologram Host Intro',
    type: 'Face AR / Live Graphics',
    category: 'Live Graphics',
    status: 'live-ready',
    version: 'v12.5',
    thumbnail: '/assets/thumbs/emerald-hologram.png',
    tags: ['host camera', 'hologram', 'lower-third', 'sparkle', 'live-safe'],
    description: 'Premium live-show intro with face-safe hologram glow and lower-third reveal.',
    internalNotes: 'Use Balanced quality mode for live shows. Emergency disable is mapped to Shift + 2.',
    createdAt: now(),
    updatedAt: now(),
    sizeBytes: 4800000,
    qualityScore: 94,
    studioStatus: 'sent',
    cameraTarget: 'Host Camera',
    assets: sampleAssets('proj-emerald-hologram'),
    versions: [
      { id: 'ver-emerald-125', version: 'v12.5', notes: 'Studio-ready release.', createdAt: now(), qualityScore: 94, sizeBytes: 4800000 },
      { id: 'ver-emerald-124', version: 'v12.4', notes: 'Pre-optimization release.', createdAt: now(), qualityScore: 89, sizeBytes: 7600000 },
    ],
    notes: [{ id: 'note-1', author: 'Producer', note: 'Intro is reliable for host camera segments.', createdAt: now() }],
    favorite: true,
    collection: 'Live Show Essentials',
  };

  const projectB: EffectProject = {
    ...projectA,
    id: 'proj-lower-third',
    name: 'Premium Lower Third Collection',
    type: 'Studio Overlay',
    category: 'Overlay',
    status: 'live-ready',
    version: 'v4.8',
    qualityScore: 97,
    studioStatus: 'live-ready',
    cameraTarget: 'Overlay Layer',
    tags: ['lower third', 'caption', 'title', 'broadcast'],
    assets: sampleAssets('proj-lower-third').map((asset) => ({ ...asset, status: 'ready' as const })),
    versions: [{ id: 'ver-lower-48', version: 'v4.8', notes: 'Premium overlay pack.', createdAt: now(), qualityScore: 97, sizeBytes: 3100000 }],
    notes: [],
    updatedAt: now(),
    sizeBytes: 3100000,
  };

  const resources: FreeResource[] = [
    { id: 'premium-host-intro-template', title: 'Premium Host Intro Template', category: 'Template', type: 'template', difficulty: 'Beginner', compatibleWithStudio: true, tags: ['intro', 'host', 'live'], description: 'Free premium intro template for live hosts.', licenseNote: 'Free for EVzone Studio use.', featured: true, createdAt: now() },
    { id: 'evzone-confetti-burst', title: 'EVzone Confetti Burst', category: 'VFX', type: 'vfx', difficulty: 'Beginner', compatibleWithStudio: true, tags: ['confetti', 'reward', 'celebration'], description: 'Live-safe confetti VFX preset.', licenseNote: 'Free internal and creator use.', featured: true, createdAt: now() },
    { id: 'studio-control-surface-presets', title: 'Studio Control Surface Presets', category: 'Studio Controls', type: 'control', difficulty: 'Studio Pro', compatibleWithStudio: true, tags: ['buttons', 'toggles', 'sliders'], description: 'Ready-made studio control presets.', licenseNote: 'Free for EVzone projects.', featured: true, createdAt: now() },
    { id: 'ai-prompt-preset-pack', title: 'AI Prompt Preset Pack', category: 'AI Prompts', type: 'ai-prompt', difficulty: 'Beginner', compatibleWithStudio: true, tags: ['ai', 'prompts'], description: 'Starter prompts for effects, overlays and materials.', licenseNote: 'Free prompt pack.', createdAt: now() },
  ];

  const learningPaths: LearningPath[] = [
    { id: 'getting-started', title: 'Getting Started Path', level: 'Beginner', time: '25 min', progress: 74, summary: 'Learn the EVzone Effect Creator workflow.', modules: ['Open Creator', 'Create project', 'Preview safely', 'Send to Studio'], outcomes: ['Navigate the creator', 'Use live-safe workflow'] },
    { id: 'studio-integration', title: 'Studio Integration Path', level: 'Studio Pro', time: '65 min', progress: 67, summary: 'Connect effects to EVzone Live Studio.', modules: ['Bridge status', 'Scene binding', 'Control surface', 'Send to Studio'], outcomes: ['Bind scenes', 'Map controls', 'Send safely'] },
  ];

  return {
    routes: pageRoutesSeed,
    projects: [projectA, projectB],
    resources,
    aiGenerations: [],
    diagnostics: [
      { id: 'diag-1', level: 'recoverable', source: 'Autosave', message: 'Recovered draft snapshot found.', createdAt: now(), projectId: projectA.id, fixSuggestion: 'Compare and restore draft.' },
      { id: 'diag-2', level: 'warning', source: 'Studio Bridge', message: 'Bridge heartbeat paused while scene targets reloaded.', createdAt: now(), fixSuggestion: 'Reconnect bridge.' },
    ],
    studioBridge: {
      connected: true,
      name: 'EVzone Live Studio Bridge',
      version: 'v4.8.2',
      heartbeatMs: 8,
      lastHeartbeatAt: now(),
      activeSession: 'LIVE-A',
      status: 'connected',
      runtimeLimits: { targetFps: 60, warningFps: 45, maxPackageMb: 10, maxTexturePx: 2048, maxDrawCalls: 80, maxScriptMs: 8, maxMemoryMb: 512 },
      scenes: ['Morning Show', 'Interview Desk', 'Guest Split', 'Countdown Scene', 'Finale'],
      cameras: ['Host Camera', 'Guest Camera', 'Virtual Camera', 'Program Output'],
      overlays: ['Lower Third', 'Alert Layer', 'Scoreboard', 'Countdown', 'Transparent Overlay'],
    },
    previewSessions: [],
    studioBindings: [
      { projectId: projectA.id, scene: 'Morning Show', camera: 'Host Camera', overlayLayer: 'Lower Third', trigger: 'Scene Change + Studio Button', controlSurface: 'EVzone Operator Surface A', fallbackMode: 'Keep overlay, disable heavy VFX', emergencyDisable: false, updatedAt: now() },
    ],
    sendPackages: [],
    learningPaths,
    settings: {
      language: 'English',
      region: 'Africa / Kampala',
      timeFormat: '24-hour',
      theme: 'light',
      defaultProjectType: 'Studio Overlay + Face AR',
      autosaveMinutes: 3,
      studioBridgeUrl: 'ws://localhost:3777/studio-bridge',
      aiSafetyEnabled: true,
      localFirstDataMode: true,
      experimentalFeatures: { aiGraphEditor: true, depthPreviewTools: false, advancedShaderPreview: true },
    },
    admin: {
      featureFlags: [
        { key: 'ai_graph_editor', name: 'AI Graph Editor', enabled: true, rollout: 'Internal Beta' },
        { key: 'depth_preview_tools', name: 'Depth Preview Tools', enabled: false, rollout: 'Lab Only' },
        { key: 'advanced_shader_preview', name: 'Advanced Shader Preview', enabled: true, rollout: 'Internal Beta' },
        { key: 'mobile_qr_preview_v2', name: 'Mobile QR Preview v2', enabled: false, rollout: 'Canary' },
      ],
      compatibilityRules: [
        { id: 'rule-studio-version', label: 'Studio version', value: '>= 4.8.0', status: 'active' },
        { id: 'rule-browser-runtime', label: 'Browser runtime', value: 'WebGPU preferred, WebGL fallback', status: 'active' },
        { id: 'rule-mobile-preview', label: 'Mobile preview', value: 'Fallback below 45 FPS', status: 'active' },
      ],
      runtimeBudgetRules: [
        { id: 'runtime-target-fps', label: 'Target FPS', value: '60 FPS', status: 'active' },
        { id: 'runtime-script-ms', label: 'Script timing', value: '8 ms recommended', status: 'active' },
        { id: 'runtime-package-size', label: 'Effect package size', value: '5 MB target / 10 MB max', status: 'active' },
      ],
      contentPolicy: [
        { id: 'policy-motion', label: 'Flashing / motion safety', value: 'Active', status: 'active', detail: 'High-speed flashing and extreme motion are flagged.' },
        { id: 'policy-private-preview', label: 'Private preview only', value: 'Active', status: 'active', detail: 'No public marketplace or monetized publish workflow.' },
      ],
      flaggedContent: [
        { id: 'flag-high-motion', title: 'High-motion VFX prompt', reason: 'Flashing / rapid motion warning', source: 'AI Creator Hub', status: 'needs-review', createdAt: now() },
      ],
      releases: [
        { id: 'release-shader-graph', title: 'Shader Graph Preview Update', version: '2026.04-canary', channel: 'Canary', status: 'ready', createdAt: now() },
        { id: 'release-bridge-rules', title: 'Studio Bridge Runtime Rules', version: 'v3.8.4', channel: 'Internal', status: 'live', createdAt: now() },
      ],
      logs: [],
    },
    maintenance: {
      mode: 'operational',
      message: 'EVzone Effect Creator is operational.',
      editorAvailability: 'Available',
      connectorStatus: 'Connected',
      localEditingAvailability: 'Available',
      estimatedRecoveryTime: 'No downtime',
      safeLocalSaveWarning: 'Create a local snapshot before closing during update windows.',
      updateNotes: [
        { title: 'Studio connector refresh', detail: 'Scene binding, camera binding and runtime limit sync improved.', status: 'Ready' },
        { title: 'Local autosave protection', detail: 'Strengthens local draft snapshots during updates.', status: 'Ready' },
      ],
      updatedAt: now(),
    },
  };
}
