import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Volume2,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  HelpCircle,
  Lightbulb,
  ListOrdered,
  GitCompare,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { askAssistant } from '../services/api';
import { speechManager } from '../services/speech';
import { speechToTextManager, isSpeechRecognitionSupported } from '../services/stt';

interface TutorViewProps {
  currentText: string;
  documentName: string;
  onOpenListen?: (text: string) => void;
}

export const TutorView: React.FC<TutorViewProps> = ({
  currentText,
  documentName,
  onOpenListen,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your OpenLearn AI tutor. I have reviewed "${documentName || 'your educational text'}". Ask me anything about this material—such as asking for a simpler explanation, a step-by-step walkthrough, or practical real-world examples.`,
      timestamp: Date.now(),
      isGroundedInSource: true,
    },
  ]);

  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'general' | 'simplify' | 'example' | 'step-by-step' | 'compare'>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (overridePrompt?: string, overrideMode?: typeof mode) => {
    const textToSend = overridePrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);
    setMicError(null);

    const activeMode = overrideMode || mode;

    try {
      const data = await askAssistant({
        messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
        documentContext: currentText,
        mode: activeMode,
      });

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: Date.now(),
        citations: data.citations,
        isGroundedInSource: data.isGroundedInSource,
        limitationNote: data.limitationNote,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `I ran into an issue answering your question: ${err?.message || 'Please check your connection and try again.'}`,
        timestamp: Date.now(),
        isGroundedInSource: false,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string, specificMode: typeof mode) => {
    setMode(specificMode);
    handleSend(prompt, specificMode);
  };

  const toggleMic = () => {
    setMicError(null);
    if (!isSpeechRecognitionSupported()) {
      setMicError('Speech recognition is not supported in this browser.');
      return;
    }

    if (isMicActive) {
      speechToTextManager.stop();
      setIsMicActive(false);
    } else {
      speechToTextManager.start(
        (transcript, isFinal) => {
          setInput(transcript);
          if (isFinal) {
            setIsMicActive(false);
            handleSend(transcript);
          }
        },
        (state) => {
          setIsMicActive(state.isListening);
          if (state.error) setMicError(state.error);
        }
      );
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleListenMessage = (text: string) => {
    if (onOpenListen) {
      onOpenListen(text);
    } else {
      speechManager.speak(text);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Chat history reset. How can I help you explore "${documentName || 'your study material'}"?`,
        timestamp: Date.now(),
        isGroundedInSource: true,
      },
    ]);
  };

  return (
    <div className="space-y-4 pb-12 max-w-4xl mx-auto flex flex-col h-[calc(100vh-10rem)] min-h-[600px]">
      {/* Header Info Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 dark:text-white">
                AI Learning Assistant & Tutor
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Grounded in Material</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">
              Context: {documentName || 'Active Material'} ({currentText.split(/\s+/).filter(Boolean).length} words)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetChat}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Quick Inquiry Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-medium whitespace-nowrap pl-1">Ask:</span>
        <button
          type="button"
          onClick={() => handleQuickPrompt('Can you explain this step-by-step in numbered points?', 'step-by-step')}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-purple-400 whitespace-nowrap flex items-center gap-1.5 shadow-2xs"
        >
          <ListOrdered className="w-3.5 h-3.5 text-purple-500" />
          <span>Step-by-step breakdown</span>
        </button>
        <button
          type="button"
          onClick={() => handleQuickPrompt('Give me a concrete everyday example of the primary concept.', 'example')}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-purple-400 whitespace-nowrap flex items-center gap-1.5 shadow-2xs"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Everyday example</span>
        </button>
        <button
          type="button"
          onClick={() => handleQuickPrompt('Explain this in simpler words with zero confusing jargon.', 'simplify')}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-purple-400 whitespace-nowrap flex items-center gap-1.5 shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Explain simply</span>
        </button>
        <button
          type="button"
          onClick={() => handleQuickPrompt('What are the main contrasting differences between key concepts here?', 'compare')}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-purple-400 whitespace-nowrap flex items-center gap-1.5 shadow-2xs"
        >
          <GitCompare className="w-3.5 h-3.5 text-blue-500" />
          <span>Compare concepts</span>
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-inner">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-2xl ${
                isUser ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed transition-all ${
                  isUser
                    ? 'bg-purple-600 text-white rounded-br-xs shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="font-bold text-[11px] text-purple-700 dark:text-purple-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>OpenLearn Tutor</span>
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        m.isGroundedInSource
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}
                    >
                      {m.isGroundedInSource ? 'Source Grounded' : 'General Concept'}
                    </span>
                  </div>
                )}

                <div className="whitespace-pre-line">{m.content}</div>

                {/* Assistant message action toolbar */}
                {!isUser && m.id !== 'welcome' && (
                  <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-slate-500 dark:text-slate-400">
                    <button
                      type="button"
                      onClick={() => handleListenMessage(m.content)}
                      className="hover:text-purple-600 flex items-center gap-1 text-[11px]"
                      title="Listen with voice"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(m.id, m.content)}
                      className="hover:text-purple-600 flex items-center gap-1 text-[11px]"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
            <span>Tutor is formulating an educational explanation...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Notice */}
      {micError && (
        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{micError}</span>
        </div>
      )}

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <button
          type="button"
          onClick={toggleMic}
          className={`p-2.5 rounded-xl transition-colors ${
            isMicActive
              ? 'bg-rose-600 text-white animate-pulse'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title={isMicActive ? 'Stop listening' : 'Speak your question'}
          aria-label={isMicActive ? 'Stop listening' : 'Speak your question'}
        >
          {isMicActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${documentName ? `"${documentName}"` : 'your study text'}...`}
          disabled={isLoading}
          className="flex-1 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none px-2"
        />

        <button
          type="submit"
          disabled={!input.trim().length || isLoading}
          className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
