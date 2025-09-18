# test file

```ts
// __tests__/components/learning/storage.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  loadProgress, 
  saveProgress, 
  updateTableProgress,
  createEmptyProgress,
  createEmptyTableProgress,
  resetProgress 
} from '@/components/learning/storage';
import type { ProgressSnapshot, Question } from '@/components/learning/types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Storage Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createEmptyProgress', () => {
    it('should create an empty progress object', () => {
      const progress = createEmptyProgress();
      
      expect(progress).toEqual({
        totalCorrect: 0,
        totalAttempts: 0,
        overallAccuracy: 0,
        lastUpdated: expect.any(Date)
      });
    });
  });

  describe('createEmptyTableProgress', () => {
    it('should create empty progress for a specific table', () => {
      const tableProgress = createEmptyTableProgress(5);
      
      expect(tableProgress).toEqual({
        table: 5,
        correctAnswers: 0,
        totalAttempts: 0,
        accuracy: 0,
        streak: 0,
        bestStreak: 0,
        lastPlayedAt: expect.any(Date),
        badges: []
      });
    });
  });

  describe('saveProgress', () => {
    it('should save progress to localStorage', () => {
      const progress = createEmptyProgress();
      
      const result = saveProgress(progress);
      
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'multiplication_trainer_progress',
        expect.any(String)
      );
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });
      
      const progress = createEmptyProgress();
      const result = saveProgress(progress);
      
      expect(result).toBe(false);
    });
  });

  describe('loadProgress', () => {
    it('should load progress from localStorage', () => {
      const mockProgress = {
        totalCorrect: 10,
        totalAttempts: 15,
        overallAccuracy: 66.67,
        lastUpdated: new Date().toISOString(),
        '5': {
          table: 5,
          correctAnswers: 8,
          totalAttempts: 10,
          accuracy: 80,
          streak: 3,
          bestStreak: 5,
          lastPlayedAt: new Date().toISOString(),
          badges: ['firstTry']
        }
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockProgress));
      
      const result = loadProgress();
      
      expect(result).toBeTruthy();
      expect(result?.totalCorrect).toBe(10);
      expect(result?.lastUpdated).toBeInstanceOf(Date);
    });

    it('should return null if no data exists', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = loadProgress();
      
      expect(result).toBeNull();
    });

    it('should handle corrupted data gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      const result = loadProgress();
      
      expect(result).toBeNull();
    });
  });

  describe('updateTableProgress', () => {
    it('should update progress for a table with correct answers', () => {
      const questions: Question[] = [
        {
          id: '1',
          factor1: 5,
          factor2: 3,
          answer: 15,
          userAnswer: 15,
          isCorrect: true
        },
        {
          id: '2',
          factor1: 5,
          factor2: 4,
          answer: 20,
          userAnswer: 20,
          isCorrect: true
        }
      ];

      const result = updateTableProgress(5, questions);
      
      expect(result['5']).toEqual({
        table: 5,
        correctAnswers: 2,
        totalAttempts: 2,
        accuracy: 100,
        streak: 2,
        bestStreak: 2,
        lastPlayedAt: expect.any(Date),
        badges: expect.arrayContaining(['firstTry', 'perfect'])
      });
    });

    it('should reset streak on incorrect answer', () => {
      const questions: Question[] = [
        {
          id: '1',
          factor1: 5,
          factor2: 3,
          answer: 15,
          userAnswer: 15,
          isCorrect: true
        },
        {
          id: '2',
          factor1: 5,
          factor2: 4,
          answer: 20,
          userAnswer: 18,
          isCorrect: false
        }
      ];

      const result = updateTableProgress(5, questions);
      
      expect(result['5'].streak).toBe(0);
      expect(result['5'].correctAnswers).toBe(1);
      expect(result['5'].totalAttempts).toBe(2);
    });
  });

  describe('resetProgress', () => {
    it('should remove progress from localStorage', () => {
      const result = resetProgress();
      
      expect(result).toBe(true);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        'multiplication_trainer_progress'
      );
    });
  });
});

// __tests__/components/learning/question-generation.test.ts
import { describe, it, expect } from 'vitest';

// Helper function to generate questions (extracted from the hook for testing)
function generateQuestionsArray(
  selectedTables: number[], 
  questionCount: number, 
  randomOrder: boolean = false
) {
  const allCombinations: Array<[number, number]> = [];
  
  selectedTables.forEach(table => {
    for (let i = 1; i <= 12; i++) {
      allCombinations.push([table, i]);
    }
  });

  if (randomOrder) {
    for (let i = allCombinations.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCombinations[i], allCombinations[j]] = [allCombinations[j], allCombinations[i]];
    }
  }

  return allCombinations.slice(0, questionCount).map(([factor1, factor2], index) => ({
    id: `q_${index}_${factor1}_${factor2}`,
    factor1,
    factor2,
    answer: factor1 * factor2
  }));
}

describe('Question Generation', () => {
  describe('generateQuestionsArray', () => {
    it('should generate correct number of questions', () => {
      const questions = generateQuestionsArray([2, 3], 5);
      
      expect(questions).toHaveLength(5);
    });

    it('should generate questions from selected tables only', () => {
      const questions = generateQuestionsArray([5], 12);
      
      questions.forEach(q => {
        expect(q.factor1).toBe(5);
        expect(q.factor2).toBeGreaterThanOrEqual(1);
        expect(q.factor2).toBeLessThanOrEqual(12);
      });
    });

    it('should calculate correct answers', () => {
      const questions = generateQuestionsArray([3], 3);
      
      questions.forEach(q => {
        expect(q.answer).toBe(q.factor1 * q.factor2);
      });
    });

    it('should limit questions to available combinations', () => {
      // Single table (12 combinations) but asking for 15 questions
      const questions = generateQuestionsArray([7], 15);
      
      expect(questions).toHaveLength(12); // Max available
    });

    it('should handle multiple tables correctly', () => {
      const questions = generateQuestionsArray([2, 3, 4], 10);
      
      const factors = new Set(questions.map(q => q.factor1));
      expect(factors.size).toBeGreaterThan(1); // Should have multiple tables
      
      questions.forEach(q => {
        expect([2, 3, 4]).toContain(q.factor1);
      });
    });
  });
});

// __tests__/components/learning/accuracy-calculation.test.ts
import { describe, it, expect } from 'vitest';
import type { Question } from '@/components/learning/types';

// Helper function to calculate accuracy (extracted for testing)
function calculateAccuracy(questions: Question[]): number {
  if (questions.length === 0) return 0;
  
  const correctCount = questions.filter(q => q.isCorrect).length;
  return (correctCount / questions.length) * 100;
}

// Helper function to calculate streak
function calculateBestStreak(questions: Question[]): number {
  let bestStreak = 0;
  let currentStreak = 0;
  
  questions.forEach(q => {
    if (q.isCorrect) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });
  
  return bestStreak;
}

describe('Accuracy and Streak Calculations', () => {
  describe('calculateAccuracy', () => {
    it('should return 0 for empty questions array', () => {
      expect(calculateAccuracy([])).toBe(0);
    });

    it('should return 100 for all correct answers', () => {
      const questions: Question[] = [
        { id: '1', factor1: 2, factor2: 3, answer: 6, isCorrect: true },
        { id: '2', factor1: 4, factor2: 5, answer: 20, isCorrect: true }
      ];
      
      expect(calculateAccuracy(questions)).toBe(100);
    });

    it('should return 0 for all incorrect answers', () => {
      const questions: Question[] = [
        { id: '1', factor1: 2, factor2: 3, answer: 6, isCorrect: false },
        { id: '2', factor1: 4, factor2: 5, answer: 20, isCorrect: false }
      ];
      
      expect(calculateAccuracy(questions)).toBe(0);
    });

    it('should calculate partial accuracy correctly', () => {
      const questions: Question[] = [
        { id: '1', factor1: 2, factor2: 3, answer: 6, isCorrect: true },
        { id: '2', factor1: 4, factor2: 5, answer: 20, isCorrect: false },
        { id: '3', factor1: 3, factor2: 3, answer: 9, isCorrect: true },
        { id: '4', factor1: 6, factor2: 2, answer: 12, isCorrect: false }
      ];
      
      expect(calculateAccuracy(questions)).toBe(50);
    });
  });

  describe('calculateBestStreak', () => {
    it('should return 0 for empty array', () => {
      expect(calculateBestStreak([])).toBe(0);
    });

    it('should return correct streak for all correct answers', () => {
      const questions: Question[] = [
        { id: '1', factor1: 2, factor2: 3, answer: 6, isCorrect: true },
        { id: '2', factor1: 4, factor2: 5, answer: 20, isCorrect: true },
        { id: '3', factor1: 3, factor2: 3, answer: 9, isCorrect: true }
      ];
      
      expect(calculateBestStreak(questions)).toBe(3);
    });

    it('should handle interrupted streaks', () => {
      const questions: Question[] = [
        { id: '1', factor1: 2, factor2: 3, answer: 6, isCorrect: true },
        { id: '2', factor1: 4, factor2: 5, answer: 20, isCorrect: true },
        { id: '3', factor1: 3, factor2: 3, answer: 9, isCorrect: false },
        { id: '4', factor1: 6, factor2: 2, answer: 12, isCorrect: true },
        { id: '5', factor1: 5, factor2: 4, answer: 20, isCorrect: true },
        { id: '6', factor1: 7, factor2: 3, answer: 21, isCorrect: true }
      ];
      
      expect(calculateBestStreak(questions)).toBe(3); // Best streak is 3 at the end
    });

    it('should return 1 for single correct answer', () => {
      const questions: Question[] = [
        { id: '1', factor1: 2, factor2: 3, answer: 6, isCorrect: false },
        { id: '2', factor1: 4, factor2: 5, answer: 20, isCorrect: true },
        { id: '3', factor1: 3, factor2: 3, answer: 9, isCorrect: false }
      ];
      
      expect(calculateBestStreak(questions)).toBe(1);
    });
  });
});

// __tests__/components/learning/i18n.test.ts
import { describe, it, expect } from 'vitest';
import { createI18n, formatHint, defaultI18n } from '@/components/learning/i18n';

describe('Internationalization', () => {
  describe('createI18n', () => {
    it('should return default i18n when no override provided', () => {
      const i18n = createI18n();
      
      expect(i18n).toEqual(defaultI18n);
    });

    it('should merge overrides correctly', () => {
      const override = {
        modes: {
          explore: 'Mirar',
          practice: 'Entrenar',
          quiz: 'Competir'
        }
      };
      
      const i18n = createI18n(override);
      
      expect(i18n.modes).toEqual(override.modes);
      expect(i18n.labels).toEqual(defaultI18n.labels); // Should keep defaults
    });

    it('should partially override nested objects', () => {
      const override = {
        feedback: {
          correct: '¡Genial!',
          incorrect: 'Oops'
        }
      };
      
      const i18n = createI18n(override);
      
      expect(i18n.feedback.correct).toBe('¡Genial!');
      expect(i18n.feedback.incorrect).toBe('Oops');
      expect(i18n.feedback.excellent).toBe(defaultI18n.feedback.excellent);
    });
  });

  describe('formatHint', () => {
    it('should replace factor placeholders', () => {
      const template = 'Contá de a {factor1} hasta llegar a {factor1} × {factor2}';
      const result = formatHint(template, 3, 4);
      
      expect(result).toBe('Contá de a 3 hasta llegar a 3 × 4');
    });

    it('should handle templates without placeholders', () => {
      const template = 'Podés pensarlo como sumas repetidas';
      const result = formatHint(template, 5, 6);
      
      expect(result).toBe('Podés pensarlo como sumas repetidas');
    });

    it('should replace multiple occurrences', () => {
      const template = '{factor1} + {factor1} + {factor1} = {factor1} × 3';
      const result = formatHint(template, 7, 3);
      
      expect(result).toBe('7 + 7 + 7 = 7 × 3');
    });
  });
});

// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
});

// vitest.setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock Date.now for consistent testing
const mockDate = new Date('2024-01-01T00:00:00.000Z');
vi.setSystemTime(mockDate);

// package.json scripts (agregar a tu package.json existente)
/*
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.1",
    "@vitejs/plugin-react": "^4.2.0",
    "jsdom": "^23.0.1",
    "vitest": "^1.0.4"
  }
}
*/
```
