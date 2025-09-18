# PracticeSettings

```tsx
// components/learning/ui/PracticeSettings.tsx
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PracticeSettings as PracticeSettingsType } from '../types';

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
            {tableNumbers.map(table => (
              <div key={table} className="flex items-center space-x-2">
                <Checkbox
                  id={`table-${table}`}
                  checked={settings.selectedTables.includes(table)}
                  onCheckedChange={(checked) => 
                    handleTableToggle(table, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`table-${table}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  Tabla del {table}
                </Label>
              </div>
            ))}
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
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="random-order"
              checked={settings.randomOrder}
              onCheckedChange={(checked) => 
                onSettingsChange({ randomOrder: checked as boolean })
              }
            />
            <Label htmlFor="random-order" className="text-sm">
              Orden aleatorio
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-hints"
              checked={settings.showHints}
              onCheckedChange={(checked) => 
                onSettingsChange({ showHints: checked as boolean })
              }
            />
            <Label htmlFor="show-hints" className="text-sm">
              Permitir pistas
            </Label>
          </div>
        </div>

        {/* Resumen de selección */}
        {settings.selectedTables.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm text-blue-800">
              <strong>Seleccionaste:</strong> Tablas del {settings.selectedTables.join(', ')} 
              ({settings.questionCount} preguntas)
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
```
