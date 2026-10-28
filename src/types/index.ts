export type EducationLevel = 'beginner' | 'school' | 'high_school' | 'university';

export type NotesLength = 'short' | 'standard' | 'detailed';

export type ActivityDifficulty = 'easy' | 'medium' | 'hard';

export interface ConceptExplanation {
  term: string;
  explanation: string;
}

export interface DifficultTerm {
  term: string;
  definition: string;
  everydayComparison: string;
}

export interface AnalogyItem {
  concept: string;
  analogy: string;
}

export interface SimplificationResult {
  title: string;
  level: EducationLevel;
  summary: string;
  plainExplanation: string;
  importantConcepts: ConceptExplanation[];
  difficultTerms: DifficultTerm[];
  analogies: AnalogyItem[];
  keyTakeaways: string[];
  quickRecap: string;
  followUpQuestions: string[];
  isDemo?: boolean;
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  detectedSourceLanguage: string;
  targetLanguage: string;
  keyTerminologyMap: Array<{ source: string; translated: string; definition?: string }>;
  academicNote: string;
  isDemo?: boolean;
}

export interface NoteSection {
  heading: string;
  content: string;
  subpoints?: string[];
}

export interface FormulaItem {
  name: string;
  formula: string;
  explanation: string;
}

export interface StudyNotesResult {
  title: string;
  length: NotesLength;
  overview: string;
  sections: NoteSection[];
  definitions: Array<{ term: string; definition: string }>;
  formulas: FormulaItem[];
  revisionChecklist: string[];
  finalSummary: string;
  sourceCitationNote: string;
  isDemo?: boolean;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  hint?: string;
  category?: string;
  status?: 'unseen' | 'learning' | 'mastered';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: ActivityDifficulty;
}

export interface ActivitiesResult {
  title: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  isDemo?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  citations?: string[];
  isGroundedInSource?: boolean;
  limitationNote?: string;
}

export interface LibraryItem {
  id: string;
  type: 'simplification' | 'translation' | 'notes' | 'activities';
  title: string;
  sourceSnippet: string;
  createdAt: number;
  data: SimplificationResult | TranslationResult | StudyNotesResult | ActivitiesResult;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'normal' | 'large' | 'extra-large';
  fontFamily: 'standard' | 'dyslexic';
  highContrast: boolean;
  reducedMotion: boolean;
  defaultLevel: EducationLevel;
  preferredLanguage: string;
  speechRate: number;
  speechPitch: number;
  voiceURI?: string;
}

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
];

export interface ProcessedDocument {
  name: string;
  size: number;
  type: string;
  extractedText: string;
  characterCount: number;
  wordCount: number;
  sourcePreview: string;
  pageCount?: number;
}
