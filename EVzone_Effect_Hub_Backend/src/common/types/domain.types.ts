export type EntityId = string;
export type ISODateString = string;
export type ProjectStatus = 'draft' | 'live-ready' | 'imported-to-studio' | 'archived' | 'needs-review';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Studio Pro';
export type DiagnosticLevel = 'info' | 'warning' | 'critical' | 'recoverable';
export type SendStatus = 'draft' | 'checking' | 'packaging' | 'sent' | 'failed';

export interface PageRouteInfo {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  path: string;
  group: string;
  description: string;
}

export interface ProjectVersion {
  id: EntityId;
  version: string;
  notes: string;
  createdAt: ISODateString;
  qualityScore: number;
  sizeBytes: number;
  restoredFrom?: EntityId;
}

export interface ProjectNote {
  id: EntityId;
  author: string;
  note: string;
  createdAt: ISODateString;
}

export interface EffectAsset {
  id: EntityId;
  projectId?: EntityId;
  name: string;
  type: string;
  sizeBytes: number;
  status: 'ready' | 'missing' | 'needs-review' | 'oversized' | 'repaired';
  owner?: string;
  createdAt: ISODateString;
}

export interface EffectProject {
  id: EntityId;
  name: string;
  type: string;
  category: string;
  status: ProjectStatus;
  version: string;
  thumbnail?: string;
  tags: string[];
  description?: string;
  internalNotes?: string;
  updatedAt: ISODateString;
  createdAt: ISODateString;
  sizeBytes: number;
  qualityScore: number;
  studioStatus: 'not-sent' | 'bound' | 'sent' | 'live-ready' | 'imported';
  cameraTarget: string;
  assets: EffectAsset[];
  versions: ProjectVersion[];
  notes: ProjectNote[];
  favorite?: boolean;
  collection?: string;
}

export interface FreeResource {
  id: EntityId;
  title: string;
  category: string;
  type: string;
  difficulty: Difficulty;
  compatibleWithStudio: boolean;
  tags: string[];
  description: string;
  licenseNote: string;
  featured?: boolean;
  createdAt: ISODateString;
}

export interface AIGeneration {
  id: EntityId;
  title: string;
  target: string;
  prompt: string;
  status: 'queued' | 'running' | 'ready' | 'failed' | 'flagged';
  safetyStatus: 'passed' | 'needs-review' | 'blocked' | 'pending';
  createdAt: ISODateString;
  result?: Record<string, unknown>;
}

export interface DiagnosticEntry {
  id: EntityId;
  level: DiagnosticLevel;
  source: string;
  message: string;
  createdAt: ISODateString;
  projectId?: EntityId;
  fixSuggestion?: string;
}

export interface RuntimeLimits {
  targetFps: number;
  warningFps: number;
  maxPackageMb: number;
  maxTexturePx: number;
  maxDrawCalls: number;
  maxScriptMs: number;
  maxMemoryMb: number;
}

export interface StudioBridgeState {
  connected: boolean;
  name: string;
  version: string;
  heartbeatMs: number;
  lastHeartbeatAt: ISODateString;
  activeSession: string;
  status: 'connected' | 'disconnected' | 'paused' | 'recovering';
  runtimeLimits: RuntimeLimits;
  scenes: string[];
  cameras: string[];
  overlays: string[];
}

export interface StudioBinding {
  projectId: EntityId;
  scene: string;
  camera: string;
  overlayLayer: string;
  trigger: string;
  controlSurface: string;
  fallbackMode: string;
  emergencyDisable: boolean;
  updatedAt: ISODateString;
}

export interface PreviewSession {
  id: EntityId;
  projectId?: EntityId;
  source: string;
  subject: string;
  deviceFrame: string;
  fps: number;
  memoryMb: number;
  cpuCost: number;
  gpuCost: number;
  qualityScore: number;
  createdAt: ISODateString;
}

export interface SendPackage {
  id: EntityId;
  projectId: EntityId;
  status: SendStatus;
  metadata: Record<string, unknown>;
  target: Partial<StudioBinding>;
  previewAssets: Record<string, unknown>;
  qualityCheck?: Record<string, unknown>;
  packageName?: string;
  versionNotes?: string;
  qrPreview?: string;
  privatePreviewLink?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface EffectHubSettings {
  language: string;
  region: string;
  timeFormat: string;
  theme: 'light';
  defaultProjectType: string;
  autosaveMinutes: number;
  studioBridgeUrl: string;
  aiSafetyEnabled: boolean;
  localFirstDataMode: boolean;
  experimentalFeatures: Record<string, boolean>;
}

export interface LearningPath {
  id: EntityId;
  title: string;
  level: Difficulty;
  time: string;
  progress: number;
  summary: string;
  modules: string[];
  outcomes: string[];
}

export interface FeatureFlag {
  key: string;
  name: string;
  enabled: boolean;
  rollout: string;
}

export interface NamedRule {
  id: EntityId;
  label: string;
  value: string;
  status: 'active' | 'draft' | 'paused';
  detail?: string;
}

export interface FlaggedGeneratedContent {
  id: EntityId;
  title: string;
  reason: string;
  source: string;
  status: 'needs-review' | 'reviewed' | 'dismissed';
  createdAt: ISODateString;
}

export interface ReleaseRecord {
  id: EntityId;
  title: string;
  version: string;
  channel: string;
  status: 'ready' | 'live' | 'paused' | 'rolled-back';
  createdAt: ISODateString;
}

export interface AdminState {
  featureFlags: FeatureFlag[];
  compatibilityRules: NamedRule[];
  runtimeBudgetRules: NamedRule[];
  contentPolicy: NamedRule[];
  flaggedContent: FlaggedGeneratedContent[];
  releases: ReleaseRecord[];
  logs: DiagnosticEntry[];
}

export interface MaintenanceStatus {
  mode: 'maintenance' | 'partial-update' | 'operational';
  message: string;
  editorAvailability: string;
  connectorStatus: string;
  localEditingAvailability: string;
  estimatedRecoveryTime: string;
  safeLocalSaveWarning: string;
  updateNotes: Array<{ title: string; detail: string; status: string }>;
  updatedAt: ISODateString;
}

export interface AppState {
  routes: PageRouteInfo[];
  projects: EffectProject[];
  resources: FreeResource[];
  aiGenerations: AIGeneration[];
  diagnostics: DiagnosticEntry[];
  studioBridge: StudioBridgeState;
  previewSessions: PreviewSession[];
  studioBindings: StudioBinding[];
  sendPackages: SendPackage[];
  learningPaths: LearningPath[];
  settings: EffectHubSettings;
  admin: AdminState;
  maintenance: MaintenanceStatus;
}
