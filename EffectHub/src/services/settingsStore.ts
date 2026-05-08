import { evzoneColors } from '../theme/colors';
import { evzoneApi, getStudioBridgeWebSocketUrl } from './apiClient';

export type EffectHubSettings = {
  language: string;
  region: string;
  theme: 'light' | 'dark';
  autosaveMinutes: number;
  studioBridgeUrl: string;
  timeFormat?: string;
  defaultProjectType?: string;
  aiSafetyEnabled?: boolean;
  localFirstDataMode?: boolean;
  experimentalFeatures?: Record<string, boolean>;
};

const settingsKey = 'evzone-effect-hub-settings';

export const defaultSettings: EffectHubSettings = {
  language: 'English',
  region: 'Africa / Kampala',
  theme: 'light',
  autosaveMinutes: 3,
  studioBridgeUrl: getStudioBridgeWebSocketUrl(),
};

export function loadSettings(): EffectHubSettings {
  let raw: string | null;
  try {
    raw = localStorage.getItem(settingsKey);
  } catch {
    return defaultSettings;
  }
  if (!raw) return defaultSettings;
  try {
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: EffectHubSettings) {
  try {
    localStorage.setItem(settingsKey, JSON.stringify(settings));
  } catch {
    return settings;
  }
  void saveRemoteSettings(settings).catch(() => undefined);
  return settings;
}

export const embeddedPalette = evzoneColors;

export async function fetchRemoteSettings() {
  const remoteSettings = await evzoneApi<Partial<EffectHubSettings>>('/settings');
  const settings = normalizeSettings(remoteSettings);
  try {
    localStorage.setItem(settingsKey, JSON.stringify(settings));
  } catch {
    return settings;
  }
  return settings;
}

export async function saveRemoteSettings(settings: EffectHubSettings) {
  const remoteSettings = await evzoneApi<Partial<EffectHubSettings>>('/settings', {
    method: 'PUT',
    body: { settings },
  });
  return normalizeSettings(remoteSettings);
}

export async function resetRemoteLayout() {
  return evzoneApi('/settings/reset-layout', { method: 'POST' });
}

export async function clearRemoteCache() {
  return evzoneApi('/settings/clear-cache', { method: 'POST' });
}

function normalizeSettings(settings: Partial<EffectHubSettings>): EffectHubSettings {
  return {
    ...defaultSettings,
    ...settings,
    theme: settings.theme === 'dark' ? 'dark' : 'light',
    studioBridgeUrl: settings.studioBridgeUrl || defaultSettings.studioBridgeUrl,
  };
}
