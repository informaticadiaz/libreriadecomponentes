# QuizResults

```tsx
// components/learning/ui/QuizResults.tsx
'use client';

import { Panel, StatCard } from './Panel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Clock, Zap, RotateCcw, ArrowRight } from 'lucide-react';
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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Mensaje motivacional */}
      <Panel className="text-center">
        <div className="space-y-3">
          <div className="text-4xl">
            {accuracy === 100 ? '🏆' : accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👏' : '💪'}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {getMotivationalMessage()}
          </h2>
          <p className="text-gray-600">
            Respondiste {correctCount} de {totalCount} preguntas correctamente
          </p>
        </div>
      </Panel>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label={i18n.accuracy}
          value={`${accuracy.toFixed(1)}%`}
          icon={<Target className="h-6 w-6" />}
          color={getAccuracyColor()}
        />
        <StatCard
          label="Mejor racha"
          value={bestStreak}
          icon={<Zap className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          label="Tiempo total"
          value={formatTime(totalTime)}
          icon={<Clock className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          label="Promedio por pregunta"
          value={formatTime(totalTime / totalCount)}
          icon={<Clock className="h-6 w-6" />}
          color="blue"
        />
      </div>

      {/* Progreso visual */}
      <Panel title="Tu progreso">
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Respuestas correctas</span>
            <span>{correctCount}/{totalCount}</span>
          </div>
          <Progress value={(correctCount / totalCount) * 100} className="h-3" />
        </div>
      </Panel>

      {/* Desglose por tabla */}
      <Panel title="Desglose por tabla">
        <div className="space-y-3">
          {result.tablesUsed.map(table => {
            const tableQuestions = result.questions.filter(q => 
              q.factor1 === table || q.factor2 === table
            );
            const tableCorrect = tableQuestions.filter(q => q.isCorrect).length;
            const tableTotal = tableQuestions.length;
            const tableAccuracy = tableTotal > 0 ? (tableCorrect / tableTotal) * 100 : 0;

            return (
              <div key={table} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="font-semibold">
                    Tabla del {table}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {tableCorrect}/{tableTotal}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${
                    tableAccuracy >= 80 ? 'text-green-600' : 
                    tableAccuracy >= 60 ? 'text-blue-600' : 
                    'text-yellow-600'
                  }`}>
                    {tableAccuracy.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Revisión de respuestas incorrectas */}
      {result.questions.some(q => !q.isCorrect) && (
        <Panel title="Respuestas para revisar">
          <div className="space-y-2">
            {result.questions
              .filter(q => !q.isCorrect)
              .map((question, index) => (
                <div key={question.id} className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded">
                  <span className="text-sm">
                    {question.factor1} × {question.factor2} = {question.answer}
                  </span>
                  <div className="text-xs text-red-600">
                    Tu respuesta: {question.userAnswer}
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
          className="flex-1"
          size="lg"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Practicar de nuevo
        </Button>
        <Button
          onClick={onBackToMenu}
          className="flex-1"
          size="lg"
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          Volver al menú
        </Button>
      </div>
    </div>
  );
};

// components/learning/ui/ProgressOverview.tsx
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import type { ProgressSnapshot } from '../types';

interface ProgressOverviewProps {
  progress: ProgressSnapshot;
  minTable: number;
  maxTable: number;
  onResetProgress: () => void;
  i18n: {
    progress: {
      accuracy: string;
      streak: string;
      bestStreak: string;
      attempts: string;
      correct: string;
      lastPlayed: string;
    };
    resetProgress: string;
  };
}

export const ProgressOverview = ({
  progress,
  minTable,
  maxTable,
  onResetProgress,
  i18n
}: ProgressOverviewProps) => {
  const tableNumbers = Array.from(
    { length: maxTable - minTable + 1 }, 
    (_, i) => minTable + i
  );

  const getTableProgress = (table: number) => {
    return progress[table.toString()] || {
      table,
      correctAnswers: 0,
      totalAttempts: 0,
      accuracy: 0,
      streak: 0,
      bestStreak: 0,
      lastPlayedAt: new Date(),
      badges: []
    };
  };

  const hasAnyProgress = progress.totalAttempts > 0;

  if (!hasAnyProgress) {
    return (
      <Panel title="Tu progreso">
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-3">📊</div>
          <p>Aún no hay datos de progreso.</p>
          <p className="text-sm mt-1">¡Empezá a practicar para ver tus estadísticas!</p>
        </div>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen general */}
      <Panel title="Resumen general">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Precisión total"
            value={`${progress.overallAccuracy.toFixed(1)}%`}
            color={progress.overallAccuracy >= 80 ? 'green' : progress.overallAccuracy >= 60 ? 'blue' : 'yellow'}
          />
          <StatCard
            label="Total correctas"
            value={progress.totalCorrect}
            color="green"
          />
          <StatCard
            label="Total intentos"
            value={progress.totalAttempts}
            color="blue"
          />
          <StatCard
            label="Última actualización"
            value={format(progress.lastUpdated, 'dd/MM', { locale: es })}
            color="purple"
          />
        </div>
      </Panel>

      {/* Progreso por tabla */}
      <Panel title="Progreso por tabla">
        <div className="space-y-3">
          {tableNumbers.map(table => {
            const tableProgress = getTableProgress(table);
            const hasData = tableProgress.totalAttempts > 0;
            
            return (
              <div 
                key={table} 
                className={`p-4 border rounded-lg ${hasData ? 'bg-white' : 'bg-gray-50'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">
                    Tabla del {table}
                  </h4>
                  {hasData && (
                    <Badge 
                      variant={tableProgress.accuracy >= 80 ? 'default' : 'secondary'}
                      className="ml-2"
                    >
                      {tableProgress.accuracy.toFixed(0)}%
                    </Badge>
                  )}
                </div>
                
                {hasData ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">{i18n.progress.correct}: </span>
                      <span className="font-medium">{tableProgress.correctAnswers}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">{i18n.progress.attempts}: </span>
                      <span className="font-medium">{tableProgress.totalAttempts}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">{i18n.progress.bestStreak}: </span>
                      <span className="font-medium">{tableProgress.bestStreak}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">{i18n.progress.lastPlayed}: </span>
                      <span className="font-medium">
                        {format(tableProgress.lastPlayedAt, 'dd/MM', { locale: es })}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Sin datos aún</p>
                )}
                
                {hasData && tableProgress.badges.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {tableProgress.badges.map(badge => (
                      <Badge key={badge} variant="outline" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Reset progress */}
      <div className="flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              {i18n.resetProgress}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Reiniciar progreso?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará todos tus datos de progreso y no se puede deshacer. 
                ¿Estás seguro de que querés continuar?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={onResetProgress} className="bg-red-600 hover:bg-red-700">
                Sí, reiniciar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
```