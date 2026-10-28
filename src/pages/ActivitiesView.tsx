import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  RotateCw,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Award,
  RefreshCcw,
  Sparkles,
  Loader2,
  AlertCircle,
  Lightbulb,
  Check,
  BookmarkCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActivityDifficulty, ActivitiesResult, Flashcard, QuizQuestion } from '../types';
import { generateActivities } from '../services/api';
import { saveLibraryItem } from '../services/storage';
import { SAMPLE_ACTIVITIES } from '../utils/sampleData';

interface ActivitiesViewProps {
  currentText: string;
  onChangeText: (text: string) => void;
  documentName: string;
  preferredLanguage?: string;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  currentText,
  onChangeText,
  documentName,
  preferredLanguage = 'en',
}) => {
  const [tab, setTab] = useState<'flashcards' | 'quiz'>('flashcards');
  const [difficulty, setDifficulty] = useState<ActivityDifficulty>('medium');
  const [result, setResult] = useState<ActivitiesResult | null>(() => {
    if (currentText.includes('Photosynthesis') || currentText.includes('physico-chemical')) {
      return SAMPLE_ACTIVITIES;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Flashcards State
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardStatus, setCardStatus] = useState<Record<string, 'need_practice' | 'know_it'>>({});
  const [showOnlyNeedPractice, setShowOnlyNeedPractice] = useState(false);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [onlyReviewWrong, setOnlyReviewWrong] = useState(false);

  const handleGenerate = async () => {
    if (!currentText.trim()) {
      setError('Please provide educational text to generate learning activities.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setCurrentCardIdx(0);
    setIsFlipped(false);
    setCardStatus({});
    setSelectedAnswers({});
    setIsQuizSubmitted(false);

    try {
      const data = await generateActivities({
        text: currentText,
        flashcardCount: 6,
        quizCount: 5,
        difficulty,
        language: preferredLanguage,
      });
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate learning activities.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered flashcards
  const activeDeck: Flashcard[] = (result?.flashcards || []).filter((card) => {
    if (showOnlyNeedPractice) {
      return cardStatus[card.id] === 'need_practice';
    }
    return true;
  });

  const currentCard: Flashcard | undefined = activeDeck[currentCardIdx];

  // Keyboard navigation for flashcards
  useEffect(() => {
    if (tab !== 'flashcards' || !activeDeck.length) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextCard();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevCard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tab, activeDeck.length, currentCardIdx]);

  const handleNextCard = () => {
    setIsFlipped(false);
    if (currentCardIdx < activeDeck.length - 1) {
      setCurrentCardIdx(currentCardIdx + 1);
    } else {
      // Completed deck! Trigger celebratory confetti
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    if (currentCardIdx > 0) {
      setCurrentCardIdx(currentCardIdx - 1);
    }
  };

  const handleShuffle = () => {
    if (!result) return;
    const shuffled = [...result.flashcards].sort(() => Math.random() - 0.5);
    setResult({ ...result, flashcards: shuffled });
    setCurrentCardIdx(0);
    setIsFlipped(false);
  };

  const markCard = (status: 'need_practice' | 'know_it') => {
    if (!currentCard) return;
    setCardStatus((prev) => ({
      ...prev,
      [currentCard.id]: status,
    }));
    handleNextCard();
  };

  // Quiz helpers
  const handleSelectOption = (questionId: string, optIdx: number) => {
    if (isQuizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optIdx,
    }));
  };

  const handleSubmitQuiz = () => {
    setIsQuizSubmitted(true);
    const questions = result?.quiz || [];
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    if (correctCount >= Math.ceil(questions.length * 0.7)) {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleRestartQuiz = () => {
    setSelectedAnswers({});
    setIsQuizSubmitted(false);
    setOnlyReviewWrong(false);
  };

  const handleSaveToLibrary = () => {
    if (!result) return;
    saveLibraryItem({
      id: `act-${Date.now()}`,
      type: 'activities',
      title: result.title,
      sourceSnippet: currentText.slice(0, 150),
      createdAt: Date.now(),
      data: result,
    });
  };

  const quizQuestions = result?.quiz || [];
  const correctCount = quizQuestions.filter((q) => selectedAnswers[q.id] === q.correctIndex).length;
  const filteredQuizQuestions = onlyReviewWrong
    ? quizQuestions.filter((q) => selectedAnswers[q.id] !== q.correctIndex)
    : quizQuestions;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner and Difficulty Selection */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Flashcards & Interactive Quizzes
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Reinforce learning with 3D flip-cards and exam-style multiple-choice questions grounded in your text
              </p>
            </div>
          </div>

          {result?.isDemo && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-medium">
              Demo Mode Active
            </span>
          )}
        </div>

        {/* Difficulty Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Difficulty:
            </span>
            <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg capitalize transition-colors ${
                    difficulty === diff
                      ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading || !currentText.trim().length}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-amber-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Practice Deck...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Flashcards & Quiz</span>
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
            <p className="font-semibold">Generation Failed</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Activities Container */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Activity Mode Switcher Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTab('flashcards')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  tab === 'flashcards'
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Flashcards ({result.flashcards.length})
              </button>
              <button
                type="button"
                onClick={() => setTab('quiz')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  tab === 'quiz'
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Practice Quiz ({result.quiz.length} Questions)
              </button>
            </div>

            <button
              type="button"
              onClick={handleSaveToLibrary}
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-amber-600 flex items-center gap-1.5"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Save Activity</span>
            </button>
          </div>

          {/* TAB 1: FLASHCARDS */}
          {tab === 'flashcards' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              {/* Header Deck Info and Controls */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium">
                  Card {activeDeck.length > 0 ? currentCardIdx + 1 : 0} of {activeDeck.length}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShuffle}
                    className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Shuffle Cards"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Shuffle</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowOnlyNeedPractice(!showOnlyNeedPractice);
                      setCurrentCardIdx(0);
                    }}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      showOnlyNeedPractice
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Need Practice Only (
                    {Object.values(cardStatus).filter((s) => s === 'need_practice').length}
                    )
                  </button>
                </div>
              </div>

              {/* 3D Flip Card */}
              {currentCard ? (
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  role="button"
                  tabIndex={0}
                  aria-label={isFlipped ? 'Flashcard back: Answer' : 'Flashcard front: Question'}
                  className="perspective-1000 min-h-[280px] sm:min-h-[320px] cursor-pointer group focus:outline-none"
                >
                  <div
                    className={`relative w-full h-full min-h-[280px] sm:min-h-[320px] rounded-3xl transition-transform duration-500 transform-style-3d shadow-md border ${
                      isFlipped
                        ? 'rotate-y-180 border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-900'
                        : 'border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950'
                    }`}
                  >
                    {/* Front (Question) */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-between backface-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {currentCard.category || 'Question'}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>Click or Space to flip</span>
                        </span>
                      </div>

                      <div className="my-auto text-center">
                        <p className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                          {currentCard.question}
                        </p>
                        {currentCard.hint && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 italic flex items-center justify-center gap-1">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                            <span>Hint: {currentCard.hint}</span>
                          </p>
                        )}
                      </div>

                      <div className="text-center text-xs text-slate-400">
                        Use Spacebar to flip, Arrow keys to navigate
                      </div>
                    </div>

                    {/* Back (Answer) */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-between backface-hidden rotate-y-180 bg-slate-50/70 dark:bg-slate-900/90 rounded-3xl">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          Answer & Explanation
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>Click to return</span>
                        </span>
                      </div>

                      <div className="my-auto text-center">
                        <p className="text-base sm:text-lg text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
                          {currentCard.answer}
                        </p>
                      </div>

                      <div className="text-center text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                        Grounded in uploaded study text
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="min-h-[260px] rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-6 text-center">
                  <Award className="w-10 h-10 text-amber-500 mb-2" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Deck Completed!
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    {showOnlyNeedPractice
                      ? "You've reviewed all cards marked for practice."
                      : "Great work! You have reviewed all flashcards in this set."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowOnlyNeedPractice(false);
                      setCurrentCardIdx(0);
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold"
                  >
                    Reset Deck
                  </button>
                </div>
              )}

              {/* Flashcard Action Toolbar */}
              {currentCard && (
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handlePrevCard}
                    disabled={currentCardIdx === 0}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Previous card"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => markCard('need_practice')}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                        cardStatus[currentCard.id] === 'need_practice'
                          ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-300'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <XCircle className="w-4 h-4 text-rose-500" />
                      <span>Need Practice</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => markCard('know_it')}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                        cardStatus[currentCard.id] === 'know_it'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Know It</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextCard}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                    aria-label="Next card"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MULTIPLE-CHOICE QUIZ */}
          {tab === 'quiz' && (
            <div className="space-y-6">
              {/* Quiz Score Header */}
              {isQuizSubmitted && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 border border-amber-200 dark:border-indigo-900/50 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                      Quiz Complete
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                      Your Score: {correctCount} / {quizQuestions.length} (
                      {Math.round((correctCount / quizQuestions.length) * 100)}%)
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setOnlyReviewWrong(!onlyReviewWrong)}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      {onlyReviewWrong ? 'Show All Questions' : 'Review Wrong Answers Only'}
                    </button>

                    <button
                      type="button"
                      onClick={handleRestartQuiz}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" />
                      <span>Restart Quiz</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-5">
                {filteredQuizQuestions.map((q, qIdx) => {
                  const userAnswer = selectedAnswers[q.id];
                  const hasAnswered = userAnswer !== undefined;
                  const isCorrect = userAnswer === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                          <span className="text-amber-600 dark:text-amber-400 mr-2">Q{qIdx + 1}.</span>
                          {q.question}
                        </h3>

                        {isQuizSubmitted && (
                          <span
                            className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${
                              isCorrect
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        )}
                      </div>

                      {/* Options */}
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isOptionSelected = userAnswer === optIdx;
                          const isOptionCorrect = q.correctIndex === optIdx;

                          let optionStyle =
                            'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200';

                          if (isQuizSubmitted) {
                            if (isOptionCorrect) {
                              optionStyle =
                                'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:border-emerald-600 dark:text-emerald-200 font-semibold ring-2 ring-emerald-500/20';
                            } else if (isOptionSelected && !isOptionCorrect) {
                              optionStyle =
                                'border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/60 dark:border-rose-600 dark:text-rose-200 line-through';
                            }
                          } else if (isOptionSelected) {
                            optionStyle =
                              'border-amber-600 bg-amber-50 text-amber-950 dark:bg-amber-950/60 dark:border-amber-500 dark:text-amber-100 ring-2 ring-amber-500/20 font-semibold';
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              disabled={isQuizSubmitted}
                              className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-all ${optionStyle}`}
                            >
                              <span
                                className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                                  isOptionSelected
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="flex-1 mt-0.5">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation box after submission */}
                      {isQuizSubmitted && (
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                          <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                            <span>Explanation:</span>
                          </p>
                          <p>{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit Quiz Button */}
              {!isQuizSubmitted && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length === 0}
                    className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-amber-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Submit Answers ({Object.keys(selectedAnswers).length} / {quizQuestions.length})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
