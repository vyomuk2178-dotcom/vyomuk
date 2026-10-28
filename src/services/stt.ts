/**
 * Speech Recognition (STT) Service for OpenLearn AI
 * Provides verbal question input using browser Web Speech API with fallback.
 */

export interface SpeechRecognitionResultState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
}

export class SpeechToTextManager {
  private recognition: any = null;
  private isListening = false;
  private onResultCb: ((transcript: string, isFinal: boolean) => void) | null = null;
  private onStateChangeCb: ((state: SpeechRecognitionResultState) => void) | null = null;

  constructor() {
    if (isSpeechRecognitionSupported()) {
      const SpeechRecognitionConstructor =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionConstructor();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.emitState();
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        if (this.onResultCb && text) {
          this.onResultCb(text, Boolean(finalTranscript));
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        this.isListening = false;
        let userMessage = 'Microphone input error.';
        if (event.error === 'not-allowed') {
          userMessage = 'Microphone access was denied. Please allow microphone permissions in your browser.';
        } else if (event.error === 'no-speech') {
          userMessage = 'No speech detected. Please try again.';
        }
        this.emitState(userMessage);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.emitState();
      };
    }
  }

  public setLanguage(langCode: string): void {
    if (this.recognition) {
      this.recognition.lang = langCode;
    }
  }

  public start(
    onResult: (transcript: string, isFinal: boolean) => void,
    onStateChange: (state: SpeechRecognitionResultState) => void
  ): void {
    if (!this.recognition) {
      onStateChange({
        isListening: false,
        transcript: '',
        error: 'Speech recognition is not supported in this browser. Please type your question directly.',
        isSupported: false,
      });
      return;
    }

    this.onResultCb = onResult;
    this.onStateChangeCb = onStateChange;

    try {
      this.recognition.start();
    } catch (err: any) {
      console.warn('Failed to start speech recognition:', err);
      this.isListening = false;
      this.emitState('Unable to access microphone. Please check permissions.');
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    this.isListening = false;
    this.emitState();
  }

  private emitState(error: string | null = null): void {
    if (this.onStateChangeCb) {
      this.onStateChangeCb({
        isListening: this.isListening,
        transcript: '',
        error,
        isSupported: isSpeechRecognitionSupported(),
      });
    }
  }
}

export const speechToTextManager = new SpeechToTextManager();
