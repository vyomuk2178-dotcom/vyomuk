import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  Copy,
  Download,
  Bookmark,
  RefreshCw,
  Lightbulb,
  BookOpen,
  HelpCircle,
  Check,
  AlertCircle,
  FileQuestion,
  Loader2,
  BookmarkCheck,
} from 'lucide-react';
import { EducationLevel, SimplificationResult } from '../types';
import { simplifyText } from '../services/api';
import { speechManager } from '../services/speech';
import { saveLibraryItem } from '../services/storage';
import { SAMPLE_SIMPLIFICATION } from '../utils/sampleData';

interface SimplifyViewProps {
  currentText: string;
  onChangeText: (text: string) => void;
  documentName: string;
  defaultLevel?: EducationLevel;
  preferredLanguage?: string;
  onOpenListen?: (text: string) => void;
}

export const SimplifyView: React.FC<SimplifyViewProps> = ({
  currentText,
  onChangeText,
  documentName,
  defaultLevel = 'school',
  preferredLanguage = 'en',
  onOpenListen,
}) => {
  const [level, setLevel] = useState<EducationLevel>(defaultLevel);
  const [focusArea, setFocusArea] = useState('');
  const [result, setResult] = useState<SimplificationResult | null>(() => {
    if (currentText.includes('Photosynthesis') || currentText.includes('physico-chemical')) {
      return SAMPLE_SIMPLIFICATION;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const levels: Array<{ id: EducationLevel; title: string; desc: string }> = [
    { id: 'beginner', title: 'Beginner', desc: 'Everyday analogies, zero unguided jargon, vivid examples.' },
    { id: 'school', title: 'School Student', desc: 'Clear step-by-step structure, relatable comparisons.' },
    { id: 'high_school', title: 'High School', desc: 'Rigorous academic terminology with clear definitions.' },
    { id: 'university', title: 'University', desc: 'In-depth conceptual architecture and nuanced mechanics.' },
  ];

  const handleSimplify = async (overrideLevel?: EducationLevel) => {
    if (!currentText.trim()) {
      setError('Please provide or paste educational text before simplifying.');
      return;
    }

    const targetLevel = overrideLevel || level;
    setError(null);
    setIsLoading(true);
    setSaved(false);

    try {
      const data = await simplifyText({
        text: currentText,
        level: targetLevel,
        language: preferredLanguage,
        focusArea: focusArea.trim() || undefined,
      });
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to simplify educational text.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const textToCopy = `# ${result.title} (${result.level.toUpperCase()})\n\n${result.summary}\n\n## Plain Language Explanation\n${result.plainExplanation}\n\n## Important Concepts\n${result.importantConcepts.map((c) => `- **${c.term}**: ${c.explanation}`).join('\n')}\n\n## Difficult Terms Simplified\n${result.difficultTerms.map((t) => `- **${t.term}**: ${t.definition} (Think: ${t.everydayComparison})`).join('\n')}\n\n## Key Takeaways\n${result.keyTakeaways.map((k) => `- ${k}`).join('\n')}\n\n## Quick Recap\n${result.quickRecap}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const textToDownload = `# ${result.title}\nLevel: ${result.level}\n\n${result.summary}\n\n## Plain Language Explanation\n${result.plainExplanation}\n\n## Key Takeaways\n${result.keyTakeaways.map((k) => `- ${k}`).join('\n')}\n\n## Quick Recap\n${result.quickRecap}`;

    const blob = new Blob([textToDownload], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_simplified.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveToLibrary = () => {
    if (!result) return;
    saveLibraryItem({
      id: `simp-${Date.now()}`,
      type: 'simplification',
      title: result.title,
      sourceSnippet: currentText.slice(0, 150),
      createdAt: Date.now(),
      data: result,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleListen = () => {
    if (!result) return;
    const speechText = `${result.title}. ${result.summary}. Here is the plain explanation: ${result.plainExplanation}. Key takeaway: ${result.quickRecap}`;
    if (onOpenListen) {
      onOpenListen(speechText);
    } else {
      speechManager.speak(speechText);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Simplify Educational Text
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transform dense textbooks into plain-language concepts, relatable analogies, and key takeaways
              </p>
            </div>
          </div>

          {result?.isDemo && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-medium">
              Demo Mode Active
            </span>
          )}
        </div>

        {/* Level Selector */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Select Comprehension Level:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {levels.map((lvl) => {
              const isSelected = level === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setLevel(lvl.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 dark:border-indigo-500 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-900/40'
                  }`}
                >
                  <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {lvl.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {lvl.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Focus Area */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <label htmlFor="focus-area-input" className="sr-only">
              Specific focus question or topic
            </label>
            <input
              id="focus-area-input"
              type="text"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              placeholder="Optional: Focus on a specific question or difficulty (e.g., 'Why is RuBisCO slow?')"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={() => handleSimplify()}
            disabled={isLoading || !currentText.trim().length}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Simplifying...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Explanation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-xs sm:text-sm text-rose-800 dark:text-rose-200">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Unable to simplify text</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Action Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  {result.level} level
                </span>
                <span className="text-xs text-slate-400">• Preserved Core Principles</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                {result.title}
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleListen}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium transition-colors"
                title="Listen to this explanation"
              >
                <Volume2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Listen</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToLibrary}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium transition-colors"
              >
                {saved ? <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-indigo-50/60 dark:bg-indigo-950/30 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-2">
              Overview at a Glance
            </h3>
            <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {result.summary}
            </p>
          </div>

          {/* Plain Language Explanation */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Plain-Language Explanation</span>
            </h3>
            <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 whitespace-pre-line">
              {result.plainExplanation}
            </div>
          </div>

          {/* Analogies & Everyday Comparisons */}
          {result.analogies && result.analogies.length > 0 && (
            <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl p-6 border border-amber-200/80 dark:border-amber-900/40 space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Everyday Analogy (Mental Model)
                </h3>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                Note: This analogy is illustrative to provide an intuitive mental model, rather than an exact mathematical representation.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {result.analogies.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50"
                  >
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block mb-1">
                      {item.concept}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.analogy}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Difficult Terms Decoded */}
          {result.difficultTerms && result.difficultTerms.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Technical Terms Decoded
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.difficultTerms.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5"
                  >
                    <div className="font-bold text-xs sm:text-sm text-indigo-700 dark:text-indigo-300">
                      {t.term}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {t.definition}
                    </p>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200 dark:border-slate-700">
                      Everyday comparison: {t.everydayComparison}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Takeaways & Quick Recap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Key Takeaways
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {result.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
              <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                Quick 10-Second Recap
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {result.quickRecap}
              </p>
            </div>
          </div>

          {/* Follow-up Questions for Reflection */}
          {result.followUpQuestions && result.followUpQuestions.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileQuestion className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Reflection & Follow-Up Questions</span>
              </h3>
              <div className="space-y-2">
                {result.followUpQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                  >
                    {idx + 1}. {q}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regenerate Level Switcher */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Want a different perspective? Regenerate explanation at another depth:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {levels.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    setLevel(l.id);
                    handleSimplify(l.id);
                  }}
                  disabled={isLoading}
                  className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
                    level === l.id
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  {l.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
