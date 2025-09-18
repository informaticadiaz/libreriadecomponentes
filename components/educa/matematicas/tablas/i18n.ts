// components/learning/i18n.ts

import type { I18nStrings } from './types';

export const defaultI18n: I18nStrings = {
  modes: {
    explore: 'Explorar',
    practice: 'Practicar',
    quiz: 'Quiz'
  },
  labels: {
    selectTable: 'Elegir tabla',
    selectTables: 'Elegir tablas',
    questionCount: 'Cantidad de preguntas',
    startPractice: 'Comenzar práctica',
    startQuiz: 'Comenzar quiz',
    yourAnswer: 'Tu respuesta',
    submit: 'Enviar',
    next: 'Siguiente',
    showHint: 'Mostrar pista',
    hideHint: 'Ocultar pista',
    resetProgress: 'Reiniciar progreso',
    timeLeft: 'Tiempo restante',
    question: 'Pregunta',
    of: 'de'
  },
  feedback: {
    correct: '¡Correcto!',
    incorrect: 'Incorrecto',
    wellDone: '¡Muy bien!',
    keepPracticing: '¡Seguí practicando!',
    excellent: '¡Excelente!',
    goodJob: '¡Buen trabajo!',
    almostThere: '¡Casi!',
    perfectScore: '¡Puntaje perfecto!'
  },
  hints: {
    addition: 'Podés pensarlo como sumas repetidas',
    counting: 'Contá de a {factor1} hasta llegar a {factor1} × {factor2}',
    pattern: 'Buscá el patrón en la tabla del {factor1}'
  },
  progress: {
    accuracy: 'Precisión',
    streak: 'Racha actual',
    bestStreak: 'Mejor racha',
    attempts: 'Intentos',
    correct: 'Correctas',
    lastPlayed: 'Última vez'
  },
  badges: {
    firstTry: 'Primera vez',
    perfect: 'Perfecto',
    streak5: 'Racha de 5',
    streak10: 'Racha de 10',
    allTables: 'Todas las tablas'
  }
};

export const createI18n = (override: Partial<I18nStrings> = {}): I18nStrings => {
  return {
    modes: { ...defaultI18n.modes, ...override.modes },
    labels: { ...defaultI18n.labels, ...override.labels },
    feedback: { ...defaultI18n.feedback, ...override.feedback },
    hints: { ...defaultI18n.hints, ...override.hints },
    progress: { ...defaultI18n.progress, ...override.progress },
    badges: { ...defaultI18n.badges, ...override.badges }
  };
};

export const formatHint = (template: string, factor1: number, factor2: number): string => {
  return template
    .replace(/{factor1}/g, factor1.toString())
    .replace(/{factor2}/g, factor2.toString());
};
