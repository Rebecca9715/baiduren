export enum UserRole {
  TEEN = 'TEEN',
  FUNDRAISER = 'FUNDRAISER',
  GUEST = 'GUEST'
}

export interface Message {
  id: string;
  content: string;
  date: string;
  from: string;
}

export interface UserProfile {
  name: string;
  age: number;
  bullyingExperience: string;
  targetReturnDate: string; // ISO Date string
  sunshinePoints: number;
  sunshineTarget: number;
  supporterCount: number;
  receivedMessages: Message[];
  offlineCode?: string;
  healingLetter?: string;
}

export interface DailyLog {
  date: string;
  mood: 'happy' | 'neutral' | 'sad' | 'anxious' | 'angry';
  action: string;
}

export interface ReframeResult {
  originalText: string;
  warmExplanation: string;
  psychAnalysis: string;
  solution: string;
  imageUrl?: string; // Base64 or URL
  timestamp: number;
}

export interface AdaptationResult {
  scenario: string;
  warmAdvice: string;
  actionStep: string;
  timestamp: number;
}

export interface DiaryEntry {
  id: string;
  content: string;
  date: string; // ISO
  mood: string;
  isFavorite: boolean;
}

export interface FairyTale {
  title: string;
  content: string;
  generatedDate: string;
}

export enum AppView {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  REFRAMER = 'REFRAMER',
  ADAPTATION = 'ADAPTATION',
  DIARY = 'DIARY',
  FUNDRAISER_INTRO = 'FUNDRAISER_INTRO',
  FUNDRAISER_DASHBOARD = 'FUNDRAISER_DASHBOARD'
}