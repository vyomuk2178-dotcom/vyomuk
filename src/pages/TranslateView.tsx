import React, { useState } from 'react';
import {
  Languages,
  ArrowRightLeft,
  Copy,
  Download,
  Volume2,
  Check,
  AlertCircle,
  Loader2,
  BookMarked,
  ShieldAlert,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, TranslationResult } from '../types';
import { translateText } from '../services/api';
import { speechManager } from '../services/speech';
import { SAMPLE_TRANSLATION } from '../utils/sampleData';

interface TranslateViewProps {
  currentText: string;
  onChangeText: (text: string) => void;
  documentName: string;
  defaultTargetLanguage?: string;
  onOpenListen?: (text: string) => void;
}

export const TranslateView: React.FC<TranslateViewProps> = ({
  currentText,
  onChangeText,
  documentName,
  defaultTargetLanguage = 'hi',
  onOpenListen,
}) => {
  const [targetLanguage, setTargetLanguage] = useState(defaultTargetLanguage);
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [result, setResult] = useState<TranslationResult | null>(() => {
    if (currentText.includes('Photosynthesis') || currentText.includes('physico-chemical')) {
      return SAMPLE_TRANSLATION;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedTranslated, setCopiedTranslated] = useState(false);

  const handleTranslate = async () => {
    if (!currentText.trim()) {
      setError('Please provide educational text to translate.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const data = await translateText({
        text: currentText,
        targetLanguage,
        sourceLanguage: sourceLanguage === 'auto' ? undefined : sourceLanguage,
      });
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to translate material.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTranslated = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.translatedText);
    setCopiedTranslated(true);
    setTimeout(() => setCopiedTranslated(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const content = `# Educational Translation (${result.targetLanguage})\nSource: ${result.detectedSourceLanguage}\n\n## Translated Content\n${result.translatedText}\n\n## Key Terminology Mapping\n${result.keyTerminologyMap?.map((t) => `- **${t.source}** -> ${t.translated}`).join('\n') || ''}\n\n## Academic Notice\n${result.academicNote}`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation_${result.targetLanguage}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleListenTranslation = () => {
    if (!result?.translatedText) return;
    if (onOpenListen) {
      onOpenListen(result.translatedText);
    } else {
      speechManager.speak(result.translatedText);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner and Language Pickers */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Multilingual Academic Translation
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Translate educational concepts while maintaining accurate terminology, formulas, and headings
              </p>
            </div>
          </div>

          {result?.isDemo && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-medium">
              Demo Mode Active
            </span>
          )}
        </div>

        {/* Language Selection Row */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Source Language Picker */}
          <div className="flex-1">
            <label htmlFor="source-lang" className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Source Language
            </label>
            <select
              id="source-lang"
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="auto">Automatic Detection</option>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          <div className="hidden sm:flex items-center justify-center pt-5">
            <ArrowRightLeft className="w-4 h-4 text-slate-400" />
          </div>

          {/* Target Language Picker */}
          <div className="flex-1">
            <label htmlFor="target-lang" className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Target Educational Language
            </label>
            <select
              id="target-lang"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:pt-5">
            <button
              type="button"
              onClick={handleTranslate}
              disabled={isLoading || !currentText.trim().length}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Translating...</span>
                </>
              ) : (
                <>
                  <Languages className="w-4 h-4" />
                  <span>Translate Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-xs sm:text-sm text-rose-800 dark:text-rose-200">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <div>
            <p className="font-semibold">Translation Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Side-by-Side (Desktop) / Stacked (Mobile) Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Original Source Material */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Original Text ({result?.detectedSourceLanguage || 'Source'})
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(currentText);
                  setCopiedOriginal(true);
                  setTimeout(() => setCopiedOriginal(false), 2000);
                }}
                className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
              >
                {copiedOriginal ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedOriginal ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="pt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
              {currentText || (
                <span className="text-slate-400 italic">
                  Paste or upload educational material in the dashboard to see original and translation side-by-side.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Translated Content */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Translation ({result?.targetLanguage || targetLanguage})
              </span>
              {result && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleListenTranslation}
                    className="text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 flex items-center gap-1"
                    title="Listen to translated output"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyTranslated}
                    className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                  >
                    {copiedTranslated ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTranslated ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              )}
            </div>

            <div className="pt-3 text-sm text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto font-medium">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <p className="text-xs">Translating material and validating scientific terms...</p>
                </div>
              ) : result ? (
                result.translatedText
              ) : (
                <span className="text-slate-400 italic">
                  Select your target language and click "Translate Text" to render translation here.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Key Terminology Preserved Table */}
      {result?.keyTerminologyMap && result.keyTerminologyMap.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Scientific & Key Terminology Reference Map
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="p-3 font-semibold rounded-l-lg">Original Term</th>
                  <th className="p-3 font-semibold">Translated Term</th>
                  <th className="p-3 font-semibold rounded-r-lg">Educational Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {result.keyTerminologyMap.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">
                      {item.source}
                    </td>
                    <td className="p-3 font-medium text-blue-700 dark:text-blue-300">
                      {item.translated}
                    </td>
                    <td className="p-3 text-slate-500 dark:text-slate-400">
                      {item.definition || 'Key curriculum term'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Academic Disclaimer Card */}
      <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Academic Review Notice</p>
          <p className="mt-0.5 text-amber-800 dark:text-amber-300">
            {result?.academicNote ||
              'Machine translations provide assistive learning support. For high-stakes examinations, medical literature, or official coursework, cross-reference terminology with certified academic materials.'}
          </p>
        </div>
      </div>
    </div>
  );
};
