import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Plus, Minus, Check, X, Timer, Volume2, VolumeX } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  restSeconds: number;
  notes?: string;
  completed?: boolean;
}

interface Set {
  reps: number;
  weight?: number;
  completed: boolean;
  rpe?: number; // Rate of Perceived Exertion (1-10)
}

interface WorkoutResults {
  workoutName: string;
  duration: number; // seconds
  exercises: Record<string, Set[]>;
  completedAt: string; // ISO string
}

interface WorkoutPlayerProps {
  workoutName: string;
  exercises: Exercise[];
  onCompleteWorkout: (results: WorkoutResults) => void;
  onExitWorkout: () => void;
}

const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({
  workoutName,
  exercises,
  onCompleteWorkout,
  onExitWorkout
}) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  // const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [workoutStartTime] = useState(Date.now());
  const [exerciseResults, setExerciseResults] = useState<Record<string, Set[]>>({});
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [currentReps, setCurrentReps] = useState<number>(0);
  const [showRPE, setShowRPE] = useState(false);
  const [selectedRPE, setSelectedRPE] = useState<number>(5);
  
// ✅ Tipos de refs correctos
const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
// Si querés forzar browser: const timerRef = useRef<number | null>(null);
const audioRef = useRef<HTMLAudioElement | null>(null);

const currentExercise = exercises[currentExerciseIndex];
const progress =
  ((currentExerciseIndex + (currentSet / (currentExercise?.sets || 1))) / exercises.length) * 100;
const completedSets = exerciseResults[currentExercise?.id] || [];

