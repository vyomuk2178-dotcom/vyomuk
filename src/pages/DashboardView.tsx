import React from 'react';
import {
  Sparkles,
  Languages,
  BookOpen,
  HelpCircle,
  Volume2,
  MessageSquare,
  ShieldCheck,
  FileCheck,
  Clock,
  ArrowRight,
  BookMarked,
  Lightbulb,
} from 'lucide-react';
import { DocumentInputArea } from '../components/DocumentInputArea';
import { NavTab } from '../components/Navbar';
import { RecentDocItem } from '../services/storage';

interface DashboardViewProps {
  currentText: string;
  onChangeText: (text: string) => void;
  documentName: string;
  onSetDocumentName: (name: string) => void;
  onNavigate: (tab: NavTab) => void;
  recentDocs: RecentDocItem[];
  onSelectRecentDoc: (doc: RecentDocItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentText,
  onChangeText,
  documentName,
  onSetDocumentName,
  onNavigate,
  recentDocs,
  onSelectRecentDoc,
}) => {
  const tools = [
    {
      id: 'simplify' as NavTab,
      title: 'Simplify Text',
      description: 'Break down complex academic jargon into crystal-clear explanations tailored for school, high school, or university learners.',
      icon: <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      accentBg: 'bg-indigo-50 dark:bg-indigo-950/40',
      tag: '4 Comprehension Levels',
    },
    {
      id: 'translate' as NavTab,
      title: 'Multilingual Translation',
      description: 'Translate study materials into Hindi, Marathi, Spanish, French, German, and more while preserving scientific terminology.',
      icon: <Languages className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      accentBg: 'bg-blue-50 dark:bg-blue-950/40',
      tag: 'Side-by-Side View',
    },
    {
      id: 'notes' as NavTab,
      title: 'Structured Study Notes',
      description: 'Extract core definitions, equations, revision checklists, and executive summaries formatted for exam preparation.',
      icon: <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      accentBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      tag: 'Checklist & Formulas',
    },
    {
      id: 'activities' as NavTab,
      title: 'Flashcards & Quizzes',
      description: 'Interactive 3D flip-cards with spaced practice tracking and 4-option multiple-choice quizzes with detailed answer rationales.',
      icon: <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      accentBg: 'bg-amber-50 dark:bg-amber-950/40',
      tag: 'Interactive Retention',
    },
    {
      id: 'listen' as NavTab,
      title: 'Listen & Learn',
      description: 'Audio-friendly speech synthesis with adjustable rate, sentence karaoke highlight, and microphone voice query support.',
      icon: <Volume2 className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      accentBg: 'bg-rose-50 dark:bg-rose-950/40',
      tag: 'Synchronized Audio',
    },
    {
      id: 'tutor' as NavTab,
      title: 'AI Learning Tutor',
      description: 'Ground answers strictly in your uploaded document excerpts to prevent hallucinations, with step-by-step guidance.',
      icon: <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      accentBg: 'bg-purple-50 dark:bg-purple-950/40',
      tag: 'Source Grounded',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome & First-time User Guidance */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/60 border border-indigo-700/50 text-xs font-medium text-indigo-200">
            <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
            <span>Accessible AI Workspace for Learners & Educators</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Understand any educational material at your own pace.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Upload complex textbooks, lecture notes, or research papers. Transform them into simple plain-language explanations, multilingual translations, structured flashcards, and audio playback.
          </p>

          {/* 3 Step Quickstart Guide */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs">
              <span className="font-bold text-indigo-300 block mb-1">1. Enter or Upload</span>
              <span className="text-slate-300">Paste textbook excerpts or upload a PDF / document below.</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs">
              <span className="font-bold text-indigo-300 block mb-1">2. Select Your Tool</span>
              <span className="text-slate-300">Choose Simplify, Translate, Study Notes, or Flashcards.</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs">
              <span className="font-bold text-indigo-300 block mb-1">3. Master & Listen</span>
              <span className="text-slate-300">Revise with audio playback, practice quizzes, and dyslexic font.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Document Input Workspace */}
      <section aria-labelledby="input-workspace-title">
        <h2 id="input-workspace-title" className="sr-only">
          Educational Material Workspace
        </h2>
        <DocumentInputArea
          currentText={currentText}
          onChangeText={onChangeText}
          documentName={documentName}
          onSetDocumentName={onSetDocumentName}
          onActionSelect={(action) => {
            if (action === 'assistant') {
              onNavigate('tutor');
            } else {
              onNavigate(action as NavTab);
            }
          }}
        />
      </section>

      {/* Learning Tools Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Learning Tools & AI Capabilities
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a specialized assistant workflow designed for educational retention
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate(tool.id)}
              className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate(tool.id);
                }
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${tool.accentBg}`}>{tool.icon}</div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {tool.tag}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Launch Tool</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Materials & Privacy Reassurance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Materials (2 Cols) */}
        <section className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recently Processed Materials
              </h3>
            </div>
            <span className="text-xs text-slate-400">Stored locally on device</span>
          </div>

          {recentDocs.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              <BookMarked className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                No recent study materials yet
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                When you paste text or upload notes, your recent sessions will appear here for fast recall.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onSelectRecentDoc(doc)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 border border-slate-100 dark:border-slate-800 cursor-pointer transition-colors"
                  role="button"
                  tabIndex={0}
                >
                  <div className="truncate pr-4">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {doc.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {doc.textSnippet}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                      {doc.wordCount} words
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Privacy & Supported Formats (1 Col) */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Privacy & Data Guarantee
            </h3>
          </div>
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              <strong className="text-slate-900 dark:text-slate-200">Device-First Storage:</strong> Your library items, history, and preferences stay on your local browser. No personal profiling or tracking.
            </p>
            <p>
              <strong className="text-slate-900 dark:text-slate-200">Supported Formats:</strong> Paste text directly or upload PDF, TXT, Markdown, and legible document scans.
            </p>
            <p>
              <strong className="text-slate-900 dark:text-slate-200">Academic Companion:</strong> Designed to assist comprehension alongside your teachers, textbooks, and primary curriculum.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
