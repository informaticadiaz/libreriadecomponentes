// components/learning/types.ts

export type Mode = 'explore' | 'practice' | 'quiz';

export interface Question {
  id: string;
  factor1: number;
  factor2: number;
  answer: number;
  userAnswer?: number;
  isCorrect?: boolean;
  timeToAnswer?: number;
  hintsUsed?: number;
}

export interface TableProgress {
  table: number;
  correctAnswers: number;
  totalAttempts: number;
  accuracy: number;
  streak: number;
  bestStreak: number;
  lastPlayedAt: Date;
  badges: string[];
}

export interface ProgressSnapshot {
  totalCorrect: number;
  totalAttempts: number;
  overallAccuracy: number;
  lastUpdated: Date;
  tables: Record<string, TableProgress>;
}

export interface PracticeSettings {
  selectedTables: number[];
  questionCount: number;
  randomOrder: boolean;
  showHints: boolean;
  timeLimit?: number; // in seconds
}

export interface QuizResult {
  questions: Question[];
  correctCount: number;
  totalCount: number;
  accuracy: number;
  totalTime: number;
  bestStreak: number;
  tablesUsed: number[];
}

export interface ModeState {
  mode: Mode;
  selectedTable?: number;
  practiceSettings: PracticeSettings;
  currentQuestion?: Question;
  questionIndex: number;
  questions: Question[];
  isAnswered: boolean;
  showHint: boolean;
  timer: number;
  isTimerActive: boolean;
  streak: number;
}

export type TablesTrainerProps = {
  minTable?: number;
  maxTable?: number;
  defaultMode?: Mode;
  defaultSelectedTables?: number[];
  defaultQuestionCount?: number;
  enableTimer?: boolean;
  i18n?: Partial<typeof defaultI18n>;
  onProgressChange?: (snapshot: ProgressSnapshot) => void;
  className?: string;
};

// Para referencia del i18n (se define en i18n.ts)
export interface I18nStrings {
  modes: {
    explore: string;
    practice: string;
    quiz: string;
  };
  labels: {
    selectTable: string;
    selectTables: string;
    questionCount: string;
    startPractice: string;
    startQuiz: string;
    yourAnswer: string;
    submit: string;
    next: string;
    showHint: string;
    hideHint: string;
    resetProgress: string;
    timeLeft: string;
    question: string;
    of: string;
  };
  feedback: {
    correct: string;
    incorrect: string;
    wellDone: string;
    keepPracticing: string;
    excellent: string;
    goodJob: string;
    almostThere: string;
    perfectScore: string;
  };
  hints: {
    addition: string;
    counting: string;
    pattern: string;
  };
  progress: {
    accuracy: string;
    streak: string;
    bestStreak: string;
    attempts: string;
    correct: string;
    lastPlayed: string;
  };
  badges: {
    firstTry: string;
    perfect: string;
    streak5: string;
    streak10: string;
    allTables: string;
  };
}

// Definición base para importar
export declare const defaultI18n: I18nStrings;