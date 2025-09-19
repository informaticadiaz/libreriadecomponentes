
// components/learning/ui/TableExplorer.tsx
'use client';

import { useState } from 'react';
import { Panel } from './Panel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TableExplorerProps {
  selectedTable: number;
  minTable: number;
  maxTable: number;
  onTableSelect: (table: number) => void;
  i18n: {
    selectTable: string;
  };
}

export const TableExplorer = ({
  selectedTable,
  minTable,
  maxTable,
  onTableSelect,
  i18n
}: TableExplorerProps) => {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const tableNumbers = Array.from(
    { length: maxTable - minTable + 1 },
    (_, i) => minTable + i
  );

  const gradientPalettes = [
    'from-rose-200 via-rose-50 to-amber-100 dark:from-rose-900 dark:via-rose-800 dark:to-amber-900',
    'from-sky-200 via-white to-emerald-200 dark:from-sky-900 dark:via-slate-900 dark:to-emerald-900',
    'from-indigo-200 via-purple-100 to-sky-100 dark:from-indigo-900 dark:via-indigo-800 dark:to-sky-900',
    'from-amber-200 via-orange-100 to-pink-200 dark:from-amber-900 dark:via-orange-900 dark:to-pink-900',
    'from-emerald-200 via-teal-100 to-cyan-200 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900',
    'from-violet-200 via-fuchsia-100 to-rose-200 dark:from-violet-900 dark:via-fuchsia-900 dark:to-rose-900'
  ];

  return (
    <div className="space-y-6">
      {/* Selector de tabla */}
      <Panel
        title={i18n.selectTable}
        className="bg-gradient-to-br from-indigo-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950 border-0 shadow-xl"
      >
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-4 justify-items-center">
          {tableNumbers.map((num, index) => {
            const gradient = gradientPalettes[index % gradientPalettes.length];
            const isSelected = selectedTable === num;

            return (
              <Button
                key={num}
                variant="ghost"
                onClick={() => onTableSelect(num)}
                aria-pressed={isSelected}
                className={cn(
                  'h-20 w-20 rounded-full text-2xl font-bold text-slate-900 dark:text-white shadow-lg transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500 focus-visible:ring-0 focus-visible:border-transparent hover:bg-transparent',
                  'relative overflow-hidden bg-gradient-to-br backdrop-blur-sm',
                  gradient,
                  isSelected
                    ? 'ring-4 ring-indigo-300 dark:ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-950'
                    : 'ring-1 ring-white/60 dark:ring-white/10'
                )}
              >
                <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]">{num}</span>
              </Button>
            );
          })}
        </div>
      </Panel>

      {/* Tabla de multiplicar */}
      <Panel
        title={`Tabla del ${selectedTable}`}
        className="bg-white/80 dark:bg-slate-900/60 border-0 shadow-lg backdrop-blur"
      >
        <div className="space-y-3">
          {Array.from({ length: 12 }, (_, i) => i + 1).map(multiplier => {
            const result = selectedTable * multiplier;
            const cellKey = `${selectedTable}x${multiplier}`;
            const isHovered = hoveredCell === cellKey;

            return (
              <div
                key={cellKey}
                className={cn(
                  'flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer bg-white/90 dark:bg-slate-900/70 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400',
                  isHovered
                    ? 'border-indigo-200/70 bg-indigo-50/80 dark:border-indigo-500/40 dark:bg-indigo-950/60 shadow-md'
                    : 'border-indigo-100/60 dark:border-slate-700/70 hover:border-indigo-200 hover:bg-indigo-50/60 dark:hover:bg-slate-800/70'
                )}
                onMouseEnter={() => setHoveredCell(cellKey)}
                onMouseLeave={() => setHoveredCell(null)}
                role="button"
                tabIndex={0}
                onFocus={() => setHoveredCell(cellKey)}
                onBlur={() => setHoveredCell(null)}
                aria-label={`${selectedTable} por ${multiplier} igual ${result}`}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setHoveredCell(cellKey);
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    {selectedTable} × {multiplier}
                  </span>
                  <span className="text-lg text-slate-500 dark:text-slate-300">=</span>
                </div>

                <Badge
                  variant={isHovered ? "default" : "secondary"}
                  className={cn(
                    'text-lg font-bold px-4 py-1.5 shadow-sm transition-colors',
                    isHovered
                      ? 'bg-indigo-500/90 text-white'
                      : 'bg-indigo-100/80 text-indigo-900 dark:bg-indigo-900/60 dark:text-indigo-100'
                  )}
                >
                  {result}
                </Badge>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
};

