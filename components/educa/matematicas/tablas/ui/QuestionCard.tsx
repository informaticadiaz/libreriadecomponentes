// components/learning/ui/QuestionCard.tsx
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Panel } from './Panel';
import { Lightbulb, CheckCircle, XCircle } from 'lucide-react';
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
    <Panel className="max-w-md mx-auto">
      <div className="text-center space-y-6">
        {/* Pregunta */}
        <div className="space-y-2">
          <div className="text-4xl font-bold text-gray-900">
            {question.factor1} × {question.factor2} = ?
          </div>
          
          {/* Feedback visual */}
          {isAnswered && (
            <div className="flex items-center justify-center space-x-2">
              {question.isCorrect ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-green-700 font-medium">{i18n.correct}</span>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-500" />
                  <span className="text-red-700 font-medium">
                    {i18n.incorrect} - La respuesta es {question.answer}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Input y controles */}
        {!isAnswered ? (
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="answer-input" 
                className="block text-sm font-medium text-gray-700 mb-2"
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
                className="text-center text-lg"
                placeholder="?"
                aria-describedby={showHint ? "hint-text" : undefined}
              />
            </div>

            <div className="flex flex-col space-y-3">
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || !inputValue.trim()}
                className="w-full"
                size="lg"
              >
                {i18n.submit}
              </Button>

              <Button
                variant="outline"
                onClick={onToggleHint}
                className="w-full"
                size="sm"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {showHint ? i18n.hideHint : i18n.showHint}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={onNext}
            className="w-full"
            size="lg"
          >
            {i18n.next}
          </Button>
        )}

        {/* Pista */}
        {showHint && !isAnswered && (
          <div 
            id="hint-text"
            className="bg-blue-50 border border-blue-200 rounded-lg p-3"
            role="region"
            aria-label="Pista"
          >
            <div className="text-blue-800 text-sm">
              💡 {getHintText()}
            </div>
          </div>
        )}

        {/* Información de respuesta del usuario */}
        {isAnswered && question.userAnswer !== undefined && (
          <div className="text-sm text-gray-600">
            Tu respuesta: <Badge variant="outline">{question.userAnswer}</Badge>
          </div>
        )}
      </div>
    </Panel>
  );
};
