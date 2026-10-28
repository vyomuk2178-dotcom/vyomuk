import React, { useState } from 'react';
import {
  Settings,
  Languages,
  Sliders,
  Type,
  Sun,
  Moon,
  Laptop,
  Volume2,
  Trash2,
  ShieldCheck,
  Check,
  RotateCcw,
  AlertTriangle,
  Github,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, UserPreferences, EducationLevel } from '../types';
import { clearAllUserData, exportAllData } from '../services/storage';

interface SettingsViewProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  onResetPreferences: () => void;
  onDataCleared: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  preferences,
  onUpdatePreferences,
  onResetPreferences,
  onDataCleared,
}) => {
  const [showClearModal, setShowClearModal] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleUpdate = (updated: Partial<UserPreferences>) => {
    onUpdatePreferences(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleConfirmClearAll = () => {
    clearAllUserData();
    setShowClearModal(false);
    onDataCleared();
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Application & Accessibility Settings
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalize language defaults, typography, speech rates, and privacy preferences
            </p>
          </div>
        </div>

        {savedNotice && (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Preferences Saved</span>
          </span>
        )}
      </div>

      {/* 1. Learning & Language Defaults */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Languages className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Language & Educational Defaults</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pref-lang" className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Preferred Target Language:
            </label>
            <select
              id="pref-lang"
              value={preferences.preferredLanguage}
              onChange={(e) => handleUpdate({ preferredLanguage: e.target.value })}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="pref-level" className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Default Simplification Level:
            </label>
            <select
              id="pref-level"
              value={preferences.defaultLevel}
              onChange={(e) => handleUpdate({ defaultLevel: e.target.value as EducationLevel })}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="beginner">Beginner (Curious novice / 8-10 yrs)</option>
              <option value="school">School Student (Middle school)</option>
              <option value="high_school">High School (Exam ready)</option>
              <option value="university">University (Deep academic analysis)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Visual & Typography Accessibility */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Type className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Visual & Typography Accessibility</span>
        </h2>

        {/* Dyslexia font */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 block">
              Lexend (Dyslexia-Friendly Typography)
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enhanced character distinctness and letter-spacing for readers with dyslexia or visual fatigue.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              handleUpdate({
                fontFamily: preferences.fontFamily === 'dyslexic' ? 'standard' : 'dyslexic',
              })
            }
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              preferences.fontFamily === 'dyslexic'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {preferences.fontFamily === 'dyslexic' ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Text Scaling */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 block">
              Text Scaling Factor
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Increase body copy and heading sizes without breaking viewport layout.
            </p>
          </div>
          <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {(['normal', 'large', 'extra-large'] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => handleUpdate({ fontSize: sz })}
                className={`px-3 py-1 text-xs font-medium rounded-lg capitalize transition-colors ${
                  preferences.fontSize === sz
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {sz === 'normal' ? '100%' : sz === 'large' ? '120%' : '140%'}
              </button>
            ))}
          </div>
        </div>

        {/* Theme mode */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 block">
              Interface Color Theme
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose clean high-contrast light mode or comfortable low-glare dark mode.
            </p>
          </div>
          <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {[
              { id: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
              { id: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5" /> },
              { id: 'system', label: 'System', icon: <Laptop className="w-3.5 h-3.5" /> },
            ].map((th) => (
              <button
                key={th.id}
                type="button"
                onClick={() => handleUpdate({ theme: th.id as any })}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  preferences.theme === th.id
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {th.icon}
                <span>{th.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* High contrast border mode */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 block">
              High Contrast Borders
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Maximizes container borders and element outlines to assist low-vision learners.
            </p>
          </div>
          <input
            type="checkbox"
            checked={preferences.highContrast}
            onChange={(e) => handleUpdate({ highContrast: e.target.checked })}
            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {/* 3. Audio & Speech Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>Speech Synthesis Speed</span>
        </h2>
        <div>
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-2">
            <span>Speech Reading Rate</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {preferences.speechRate.toFixed(2)}x
            </span>
          </div>
          <input
            type="range"
            min="0.7"
            max="1.5"
            step="0.05"
            value={preferences.speechRate}
            onChange={(e) => handleUpdate({ speechRate: parseFloat(e.target.value) })}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>0.7x (Deliberate)</span>
            <span>1.0x (Standard)</span>
            <span>1.5x (Fast)</span>
          </div>
        </div>
      </div>

      {/* 4. Privacy & Data Storage */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Privacy & Local Data Management</span>
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          OpenLearn AI stores your preferences, recent documents, and saved flashcards directly inside your browser's local storage. None of your private learning notes or study materials are sold or permanently retained on external servers.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onResetPreferences}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Settings to Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Local App Data</span>
          </button>
        </div>
      </div>

      {/* Clear All Confirmation Modal */}
      {showClearModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Clear All Data & Settings?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              This will erase all saved notes, flashcards, recent documents, and custom settings from this browser. This action cannot be reversed.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAll}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
              >
                Erase Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
