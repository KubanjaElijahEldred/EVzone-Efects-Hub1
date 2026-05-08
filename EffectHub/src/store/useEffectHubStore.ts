import { create } from 'zustand';
import { loadSettings, saveSettings } from '../services/settingsStore';

type ThemeMode = 'light' | 'dark';

type EffectHubStore = {
  studioConnected: boolean;
  activeProjectId?: string;
  themeMode: ThemeMode;
  setStudioConnected: (connected: boolean) => void;
  setActiveProjectId: (projectId?: string) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
};

const initialSettings = loadSettings();

export const useEffectHubStore = create<EffectHubStore>((set) => ({
  studioConnected: false,
  activeProjectId: undefined,
  themeMode: initialSettings.theme,
  setStudioConnected: (studioConnected) => set({ studioConnected }),
  setActiveProjectId: (activeProjectId) => set({ activeProjectId }),
  setThemeMode: (themeMode) =>
    set(() => {
      saveSettings({ ...loadSettings(), theme: themeMode });
      return { themeMode };
    }),
}));
