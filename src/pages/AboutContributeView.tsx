import React from 'react';
import {
  BookOpen,
  Heart,
  Github,
  Shield,
  Layers,
  Code2,
  Cpu,
  Keyboard,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const AboutContributeView: React.FC = () => {
  const keyboardShortcuts = [
    { key: 'Tab / Shift + Tab', action: 'Navigate between interactive controls and buttons' },
    { key: 'Spacebar / Enter', action: 'Flip active flashcard front-to-back' },
    { key: 'Left / Right Arrow', action: 'Step to previous or next flashcard in the deck' },
    { key: 'Escape', action: 'Close accessibility drawer or open dialog modal' },
    { key: 'Alt + S / Option + S', action: 'Focus main educational material input area' },
  ];

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Hero Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                OpenLearn AI
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                v1.0.0 Open Source
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              "Learn anything. Understand everything."
            </p>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
          OpenLearn AI is a free, accessible learning assistant engineered to bridge comprehension barriers. Whether reading dense university textbooks, scientific research, or study materials written in a non-native language, OpenLearn transforms educational text into clear explanations, verified multilingual translations, structured revision outlines, 3D flashcards, and synchronized audio playback.
        </p>
      </div>

      {/* The Real-World Problem */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500" />
          <span>The Real-World Educational Problem</span>
        </h2>
        <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            • <strong>Jargon Obstacles:</strong> Academic textbooks often conceal fundamental concepts behind impenetrable vocabulary, frustrating early learners and self-taught students.
          </p>
          <p>
            • <strong>Language Divides:</strong> Most advanced STEM educational materials are published in English, excluding millions of Hindi, Marathi, and multilingual learners worldwide.
          </p>
          <p>
            • <strong>Visual and Reading Disabilities:</strong> Standard PDF readers fail readers with dyslexia, ADHD, or visual impairments who need high-contrast typography, adjustable letter-spacing, and sentence-synchronized speech.
          </p>
          <p>
            • <strong>Educational Companion Rule:</strong> OpenLearn AI is designed to clarify existing textbooks, not fabricate untruthful shortcuts or replace real classroom educators.
          </p>
        </div>
      </div>

      {/* Accessibility Standards & Keyboard Shortcuts */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>WCAG 2.2 AA Accessibility & Keyboard Shortcuts</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Every primary workflow can be navigated without a mouse. High-contrast indicators and Lexend dyslexic font provide comfortable reading.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Key Combination</th>
                <th className="p-3 font-semibold rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {keyboardShortcuts.map((sc, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-3 font-mono font-bold text-indigo-700 dark:text-indigo-300">
                    {sc.key}
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">{sc.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technology Stack & Architecture */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Technology Stack</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-500" />
              <span>Frontend Architecture</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-amber-500" />
              <span>Full-Stack & AI Engine</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Node.js + Express, Google GenAI SDK (`gemini-3.8-flash`), Web Speech API.
            </p>
          </div>
        </div>
      </div>

      {/* Open Source License & How to Contribute */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Github className="w-4 h-4" />
          <span>Open-Source Licensing & Contributing</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          OpenLearn AI is released under the permissive <strong>MIT License</strong>. We welcome contributions from educators, accessibility advocates, translators, and developers.
        </p>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            How to Contribute:
          </p>
          <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
            <li>Submit issue reports for unhandled educational file formats or translation errors.</li>
            <li>Contribute new language localizations and terminology dictionaries.</li>
            <li>Suggest improved WCAG accessibility patterns and screen-reader optimizations.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
