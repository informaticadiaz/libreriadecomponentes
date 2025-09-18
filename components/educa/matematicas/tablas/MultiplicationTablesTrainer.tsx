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
    <div className={cn("max-w-4xl mx-auto p-4", className)}>
      {/* Header con navegación */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            🔢 Entrenador de Tablas de Multiplicar
          </h1>
          
          {currentView !== 'menu' && (
            <Button
              variant="outline"
              onClick={handleBackToMenu}
              className="flex items-center space-x-2"
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="explore">{i18n.modes.explore}</TabsTrigger>
            <TabsTrigger value="practice">{i18n.modes.practice}</TabsTrigger>
            <TabsTrigger value="quiz">{i18n.modes.quiz}</TabsTrigger>
            <TabsTrigger value="progress">Progreso</TabsTrigger>
          </TabsList>

          <div className="mt-6">
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
      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="text-center text-xs text-gray-500">
          <p>Navega con Tab • Envía con Enter • Guarda progreso automáticamente</p>
        </div>
        
        {/* Debug info - remover en producción */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs">
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
  );
};

// Export por defecto
export default MultiplicationTablesTrainer;

// Export de tipos para reutilización
export type { TablesTrainerProps, Mode, Question, ProgressSnapshot, QuizResult } from './types';