// components/learning/ui/QuizResults.tsx
'use client';

import { Panel} from './Panel';
import { StatCard } from './StatCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Clock, Zap, RotateCcw, ArrowRight } from 'lucide-react';
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
              .map((question) => (
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

