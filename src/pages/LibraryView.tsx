import React, { useState } from 'react';
import {
  BookmarkCheck,
  Search,
  Trash2,
  Download,
  Sparkles,
  Languages,
  BookOpen,
  HelpCircle,
  ExternalLink,
  Calendar,
  AlertTriangle,
  X,
} from 'lucide-react';
import { LibraryItem } from '../types';
import { deleteLibraryItem, clearLibrary, exportAllData } from '../services/storage';

interface LibraryViewProps {
  items: LibraryItem[];
  onRefreshItems: () => void;
  onInspectItem: (item: LibraryItem) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  items,
  onRefreshItems,
  onInspectItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredItems = items.filter((item) => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sourceSnippet.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDelete = (id: string) => {
    deleteLibraryItem(id);
    setDeleteConfirmId(null);
    onRefreshItems();
  };

  const handleClearAll = () => {
    clearLibrary();
    setShowClearConfirm(false);
    onRefreshItems();
  };

  const handleExportJSON = () => {
    const jsonStr = exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `openlearn_library_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTypeIcon = (type: LibraryItem['type']) => {
    switch (type) {
      case 'simplification':
        return <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'translation':
        return <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'notes':
        return <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'activities':
        return <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner and Export Tools */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Saved Learning Library
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your offline collection of simplified texts, study outlines, and practice flashcards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJSON}
              disabled={items.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Library (JSON)</span>
            </button>

            {items.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved materials by title or snippet..."
              className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All' },
              { id: 'simplification', label: 'Simplifications' },
              { id: 'translation', label: 'Translations' },
              { id: 'notes', label: 'Notes' },
              { id: 'activities', label: 'Activities' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedType(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedType === f.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Library Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <BookmarkCheck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
            {searchQuery || selectedType !== 'all'
              ? 'No matching library items found'
              : 'Your learning library is currently empty'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            When you generate simplified texts, notes, or quiz sets, click the "Save to Library" button to keep them saved offline here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs flex flex-col justify-between transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                      {getTypeIcon(item.type)}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 capitalize">
                      {item.type}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                    {item.sourceSnippet}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onInspectItem(item)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
                >
                  <span>Review Item</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete from library"
                  aria-label={`Delete ${item.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      {deleteConfirmId && (
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
                Delete Library Item?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to remove this item from your saved library? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Entire Library Modal */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Clear Entire Library?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              This will remove all {items.length} saved learning items from your browser's local storage.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
