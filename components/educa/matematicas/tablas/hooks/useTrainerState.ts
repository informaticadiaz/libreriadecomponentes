// components/learning/hooks/useTrainerState.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import type { 
  Mode, 
  ModeState, 
  Question, 
  PracticeSettings, 
  ProgressSnapshot, 
  QuizResult,
  TablesTrainerProps 
} from '../types';
import { 
  loadProgress, 
  loadSettings, 
  saveSettings, 
  updateTableProgress,
  updateMultipleTablesProgress,
  createEmptyProgress 
} from '../storage';

interface UseTrainerStateReturn {
  state: ModeState;
  progress: ProgressSnapshot;
  isLoading: boolean;
  
  // Mode management
  setMode: (mode: Mode) => void;
  
  // Table selection
  setSelectedTable: (table: number) => void;
  updatePracticeSettings: (settings: Partial<PracticeSettings>) => void;
  
  // Question management
  generateQuestions: () => void;
  submitAnswer: (answer: number) => void;
  nextQuestion: () => void;
  toggleHint: () => void;
  
  // Timer management
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  
  // Results
  getCurrentResult: () => QuizResult | null;
  
  // Progress management
  resetProgress: () => void;
  
  // State checks
  isQuestionAnswered: boolean;
  isLastQuestion: boolean;
  canSubmit: boolean;
}

