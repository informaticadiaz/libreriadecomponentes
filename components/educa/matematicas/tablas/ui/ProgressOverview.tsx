// components/learning/ui/ProgressOverview.tsx
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Panel } from './Panel';
import { StatCard } from './StatCard';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    return progress.tables[table.toString()] || {
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

  // Debug logging
  console.log('ProgressOverview - Progreso recibido:', progress);
  console.log('ProgressOverview - ¿Hay progreso?:', hasAnyProgress);
  console.log('ProgressOverview - Tablas disponibles:', Object.keys(progress.tables || {}));

  if (!hasAnyProgress) {
    return (
      <Panel variant="playful" title="Tu progreso">
        <div className="text-center py-8 text-sky-700">
          <div className="text-4xl mb-3">📊</div>
          <p className="font-semibold">Aún no hay datos de progreso.</p>
          <p className="text-sm mt-1 opacity-80">¡Empezá a practicar para ver tus estadísticas!</p>
          
          {/* Debug info en modo desarrollo */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer">Debug: Datos de progreso</summary>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                {JSON.stringify(progress, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen general */}
      <Panel variant="playful" title="Resumen general">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Precisión total"
            value={`${progress.overallAccuracy.toFixed(1)}%`}
            color={progress.overallAccuracy >= 80 ? 'green' : progress.overallAccuracy >= 60 ? 'blue' : 'yellow'}
          />
          <StatCard
            label="Total correctas"
            value={progress.totalCorrect}
            color="teal"
          />
          <StatCard
            label="Total intentos"
            value={progress.totalAttempts}
            color="amber"
          />
          <StatCard
            label="Última actualización"
            value={format(progress.lastUpdated, 'dd/MM', { locale: es })}
            color="pink"
          />
        </div>
      </Panel>

      {/* Progreso por tabla */}
      <Panel variant="playful" title="Progreso por tabla">
        <div className="space-y-3">
          {tableNumbers.map(table => {
            const tableProgress = getTableProgress(table);
            const hasData = tableProgress.totalAttempts > 0;

            return (
              <div
                key={table}
                className={cn(
                  'p-4 border rounded-2xl shadow-sm transition-transform duration-200 hover:-translate-y-0.5',
                  hasData ? 'bg-white/80 border-sky-100' : 'bg-sky-50/80 border-sky-100'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sky-900">
                    Tabla del {table}
                  </h4>
                  {hasData && (
                    <Badge
                      variant={tableProgress.accuracy >= 80 ? 'default' : 'secondary'}
                      className="ml-2 bg-white/80 text-sky-800 border border-sky-200"
                    >
                      {tableProgress.accuracy.toFixed(0)}%
                    </Badge>
                  )}
                </div>

                {hasData ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-sky-700">{i18n.progress.correct}: </span>
                      <span className="font-medium">{tableProgress.correctAnswers}</span>
                    </div>
                    <div>
                      <span className="text-sky-700">{i18n.progress.attempts}: </span>
                      <span className="font-medium">{tableProgress.totalAttempts}</span>
                    </div>
                    <div>
                      <span className="text-sky-700">{i18n.progress.bestStreak}: </span>
                      <span className="font-medium">{tableProgress.bestStreak}</span>
                    </div>
                    <div>
                      <span className="text-sky-700">{i18n.progress.lastPlayed}: </span>
                      <span className="font-medium text-sky-900">
                        {format(tableProgress.lastPlayedAt, 'dd/MM', { locale: es })}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-sky-600">Sin datos aún</p>
                )}

                {hasData && tableProgress.badges.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {tableProgress.badges.map(badge => (
                      <Badge key={badge} variant="outline" className="text-xs bg-white/80 border-sky-200 text-sky-800">
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