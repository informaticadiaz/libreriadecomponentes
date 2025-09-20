"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Lightbulb, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Star,
  Rocket,
  Crown,
  Trophy,
  Heart,
  Zap,
  Gift,
  Rainbow,
  Smile,
  PartyPopper,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Tipos para el componente
interface PracticeSettings {
  selectedTables: number[];
  questionCount: number;
  randomOrder: boolean;
  showHints: boolean;
}

interface Question {
  factor1: number;
  factor2: number;
  answer: number;
  id: number;
}

// Componente principal con diseño amigable para niños
const KidFriendlyMultiplicationTrainer = () => {
  const [currentView, setCurrentView] = useState('menu');
  const [selectedMode, setSelectedMode] = useState('explore');
  const [selectedTable, setSelectedTable] = useState(2);
  const [practiceSettings, setPracticeSettings] = useState<PracticeSettings>({
    selectedTables: [2, 3],
    questionCount: 10,
    randomOrder: true,
    showHints: true
  });
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    factor1: 2,
    factor2: 3,
    answer: 6,
    id: 1
  });
  const [inputValue, setInputValue] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions] = useState(10);
  const [streak, setStreak] = useState(0);
  const [stars, setStars] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Función para generar nueva pregunta
  const generateNewQuestion = () => {
    const tables = practiceSettings.selectedTables;
    const randomTable = tables[Math.floor(Math.random() * tables.length)];
    const randomMultiplier = Math.floor(Math.random() * 12) + 1;
    
    setCurrentQuestion({
      factor1: randomTable,
      factor2: randomMultiplier,
      answer: randomTable * randomMultiplier,
      id: Math.random()
    });
  };

  // Efectos de sonido visuales
  const [celebration, setCelebration] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (celebration) {
      const timer = setTimeout(() => setCelebration(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [celebration]);

  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 600);
      return () => clearTimeout(timer);
    }
  }, [shake]);

  const handleSubmitAnswer = () => {
    const answer = parseInt(inputValue, 10);
    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);
    setIsAnswered(true);
    
    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
      setStars(stars + 1);
      setCelebration(true);
    } else {
      setStreak(0);
      setShake(true);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setInputValue('');
    setShowHint(false);
    setQuestionIndex(questionIndex + 1);
    
    // Generar nueva pregunta
    generateNewQuestion();
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const FloatingIcon = ({ icon: Icon, className = "", delay = 0 }: {
    icon: React.ElementType;
    className?: string;
    delay?: number;
  }) => (
    <div 
      className={cn("absolute animate-bounce", className)}
      style={{ animationDelay: `${delay}s`, animationDuration: '2s' }}
    >
      <Icon className="h-6 w-6 text-yellow-400 drop-shadow-lg" />
    </div>
  );

  const getTableColor = (table: number): string => {
    const colors = [
      'from-pink-400 to-rose-400',
      'from-purple-400 to-indigo-400', 
      'from-blue-400 to-cyan-400',
      'from-green-400 to-emerald-400',
      'from-yellow-400 to-orange-400',
      'from-red-400 to-pink-400',
      'from-indigo-400 to-purple-400',
      'from-cyan-400 to-blue-400',
      'from-emerald-400 to-green-400',
      'from-orange-400 to-yellow-400',
      'from-rose-400 to-red-400',
      'from-violet-400 to-fuchsia-400'
    ];
    return colors[(table - 1) % colors.length];
  };

  if (currentView === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-200 to-yellow-200 p-4 relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingIcon icon={Star} className="top-10 left-10" delay={0} />
          <FloatingIcon icon={Heart} className="top-20 right-20" delay={0.5} />
          <FloatingIcon icon={Sparkles} className="bottom-20 left-16" delay={1} />
          <FloatingIcon icon={Rainbow} className="top-1/3 right-10" delay={1.5} />
          <FloatingIcon icon={Gift} className="bottom-10 right-32" delay={2} />
          <FloatingIcon icon={Smile} className="top-1/2 left-8" delay={2.5} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header súper divertido */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-6xl animate-bounce">🚀</div>
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
                  ¡MATEMÁTICAS SÚPER DIVERTIDAS!
                </h1>
                <p className="text-xl font-bold text-purple-700 mt-2">
                  🌟 Conviértete en un Héroe de las Multiplicaciones 🌟
                </p>
              </div>
              <div className="text-6xl animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
            </div>
          </div>

          {/* Selector de modo con diseño de juego */}
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-4 border-white/30 mb-8">
            <Tabs value={selectedMode} onValueChange={setSelectedMode}>
              <TabsList className="grid w-full grid-cols-4 bg-white/40 rounded-2xl p-2 shadow-inner">
                <TabsTrigger 
                  value="explore" 
                  className="rounded-xl font-bold text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg transform transition-all hover:scale-105"
                >
                  🔍 Explorar
                </TabsTrigger>
                <TabsTrigger 
                  value="practice" 
                  className="rounded-xl font-bold text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg transform transition-all hover:scale-105"
                >
                  💪 Practicar
                </TabsTrigger>
                <TabsTrigger 
                  value="quiz" 
                  className="rounded-xl font-bold text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg transform transition-all hover:scale-105"
                >
                  🏆 Desafío
                </TabsTrigger>
                <TabsTrigger 
                  value="progress" 
                  className="rounded-xl font-bold text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transform transition-all hover:scale-105"
                >
                  📊 Progreso
                </TabsTrigger>
              </TabsList>

              <TabsContent value="explore" className="mt-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-black text-purple-800 mb-4">
                      🎯 ¡Elige tu tabla favorita!
                    </h2>
                  </div>
                  
                  {/* Selector de tablas súper colorido */}
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                      <Button
                        key={num}
                        onClick={() => setSelectedTable(num)}
                        className={cn(
                          "h-20 w-full rounded-3xl text-2xl font-black shadow-xl transform transition-all duration-200 hover:scale-110 hover:-rotate-3 border-4",
                          selectedTable === num 
                            ? `bg-gradient-to-br ${getTableColor(num)} text-white border-yellow-400 ring-4 ring-yellow-300 shadow-2xl scale-110` 
                            : `bg-gradient-to-br ${getTableColor(num)} text-white border-white/50 hover:border-yellow-400`
                        )}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>

                  {/* Tabla de multiplicar súper divertida */}
                  <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 shadow-xl border-4 border-white/40">
                    <h3 className="text-2xl font-black text-center mb-6 text-purple-800">
                      🎉 ¡Tabla del {selectedTable}! 🎉
                    </h3>
                    <div className="grid gap-3">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(multiplier => {
                        const result = selectedTable * multiplier;
                        return (
                          <div
                            key={multiplier}
                            className="flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-white/60 hover:bg-white/70 hover:scale-105 transition-all duration-200 hover:shadow-xl"
                          >
                            <div className="flex items-center gap-4">
                              <div className="text-3xl">
                                {multiplier <= 3 ? '🟢' : multiplier <= 6 ? '🟡' : multiplier <= 9 ? '🟠' : '🔴'}
                              </div>
                              <span className="text-2xl font-bold text-purple-800">
                                {selectedTable} × {multiplier} =
                              </span>
                            </div>
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xl font-black px-4 py-2 rounded-2xl shadow-lg">
                              {result}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="practice" className="mt-6">
                <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 shadow-xl border-4 border-white/40">
                  <h2 className="text-3xl font-black text-center mb-6 text-green-800">
                    💪 ¡Configura tu entrenamiento!
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Selector de tablas */}
                    <div>
                      <Label className="text-xl font-bold text-green-700 mb-4 block">
                        🎯 Selecciona las tablas que quieres practicar:
                      </Label>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(table => {
                          const isSelected = practiceSettings.selectedTables.includes(table);
                          return (
                            <label
                              key={table}
                              className={cn(
                                "flex items-center justify-center h-16 rounded-2xl cursor-pointer font-bold text-lg shadow-lg transition-all duration-200 hover:scale-105 border-3",
                                isSelected
                                  ? `bg-gradient-to-br ${getTableColor(table)} text-white border-yellow-400 ring-2 ring-yellow-300 shadow-xl`
                                  : "bg-white/70 text-gray-600 border-gray-200 hover:bg-white/90"
                              )}
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => {
                                  const isChecked = checked as boolean;
                                  if (isChecked) {
                                    setPracticeSettings(prev => ({
                                      ...prev,
                                      selectedTables: [...prev.selectedTables, table].sort()
                                    }));
                                  } else {
                                    setPracticeSettings(prev => ({
                                      ...prev,
                                      selectedTables: prev.selectedTables.filter(t => t !== table)
                                    }));
                                  }
                                }}
                                className="sr-only"
                              />
                              Tabla {table}
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Cantidad de preguntas */}
                    <div>
                      <Label className="text-xl font-bold text-green-700 mb-4 block">
                        🎮 ¿Cuántas preguntas quieres?
                      </Label>
                      <Select
                        value={practiceSettings.questionCount.toString()}
                        onValueChange={(value) => 
                          setPracticeSettings(prev => ({ ...prev, questionCount: parseInt(value) }))
                        }
                      >
                        <SelectTrigger className="w-full h-16 text-xl font-bold rounded-2xl bg-white/70 border-3 border-green-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 10, 15, 20, 25, 30].map(count => (
                            <SelectItem key={count} value={count.toString()} className="text-lg font-bold">
                              {count} preguntas {count >= 20 ? '🔥' : count >= 15 ? '⭐' : '✨'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Opciones divertidas */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <label className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-105 border-3",
                        practiceSettings.randomOrder 
                          ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white border-yellow-400 shadow-lg"
                          : "bg-white/70 border-gray-300"
                      )}>
                        <Checkbox
                          checked={practiceSettings.randomOrder}
                          onCheckedChange={(checked) => 
                            setPracticeSettings(prev => ({ ...prev, randomOrder: checked as boolean }))
                          }
                          className="sr-only"
                        />
                        <div className="text-4xl">🎲</div>
                        <div>
                          <div className="font-bold text-lg">Orden aleatorio</div>
                          <div className="text-sm opacity-90">¡Más divertido y desafiante!</div>
                        </div>
                      </label>

                      <label className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-105 border-3",
                        practiceSettings.showHints 
                          ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-yellow-600 shadow-lg"
                          : "bg-white/70 border-gray-300"
                      )}>
                        <Checkbox
                          checked={practiceSettings.showHints}
                          onCheckedChange={(checked) => 
                            setPracticeSettings(prev => ({ ...prev, showHints: checked as boolean }))
                          }
                          className="sr-only"
                        />
                        <div className="text-4xl">💡</div>
                        <div>
                          <div className="font-bold text-lg">Pistas disponibles</div>
                          <div className="text-sm opacity-90">¡Ayuda cuando la necesites!</div>
                        </div>
                      </label>
                    </div>

                    {/* Botón de inicio súper llamativo */}
                    <Button
                      onClick={() => setCurrentView('practice')}
                      disabled={practiceSettings.selectedTables.length === 0}
                      className="w-full h-20 text-2xl font-black rounded-3xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white shadow-2xl border-4 border-white hover:scale-105 transition-all duration-200 hover:shadow-3xl"
                    >
                      🚀 ¡EMPEZAR A PRACTICAR! 🚀
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="quiz" className="mt-6">
                <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 shadow-xl border-4 border-white/40 text-center">
                  <div className="text-6xl mb-4">🏆</div>
                  <h2 className="text-3xl font-black text-orange-800 mb-4">
                    ¡MODO DESAFÍO ÉPICO!
                  </h2>
                  <p className="text-xl text-orange-700 mb-6">
                    ¿Estás listo para el desafío más emocionante?
                  </p>
                  <Button
                    onClick={() => setCurrentView('quiz')}
                    className="h-20 px-12 text-2xl font-black rounded-3xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white shadow-2xl border-4 border-white hover:scale-105 transition-all duration-200"
                  >
                    🔥 ¡ACEPTO EL DESAFÍO! 🔥
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="progress" className="mt-6">
                <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 shadow-xl border-4 border-white/40">
                  <h2 className="text-3xl font-black text-center mb-6 text-purple-800">
                    📊 ¡Tu aventura matemática!
                  </h2>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-3xl p-6 text-center shadow-xl border-4 border-white">
                      <div className="text-5xl mb-2">⭐</div>
                      <div className="text-3xl font-black text-white">{stars}</div>
                      <div className="text-lg font-bold text-white">Estrellas ganadas</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-400 to-emerald-400 rounded-3xl p-6 text-center shadow-xl border-4 border-white">
                      <div className="text-5xl mb-2">🔥</div>
                      <div className="text-3xl font-black text-white">{streak}</div>
                      <div className="text-lg font-bold text-white">Mejor racha</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl p-6 text-center shadow-xl border-4 border-white">
                      <div className="text-5xl mb-2">🏆</div>
                      <div className="text-3xl font-black text-white">{score}</div>
                      <div className="text-lg font-bold text-white">Preguntas correctas</div>
                    </div>
                  </div>

                  <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-3xl p-6 border-3 border-white/60">
                    <h3 className="text-2xl font-black text-purple-800 mb-4 text-center">
                      🎯 Progreso por tabla
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(table => (
                        <div key={table} className="text-center">
                          <div className={cn(
                            "w-full h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg border-3 border-white/50",
                            `bg-gradient-to-br ${getTableColor(table)}`
                          )}>
                            Tabla {table}
                          </div>
                          <div className="mt-2 text-sm font-bold text-purple-700">
                            {Math.floor(Math.random() * 100)}% dominada
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'practice' || currentView === 'quiz') {
    return (
      <div className={cn(
        "min-h-screen p-4 relative overflow-hidden",
        celebration ? "bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-300" : "bg-gradient-to-br from-blue-300 via-purple-200 to-pink-200"
      )}>
        {/* Efectos de celebración */}
        {celebration && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: '1s'
                }}
              >
                <PartyPopper className="h-8 w-8 text-yellow-400" />
              </div>
            ))}
          </div>
        )}

        {/* Elementos decorativos animados */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingIcon icon={Star} className="top-10 left-10" delay={0} />
          <FloatingIcon icon={Rocket} className="top-20 right-20" delay={0.5} />
          <FloatingIcon icon={Heart} className="bottom-20 left-16" delay={1} />
          <FloatingIcon icon={Crown} className="top-1/3 right-10" delay={1.5} />
          <FloatingIcon icon={Trophy} className="bottom-10 right-32" delay={2} />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header con progreso súper visual */}
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => setCurrentView('menu')}
              className="h-16 px-6 rounded-3xl bg-gradient-to-r from-red-400 to-pink-400 text-white font-bold text-lg shadow-xl border-4 border-white hover:scale-105 transition-all"
            >
              <ArrowLeft className="h-6 w-6 mr-2" />
              🏠 Menú
            </Button>

            <div className="flex items-center gap-4">
              <div className="bg-white/30 backdrop-blur-md rounded-3xl px-6 py-3 border-3 border-white/50">
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-400" />
                  <span className="text-xl font-bold text-purple-800">{stars}</span>
                </div>
              </div>
              
              <div className="bg-white/30 backdrop-blur-md rounded-3xl px-6 py-3 border-3 border-white/50">
                <div className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-orange-400" />
                  <span className="text-xl font-bold text-purple-800">Racha: {streak}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de progreso súper divertida */}
          <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 mb-6 shadow-xl border-4 border-white/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-purple-800">
                Pregunta {questionIndex + 1} de {totalQuestions} 🎯
              </span>
              <div className="flex items-center gap-2">
                {[...Array(Math.min(streak, 5))].map((_, i) => (
                  <Zap key={i} className="h-6 w-6 text-yellow-400 animate-pulse" />
                ))}
              </div>
            </div>
            <Progress 
              value={(questionIndex / totalQuestions) * 100} 
              className="h-6 bg-white/50 rounded-full overflow-hidden"
            />
          </div>

          {/* Tarjeta de pregunta súper atractiva */}
          <div className={cn(
            "bg-white/40 backdrop-blur-md rounded-[3rem] p-8 shadow-2xl border-6 border-white/60 transition-all duration-300",
            shake && "animate-pulse bg-red-100/40",
            celebration && "animate-bounce bg-yellow-100/40"
          )}>
            <div className="text-center space-y-8">
              {/* Pregunta gigante y colorida */}
              <div className="space-y-4">
                <div className="text-lg font-bold text-purple-600 uppercase tracking-wide">
                  🎮 Resuelve este desafío:
                </div>
                <div className="text-8xl font-black text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text drop-shadow-2xl">
                  {currentQuestion.factor1} × {currentQuestion.factor2}
                </div>
                <div className="text-6xl font-black text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                  = ?
                </div>
              </div>

              {/* Feedback visual */}
              {isAnswered && (
                <div className={cn(
                  "flex items-center justify-center gap-4 text-3xl font-black p-6 rounded-3xl shadow-xl border-4",
                  isCorrect 
                    ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white border-green-300"
                    : "bg-gradient-to-r from-red-400 to-pink-400 text-white border-red-300"
                )}>
                  {isCorrect ? (
                    <>
                      <CheckCircle className="h-12 w-12" />
                      <span>¡INCREÍBLE! ¡Eres genial! 🎉</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-12 w-12" />
                      <span>¡Casi! La respuesta es {currentQuestion.answer} 💪</span>
                    </>
                  )}
                </div>
              )}

              {/* Input y controles */}
              {!isAnswered ? (
                <div className="space-y-6">
                  <div>
                    <Label className="text-2xl font-bold text-purple-700 mb-4 block">
                      🎯 Tu respuesta:
                    </Label>
                    <Input
                      ref={inputRef}
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && inputValue && handleSubmitAnswer()}
                      className="w-full h-20 text-4xl font-bold text-center rounded-3xl bg-white/80 border-4 border-purple-300 shadow-lg focus:border-yellow-400 focus:ring-4 focus:ring-yellow-200"
                      placeholder="?"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!inputValue}
                      className="h-16 px-8 text-xl font-black rounded-3xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl border-4 border-white hover:scale-105 transition-all disabled:opacity-50"
                    >
                      ✨ ¡ENVIAR! ✨
                    </Button>

                    <Button
                      onClick={() => setShowHint(!showHint)}
                      className="h-16 px-8 text-xl font-black rounded-3xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-xl border-4 border-white hover:scale-105 transition-all"
                    >
                      <Lightbulb className="h-6 w-6 mr-2" />
                      💡 Pista
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="h-20 px-12 text-2xl font-black rounded-3xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl border-4 border-white hover:scale-105 transition-all"
                >
                  🚀 ¡SIGUIENTE! 🚀
                </Button>
              )}

              {/* Pista súper visual */}
              {showHint && !isAnswered && (
                <div className="bg-gradient-to-r from-amber-200 to-yellow-200 rounded-3xl p-6 border-4 border-amber-300 shadow-xl">
                  <div className="flex items-center gap-4 text-xl font-bold text-amber-800">
                    <div className="text-4xl">💡</div>
                    <div>
                      <div className="text-2xl font-black mb-2">¡Pista súper útil!</div>
                      <div>
                        Puedes contar de {currentQuestion.factor1} en {currentQuestion.factor1}: 
                        {Array.from({length: currentQuestion.factor2}, (_, i) => (i + 1) * currentQuestion.factor1).join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default KidFriendlyMultiplicationTrainer;