import React, { useState, useRef, ChangeEvent } from 'react';
import {
  Upload,
  FileText,
  File,
  X,
  Sparkles,
  Languages,
  BookOpen,
  HelpCircle,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Loader2,
  Trash2,
  BookMarked,
  ArrowRight,
} from 'lucide-react';
import { extractDocumentContent } from '../services/api';
import { SAMPLE_TOPICS } from '../utils/sampleData';

interface DocumentInputAreaProps {
  currentText: string;
  onChangeText: (text: string) => void;
  documentName?: string;
  onSetDocumentName: (name: string) => void;
  onActionSelect: (action: 'simplify' | 'translate' | 'notes' | 'activities' | 'assistant') => void;
  isProcessing?: boolean;
}

export const DocumentInputArea: React.FC<DocumentInputAreaProps> = ({
  currentText,
  onChangeText,
  documentName,
  onSetDocumentName,
  onActionSelect,
  isProcessing = false,
}) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = currentText.trim().length ? currentText.trim().split(/\s+/).length : 0;
  const charCount = currentText.length;

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setSuccessNotice(null);

    // Limit to 20MB
    const MAX_SIZE_MB = 20;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed is ${MAX_SIZE_MB}MB.`);
      return;
    }

    setIsExtracting(true);

    try {
      const reader = new FileReader();

      // Plain text or markdown
      if (
        file.type === 'text/plain' ||
        file.type === 'text/markdown' ||
        file.name.endsWith('.txt') ||
        file.name.endsWith('.md')
      ) {
        reader.onload = (event) => {
          const content = event.target?.result as string;
          onChangeText(content || '');
          onSetDocumentName(file.name);
          setIsExtracting(false);
          setSuccessNotice(`Extracted ${file.name} successfully.`);
        };
        reader.onerror = () => {
          setErrorMessage('Failed to read file from browser.');
          setIsExtracting(false);
        };
        reader.readAsText(file);
      } else {
        // PDF or image - read as base64 and send to server extraction route
        reader.onload = async (event) => {
          try {
            const result = event.target?.result as string;
            const base64Data = result.split(',')[1];

            const extracted = await extractDocumentContent({
              fileData: base64Data,
              fileName: file.name,
              mimeType: file.type || 'application/pdf',
            });

            onChangeText(extracted.text);
            onSetDocumentName(file.name);
            setSuccessNotice(
              `Extracted ${extracted.wordCount} words from ${file.name} (${(file.size / 1024).toFixed(0)} KB)`
            );
          } catch (err: any) {
            setErrorMessage(err?.message || 'Could not extract text from document. Please verify it contains readable content.');
          } finally {
            setIsExtracting(false);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unexpected file processing failure.');
      setIsExtracting(false);
    }
  };

  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_TOPICS.find((s) => s.id === sampleId);
    if (sample) {
      onChangeText(sample.content);
      onSetDocumentName(sample.title);
      setErrorMessage(null);
      setSuccessNotice(`Loaded sample topic: "${sample.title}"`);
    }
  };

  const handleClear = () => {
    onChangeText('');
    onSetDocumentName('');
    setErrorMessage(null);
    setSuccessNotice(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      {/* Header with Title and File Metadata */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              {documentName ? documentName : 'Educational Material Input'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste textbook text, notes, or upload a document/PDF
            </p>
          </div>
        </div>

        {/* Word count & Clear button */}
        <div className="flex items-center gap-3">
          {currentText.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {wordCount} words
              </span>
              <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded hidden sm:inline">
                {charCount} chars
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Clear content"
                aria-label="Clear current educational text"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Preset Topics Pills */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium mr-1">
          <BookMarked className="w-3.5 h-3.5 text-indigo-500" />
          <span>Quick Samples:</span>
        </span>
        {SAMPLE_TOPICS.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => handleSelectSample(topic.id)}
            className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title={topic.summary}
          >
            {topic.title.split('&')[0].trim()}
          </button>
        ))}
      </div>

      {/* Main Textarea & Drag Drop Zone */}
      <div className="relative p-4 sm:p-5">
        <label htmlFor="educational-content-input" className="sr-only">
          Educational content to simplify or study
        </label>
        <textarea
          id="educational-content-input"
          value={currentText}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="Paste educational material, textbook excerpts, lecture notes, complex concepts, or upload a document below..."
          rows={7}
          className="w-full resize-y text-sm sm:text-base leading-relaxed bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
        />

        {/* Extraction loading overlay */}
        {isExtracting && (
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-10">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400" />
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Extracting document content...
            </p>
          </div>
        )}
      </div>

      {/* Alerts / Feedback */}
      {errorMessage && (
        <div className="mx-4 sm:mx-5 mb-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Document Notice</p>
            <p>{errorMessage}</p>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-rose-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {successNotice && (
        <div className="mx-4 sm:mx-5 mb-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button onClick={() => setSuccessNotice(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Footer with File Upload and Action Launchers */}
      <div className="p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-900/70 border-t border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Upload Trigger */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.md,.pdf,.png,.jpg,.jpeg"
            className="hidden"
            id="document-file-upload"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isExtracting}
            className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 transition-colors focus:outline-none"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Upload Document</span>
          </button>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            PDF, TXT, MD, Images (max 20MB)
          </span>
        </div>

        {/* Action Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onActionSelect('simplify')}
            disabled={!currentText.trim().length || isProcessing}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simplify Text</span>
          </button>

          <button
            type="button"
            onClick={() => onActionSelect('translate')}
            disabled={!currentText.trim().length || isProcessing}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Translate</span>
          </button>

          <button
            type="button"
            onClick={() => onActionSelect('notes')}
            disabled={!currentText.trim().length || isProcessing}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Study Notes</span>
          </button>

          <button
            type="button"
            onClick={() => onActionSelect('activities')}
            disabled={!currentText.trim().length || isProcessing}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Flashcards & Quiz</span>
          </button>

          <button
            type="button"
            onClick={() => onActionSelect('assistant')}
            disabled={!currentText.trim().length || isProcessing}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Ask Tutor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
