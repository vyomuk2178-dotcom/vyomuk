import React, { useState } from 'react';
import {
  FileText,
  Volume2,
  Copy,
  Download,
  Bookmark,
  Check,
  AlertCircle,
  Loader2,
  BookOpen,
  CheckSquare,
  Square,
  Calculator,
  BookmarkCheck,
  Edit3,
  Eye,
} from 'lucide-react';
import { NotesLength, StudyNotesResult } from '../types';
import { generateStudyNotes } from '../services/api';
import { speechManager } from '../services/speech';
import { saveLibraryItem } from '../services/storage';
import { SAMPLE_NOTES } from '../utils/sampleData';

interface StudyNotesViewProps {
  currentText: string;
  onChangeText: (text: string) => void;
  documentName: string;
  preferredLanguage?: string;
  onOpenListen?: (text: string) => void;
}

export const StudyNotesView: React.FC<StudyNotesViewProps> = ({
  currentText,
  onChangeText,
  documentName,
  preferredLanguage = 'en',
  onOpenListen,
}) => {
  const [length, setLength] = useState<NotesLength>('standard');
  const [result, setResult] = useState<StudyNotesResult | null>(() => {
    if (currentText.includes('Photosynthesis') || currentText.includes('physico-chemical')) {
      return SAMPLE_NOTES;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editableMarkdown, setEditableMarkdown] = useState('');

  const lengths: Array<{ id: NotesLength; label: string; desc: string }> = [
    { id: 'short', label: 'Short (Cheat Sheet)', desc: 'Key definitions and core formula bullets only.' },
    { id: 'standard', label: 'Standard (Classroom Notes)', desc: 'Balanced hierarchical breakdown with explanations.' },
    { id: 'detailed', label: 'Detailed (Deep Guide)', desc: 'Exhaustive notes covering all subtopics and nuances.' },
  ];

  const handleGenerateNotes = async () => {
    if (!currentText.trim()) {
      setError('Please provide educational text to generate study notes.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setCheckedItems({});
    setSaved(false);

    try {
      const data = await generateStudyNotes({
        text: currentText,
        length,
        preferredLanguage,
      });
      setResult(data);

      // Construct markdown string for edit mode
      const md = `# ${data.title}\n\n${data.overview}\n\n` +
        data.sections.map((s) => `### ${s.heading}\n${s.content}\n${s.subpoints?.map((p) => `- ${p}`).join('\n') || ''}`).join('\n\n') +
        `\n\n### Definitions\n` +
        data.definitions.map((d) => `- **${d.term}**: ${d.definition}`).join('\n') +
        `\n\n### Revision Checklist\n` +
        data.revisionChecklist.map((c) => `- [ ] ${c}`).join('\n') +
        `\n\n### Summary\n${data.finalSummary}`;

      setEditableMarkdown(md);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate study notes.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleCopy = () => {
    const textToCopy = isEditing ? editableMarkdown : constructMarkdown();
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload = isEditing ? editableMarkdown : constructMarkdown();
    const filename = result?.title ? `${result.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_notes.md` : 'study_notes.md';

    const blob = new Blob([textToDownload], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const constructMarkdown = (): string => {
    if (!result) return '';
    return `# ${result.title} (${result.length.toUpperCase()})\n\n${result.overview}\n\n` +
      result.sections.map((s) => `## ${s.heading}\n${s.content}\n${s.subpoints?.map((p) => `- ${p}`).join('\n') || ''}`).join('\n\n') +
      `\n\n## Key Definitions\n` +
      result.definitions.map((d) => `- **${d.term}**: ${d.definition}`).join('\n') +
      (result.formulas.length ? `\n\n## Important Formulas\n` + result.formulas.map((f) => `- **${f.name}**: \`${f.formula}\` (${f.explanation})`).join('\n') : '') +
      `\n\n## Revision Checklist\n` +
      result.revisionChecklist.map((c) => `- [ ] ${c}`).join('\n') +
      `\n\n## Final Summary\n${result.finalSummary}\n\n_${result.sourceCitationNote}_`;
  };

  const handleSaveToLibrary = () => {
    if (!result) return;
    saveLibraryItem({
      id: `notes-${Date.now()}`,
      type: 'notes',
      title: result.title,
      sourceSnippet: currentText.slice(0, 150),
      createdAt: Date.now(),
      data: result,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleListenNotes = () => {
    if (!result) return;
    const speechText = `${result.title}. ${result.overview}. Let's review the main sections. ${result.sections.map((s) => `${s.heading}: ${s.content}`).join('. ')}. Key summary: ${result.finalSummary}`;

    if (onOpenListen) {
      onOpenListen(speechText);
    } else {
      speechManager.speak(speechText);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner and Length Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Study Notes & Revision Generator
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate structured revision outlines with definitions, formulas, checklists, and executive summaries
              </p>
            </div>
          </div>

          {result?.isDemo && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-medium">
              Demo Mode Active
            </span>
          )}
        </div>

        {/* Length Controls */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Select Notes Depth & Format:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {lengths.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLength(item.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  length === item.id
                    ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/60 dark:border-emerald-500 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-900/40'
                }`}
              >
                <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {item.label}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {item.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleGenerateNotes}
            disabled={isLoading || !currentText.trim().length}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Structuring Study Notes...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Generate Study Notes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-xs sm:text-sm text-rose-800 dark:text-rose-200">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <div>
            <p className="font-semibold">Unable to Generate Notes</p>
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
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {result.length} notes
                </span>
                <span className="text-xs text-slate-400">• Source Grounded</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                {result.title}
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  isEditing
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-700 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                <span>{isEditing ? 'View Mode' : 'Edit Text'}</span>
              </button>

              <button
                type="button"
                onClick={handleListenNotes}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium transition-colors"
                title="Listen to notes"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Listen</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .MD</span>
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

          {isEditing ? (
            /* Editable Markdown Area */
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-2">
              <label htmlFor="notes-editor" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Markdown Notes Editor
              </label>
              <textarea
                id="notes-editor"
                value={editableMarkdown}
                onChange={(e) => setEditableMarkdown(e.target.value)}
                rows={16}
                className="w-full font-mono text-xs sm:text-sm p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ) : (
            /* Rich Formatted View */
            <div className="space-y-6">
              {/* Overview */}
              <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl p-5 border border-emerald-200/80 dark:border-emerald-900/50">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-2">
                  Executive Revision Overview
                </h3>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {result.overview}
                </p>
              </div>

              {/* Structured Sections */}
              <div className="space-y-4">
                {result.sections.map((sec, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {sec.heading}
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {sec.content}
                    </p>
                    {sec.subpoints && sec.subpoints.length > 0 && (
                      <ul className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        {sec.subpoints.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Definitions and Formulas Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Definitions */}
                {result.definitions && result.definitions.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Key Definitions</span>
                    </h3>
                    <div className="space-y-2.5">
                      {result.definitions.map((def, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60"
                        >
                          <span className="font-bold text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 block mb-0.5">
                            {def.term}
                          </span>
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            {def.definition}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formulas / Equations */}
                {result.formulas && result.formulas.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Formulas & Key Relations</span>
                    </h3>
                    <div className="space-y-2.5">
                      {result.formulas.map((form, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1"
                        >
                          <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                            {form.name}
                          </span>
                          <div className="p-2 rounded bg-slate-100 dark:bg-slate-900 font-mono text-xs text-indigo-700 dark:text-indigo-300 font-semibold overflow-x-auto">
                            {form.formula}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {form.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Revision Checklist */}
              {result.revisionChecklist && result.revisionChecklist.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Interactive Exam Revision Checklist</span>
                    </h3>
                    <span className="text-xs text-slate-400">
                      {Object.values(checkedItems).filter(Boolean).length} / {result.revisionChecklist.length} reviewed
                    </span>
                  </div>

                  <div className="space-y-2 pt-1">
                    {result.revisionChecklist.map((item, idx) => {
                      const isDone = Boolean(checkedItems[idx]);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleCheck(idx)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl text-left border transition-all ${
                            isDone
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200 line-through'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {isDone ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className="text-xs sm:text-sm font-medium">{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Final Summary and Citation Note */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Final Summary
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {result.finalSummary}
                </p>
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 italic">
                  Citation Note: {result.sourceCitationNote}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
