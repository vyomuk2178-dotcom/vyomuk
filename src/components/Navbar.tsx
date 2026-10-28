import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Languages,
  FileText,
  HelpCircle,
  Volume2,
  BookmarkCheck,
  Settings,
  Info,
  Sliders,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { UserPreferences } from '../types';

export type NavTab =
  | 'dashboard'
  | 'simplify'
  | 'translate'
  | 'notes'
  | 'activities'
  | 'tutor'
  | 'listen'
  | 'library'
  | 'settings'
  | 'about';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onToggleAccessibility: () => void;
  isAiConfigured: boolean;
  preferences: UserPreferences;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onToggleAccessibility,
  isAiConfigured,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'simplify', label: 'Simplify', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'translate', label: 'Translate', icon: <Languages className="w-4 h-4" /> },
    { id: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" /> },
    { id: 'activities', label: 'Quiz & Cards', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'tutor', label: 'AI Tutor', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'listen', label: 'Listen', icon: <Volume2 className="w-4 h-4" /> },
    { id: 'library', label: 'Library', icon: <BookmarkCheck className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Skip to Main Content Link for Keyboard and Screen Reader Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick('dashboard')}
                className="flex items-center gap-2.5 text-left group focus:outline-none"
                aria-label="OpenLearn AI Home"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                      OpenLearn
                    </span>
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      AI
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                    Learn anything. Understand everything.
                  </p>
                </div>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Tools & Badges */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* AI Status Badge */}
              <div
                className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  isAiConfigured
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                }`}
                title={
                  isAiConfigured
                    ? 'Connected to Gemini 3.8 Flash AI'
                    : 'Running in honest Demo Mode with pre-structured educational samples'
                }
              >
                {isAiConfigured ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Gemini AI Active</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Demo Mode</span>
                  </>
                )}
              </div>

              {/* Accessibility Quick Toggle */}
              <button
                onClick={onToggleAccessibility}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 focus:outline-none"
                aria-label="Open Accessibility & Reading Options Drawer"
                title="Accessibility Preferences (Dyslexia Font, Text Size, High Contrast, Speed)"
              >
                <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                <span className="hidden sm:inline">Accessibility</span>
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1 animate-in slide-in-from-top-2">
            <div className="pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Navigation</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  isAiConfigured
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                }`}
              >
                {isAiConfigured ? 'Gemini AI Ready' : 'Demo Mode'}
              </span>
            </div>

            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>
    </>
  );
};
