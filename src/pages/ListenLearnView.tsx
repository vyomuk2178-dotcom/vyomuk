import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Play,
  Pause,
  Square,
  Mic,
  MicOff,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Send,
  Loader2,
  Sliders,
  Settings2,
} from 'lucide-react';
import {
  speechManager,
  isSpeechSynthesisSupported,
  splitIntoSentences,
  SpeechState,
} from '../services/speech';
import {
  speechToTextManager,
  isSpeechRecognitionSupported,
} from '../services/stt';
import { askAssistant } from '../services/api';

interface ListenLearnViewProps {
  currentText: string;
  documentName: string;
  externalSpeechText?: string;
}

export const ListenLearnView: React.FC<ListenLearnViewProps> = ({
  currentText,
  documentName,
  externalSpeechText,
}) => {
  const [speechText, setSpeechText] = useState(externalSpeechText || currentText || '');
  const [speechState, setSpeechState] = useState<SpeechState>({
    isSpeaking: false,
    isPaused: false,
    currentSentenceIndex: 0,
    totalSentences: 0,
    availableVoices: [],
    error: null,
  });

  const [rate, setRate] = useState(1.0);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Speech-to-text question state
  const [isMicActive, setIsMicActive] = useState(false);
  const [micTranscript, setMicTranscript] = useState('');
  const [micError, setMicError] = useState<string | null>(null);
  const [tutorReply, setTutorReply] = useState<string | null>(null);
  const [isTutorThinking, setIsTutorThinking] = useState(false);

  useEffect(() => {
    if (externalSpeechText) {
      setSpeechText(externalSpeechText);
    } else if (!speechText && currentText) {
      setSpeechText(currentText);
    }
  }, [externalSpeechText, currentText]);

  useEffect(() => {
    const updateVoices = () => {
      const v = speechManager.getVoices();
      setVoices(v);
      if (v.length > 0 && !selectedVoiceURI) {
        // default to first english or local voice
        const defaultVoice = v.find((voice) => voice.lang.startsWith('en')) || v[0];
        setSelectedVoiceURI(defaultVoice.voiceURI);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    speechManager.setListener((state) => {
      setSpeechState(state);
    });

    return () => {
      speechManager.stop();
    };
  }, []);

  const handlePlay = () => {
    if (!speechText.trim()) return;

    if (speechState.isPaused) {
      speechManager.resume();
    } else {
      speechManager.setRate(rate);
      const voiceObj = voices.find((v) => v.voiceURI === selectedVoiceURI) || null;
      speechManager.setVoice(voiceObj);
      speechManager.speak(speechText, 0);
    }
  };

  const handlePause = () => {
    speechManager.pause();
  };

  const handleStop = () => {
    speechManager.stop();
  };

  const handleSeekSentence = (idx: number) => {
    speechManager.setRate(rate);
    const voiceObj = voices.find((v) => v.voiceURI === selectedVoiceURI) || null;
    speechManager.setVoice(voiceObj);
    speechManager.seek(idx);
  };

  // Verbal Mic interaction
  const toggleMicrophone = () => {
    setMicError(null);

    if (isMicActive) {
      speechToTextManager.stop();
      setIsMicActive(false);
    } else {
      setMicTranscript('');
      speechToTextManager.start(
        (transcript, isFinal) => {
          setMicTranscript(transcript);
          if (isFinal) {
            setIsMicActive(false);
            handleAskTutor(transcript);
          }
        },
        (state) => {
          setIsMicActive(state.isListening);
          if (state.error) setMicError(state.error);
        }
      );
    }
  };

  const handleAskTutor = async (question: string) => {
    if (!question.trim()) return;
    setIsTutorThinking(true);
    setTutorReply(null);

    try {
      const resp = await askAssistant({
        messages: [{ role: 'user', content: question }],
        documentContext: speechText || currentText,
        mode: 'simplify',
      });
      setTutorReply(resp.reply);
      // Auto-read response if user asked by voice
      speechManager.speak(`Answer to your question: ${resp.reply}`);
    } catch (err: any) {
      setMicError(err?.message || 'Could not retrieve answer from assistant.');
    } finally {
      setIsTutorThinking(false);
    }
  };

  const sentences = splitIntoSentences(speechText);
  const isSpeechSupported = isSpeechSynthesisSupported();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Listen & Learn — Audio-Assisted Reading
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Synchronized sentence highlighting with audio playback, voice speed control, and verbal questions
            </p>
          </div>
        </div>

        {!isSpeechSupported && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-xs sm:text-sm text-amber-800 dark:text-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <p className="font-semibold">Speech Synthesis Unavailable</p>
              <p>
                Your browser or system does not expose the Web Speech API. You can still read the formatted sentences below.
              </p>
            </div>
          </div>
        )}

        {/* Audio Player Control Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Playback Buttons */}
            <div className="flex items-center gap-2">
              {!speechState.isSpeaking || speechState.isPaused ? (
                <button
                  type="button"
                  onClick={handlePlay}
                  disabled={!isSpeechSupported || !speechText.trim().length}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-rose-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="Play educational audio"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{speechState.isPaused ? 'Resume' : 'Listen Now'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePause}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
                  aria-label="Pause audio"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleStop}
                disabled={!speechState.isSpeaking && !speechState.isPaused}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Stop audio"
                title="Stop audio"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            </div>

            {/* Speed Rate Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Speed:
              </span>
              <div className="inline-flex rounded-xl p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                {[0.8, 1.0, 1.25, 1.5].map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => {
                      setRate(speed);
                      speechManager.setRate(speed);
                    }}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                      rate === speed
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Dropdown */}
            {voices.length > 0 && (
              <div className="flex items-center gap-2 flex-1 max-w-xs">
                <label htmlFor="voice-select" className="sr-only">
                  Voice
                </label>
                <select
                  id="voice-select"
                  value={selectedVoiceURI}
                  onChange={(e) => {
                    setSelectedVoiceURI(e.target.value);
                    const v = voices.find((voice) => voice.voiceURI === e.target.value) || null;
                    speechManager.setVoice(v);
                  }}
                  className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 truncate focus:outline-none"
                >
                  {voices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Synchronized Karaoke Reader Display */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Synchronized Reader</span>
            {speechState.isSpeaking && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-full animate-pulse">
                Speaking sentence {speechState.currentSentenceIndex + 1} of {sentences.length}
              </span>
            )}
          </h2>
          <span className="text-xs text-slate-400">Click any sentence to jump audio</span>
        </div>

        {sentences.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs italic">
            Enter or paste study text in the Dashboard to listen to synchronized audio.
          </div>
        ) : (
          <div className="space-y-3 leading-loose text-sm sm:text-base text-slate-700 dark:text-slate-300">
            {sentences.map((sentence, idx) => {
              const isCurrent = speechState.isSpeaking && speechState.currentSentenceIndex === idx;

              return (
                <span
                  key={idx}
                  onClick={() => handleSeekSentence(idx)}
                  className={`inline cursor-pointer px-1.5 py-1 rounded-md transition-all ${
                    isCurrent
                      ? 'bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-100 font-semibold ring-2 ring-rose-400'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSeekSentence(idx);
                  }}
                  title="Click to start listening from here"
                >
                  {sentence}{' '}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Verbal Question Section (Microphone Voice Query) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Ask a Question Verbally (Speech-to-Text)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Optional Voice Feature</span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Click the microphone to speak your question about this educational material. We'll transcribe it and ground the response in your text.
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleMicrophone}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              isMicActive
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
            }`}
          >
            {isMicActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isMicActive ? 'Listening... (Click to stop)' : 'Click to Speak Question'}</span>
          </button>

          {micTranscript && (
            <div className="flex-1 text-xs sm:text-sm italic text-slate-700 dark:text-slate-300 truncate">
              "{micTranscript}"
            </div>
          )}
        </div>

        {micError && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{micError}</span>
          </div>
        )}

        {isTutorThinking && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
            <span>Assistant is retrieving answer from your material...</span>
          </div>
        )}

        {tutorReply && (
          <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 dark:text-purple-200">
                Assistant Response
              </span>
              <button
                type="button"
                onClick={() => speechManager.speak(tutorReply)}
                className="text-xs text-purple-700 dark:text-purple-300 hover:underline flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Replay Audio</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {tutorReply}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
