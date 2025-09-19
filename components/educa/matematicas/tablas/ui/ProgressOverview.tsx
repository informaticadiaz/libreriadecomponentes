// components/learning/ui/ProgressOverview.tsx
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Panel } from './Panel';
import { StatCard } from './StatCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Sparkles, BarChart3, Crown, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
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

  if (!hasAnyProgress) {
    return (
      <Panel className="rounded-3xl border-0 bg-gradient-to-br from-sky-100 via-white to-emerald-100 p-10 text-center shadow-xl dark:from-slate-900 dark:via-slate-950 dark:to-emerald-950">
        <div className="flex flex-col items-center gap-4 text-slate-700 dark:text-slate-200">
          <Sparkles className="h-12 w-12 text-emerald-500" />
          <p className="text-xl font-semibold">Aún no hay datos de progreso.</p>
          <p className="max-w-md text-sm text-slate-600 dark:text-slate-300">
            Comenzá una práctica para desbloquear estadísticas y medallas.
          </p>
        </div>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen general */}
      <Panel
        title="Resumen general"
        className="rounded-3xl border-0 bg-gradient-to-br from-sky-100 via-white to-emerald-100 shadow-xl dark:from-slate-900 dark:via-slate-950 dark:to-emerald-950"
      >
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Precisión total"
            value={`${progress.overallAccuracy.toFixed(1)}%`}
            color={progress.overallAccuracy >= 80 ? 'green' : progress.overallAccuracy >= 60 ? 'blue' : 'yellow'}
            icon={<Target className="h-6 w-6" />}
            className="rounded-3xl border-0 bg-white/80 p-6 text-slate-800 shadow-lg backdrop-blur dark:bg-slate-900/70 dark:text-slate-100"
          />
          <StatCard
            label="Total correctas"
            value={progress.totalCorrect}
            color="green"
            icon={<Sparkles className="h-6 w-6" />}
            className="rounded-3xl border-0 bg-white/80 p-6 text-slate-800 shadow-lg backdrop-blur dark:bg-slate-900/70 dark:text-slate-100"
          />
          <StatCard
            label="Total intentos"
            value={progress.totalAttempts}
            color="blue"
            icon={<BarChart3 className="h-6 w-6" />}
            className="rounded-3xl border-0 bg-white/80 p-6 text-slate-800 shadow-lg backdrop-blur dark:bg-slate-900/70 dark:text-slate-100"
          />
          <StatCard
            label="Última actualización"
            value={format(progress.lastUpdated, 'dd/MM', { locale: es })}
            color="purple"
            icon={<Crown className="h-6 w-6" />}
            className="rounded-3xl border-0 bg-white/80 p-6 text-slate-800 shadow-lg backdrop-blur dark:bg-slate-900/70 dark:text-slate-100"
          />
        </div>
      </Panel>

      {/* Progreso por tabla */}
      <Panel
        title="Progreso por tabla"
        className="rounded-3xl border-0 bg-white/90 shadow-xl backdrop-blur dark:bg-slate-950/60"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {tableNumbers.map(table => {
            const tableProgress = getTableProgress(table);
            const hasData = tableProgress.totalAttempts > 0;

            return (
              <div
                key={table}
                className={cn(
                  'relative overflow-hidden rounded-3xl p-5 text-slate-800 shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:text-slate-100',
                  hasData
                    ? 'bg-gradient-to-r from-sky-200/80 via-emerald-200/70 to-emerald-100/70 dark:from-sky-900/40 dark:via-emerald-900/40 dark:to-emerald-900/30'
                    : 'bg-gradient-to-r from-slate-100/80 to-slate-200/70 dark:from-slate-900/50 dark:to-slate-800/60'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-sky-500 shadow-inner dark:bg-slate-900/60 dark:text-sky-300">
                      <Sparkles className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h4 className="text-lg font-semibold">Tabla del {table}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {hasData ? `${tableProgress.correctAnswers} aciertos de ${tableProgress.totalAttempts} intentos` : 'Sin datos aún'}
                      </p>
                    </div>
                  </div>
                  {hasData && (
                    <Badge className="rounded-full border-0 bg-emerald-500/90 px-3 py-1 text-sm font-semibold text-white shadow-sm">
                      {tableProgress.accuracy.toFixed(0)}%
                    </Badge>
                  )}
                </div>

                <div className="mt-4 space-y-4">
                  <div className="h-3 w-full overflow-hidden rounded-full bg-white/60 dark:bg-slate-900/60">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-500 transition-all"
                      style={{ width: `${hasData ? tableProgress.accuracy : 5}%` }}
                      aria-hidden="true"
                    />
                  </div>

                  {hasData ? (
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 shadow-sm dark:bg-slate-900/60">
                        <Sparkles className="h-3.5 w-3.5" /> {i18n.progress.correct}: {tableProgress.correctAnswers}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 shadow-sm dark:bg-slate-900/60">
                        <BarChart3 className="h-3.5 w-3.5" /> {i18n.progress.attempts}: {tableProgress.totalAttempts}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 shadow-sm dark:bg-slate-900/60">
                        <Crown className="h-3.5 w-3.5" /> {i18n.progress.bestStreak}: {tableProgress.bestStreak}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 shadow-sm dark:bg-slate-900/60">
                        <Target className="h-3.5 w-3.5" /> {i18n.progress.lastPlayed}: {format(tableProgress.lastPlayedAt, 'dd/MM', { locale: es })}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-300">Sin datos aún</p>
                  )}

                  {hasData && tableProgress.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tableProgress.badges.map(badge => (
                        <Badge
                          key={badge}
                          className="rounded-full border-0 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:bg-slate-900/60 dark:text-slate-100"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Reset progress */}
      <div className="flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-2 border-rose-200 bg-white/80 text-rose-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 dark:border-rose-500/40 dark:bg-slate-900/70 dark:text-rose-200"
            >
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