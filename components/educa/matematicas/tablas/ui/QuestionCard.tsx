// components/learning/ui/QuestionCard.tsx
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Panel } from './Panel';
import { Lightbulb, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import type { Question } from '../types';
import { formatHint } from '../i18n';

interface QuestionCardProps {
  question: Question;
  showHint: boolean;
  onToggleHint: () => void;
  onSubmit: (answer: number) => void;
  onNext: () => void;
  isAnswered: boolean;
  canSubmit: boolean;
  i18n: {
    yourAnswer: string;
    submit: string;
    next: string;
    showHint: string;
    hideHint: string;
    correct: string;
    incorrect: string;
    hints: {
      addition: string;
      counting: string;
    };
  };
}

export const QuestionCard = ({
  question,
  showHint,
  onToggleHint,
  onSubmit,
  onNext,
  isAnswered,
  canSubmit,
  i18n
}: QuestionCardProps) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAnswered) {
      setInputValue('');
      inputRef.current?.focus();
    }
  }, [question.id, isAnswered]);

  const handleSubmit = () => {
    const answer = parseInt(inputValue, 10);
    if (!isNaN(answer)) {
      onSubmit(answer);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canSubmit && inputValue.trim()) {
      handleSubmit();
    }
  };

  const getHintText = () => {
    if (question.factor1 <= 5 || question.factor2 <= 5) {
      return formatHint(i18n.hints.addition, question.factor1, question.factor2);
    }
    return formatHint(i18n.hints.counting, question.factor1, question.factor2);
  };

  return (
    <Panel className="mx-auto max-w-3xl border-0 bg-gradient-to-br from-indigo-50 via-white to-sky-100 p-10 shadow-2xl dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 rounded-[36px] border-4 border-indigo-100 bg-white/90 p-8 text-center shadow-xl backdrop-blur-sm dark:border-indigo-500/40 dark:bg-slate-950/70">
        {/* Pregunta */}
        <div className="space-y-4">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400 dark:text-indigo-200">
            Desafío actual
          </div>
          <div className="text-6xl font-black text-indigo-900 drop-shadow-sm dark:text-indigo-100">
            {question.factor1} × {question.factor2}
            <span className="block text-5xl font-black text-indigo-600/80 dark:text-indigo-300">= ?</span>
          </div>
          <div className="text-base font-medium text-indigo-500/90 dark:text-indigo-200/90">
            ¿Cuál es el resultado correcto?
          </div>

          {/* Feedback visual */}
          {isAnswered && (
            <div className="flex items-center justify-center gap-3 text-lg">
              {question.isCorrect ? (
                <>
                  <CheckCircle className="h-7 w-7 text-emerald-500" />
                  <span className="font-semibold text-emerald-600 dark:text-emerald-300">{i18n.correct}</span>
                </>
              ) : (
                <>
                  <XCircle className="h-7 w-7 text-rose-500" />
                  <span className="font-semibold text-rose-600 dark:text-rose-300">
                    {i18n.incorrect} - La respuesta es {question.answer}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Input y controles */}
        {!isAnswered ? (
          <div className="flex w-full flex-col gap-6">
            <div className="w-full text-left">
              <label
                htmlFor="answer-input"
                className="mb-2 block text-sm font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-200"
              >
                {i18n.yourAnswer}
              </label>
              <Input
                ref={inputRef}
                id="answer-input"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full rounded-2xl border-4 border-dashed border-indigo-200/80 bg-white/80 px-6 py-5 text-center text-3xl font-semibold text-indigo-900 shadow-inner transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-indigo-500/40 dark:bg-slate-900/70 dark:text-indigo-100"
                placeholder="?"
                aria-describedby={showHint ? "hint-text" : undefined}
              />
            </div>

            <div className="flex w-full flex-col gap-3">
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || !inputValue.trim()}
                className="w-full rounded-2xl bg-indigo-500 text-lg font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-indigo-500/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
                size="lg"
              >
                {i18n.submit}
              </Button>

              <Button
                variant="outline"
                onClick={onToggleHint}
                className="w-full rounded-2xl border-2 border-indigo-200/60 bg-white/70 text-indigo-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 dark:border-indigo-500/30 dark:bg-slate-900/60 dark:text-indigo-200"
                size="sm"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                {showHint ? i18n.hideHint : i18n.showHint}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={onNext}
            className="w-full rounded-2xl bg-emerald-500 text-lg font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-emerald-500/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
            size="lg"
          >
            {i18n.next}
          </Button>
        )}

        {/* Pista */}
        {showHint && !isAnswered && (
          <div
            id="hint-text"
            className="relative mx-auto max-w-md rounded-3xl bg-amber-100/90 p-5 text-left text-amber-900 shadow-lg before:absolute before:-bottom-6 before:left-16 before:h-0 before:w-0 before:-translate-x-3 before:border-[14px] before:border-transparent before:border-t-amber-100/90 dark:bg-amber-500/40 dark:text-amber-50 dark:before:border-t-amber-500/40"
            role="region"
            aria-label="Pista"
          >
            <div className="flex items-start gap-3 text-sm leading-relaxed">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200/80 text-amber-700 shadow-inner dark:bg-amber-500/60 dark:text-amber-100">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>{getHintText()}</span>
            </div>
          </div>
        )}

        {/* Información de respuesta del usuario */}
        {isAnswered && question.userAnswer !== undefined && (
          <div className="text-sm text-indigo-700 dark:text-indigo-200">
            Tu respuesta:
            <Badge variant="outline" className="ml-2 rounded-full border-indigo-200 bg-indigo-50/80 px-3 py-1 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-900/40 dark:text-indigo-200">
              {question.userAnswer}
            </Badge>
          </div>
        )}
      </div>
    </Panel>
  );
};
