import { LibraryItem, UserPreferences } from '../types';

const PREFS_KEY = 'openlearn_preferences_v1';
const LIBRARY_KEY = 'openlearn_library_v1';
const RECENT_DOCS_KEY = 'openlearn_recent_docs_v1';

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  fontSize: 'normal',
  fontFamily: 'standard',
  highContrast: false,
  reducedMotion: false,
  defaultLevel: 'school',
  preferredLanguage: 'en',
  speechRate: 1.0,
  speechPitch: 1.0,
};

export function loadPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.warn('Failed to save preferences to localStorage:', err);
  }
}

export function loadLibraryItems(): LibraryItem[] {
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLibraryItem(item: LibraryItem): void {
  try {
    const current = loadLibraryItems();
    const updated = [item, ...current.filter((i) => i.id !== item.id)].slice(0, 50);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save library item:', err);
  }
}

export function deleteLibraryItem(id: string): void {
  try {
    const current = loadLibraryItems();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to delete library item:', err);
  }
}

export function clearLibrary(): void {
  try {
    localStorage.removeItem(LIBRARY_KEY);
  } catch (err) {
    console.warn('Failed to clear library:', err);
  }
}

export interface RecentDocItem {
  id: string;
  name: string;
  textSnippet: string;
  wordCount: number;
  timestamp: number;
}

export function loadRecentDocs(): RecentDocItem[] {
  try {
    const raw = localStorage.getItem(RECENT_DOCS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveRecentDoc(doc: RecentDocItem): void {
  try {
    const current = loadRecentDocs();
    const updated = [doc, ...current.filter((d) => d.id !== doc.id)].slice(0, 10);
    localStorage.setItem(RECENT_DOCS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save recent doc:', err);
  }
}

export function clearRecentDocs(): void {
  try {
    localStorage.removeItem(RECENT_DOCS_KEY);
  } catch (err) {
    console.warn('Failed to clear recent docs:', err);
  }
}

export function exportAllData(): string {
  const exportPayload = {
    app: 'OpenLearn AI',
    exportedAt: new Date().toISOString(),
    preferences: loadPreferences(),
    library: loadLibraryItems(),
    recentDocs: loadRecentDocs(),
  };
  return JSON.stringify(exportPayload, null, 2);
}

export function clearAllUserData(): void {
  localStorage.removeItem(PREFS_KEY);
  localStorage.removeItem(LIBRARY_KEY);
  localStorage.removeItem(RECENT_DOCS_KEY);
}