// ✅ Timer effect correcto (sin choque de overloads y sin múltiples intervalos)
useEffect(() => {
  // Limpia cualquier intervalo previo
  if (timerRef.current !== null) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }

  if (isResting && restTimer > 0) {
    // Crea un nuevo intervalo
    timerRef.current = setInterval(() => {
      setRestTimer((prev) => {
        if (prev <= 1) {
          // Fin del descanso: limpiar intervalo y ejecutar acciones
          if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setIsResting(false);
          if (!isMuted) {
            playSound();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  // Cleanup al desmontar o cuando cambie la condición
  return () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  // 👇 Importante: no incluyas restTimer, así no recrea el intervalo cada segundo
}, [isResting, isMuted]);

// ✅ Inicialización del ejercicio actual
useEffect(() => {
  if (currentExercise) {
    setCurrentWeight(currentExercise.weight || 0);
    setCurrentReps(currentExercise.reps || 0);
  }
}, [currentExercise]);

  const playSound = () => {
    if (!isMuted && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Silently handle audio play errors
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatElapsedTime = () => {
    const elapsed = Math.floor((Date.now() - workoutStartTime) / 1000);
    return formatTime(elapsed);
  };

  const completeSet = () => {
    const exerciseId = currentExercise.id;
    const newSet: Set = {
      reps: currentReps,
      weight: currentWeight > 0 ? currentWeight : undefined,
      completed: true,
      rpe: selectedRPE
    };

    setExerciseResults(prev => ({
      ...prev,
      [exerciseId]: [...(prev[exerciseId] || []), newSet]
    }));

    if (currentSet < currentExercise.sets) {
      // Start rest timer
      setRestTimer(currentExercise.restSeconds);
      setIsResting(true);
      setCurrentSet(prev => prev + 1);
      setShowRPE(false);
    } else {
      // Move to next exercise
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
        setShowRPE(false);
      } else {
        // Workout completed
        finishWorkout();
      }
    }

    playSound();
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimer(0);
  };

  const addRestTime = () => {
    setRestTimer(prev => prev + 30);
  };

  const finishWorkout = () => {
    const workoutResults = {
      workoutName,
      duration: Math.floor((Date.now() - workoutStartTime) / 1000),
      exercises: exerciseResults,
      completedAt: new Date().toISOString()
    };
    onCompleteWorkout(workoutResults);
  };

  const resetCurrentSet = () => {
    setCurrentReps(currentExercise.reps);
    setCurrentWeight(currentExercise.weight || 0);
    setSelectedRPE(5);
  };

  const RPESelector = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">¿Qué tan difícil fue?</h3>
        <p className="text-sm text-gray-400">Califica tu esfuerzo del 1 al 10</p>
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
          <button
            key={level}
            onClick={() => setSelectedRPE(level)}
            className={`aspect-square rounded-xl font-bold transition-all ${
              selectedRPE === level
                ? 'bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {level}
          </button>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-xs text-gray-500">
          {selectedRPE <= 3 && "Muy fácil"}
          {selectedRPE > 3 && selectedRPE <= 5 && "Moderado"}
          {selectedRPE > 5 && selectedRPE <= 7 && "Difícil"}
          {selectedRPE > 7 && selectedRPE <= 9 && "Muy difícil"}
          {selectedRPE === 10 && "Máximo esfuerzo"}
        </p>
      </div>
    </div>
  );

  if (!currentExercise) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Entrenamiento Completado 🎉</h2>
          <button
            onClick={() => onCompleteWorkout({
              workoutName: 'Workout Completado',
              duration: 0,
              exercises: {},
              completedAt: new Date().toISOString()
            })}
            className="bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white px-8 py-3 rounded-full font-semibold"
          >
            Ver Resumen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white relative">
      {/* Audio element for notifications */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N+QQAoUXrTp66hVFApGn+DyvmEcBj2Z2+/AbyMFl2Ac" type="audio/wav" />
      </audio>

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={onExitWorkout}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
          <div>
            <h1 className="font-semibold text-white">{workoutName}</h1>
            <p className="text-xs text-gray-400">{formatElapsedTime()} • {Math.round(progress)}%</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-gray-400" />
            ) : (
              <Volume2 className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pb-4">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-fuchsia-500 to-violet-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4">
        
        {/* Exercise Info */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{currentExercise.name}</h2>
          <div className="flex items-center justify-center space-x-4 text-gray-400">
            <span>Set {currentSet} de {currentExercise.sets}</span>
            <span>•</span>
            <span>Ejercicio {currentExerciseIndex + 1} de {exercises.length}</span>
          </div>
        </div>

        {/* Rest Timer */}
        {isResting && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 mb-4">
              <div className="text-center">
                <Timer className="h-8 w-8 text-white mx-auto mb-1" />
                <div className="text-2xl font-bold text-white">{formatTime(restTimer)}</div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Descansando</h3>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={addRestTime}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                +30s
              </button>
              <button
                onClick={skipRest}
                className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Saltar
              </button>
            </div>
          </div>
        )}

        {/* Set Input */}
        {!isResting && !showRPE && (
          <div className="space-y-6">
            
            {/* Weight Input */}
            {currentExercise.weight !== undefined && (
              <div className="text-center">
                <p className="text-gray-400 mb-3">Peso (kg)</p>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setCurrentWeight(Math.max(0, currentWeight - 2.5))}
                    className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Minus className="h-5 w-5 text-white" />
                  </button>
                  <div className="text-3xl font-bold text-white min-w-[100px] text-center">
                    {currentWeight}
                  </div>
                  <button
                    onClick={() => setCurrentWeight(currentWeight + 2.5)}
                    className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Plus className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Reps Input */}
            <div className="text-center">
              <p className="text-gray-400 mb-3">Repeticiones</p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setCurrentReps(Math.max(0, currentReps - 1))}
                  className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <Minus className="h-5 w-5 text-white" />
                </button>
                <div className="text-3xl font-bold text-white min-w-[100px] text-center">
                  {currentReps}
                </div>
                <button
                  onClick={() => setCurrentReps(currentReps + 1)}
                  className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <Plus className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Previous Sets */}
            {completedSets.length > 0 && (
              <div className="bg-gray-900 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-3">Sets anteriores</h4>
                <div className="space-y-2">
                  {completedSets.map((set, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Set {index + 1}</span>
                      <span className="text-white">
                        {set.weight && `${set.weight}kg × `}{set.reps} reps
                        {set.rpe && ` • RPE ${set.rpe}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exercise Notes */}
            {currentExercise.notes && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-sm text-blue-300">{currentExercise.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* RPE Selector */}
        {showRPE && (
          <div className="bg-gray-900 rounded-2xl p-6">
            <RPESelector />
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 bg-gray-900/50 backdrop-blur-sm border-t border-gray-800/50">
        {!isResting && !showRPE && (
          <div className="flex items-center space-x-3">
            <button
              onClick={resetCurrentSet}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Reset</span>
            </button>
            
            <button
              onClick={() => setShowRPE(true)}
              className="flex-[2] bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:shadow-lg hover:shadow-fuchsia-500/25 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <Check className="h-5 w-5" />
              <span>Completar Set</span>
            </button>
          </div>
        )}

        {showRPE && (
          <button
            onClick={completeSet}
            className="w-full bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:shadow-lg hover:shadow-fuchsia-500/25 text-white py-4 rounded-xl font-semibold transition-all"
          >
            Confirmar Set
          </button>
        )}
      </div>
    </div>
  );
};

// Demo Component
const WorkoutPlayerDemo = () => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  const demoExercises: Exercise[] = [
    {
      id: '1',
      name: 'Press de Banca',
      sets: 3,
      reps: 12,
      weight: 60,
      restSeconds: 90,
      notes: 'Mantén el control en la fase excéntrica'
    },
    {
      id: '2',
      name: 'Sentadillas',
      sets: 4,
      reps: 15,
      weight: 80,
      restSeconds: 120,
      notes: 'Baja hasta que los muslos estén paralelos al suelo'
    },
    {
      id: '3',
      name: 'Flexiones',
      sets: 3,
      reps: 15,
      restSeconds: 60,
      notes: 'Si es muy difícil, apoya las rodillas'
    }
  ];

  const handleCompleteWorkout = (results: WorkoutResults) => {
    console.log('Workout completed:', results);
    setIsWorkoutActive(false);
  };

  const handleExitWorkout = () => {
    setIsWorkoutActive(false);
  };

  if (!isWorkoutActive) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-sm">
          <h2 className="text-3xl font-bold text-white">Workout Player</h2>
          <p className="text-gray-400">Experiencia inmersiva durante el entrenamiento</p>
          
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-xl p-4">
              <h3 className="font-semibold text-white mb-2">Push Day Intenso</h3>
              <p className="text-sm text-gray-400">3 ejercicios • 45 min estimados</p>
              <div className="mt-3 space-y-1">
                {demoExercises.map((exercise) => (
                  <div key={exercise.id} className="flex justify-between text-xs">
                    <span className="text-gray-300">{exercise.name}</span>
                    <span className="text-gray-500">{exercise.sets} × {exercise.reps}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsWorkoutActive(true)}
            className="w-full bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all"
          >
            Comenzar Entrenamiento
          </button>
        </div>
      </div>
    );
  }

  return (
    <WorkoutPlayer
      workoutName="Push Day Intenso"
      exercises={demoExercises}
      onCompleteWorkout={handleCompleteWorkout}
      onExitWorkout={handleExitWorkout}
    />
  );
};

export default WorkoutPlayerDemo;