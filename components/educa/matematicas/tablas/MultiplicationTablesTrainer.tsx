// components/learning/MultiplicationTablesTrainer.tsx
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types and utilities
import type { TablesTrainerProps, Mode } from './types';
import { createI18n } from './i18n';
import { useTrainerState } from './hooks/useTrainerState';

// UI Components
import { Panel } from './ui/Panel';
import { TableExplorer } from './ui/TableExplorer';
import { PracticeSettingsComponent } from './ui/PracticeSettings';
import { QuestionCard } from './ui/QuestionCard';
import { QuizResults } from './ui/QuizResults';
import { ProgressOverview } from './ui/ProgressOverview';

export const MultiplicationTablesTrainer = (props: TablesTrainerProps) => {
  const {
    minTable = 1,
    maxTable = 12,
    enableTimer = true,
    i18n: i18nOverride,
    className
  } = props;

  const i18n = createI18n(i18nOverride);
  const {
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
    resetProgress,
    isQuestionAnswered,
    isLastQuestion,
    canSubmit
  } = useTrainerState(props);

  const [currentView, setCurrentView] = useState<'menu' | 'active' | 'results'>('menu');

  // Manejar el cambio de modo
  const handleModeChange = (mode: Mode) => {
    setMode(mode);
    setCurrentView('menu');
    stopTimer();
    resetTimer();
  };

  // Iniciar práctica o quiz
  const handleStart = () => {
    generateQuestions();
    setCurrentView('active');
    if (enableTimer && state.mode === 'quiz') {
      startTimer();
    }
  };

  // Manejar envío de respuesta
  const handleSubmitAnswer = (answer: number) => {
    submitAnswer(answer);
  };

  // Manejar siguiente pregunta
  const handleNextQuestion = () => {
    const wasLastQuestion = isLastQuestion;

    nextQuestion();

    if (!wasLastQuestion) {
      return;
    }

    if (state.mode === 'quiz') {
      setCurrentView('results');
      stopTimer();
      return;
    }

    setCurrentView('menu');
  };

  // Volver al menú
  const handleBackToMenu = () => {
    setCurrentView('menu');
    stopTimer();
    resetTimer();
  };

  // Reiniciar práctica/quiz
  const handleRestart = () => {
    generateQuestions();
    setCurrentView('active');
    resetTimer();
    if (enableTimer && state.mode === 'quiz') {
      startTimer();
    }
  };

  // Formatear tiempo
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500">Cargando entrenador...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative mx-auto max-w-5xl overflow-hidden rounded-[40px] bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100 p-6',
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -left-12 h-40 w-40 rounded-full bg-white/60 opacity-40 blur-3xl"
      ></div>
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -right-16 h-48 w-48 rounded-full bg-pink-200/70 opacity-50 blur-3xl"
      ></div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-1/3 left-10 hidden h-16 w-16 rotate-12 items-center justify-center rounded-full bg-sky-200/60 text-4xl text-sky-500/80 opacity-40 shadow-inner backdrop-blur-sm sm:flex"
      >
        ✶
      </div>
      <div className="relative z-10 mx-auto max-w-4xl rounded-[32px] border-4 border-white/60 bg-white/70 md:p-8 shadow-xl backdrop-blur">
        {/* Header con navegación */}
        <div className="mb-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span aria-hidden className="text-5xl sm:text-6xl">🌟</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-700/70">
                  Matemáticas divertidas
                </p>
                <h1 className="font-display text-3xl tracking-wide text-sky-950 sm:text-4xl md:text-5xl">
                  Entrenador de Tablas de Multiplicar
                </h1>
              </div>
            </div>

            {currentView !== 'menu' && (
              <Button
                variant="default"
                onClick={handleBackToMenu}
                className="flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-2 text-sm font-semibold text-sky-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Volver</span>
              </Button>
            )}
          </div>

          {/* Progreso durante práctica/quiz */}
          {currentView === 'active' && state.questions.length > 0 && (
            <Panel className="mb-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    {i18n.labels.question} {state.questionIndex + 1} {i18n.labels.of} {state.questions.length}
                  </span>
                  <div className="flex items-center space-x-4">
                    {state.streak > 0 && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        🔥 Racha: {state.streak}
                      </Badge>
                    )}
                    {enableTimer && state.mode === 'quiz' && (
                      <div className="flex items-center space-x-2">
                        <span>{formatTime(state.timer)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={state.isTimerActive ? stopTimer : startTimer}
                        >
                          {state.isTimerActive ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <Progress
                  value={((state.questionIndex + (isQuestionAnswered ? 1 : 0)) / state.questions.length) * 100}
                  className="h-2"
                />
              </div>
            </Panel>
          )}
        </div>

        {/* Contenido principal */}
        {currentView === 'menu' && (
          <Tabs value={state.mode} onValueChange={(value) => handleModeChange(value as Mode)}>
            <TabsList className="flex flex-wrap items-center justify-center gap-3 rounded-full bg-white/40 p-2 shadow-inner backdrop-blur-sm">
              <TabsTrigger
                value="explore"
                className="rounded-full bg-sky-200/70 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-sky-900/70 transition-all hover:-translate-y-0.5 hover:bg-sky-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 data-[state=active]:bg-white data-[state=active]:text-sky-950 data-[state=active]:shadow-lg"
              >
                {i18n.modes.explore}
              </TabsTrigger>
              <TabsTrigger
                value="practice"
                className="rounded-full bg-emerald-200/70 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-900/70 transition-all hover:-translate-y-0.5 hover:bg-emerald-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 data-[state=active]:bg-white data-[state=active]:text-emerald-900 data-[state=active]:shadow-lg"
              >
                {i18n.modes.practice}
              </TabsTrigger>
              <TabsTrigger
                value="quiz"
                className="rounded-full bg-orange-200/70 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-orange-900/70 transition-all hover:-translate-y-0.5 hover:bg-orange-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 data-[state=active]:bg-white data-[state=active]:text-orange-900 data-[state=active]:shadow-lg"
              >
                {i18n.modes.quiz}
              </TabsTrigger>
              <TabsTrigger
                value="progress"
                className="rounded-full bg-purple-200/70 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-purple-900/70 transition-all hover:-translate-y-0.5 hover:bg-purple-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 data-[state=active]:bg-white data-[state=active]:text-purple-900 data-[state=active]:shadow-lg"
              >
                Progreso
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <TabsContent value="explore" className="space-y-6">
                <TableExplorer
                  selectedTable={state.selectedTable || minTable}
                  minTable={minTable}
                  maxTable={maxTable}
                  onTableSelect={setSelectedTable}
                  i18n={{
                    selectTable: i18n.labels.selectTable
                  }}
                />
              </TabsContent>

              <TabsContent value="practice">
                <PracticeSettingsComponent
                  settings={state.practiceSettings}
                  onSettingsChange={updatePracticeSettings}
                  minTable={minTable}
                  maxTable={maxTable}
                  onStart={handleStart}
                  i18n={{
                    selectTables: i18n.labels.selectTables,
                    questionCount: i18n.labels.questionCount,
                    startPractice: i18n.labels.startPractice,
                    startQuiz: i18n.labels.startQuiz
                  }}
                  mode="practice"
                />
              </TabsContent>

              <TabsContent value="quiz">
                <PracticeSettingsComponent
                  settings={state.practiceSettings}
                  onSettingsChange={updatePracticeSettings}
                  minTable={minTable}
                  maxTable={maxTable}
                  onStart={handleStart}
                  i18n={{
                    selectTables: i18n.labels.selectTables,
                    questionCount: i18n.labels.questionCount,
                    startPractice: i18n.labels.startPractice,
                    startQuiz: i18n.labels.startQuiz
                  }}
                  mode="quiz"
                />
              </TabsContent>

              <TabsContent value="progress">
                <ProgressOverview
                  progress={progress}
                  minTable={minTable}
                  maxTable={maxTable}
                  onResetProgress={resetProgress}
                  i18n={{
                    progress: i18n.progress,
                    resetProgress: i18n.labels.resetProgress
                  }}
                />
              </TabsContent>
            </div>
          </Tabs>
        )}

      {currentView === 'active' && state.currentQuestion && (
        <div className="space-y-6">
          <QuestionCard
            question={state.currentQuestion}
            showHint={state.showHint}
            onToggleHint={toggleHint}
            onSubmit={handleSubmitAnswer}
            onNext={handleNextQuestion}
            isAnswered={isQuestionAnswered}
            canSubmit={canSubmit}
            i18n={{
              yourAnswer: i18n.labels.yourAnswer,
              submit: i18n.labels.submit,
              next: i18n.labels.next,
              showHint: i18n.labels.showHint,
              hideHint: i18n.labels.hideHint,
              correct: i18n.feedback.correct,
              incorrect: i18n.feedback.incorrect,
              hints: {
                addition: i18n.hints.addition,
                counting: i18n.hints.counting
              }
            }}
          />

          {/* Información adicional durante la práctica */}
          {state.mode === 'practice' && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handleBackToMenu}
                size="sm"
              >
                Terminar práctica
              </Button>
            </div>
          )}
        </div>
      )}

      {currentView === 'results' && (() => {
        const result = getCurrentResult();
        return result ? (
          <QuizResults
            result={result}
            onRestart={handleRestart}
            onBackToMenu={handleBackToMenu}
            i18n={{
              excellent: i18n.feedback.excellent,
              goodJob: i18n.feedback.goodJob,
              keepPracticing: i18n.feedback.keepPracticing,
              perfectScore: i18n.feedback.perfectScore,
              accuracy: i18n.progress.accuracy,
              streak: i18n.progress.streak,
              question: i18n.labels.question,
              of: i18n.labels.of,
              correct: i18n.feedback.correct,
              incorrect: i18n.feedback.incorrect
            }}
          />
        ) : (
          <Panel className="text-center">
            <p className="text-gray-500">No hay resultados disponibles.</p>
            <Button onClick={handleBackToMenu} className="mt-4">
              Volver al menú
            </Button>
          </Panel>
        );
      })()}

        {/* Footer con información de accesibilidad */}
        <div className="mt-12 border-t border-white/60 pt-6">
          <div className="text-center text-xs text-gray-500">
            <p>Navega con Tab • Envía con Enter • Guarda progreso automáticamente</p>
          </div>

          {/* Debug info - remover en producción */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 rounded-lg bg-gray-100 p-4 text-xs">
              <details>
                <summary className="cursor-pointer font-medium">Debug Info</summary>
                <div className="mt-2 space-y-2">
                  <div><strong>Progreso cargado:</strong> {JSON.stringify(progress, null, 2)}</div>
                  <div><strong>Estado actual:</strong> Modo {state.mode}, Vista {currentView}</div>
                  <div><strong>Preguntas:</strong> {state.questions.length} preguntas generadas</div>
                  <div><strong>localStorage disponible:</strong> {typeof window !== 'undefined' && window.localStorage ? 'Sí' : 'No'}</div>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}
                    >
                      Limpiar localStorage y recargar
                    </Button>
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export por defecto
export default MultiplicationTablesTrainer;

// Export de tipos para reutilización
export type { TablesTrainerProps, Mode, Question, ProgressSnapshot, QuizResult } from './types';