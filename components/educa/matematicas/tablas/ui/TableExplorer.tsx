
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

  return (
    <div className="space-y-6">
      {/* Selector de tabla */}
      <Panel title={i18n.selectTable}>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {tableNumbers.map(num => (
            <Button
              key={num}
              variant={selectedTable === num ? "default" : "outline"}
              onClick={() => onTableSelect(num)}
              className="aspect-square"
            >
              {num}
            </Button>
          ))}
        </div>
      </Panel>

      {/* Tabla de multiplicar */}
      <Panel title={`Tabla del ${selectedTable}`}>
        <div className="space-y-3">
          {Array.from({ length: 12 }, (_, i) => i + 1).map(multiplier => {
            const result = selectedTable * multiplier;
            const cellKey = `${selectedTable}x${multiplier}`;
            const isHovered = hoveredCell === cellKey;

            return (
              <div
                key={cellKey}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer",
                  isHovered 
                    ? "bg-blue-50 border-blue-200 shadow-sm" 
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                )}
                onMouseEnter={() => setHoveredCell(cellKey)}
                onMouseLeave={() => setHoveredCell(null)}
                role="button"
                tabIndex={0}
                aria-label={`${selectedTable} por ${multiplier} igual ${result}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-semibold text-gray-700">
                    {selectedTable} × {multiplier}
                  </span>
                  <span className="text-lg text-gray-500">=</span>
                </div>
                
                <Badge 
                  variant={isHovered ? "default" : "secondary"}
                  className="text-lg font-bold px-3 py-1"
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

