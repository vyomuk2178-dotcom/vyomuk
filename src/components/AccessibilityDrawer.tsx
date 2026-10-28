import React, { useEffect } from 'react';
import { X, Type, Eye, Sun, Moon, Laptop, Volume2, RotateCcw } from 'lucide-react';
import { UserPreferences } from '../types';
import { DEFAULT_PREFERENCES } from '../services/storage';

interface AccessibilityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  onResetPreferences: () => void;
}

export const AccessibilityDrawer: React.FC<AccessibilityDrawerProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
  onResetPreferences,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-drawer-title"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl h-full flex flex-col border-l border-slate-200 dark:border-slate-800 transition-colors">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Eye className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="accessibility-drawer-title" className="font-bold text-base text-slate-900 dark:text-white">
                Reading & Accessibility
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalize contrast, typography, and speech
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Close accessibility settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* 1. Font Family / Dyslexia Friendly */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <Type className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Dyslexia-Friendly Typography</span>
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Lexend features distinct character shapes and generous letter spacing designed to reduce visual crowding.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdatePreferences({ fontFamily: 'standard' })}
                className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  preferences.fontFamily === 'standard'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-500 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Standard Font
              </button>
              <button
                type="button"
                onClick={() => onUpdatePreferences({ fontFamily: 'dyslexic' })}
                className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all font-serif ${
                  preferences.fontFamily === 'dyslexic'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-500 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Lexend (Dyslexic)
              </button>
            </div>
          </div>

          {/* 2. Text Sizing */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>Text Size</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 capitalize">
                {preferences.fontSize}
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'large', 'extra-large'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onUpdatePreferences({ fontSize: size })}
                  className={`py-2 px-2 rounded-lg border text-xs sm:text-sm font-medium transition-all text-center capitalize ${
                    preferences.fontSize === size
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-500 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {size === 'normal' ? 'Normal' : size === 'large' ? 'Large' : 'XL'}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Theme Mode */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Display Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onUpdatePreferences({ theme: 'light' })}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  preferences.theme === 'light'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-500 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdatePreferences({ theme: 'dark' })}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  preferences.theme === 'dark'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-500 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdatePreferences({ theme: 'system' })}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  preferences.theme === 'system'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-500 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Laptop className="w-4 h-4" />
                <span>Auto</span>
              </button>
            </div>
          </div>

          {/* 4. High Contrast Mode */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <label
                  htmlFor="high-contrast-toggle"
                  className="text-sm font-semibold text-slate-800 dark:text-slate-200 block"
                >
                  High Contrast Borders
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enforces distinct boundaries and maximum visual edge distinction.
                </p>
              </div>
              <input
                id="high-contrast-toggle"
                type="checkbox"
                checked={preferences.highContrast}
                onChange={(e) => onUpdatePreferences({ highContrast: e.target.checked })}
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          {/* 5. Speech Synthesis Rate */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <label
              htmlFor="speech-rate-slider"
              className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Audio Reading Speed</span>
              </span>
              <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
                {preferences.speechRate.toFixed(2)}x
              </span>
            </label>
            <input
              id="speech-rate-slider"
              type="range"
              min="0.7"
              max="1.5"
              step="0.05"
              value={preferences.speechRate}
              onChange={(e) => onUpdatePreferences({ speechRate: parseFloat(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0.7x (Deliberate)</span>
              <span>1.0x (Standard)</span>
              <span>1.5x (Fast)</span>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          <button
            onClick={onResetPreferences}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus:outline-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
