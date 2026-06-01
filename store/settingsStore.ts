import { create } from 'zustand';
import type { AppSettings } from '../types';

interface SettingsStore {
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'system',
  notificationsEnabled: true,
  showActivityStatus: true,
  privateAccount: false,
  twoFactorEnabled: false,
  language: 'en',
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: defaultSettings,
  updateSettings: (patch) =>
    set((s) => ({ settings: { ...s.settings, ...patch } })),
  resetSettings: () => set({ settings: defaultSettings }),
}));