export const useTrainerState = (props: TablesTrainerProps): UseTrainerStateReturn => {
  const {
    minTable = 1,
    maxTable = 12,
    defaultMode = 'explore',
    defaultSelectedTables = [2, 3, 4],
    defaultQuestionCount = 10,
    enableTimer = true,
    onProgressChange
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<ProgressSnapshot>(createEmptyProgress());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const [state, setState] = useState<ModeState>({
    mode: defaultMode,
    selectedTable: minTable,
    practiceSettings: {
      selectedTables: defaultSelectedTables,
      questionCount: defaultQuestionCount,
      randomOrder: true,
      showHints: true,
      timeLimit: enableTimer ? 300 : undefined // 5 minutos por defecto
    },
    questionIndex: 0,
    questions: [],
    isAnswered: false,
    showHint: false,
    timer: 0,
    isTimerActive: false,
    streak: 0
  });

  // Cargar datos guardados al inicializar
  useEffect(() => {
    const loadStoredData = () => {
      try {
        console.log('Cargando datos guardados...');
        
        const storedProgress = loadProgress();
        console.log('Progreso cargado:', storedProgress);
        
        if (storedProgress) {
          setProgress(storedProgress);
        }

        const storedSettings = loadSettings();
        console.log('Configuraciones cargadas:', storedSettings);
        
        if (storedSettings) {
          setState(prev => ({
            ...prev,
            practiceSettings: {
              ...prev.practiceSettings,
              selectedTables: storedSettings.lastSelectedTables,
              questionCount: storedSettings.lastQuestionCount
            },
            mode: storedSettings.lastMode as Mode || defaultMode
          }));
        }
      } catch (error) {
        console.warn('Error loading stored data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, [defaultMode]);

  // Guardar configuraciones cuando cambien
  useEffect(() => {
    if (!isLoading) {
      saveSettings({
        lastSelectedTables: state.practiceSettings.selectedTables,
        lastQuestionCount: state.practiceSettings.questionCount,
        lastMode: state.mode
      });
    }
  }, [state.practiceSettings.selectedTables, state.practiceSettings.questionCount, state.mode, isLoading]);

  // Timer management
  useEffect(() => {
    if (state.isTimerActive) {
      timerRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          timer: prev.timer + 1
        }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.isTimerActive]);

  // Generar preguntas
  const generateQuestions = useCallback(() => {
    const { selectedTables, questionCount, randomOrder } = state.practiceSettings;
    
    console.log('Generando preguntas:', { selectedTables, questionCount, randomOrder });
    
    const questions: Question[] = [];
    const allCombinations: Array<[number, number]> = [];
    
    selectedTables.forEach(table => {
      for (let i = 1; i <= 12; i++) {
        allCombinations.push([table, i]);
      }
    });

    // Mezclar si está configurado
    if (randomOrder) {
      for (let i = allCombinations.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allCombinations[i], allCombinations[j]] = [allCombinations[j], allCombinations[i]];
      }
    }

    // Tomar solo la cantidad necesaria
    const selectedCombinations = allCombinations.slice(0, questionCount);

    selectedCombinations.forEach(([factor1, factor2], index) => {
      questions.push({
        id: `q_${index}_${factor1}_${factor2}`,
        factor1,
        factor2,
        answer: factor1 * factor2
      });
    });

    console.log('Preguntas generadas:', questions);

    setState(prev => ({
      ...prev,
      questions,
      questionIndex: 0,
      currentQuestion: questions[0],
      isAnswered: false,
      showHint: false,
      streak: 0
    }));

    startTimeRef.current = Date.now();
  }, [state.practiceSettings]);

  // Enviar respuesta
  const submitAnswer = useCallback((answer: number) => {
    if (!state.currentQuestion || state.isAnswered) return;

    const isCorrect = answer === state.currentQuestion.answer;
    const timeToAnswer = startTimeRef.current ? Date.now() - startTimeRef.current : 0;

    const updatedQuestion: Question = {
      ...state.currentQuestion,
      userAnswer: answer,
      isCorrect,
      timeToAnswer,
      hintsUsed: state.showHint ? 1 : 0
    };

    console.log('Respuesta enviada:', { 
      question: updatedQuestion, 
      userAnswer: answer, 
      correctAnswer: updatedQuestion.answer, 
      isCorrect 
    });

    setState(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[prev.questionIndex] = updatedQuestion;

      return {
        ...prev,
        questions: updatedQuestions,
        currentQuestion: updatedQuestion,
        isAnswered: true,
        streak: isCorrect ? prev.streak + 1 : 0
      };
    });
  }, [state.currentQuestion, state.isAnswered, state.showHint]);
  
  const stopTimer = useCallback(() => {
    setState(prev => ({ ...prev, isTimerActive: false }));
  }, []);

  // Siguiente pregunta
  const nextQuestion = useCallback(() => {
    if (!state.isAnswered) return;

    const nextIndex = state.questionIndex + 1;
    const hasMoreQuestions = nextIndex < state.questions.length;

    if (hasMoreQuestions) {
      setState(prev => ({
        ...prev,
        questionIndex: nextIndex,
        currentQuestion: prev.questions[nextIndex],
        isAnswered: false,
        showHint: false
      }));
      startTimeRef.current = Date.now();
    } else {
      // Quiz/práctica terminada, actualizar progreso
      console.log('Terminando quiz/práctica, actualizando progreso...');
      console.log('Preguntas para guardar:', state.questions);
      
      const updatedProgress = updateMultipleTablesProgress(state.questions, progress);
      
      console.log('Progreso actualizado:', updatedProgress);
      
      setProgress(updatedProgress);
      onProgressChange?.(updatedProgress);
      
      stopTimer();
    }
  }, [state.isAnswered, state.questionIndex, state.questions, progress, onProgressChange, stopTimer]);

  // Control methods
  const setMode = useCallback((mode: Mode) => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  const setSelectedTable = useCallback((table: number) => {
    setState(prev => ({ ...prev, selectedTable: table }));
  }, []);

  const updatePracticeSettings = useCallback((settings: Partial<PracticeSettings>) => {
    setState(prev => ({
      ...prev,
      practiceSettings: { ...prev.practiceSettings, ...settings }
    }));
  }, []);

  const toggleHint = useCallback(() => {
    setState(prev => ({ ...prev, showHint: !prev.showHint }));
  }, []);

  const startTimer = useCallback(() => {
    setState(prev => ({ ...prev, isTimerActive: true }));
  }, []);


  const resetTimer = useCallback(() => {
    setState(prev => ({ ...prev, timer: 0, isTimerActive: false }));
  }, []);

  const getCurrentResult = useCallback((): QuizResult | null => {
    if (state.questions.length === 0) return null;

    const correctCount = state.questions.filter(q => q.isCorrect).length;
    const totalTime = state.questions.reduce((sum, q) => sum + (q.timeToAnswer || 0), 0);
    
    let bestStreak = 0;
    let currentStreak = 0;
    
    state.questions.forEach(q => {
      if (q.isCorrect) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });

    return {
      questions: state.questions,
      correctCount,
      totalCount: state.questions.length,
      accuracy: (correctCount / state.questions.length) * 100,
      totalTime,
      bestStreak,
      tablesUsed: state.practiceSettings.selectedTables
    };
  }, [state.questions, state.practiceSettings.selectedTables]);

  const resetProgressData = useCallback(() => {
    try {
      const { resetProgress: resetStoredProgress } = require('../storage');
      resetStoredProgress();
      setProgress(createEmptyProgress());
      onProgressChange?.(createEmptyProgress());
    } catch (error) {
      console.warn('Error resetting progress:', error);
    }
  }, [onProgressChange]);

  // Computed values
  const isQuestionAnswered = state.isAnswered;
  const isLastQuestion = state.questionIndex >= state.questions.length - 1;
  const canSubmit = Boolean(state.currentQuestion && !state.isAnswered);

  return {
    state,
    progress,
    isLoading,
    setMode,
    setSelectedTable,
    updatePracticeSettings,
    generateQuestions,
    submitAnswer,
    nextQuestion,
    toggleHint,
    startTimer,
    stopTimer,
    resetTimer,
    getCurrentResult,
    resetProgress: resetProgressData,
    isQuestionAnswered,
    isLastQuestion,
    canSubmit
  };
};