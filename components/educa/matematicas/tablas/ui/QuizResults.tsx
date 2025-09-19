// components/learning/ui/QuizResults.tsx
'use client';

import { Panel} from './Panel';
import { StatCard } from './StatCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Clock, Zap, RotateCcw, ArrowRight, Stars, Sparkles, Trophy } from 'lucide-react';
import type { QuizResult } from '../types';

interface QuizResultsProps {
  result: QuizResult;
  onRestart: () => void;
  onBackToMenu: () => void;
  i18n: {
    excellent: string;
    goodJob: string;
    keepPracticing: string;
    perfectScore: string;
    accuracy: string;
    streak: string;
    question: string;
    of: string;
    correct: string;
    incorrect: string;
  };
}

export const QuizResults = ({
  result,
  onRestart,
  onBackToMenu,
  i18n
}: QuizResultsProps) => {
  const { correctCount, totalCount, accuracy, totalTime, bestStreak } = result;
  
  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const getMotivationalMessage = (): string => {
    if (accuracy === 100) return i18n.perfectScore;
    if (accuracy >= 80) return i18n.excellent;
    if (accuracy >= 60) return i18n.goodJob;
    return i18n.keepPracticing;
  };

  const getAccuracyColor = (): 'green' | 'blue' | 'yellow' | 'red' => {
    if (accuracy >= 90) return 'green';
    if (accuracy >= 70) return 'blue';
    if (accuracy >= 50) return 'yellow';
    return 'red';
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Mensaje motivacional */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-fuchsia-200 via-rose-100 to-amber-100 p-8 shadow-2xl dark:from-fuchsia-900/80 dark:via-rose-900/70 dark:to-amber-900/60">
        <span className="absolute -top-6 left-8 text-rose-300/70 dark:text-rose-500/60">
          <Stars className="h-16 w-16 animate-pulse" />
        </span>
        <span className="absolute top-6 right-6 text-amber-300/70 dark:text-amber-400/60">
          <Sparkles className="h-10 w-10 animate-bounce" />
        </span>
        <span className="absolute bottom-4 left-1/3 text-fuchsia-300/70 dark:text-fuchsia-500/60">
          <Sparkles className="h-8 w-8 animate-pulse delay-200" />
        </span>
        <div className="relative z-10 flex flex-col gap-3 text-rose-900 dark:text-rose-50">
          <div className="flex items-center gap-3 text-4xl font-black">
            <Trophy className="h-10 w-10 text-amber-500 drop-shadow" />
            {getMotivationalMessage()}
          </div>
          <p className="max-w-xl text-lg text-rose-700/90 dark:text-rose-100/90">
            Respondiste <strong>{correctCount}</strong> de <strong>{totalCount}</strong> preguntas correctamente. ¡Seguí brillando!
          </p>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label={i18n.accuracy}
          value={`${accuracy.toFixed(1)}%`}
          icon={<Target className="h-6 w-6" />}
          color={getAccuracyColor()}
          className="rounded-3xl border-0 bg-white/85 p-6 text-slate-800 shadow-xl backdrop-blur dark:bg-slate-900/70 dark:text-slate-100"
        />
        <StatCard
          label="Mejor racha"
          value={bestStreak}
          icon={<Zap className="h-6 w-6" />}
          color="purple"
          className="rounded-3xl border-0 bg-white/85 p-6 text-slate-800 shadow-xl backdrop-blur dark:bg-slate-900/70 dark:text-slate-100"
        />
        <StatCard
          label="Tiempo total"
          value={formatTime(totalTime)}
          icon={<Clock className="h-6 w-6" />}
          color="blue"
          className="rounded-3xl border-0 bg-white/85 p-6 text-slate-800 shadow-xl backdrop-blur dark:bg-slate-900/70 dark:text-slate-100"
        />
        <StatCard
          label="Promedio por pregunta"
          value={formatTime(totalTime / totalCount)}
          icon={<Clock className="h-6 w-6" />}
          color="blue"
          className="rounded-3xl border-0 bg-white/85 p-6 text-slate-800 shadow-xl backdrop-blur dark:bg-slate-900/70 dark:text-slate-100"
        />
      </div>

      {/* Progreso visual */}
      <Panel
        title="Tu progreso"
        className="rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur dark:bg-slate-900/70"
      >
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
            <span>Respuestas correctas</span>
            <span>{correctCount}/{totalCount}</span>
          </div>
          <Progress
            value={(correctCount / totalCount) * 100}
            className="h-4 overflow-hidden bg-white/60 dark:bg-slate-800/80"
          />
        </div>
      </Panel>

      {/* Desglose por tabla */}
      <Panel
        title="Desglose por tabla"
        className="rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur dark:bg-slate-900/70"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {result.tablesUsed.map(table => {
            const tableQuestions = result.questions.filter(q =>
              q.factor1 === table || q.factor2 === table
            );
            const tableCorrect = tableQuestions.filter(q => q.isCorrect).length;
            const tableTotal = tableQuestions.length;
            const tableAccuracy = tableTotal > 0 ? (tableCorrect / tableTotal) * 100 : 0;

            return (
              <div
                key={table}
                className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-lg ring-1 ring-white/60 transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-950/60 dark:ring-slate-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-200 to-amber-200 text-rose-700 shadow-inner dark:from-rose-500/50 dark:to-amber-500/40 dark:text-rose-100">
                      <Sparkles className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Tabla del {table}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-300">{tableCorrect} de {tableTotal} correctas</p>
                    </div>
                  </div>
                  <Badge className="rounded-full border-0 bg-indigo-500/90 px-3 py-1 text-sm font-semibold text-white shadow-sm">
                    {tableAccuracy.toFixed(0)}%
                  </Badge>
                </div>
                <div className="h-3 w-full rounded-full bg-indigo-100/80 dark:bg-indigo-900/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 transition-all dark:from-indigo-500 dark:via-sky-500 dark:to-emerald-500"
                    style={{ width: `${tableAccuracy}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Revisión de respuestas incorrectas */}
      {result.questions.some(q => !q.isCorrect) && (
        <Panel
          title="Respuestas para revisar"
          className="rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur dark:bg-slate-900/70"
        >
          <div className="grid gap-3">
            {result.questions
              .filter(q => !q.isCorrect)
              .map((question) => (
                <div
                  key={question.id}
                  className="flex items-start gap-4 rounded-3xl bg-rose-100/90 p-4 text-rose-800 shadow-md transition hover:-translate-y-0.5 dark:bg-rose-900/60 dark:text-rose-100"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-rose-400 shadow-inner dark:bg-rose-900/50 dark:text-rose-200">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold">
                      {question.factor1} × {question.factor2} = {question.answer}
                    </p>
                    <p className="text-xs text-rose-500 dark:text-rose-200">
                      Tu respuesta: {question.userAnswer}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Panel>
      )}

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onRestart}
          variant="outline"
          className="flex-1 rounded-2xl border-2 border-rose-200 bg-white/80 text-rose-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 dark:border-rose-500/40 dark:bg-slate-900/60 dark:text-rose-200"
          size="lg"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Practicar de nuevo
        </Button>
        <Button
          onClick={onBackToMenu}
          className="flex-1 rounded-2xl bg-rose-500 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-rose-500/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-200"
          size="lg"
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          Volver al menú
        </Button>
      </div>
    </div>
  );
};

