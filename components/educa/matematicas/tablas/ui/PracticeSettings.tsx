
// components/learning/ui/PracticeSettings.tsx
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PracticeSettings as PracticeSettingsType } from '../types';
import { Panel } from './Panel';
import { Button } from '@/components/ui/button';
import {
  Smile,
  Sparkles,
  Star,
  Sun,
  Rainbow,
  Heart,
  Flower2,
  PartyPopper,
  MoonStar,
  WandSparkles,
  Shuffle,
  Lightbulb,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PracticeSettingsProps {
  settings: PracticeSettingsType;
  onSettingsChange: (settings: Partial<PracticeSettingsType>) => void;
  minTable: number;
  maxTable: number;
  onStart: () => void;
  i18n: {
    selectTables: string;
    questionCount: string;
    startPractice: string;
    startQuiz: string;
  };
  mode: 'practice' | 'quiz';
}

export const PracticeSettingsComponent = ({
  settings,
  onSettingsChange,
  minTable,
  maxTable,
  onStart,
  i18n,
  mode
}: PracticeSettingsProps) => {
  const tableNumbers = Array.from(
    { length: maxTable - minTable + 1 },
    (_, i) => minTable + i
  );

  const tableIcons = [
    Smile,
    Sparkles,
    Star,
    Sun,
    Rainbow,
    Heart,
    Flower2,
    PartyPopper,
    MoonStar,
    WandSparkles
  ];

  const handleTableToggle = (table: number, checked: boolean) => {
    if (checked) {
      onSettingsChange({
        selectedTables: [...settings.selectedTables, table].sort((a, b) => a - b)
      });
    } else {
      onSettingsChange({
        selectedTables: settings.selectedTables.filter(t => t !== table)
      });
    }
  };

  const canStart = settings.selectedTables.length > 0 && settings.questionCount > 0;

  return (
    <Panel title={mode === 'practice' ? 'Configurar Práctica' : 'Configurar Quiz'}>
      <div className="space-y-6">
        {/* Selección de tablas */}
        <div>
          <Label className="text-base font-medium mb-3 block">
            {i18n.selectTables}
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {tableNumbers.map((table, index) => {
              const Icon = tableIcons[index % tableIcons.length];
              const isSelected = settings.selectedTables.includes(table);

              return (
                <label
                  key={table}
                  htmlFor={`table-${table}`}
                  className={cn(
                    'group relative flex items-center justify-between gap-3 rounded-full border border-transparent bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-pink-300 dark:bg-slate-900/60 dark:text-slate-100',
                    isSelected
                      ? 'ring-2 ring-offset-2 ring-pink-300 dark:ring-pink-400 dark:ring-offset-slate-950'
                      : 'ring-1 ring-white/60 dark:ring-white/10'
                  )}
                >
                  <Checkbox
                    id={`table-${table}`}
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      handleTableToggle(table, checked as boolean)
                    }
                    className="sr-only"
                  />
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 via-white to-sky-200 text-pink-600 shadow-inner dark:from-pink-500/60 dark:via-slate-900 dark:to-sky-500/60">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>Tabla del {table}</span>
                  </span>
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full bg-pink-200/80 text-pink-600 transition-opacity dark:bg-pink-500/40 dark:text-pink-100',
                      isSelected ? 'opacity-100' : 'opacity-0'
                    )}
                    aria-hidden="true"
                  >
                    <Check className="h-4 w-4" />
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Cantidad de preguntas */}
        <div>
          <Label htmlFor="question-count" className="text-base font-medium mb-3 block">
            {i18n.questionCount}
          </Label>
          <Select
            value={settings.questionCount.toString()}
            onValueChange={(value) => 
              onSettingsChange({ questionCount: parseInt(value, 10) })
            }
          >
            <SelectTrigger id="question-count" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 15, 20, 25, 30].map(count => (
                <SelectItem key={count} value={count.toString()}>
                  {count} preguntas
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Opciones adicionales */}
        <div className="flex flex-wrap gap-3">
          {[{
            id: 'random-order',
            label: 'Orden aleatorio',
            description: 'Mezcla las preguntas',
            checked: settings.randomOrder,
            onChange: (checked: boolean) => onSettingsChange({ randomOrder: checked }),
            Icon: Shuffle
          }, {
            id: 'show-hints',
            label: 'Permitir pistas',
            description: 'Activa ayudas visuales',
            checked: settings.showHints,
            onChange: (checked: boolean) => onSettingsChange({ showHints: checked }),
            Icon: Lightbulb
          }].map(option => (
            <label
              key={option.id}
              htmlFor={option.id}
              className={cn(
                'flex min-w-[220px] flex-1 cursor-pointer items-center justify-between gap-3 rounded-full border border-transparent bg-white/80 px-4 py-2 text-sm text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-pink-300 dark:bg-slate-900/60 dark:text-slate-100',
                option.checked
                  ? 'ring-2 ring-offset-2 ring-pink-300 dark:ring-pink-400 dark:ring-offset-slate-950'
                  : 'ring-1 ring-white/60 dark:ring-white/10'
              )}
            >
              <Checkbox
                id={option.id}
                checked={option.checked}
                onCheckedChange={(checked) => option.onChange(checked as boolean)}
                className="sr-only"
              />
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-white to-rose-200 text-amber-600 shadow-inner dark:from-amber-500/50 dark:via-slate-900 dark:to-rose-500/50">
                  <option.Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-left">
                  <span className="block font-semibold">{option.label}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-300">{option.description}</span>
                </span>
              </span>
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full bg-pink-200/80 text-pink-600 transition-opacity dark:bg-pink-500/40 dark:text-pink-100',
                  option.checked ? 'opacity-100' : 'opacity-0'
                )}
                aria-hidden="true"
              >
                <Check className="h-4 w-4" />
              </span>
            </label>
          ))}
        </div>

        {/* Resumen de selección */}
        {settings.selectedTables.length > 0 && (
          <div className="rounded-3xl border-0 bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 p-4 text-sm text-rose-700 shadow-inner dark:from-rose-900/40 dark:via-rose-900/30 dark:to-amber-900/30 dark:text-rose-100">
            <div className="font-semibold">
              Seleccionaste: Tablas del {settings.selectedTables.join(', ')}
            </div>
            <div className="text-xs text-rose-500 dark:text-rose-200">
              {settings.questionCount} preguntas preparadas
            </div>
          </div>
        )}

        {/* Botón de inicio */}
        <Button
          onClick={onStart}
          disabled={!canStart}
          className="w-full"
          size="lg"
        >
          {mode === 'practice' ? i18n.startPractice : i18n.startQuiz}
        </Button>
      </div>
    </Panel>
  );
};