/**
 * Speech Synthesis Service for OpenLearn AI
 * Provides Web Speech API synthesis with sentence tracking, audio-friendly text cleaning,
 * and graceful fallback support.
 */

export interface SpeechState {
  isSpeaking: boolean;
  isPaused: boolean;
  currentSentenceIndex: number;
  totalSentences: number;
  availableVoices: SpeechSynthesisVoice[];
  error: string | null;
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

export function cleanTextForAudio(rawText: string): string {
  if (!rawText) return '';

  return rawText
    // Remove Markdown headers (#, ##, etc.)
    .replace(/^#+\s+/gm, '')
    // Remove Markdown bold/italic (* or _)
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    // Remove Markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove code ticks
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    // Clean bullet points
    .replace(/^[-*•]\s+/gm, '')
    // Expand common academic / educational abbreviations
    .replace(/\be\.g\.\b/gi, 'for example')
    .replace(/\bi\.e\.\b/gi, 'that is')
    .replace(/\betc\.\b/gi, 'and so on')
    .replace(/\bvs\.\b/gi, 'versus')
    .replace(/\bCO2\b/g, 'C O 2')
    .replace(/\bH2O\b/g, 'H 2 O')
    .replace(/\bATP\b/g, 'A T P')
    .replace(/\s+/g, ' ')
    .trim();
}

export function splitIntoSentences(text: string): string[] {
  const cleaned = cleanTextForAudio(text);
  if (!cleaned) return [];

  // Match sentence endings like '.', '!', '?', or newline, but avoid breaking on decimals
  const rawSentences = cleaned.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [cleaned];
  return rawSentences.map((s) => s.trim()).filter((s) => s.length > 0);
}

class SpeechManager {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private sentences: string[] = [];
  private currentSentenceIdx = 0;
  private onStateChange: ((state: SpeechState) => void) | null = null;
  private speechRate = 1.0;
  private speechPitch = 1.0;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isUserInterrupted = false;

  constructor() {
    if (isSpeechSynthesisSupported()) {
      this.synth = window.speechSynthesis;
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  public setListener(cb: (state: SpeechState) => void): void {
    this.onStateChange = cb;
    this.emitState();
  }

  public setRate(rate: number): void {
    this.speechRate = Math.max(0.6, Math.min(2.0, rate));
  }

  public setPitch(pitch: number): void {
    this.speechPitch = Math.max(0.5, Math.min(1.5, pitch));
  }

  public setVoice(voice: SpeechSynthesisVoice | null): void {
    this.selectedVoice = voice;
  }

  private emitState(errorMessage: string | null = null): void {
    if (!this.onStateChange) return;

    this.onStateChange({
      isSpeaking: Boolean(this.synth?.speaking && !this.synth?.paused),
      isPaused: Boolean(this.synth?.paused),
      currentSentenceIndex: this.currentSentenceIdx,
      totalSentences: this.sentences.length,
      availableVoices: this.getVoices(),
      error: errorMessage,
    });
  }

  public speak(fullText: string, startIndex = 0): void {
    if (!this.synth) {
      this.emitState('Speech synthesis is not supported on this browser or platform.');
      return;
    }

    this.stop();
    this.isUserInterrupted = false;
    this.sentences = splitIntoSentences(fullText);

    if (this.sentences.length === 0) {
      this.emitState('No readable educational text was provided to listen to.');
      return;
    }

    this.currentSentenceIdx = Math.max(0, Math.min(startIndex, this.sentences.length - 1));
    this.playNextSentence();
  }

  private playNextSentence(): void {
    if (!this.synth || this.isUserInterrupted) return;

    if (this.currentSentenceIdx >= this.sentences.length) {
      this.currentSentenceIdx = 0;
      this.emitState();
      return;
    }

    const sentence = this.sentences[this.currentSentenceIdx];
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.rate = this.speechRate;
    utterance.pitch = this.speechPitch;

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    utterance.onstart = () => {
      this.emitState();
    };

    utterance.onend = () => {
      if (!this.isUserInterrupted) {
        this.currentSentenceIdx++;
        if (this.currentSentenceIdx < this.sentences.length) {
          this.playNextSentence();
        } else {
          this.currentSentenceIdx = 0;
          this.emitState();
        }
      }
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        this.emitState(`Playback error: ${e.error}`);
      }
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
    this.emitState();
  }

  public pause(): void {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
      this.emitState();
    }
  }

  public resume(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      this.emitState();
    }
  }

  public stop(): void {
    this.isUserInterrupted = true;
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
    this.emitState();
  }

  public seek(index: number): void {
    if (index >= 0 && index < this.sentences.length) {
      this.currentSentenceIdx = index;
      this.speak(this.sentences.join(' '), index);
    }
  }

  public getSentences(): string[] {
    return this.sentences;
  }
}

export const speechManager = new SpeechManager();
