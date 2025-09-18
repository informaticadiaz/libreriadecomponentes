# storage

```ts
// components/learning/storage.ts

import type { ProgressSnapshot, TableProgress, Question } from './types';

const STORAGE_PREFIX = 'multiplication_trainer_';
const PROGRESS_KEY = `${STORAGE_PREFIX}progress`;
const SETTINGS_KEY = `${STORAGE_PREFIX}settings`;

export interface StoredSettings {
  lastSelectedTables: number[];
  lastQuestionCount: number;
  lastMode: string;
}

/**
 * Chequea si localStorage está disponible
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Carga el progreso guardado desde localStorage
 */
export const loadProgress = (): ProgressSnapshot | null => {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    
    // Convertir fechas desde string
    if (parsed.lastUpdated) {
      parsed.lastUpdated = new Date(parsed.lastUpdated);
    }
    
    Object.keys(parsed).forEach(key => {
      if (key !== 'totalCorrect' && key !== 'totalAttempts' && key !== 'overallAccuracy' && key !== 'lastUpdated') {
        const tableProgress = parsed[key] as TableProgress;
        if (tableProgress.lastPlayedAt) {
          tableProgress.lastPlayedAt = new Date(tableProgress.lastPlayedAt);
        }
      }
    });
    
    return parsed;
  } catch (error) {
    console.warn('Error loading progress from localStorage:', error);
    return null;
  }
};

/**
 * Guarda el progreso en localStorage
 */
export const saveProgress = (progress: ProgressSnapshot): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    return true;
  } catch (error) {
    console.warn('Error saving progress to localStorage:', error);
    return false;
  }
};

/**
 * Actualiza el progreso de una tabla específica
 */
export const updateTableProgress = (
  tableNumber: number,
  questions: Question[],
  currentProgress?: ProgressSnapshot
): ProgressSnapshot => {
  const existingProgress = currentProgress || loadProgress() || createEmptyProgress();
  const tableKey = tableNumber.toString();
  
  const tableQuestions = questions.filter(q => 
    q.factor1 === tableNumber || q.factor2 === tableNumber
  );
  
  const correctAnswers = tableQuestions.filter(q => q.isCorrect).length;
  const totalAttempts = tableQuestions.length;
  
  const existingTableProgress = existingProgress[tableKey] || createEmptyTableProgress(tableNumber);
  
  // Calcular nueva racha
  let newStreak = existingTableProgress.streak;
  let consecutiveCorrect = 0;
  
  for (const question of tableQuestions) {
    if (question.isCorrect) {
      consecutiveCorrect++;
    } else {
      consecutiveCorrect = 0;
    }
  }
  
  if (consecutiveCorrect > 0) {
    newStreak += consecutiveCorrect;
  } else if (tableQuestions.some(q => !q.isCorrect)) {
    newStreak = 0;
  }
  
  const updatedTableProgress: TableProgress = {
    ...existingTableProgress,
    correctAnswers: existingTableProgress.correctAnswers + correctAnswers,
    totalAttempts: existingTableProgress.totalAttempts + totalAttempts,
    accuracy: ((existingTableProgress.correctAnswers + correctAnswers) / (existingTableProgress.totalAttempts + totalAttempts)) * 100,
    streak: newStreak,
    bestStreak: Math.max(existingTableProgress.bestStreak, newStreak),
    lastPlayedAt: new Date(),
    badges: updateBadges(existingTableProgress, newStreak, correctAnswers, totalAttempts)
  };
  
  const updatedProgress: ProgressSnapshot = {
    ...existingProgress,
    [tableKey]: updatedTableProgress,
    totalCorrect: existingProgress.totalCorrect + correctAnswers,
    totalAttempts: existingProgress.totalAttempts + totalAttempts,
    lastUpdated: new Date()
  };
  
  updatedProgress.overallAccuracy = (updatedProgress.totalCorrect / updatedProgress.totalAttempts) * 100;
  
  saveProgress(updatedProgress);
  return updatedProgress;
};

/**
 * Crea un progreso vacío
 */
export const createEmptyProgress = (): ProgressSnapshot => ({
  totalCorrect: 0,
  totalAttempts: 0,
  overallAccuracy: 0,
  lastUpdated: new Date()
});

/**
 * Crea progreso vacío para una tabla
 */
export const createEmptyTableProgress = (tableNumber: number): TableProgress => ({
  table: tableNumber,
  correctAnswers: 0,
  totalAttempts: 0,
  accuracy: 0,
  streak: 0,
  bestStreak: 0,
  lastPlayedAt: new Date(),
  badges: []
});

/**
 * Actualiza las insignias basado en el rendimiento
 */
const updateBadges = (
  existing: TableProgress,
  newStreak: number,
  correctAnswers: number,
  totalAttempts: number
): string[] => {
  const badges = new Set(existing.badges);
  
  // Primera vez jugando esta tabla
  if (existing.totalAttempts === 0 && totalAttempts > 0) {
    badges.add('firstTry');
  }
  
  // Puntaje perfecto en esta sesión
  if (totalAttempts > 0 && correctAnswers === totalAttempts) {
    badges.add('perfect');
  }
  
  // Rachas
  if (newStreak >= 5) {
    badges.add('streak5');
  }
  if (newStreak >= 10) {
    badges.add('streak10');
  }
  
  return Array.from(badges);
};

/**
 * Resetea todo el progreso
 */
export const resetProgress = (): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    localStorage.removeItem(PROGRESS_KEY);
    return true;
  } catch (error) {
    console.warn('Error resetting progress:', error);
    return false;
  }
};

/**
 * Carga configuraciones guardadas
 */
export const loadSettings = (): StoredSettings | null => {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Error loading settings:', error);
    return null;
  }
};

/**
 * Guarda configuraciones
 */
export const saveSettings = (settings: StoredSettings): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.warn('Error saving settings:', error);
    return false;
  }
};
```
