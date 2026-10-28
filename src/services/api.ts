import {
  SimplificationResult,
  TranslationResult,
  StudyNotesResult,
  ActivitiesResult,
  ChatMessage,
  EducationLevel,
  NotesLength,
  ActivityDifficulty,
} from '../types';

export interface ServerStatus {
  status: string;
  aiConfigured: boolean;
  model: string;
  version: string;
}

export async function checkServerStatus(): Promise<ServerStatus> {
  const res = await fetch('/api/status');
  if (!res.ok) {
    throw new Error('Failed to reach backend server');
  }
  return res.json();
}

export async function extractDocumentContent(params: {
  fileData?: string;
  fileName?: string;
  mimeType?: string;
  rawText?: string;
}): Promise<{
  text: string;
  wordCount: number;
  charCount: number;
  fileName: string;
  extractedVia: string;
  warning?: string;
}> {
  const res = await fetch('/api/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to extract document contents');
  }
  return data;
}

export async function simplifyText(params: {
  text: string;
  level: EducationLevel;
  language?: string;
  focusArea?: string;
}): Promise<SimplificationResult> {
  const res = await fetch('/api/simplify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to simplify educational text');
  }
  return data;
}

export async function translateText(params: {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}): Promise<TranslationResult> {
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to translate educational content');
  }
  return data;
}

export async function generateStudyNotes(params: {
  text: string;
  length: NotesLength;
  preferredLanguage?: string;
}): Promise<StudyNotesResult> {
  const res = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to generate study notes');
  }
  return data;
}

export async function generateActivities(params: {
  text: string;
  flashcardCount?: number;
  quizCount?: number;
  difficulty?: ActivityDifficulty;
  language?: string;
}): Promise<ActivitiesResult> {
  const res = await fetch('/api/activities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to generate flashcards and quiz');
  }
  return data;
}

export async function askAssistant(params: {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  documentContext?: string;
  mode?: 'general' | 'simplify' | 'example' | 'step-by-step' | 'compare';
}): Promise<{
  reply: string;
  citations?: string[];
  isGroundedInSource?: boolean;
  limitationNote?: string;
}> {
  const res = await fetch('/api/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Learning assistant request failed');
  }
  return data;
}
