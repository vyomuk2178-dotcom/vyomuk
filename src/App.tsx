import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { AccessibilityDrawer } from './components/AccessibilityDrawer';
import { DashboardView } from './pages/DashboardView';
import { SimplifyView } from './pages/SimplifyView';
import { TranslateView } from './pages/TranslateView';
import { StudyNotesView } from './pages/StudyNotesView';
import { ActivitiesView } from './pages/ActivitiesView';
import { TutorView } from './pages/TutorView';
import { ListenLearnView } from './pages/ListenLearnView';
import { LibraryView } from './pages/LibraryView';
import { SettingsView } from './pages/SettingsView';
import { AboutContributeView } from './pages/AboutContributeView';

import {
  UserPreferences,
  LibraryItem,
} from './types';
import {
  loadPreferences,
  savePreferences,
  DEFAULT_PREFERENCES,
  loadRecentDocs,
  saveRecentDoc,
  RecentDocItem,
  loadLibraryItems,
} from './services/storage';
import { checkServerStatus } from './services/api';
import { SAMPLE_TOPICS } from './utils/sampleData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [currentText, setCurrentText] = useState<string>(SAMPLE_TOPICS[0].content);
  const [documentName, setDocumentName] = useState<string>(SAMPLE_TOPICS[0].title);
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences);
  const [recentDocs, setRecentDocs] = useState<RecentDocItem[]>(loadRecentDocs);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>(loadLibraryItems);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isAiConfigured, setIsAiConfigured] = useState(false);
  const [externalSpeechText, setExternalSpeechText] = useState<string>('');

  // Check backend server status & Gemini connectivity on mount
  useEffect(() => {
    checkServerStatus()
      .then((status) => {
        setIsAiConfigured(status.aiConfigured);
      })
      .catch((err) => {
        console.warn('Backend status check returned notice:', err);
      });
  }, []);

  // Sync user preferences with document body classes & theme
  useEffect(() => {
    savePreferences(preferences);

    const root = document.documentElement;
    const body = document.body;

    // 1. Dark Mode
    if (
      preferences.theme === 'dark' ||
      (preferences.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 2. Dyslexia Typography
    if (preferences.fontFamily === 'dyslexic') {
      body.classList.add('font-dyslexic');
    } else {
      body.classList.remove('font-dyslexic');
    }

    // 3. Text Sizing Scale
    body.classList.remove('text-size-large', 'text-size-xlarge');
    if (preferences.fontSize === 'large') {
      body.classList.add('text-size-large');
    } else if (preferences.fontSize === 'extra-large') {
      body.classList.add('text-size-xlarge');
    }

    // 4. High Contrast Borders
    if (preferences.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }
  }, [preferences]);

  // Save current text to recent docs when non-empty
  const handleUpdateText = (text: string) => {
    setCurrentText(text);
    if (text.trim().length > 30) {
      const docItem: RecentDocItem = {
        id: `doc-${Date.now()}`,
        name: documentName || 'Study Material',
        textSnippet: text.slice(0, 140).replace(/\s+/g, ' '),
        wordCount: text.split(/\s+/).filter(Boolean).length,
        timestamp: Date.now(),
      };
      saveRecentDoc(docItem);
      setRecentDocs(loadRecentDocs());
    }
  };

  const handleUpdatePreferences = (updated: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updated }));
  };

  const handleResetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  const handleSelectRecentDoc = (doc: RecentDocItem) => {
    setCurrentText(doc.textSnippet);
    setDocumentName(doc.name);
    setCurrentTab('simplify');
  };

  const handleOpenListenWithText = (text: string) => {
    setExternalSpeechText(text);
    setCurrentTab('listen');
  };

  const handleInspectLibraryItem = (item: LibraryItem) => {
    if (item.type === 'simplification') {
      setCurrentTab('simplify');
    } else if (item.type === 'translation') {
      setCurrentTab('translate');
    } else if (item.type === 'notes') {
      setCurrentTab('notes');
    } else if (item.type === 'activities') {
      setCurrentTab('activities');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Accessible Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onToggleAccessibility={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
        isAiConfigured={isAiConfigured}
        preferences={preferences}
      />

      {/* Main Content Viewport */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            currentText={currentText}
            onChangeText={handleUpdateText}
            documentName={documentName}
            onSetDocumentName={setDocumentName}
            onNavigate={setCurrentTab}
            recentDocs={recentDocs}
            onSelectRecentDoc={handleSelectRecentDoc}
          />
        )}

        {currentTab === 'simplify' && (
          <SimplifyView
            currentText={currentText}
            onChangeText={handleUpdateText}
            documentName={documentName}
            defaultLevel={preferences.defaultLevel}
            preferredLanguage={preferences.preferredLanguage}
            onOpenListen={handleOpenListenWithText}
          />
        )}

        {currentTab === 'translate' && (
          <TranslateView
            currentText={currentText}
            onChangeText={handleUpdateText}
            documentName={documentName}
            defaultTargetLanguage={preferences.preferredLanguage}
            onOpenListen={handleOpenListenWithText}
          />
        )}

        {currentTab === 'notes' && (
          <StudyNotesView
            currentText={currentText}
            onChangeText={handleUpdateText}
            documentName={documentName}
            preferredLanguage={preferences.preferredLanguage}
            onOpenListen={handleOpenListenWithText}
          />
        )}

        {currentTab === 'activities' && (
          <ActivitiesView
            currentText={currentText}
            onChangeText={handleUpdateText}
            documentName={documentName}
            preferredLanguage={preferences.preferredLanguage}
          />
        )}

        {currentTab === 'tutor' && (
          <TutorView
            currentText={currentText}
            documentName={documentName}
            onOpenListen={handleOpenListenWithText}
          />
        )}

        {currentTab === 'listen' && (
          <ListenLearnView
            currentText={currentText}
            documentName={documentName}
            externalSpeechText={externalSpeechText}
          />
        )}

        {currentTab === 'library' && (
          <LibraryView
            items={libraryItems}
            onRefreshItems={() => setLibraryItems(loadLibraryItems())}
            onInspectItem={handleInspectLibraryItem}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            onResetPreferences={handleResetPreferences}
            onDataCleared={() => {
              setRecentDocs([]);
              setLibraryItems([]);
              setPreferences(DEFAULT_PREFERENCES);
            }}
          />
        )}

        {currentTab === 'about' && <AboutContributeView />}
      </main>

      {/* Accessible Accessibility Settings Drawer */}
      <AccessibilityDrawer
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
        onResetPreferences={handleResetPreferences}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">OpenLearn AI</span>
            <span>—</span>
            <span>Accessible Learning Workspace</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentTab('about')}
              className="hover:text-slate-900 dark:hover:text-white"
            >
              WCAG 2.2 AA Guide
            </button>
            <button
              onClick={() => setCurrentTab('settings')}
              className="hover:text-slate-900 dark:hover:text-white"
            >
              Privacy & Settings
            </button>
            <button
              onClick={() => setIsAccessibilityOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold"
            >
              Accessibility Options
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
