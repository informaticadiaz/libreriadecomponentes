import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

// =====================================
// TYPES & INTERFACES
// =====================================

interface Exercise {
  id: number;
  name: string;
  duration: number; // segundos
  rest: number; // segundos de descanso después del ejercicio
  images: [string, string, string]; // [start, mid, end] - emojis o URLs
  instructions: string;
}

interface Workout {
  title: string;
  description: string;
  exercises: Exercise[];
}

type WorkoutStatus = 'idle' | 'playing' | 'paused' | 'stopped' | 'completed';
type WorkoutPhase = 'exercise' | 'rest';

interface WorkoutState {
  status: WorkoutStatus;
  phase: WorkoutPhase;
  currentExerciseIndex: number;
  currentTime: number;
  currentImageIndex: number;
  isFullscreen: boolean;
  isMuted: boolean;
  volume: number;
}

// =====================================
// COMPONENT
// =====================================

/**
 * WorkoutPlayerDemo - Reproductor de entrenamientos con pantalla completa
 * 
 * Características principales:
 * - Reproduce ejercicios con imágenes dinámicas (start → mid → end)
 * - Descansos automáticos entre ejercicios
 * - Modo pantalla completa inmersivo
 * - Controles de audio y navegación
 * - Flujo automático continuo hasta completar rutina
 * 
 * @returns JSX.Element - Componente del reproductor
 */
const WorkoutPlayerDemo: React.FC = () => {
  // Estados tipados del workout
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentExercise, setCurrentExercise] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(70);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [workoutComplete, setWorkoutComplete] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Datos tipados del workout
  const workout: Workout = {
    title: "Entrenamiento de Fuerza - Día 1",
    description: "Rutina completa de tren superior",
    exercises: [
      {
        id: 1,
        name: "Flexiones de Pecho",
        duration: 30,
        rest: 15,
        images: ["🏃‍♀️", "💪", "🏋️‍♀️"], // Emojis como placeholders de imágenes
        instructions: "Mantén el core activo y baja controladamente"
      },
      {
        id: 2, 
        name: "Sentadillas",
        duration: 45,
        rest: 20,
        images: ["🦵", "🏃‍♂️", "💪"],
        instructions: "Baja hasta que los muslos estén paralelos al suelo"
      },
      {
        id: 3,
        name: "Plancha",
        duration: 60,
        rest: 30,
        images: ["🧘‍♀️", "🏋️‍♀️", "💪"],
        instructions: "Mantén el cuerpo recto como una tabla"
      },
      {
        id: 4,
        name: "Burpees",
        duration: 20,
        rest: 25,
        images: ["🤸‍♂️", "🏃‍♀️", "💥"],
        instructions: "Movimiento explosivo, combina todo el cuerpo"
      }
    ]
  };

  // Variables calculadas tipadas
  const currentEx: Exercise = workout.exercises[currentExercise];
  const restTime: number = 15; // 15 segundos de descanso
  const totalTime: number = isResting ? restTime : currentEx.duration;
  const progress: number = (currentTime / totalTime) * 100;

  // Simular timer cuando está reproduciendo
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> ;
    if (isPlaying && currentTime < totalTime && !workoutComplete) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalTime - 1) {
            // Si terminó el tiempo actual
            if (isResting) {
              // Si estaba en descanso, pasar al próximo ejercicio
              if (currentExercise < workout.exercises.length - 1) {
                setCurrentExercise(currentExercise + 1);
                setIsResting(false);
                setCurrentImageIndex(0);
                return 0;
              } else {
                // Se terminó toda la rutina
                setIsPlaying(false);
                setWorkoutComplete(true);
                setIsFullscreen(false); // Salir de pantalla completa al terminar
                return 0;
              }
            } else {
              // Si terminó el ejercicio, pasar a descanso
              if (currentExercise < workout.exercises.length - 1) {
                setIsResting(true);
                return 0;
              } else {
                // Era el último ejercicio, terminar todo
                setIsPlaying(false);
                setWorkoutComplete(true);
                setIsFullscreen(false); // Salir de pantalla completa al terminar
                return 0;
              }
            }
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, totalTime, isResting, currentExercise, workoutComplete]);

  // Cambiar imagen según el progreso (solo durante ejercicios)
  useEffect(() => {
    if (!isResting) {
      const progressPercent = (currentTime / totalTime) * 100;
      if (progressPercent < 33) {
        setCurrentImageIndex(0); // start
      } else if (progressPercent < 66) {
        setCurrentImageIndex(1); // mid
      } else {
        setCurrentImageIndex(2); // end
      }
    }
  }, [currentTime, totalTime, isResting]);

  // Función para formatear tiempo
  const formatTime = (seconds: number): string => {
    const mins: number = Math.floor(seconds / 60);
    const secs: number = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handlers tipados
  const handlePlayPause = (): void => {
    if (workoutComplete) {
      // Si el workout está completo, reiniciar todo
      setWorkoutComplete(false);
      setCurrentExercise(0);
      setCurrentTime(0);
      setIsResting(false);
      setCurrentImageIndex(0);
      setIsPlaying(true);
      setIsFullscreen(true); // Activar pantalla completa al reiniciar
    } else {
      setIsPlaying(!isPlaying);
      if (!isPlaying) {
        setIsFullscreen(true); // Activar pantalla completa al presionar play
      }
    }
  };

  const handleStop = (): void => {
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentImageIndex(0);
    setIsResting(false);
    setWorkoutComplete(false);
    setCurrentExercise(0);
    setIsFullscreen(false); // Salir de pantalla completa al parar
  };

  const handleNext = (): void => {
    if (currentExercise < workout.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setCurrentTime(0);
      setCurrentImageIndex(0);
      setIsResting(false);
      setIsPlaying(false);
      setIsFullscreen(false); // Salir de pantalla completa al navegar manualmente
    }
  };

  const handlePrevious = (): void => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setCurrentTime(0);
      setCurrentImageIndex(0);
      setIsResting(false);
      setIsPlaying(false);
      setIsFullscreen(false); // Salir de pantalla completa al navegar manualmente
    }
  };

  const exitFullscreen = (): void => {
    setIsFullscreen(false);
    setIsPlaying(false); // Pausar cuando salga de pantalla completa
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setVolume(Number(event.target.value));
  };

  const toggleMute = (): void => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {!isFullscreen ? (
        // Vista Normal
        <>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
            <h2 className="text-lg font-bold">{workout.title}</h2>
            <p className="text-sm opacity-90">{workout.description}</p>
          </div>

          {/* Exercise Display */}
          <div className="p-6">
            {/* Current Exercise Info */}
            <div className="text-center mb-4">
              {workoutComplete ? (
                <>
                  <h3 className="text-xl font-semibold text-green-600 mb-2">
                    🎉 ¡Rutina Completada!
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Has terminado todos los ejercicios. ¡Excelente trabajo!
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {currentEx.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {currentEx.instructions}
                  </p>
                </>
              )}
              
              {/* Image Stage */}
              <div className={`rounded-lg p-6 mb-4 relative ${
                workoutComplete ? 'bg-green-50 border border-green-200' : 'bg-gray-100'
              }`}>
                <div className="text-4xl mb-2 transition-all duration-500">
                  {workoutComplete ? '🏆' : currentEx.images[currentImageIndex]}
                </div>
                <div className="text-xs text-gray-500">
                  {workoutComplete ? 'Rutina Completada' :
                   currentImageIndex === 0 ? 'Posición Inicial' : 
                   currentImageIndex === 1 ? 'Ejecución' : 'Posición Final'}
                </div>
                
                {/* Progress indicator on image */}
                {!workoutComplete && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {currentExercise + 1}/{workout.exercises.length}
                  </div>
                )}
              </div>

              {/* Time Display */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl font-mono font-bold text-gray-800">
                  {formatTime(currentTime)}
                </span>
                <span className="text-sm text-gray-500">
                  / {formatTime(totalTime)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    workoutComplete ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${workoutComplete ? 100 : progress}%` }}
                ></div>
              </div>
            </div>

            {/* Transport Controls */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <button 
                onClick={handlePrevious}
                disabled={currentExercise === 0}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
                aria-label="Ejercicio anterior"
              >
                <SkipBack className="w-5 h-5 text-gray-700" />
              </button>

              <button 
                onClick={handlePlayPause}
                className={`p-3 rounded-full text-white ${
                  workoutComplete ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                }`}
                aria-label={
                  workoutComplete ? "Reiniciar rutina" :
                  isPlaying ? "Pausar" : "Reproducir"
                }
              >
                {workoutComplete ? (
                  <span className="text-sm px-1">↺</span>
                ) : isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" />
                )}
              </button>

              <button 
                onClick={handleStop}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                aria-label="Detener"
              >
                <Square className="w-5 h-5 text-gray-700" />
              </button>

              <button 
                onClick={handleNext}
                disabled={currentExercise === workout.exercises.length - 1}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
                aria-label="Siguiente ejercicio"
              >
                <SkipForward className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <button 
                onClick={toggleMute}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                aria-label={isMuted ? "Activar audio" : "Silenciar audio"}
              >
                {isMuted ? 
                  <VolumeX className="w-4 h-4 text-gray-700" /> : 
                  <Volume2 className="w-4 h-4 text-gray-700" />
                }
              </button>
              
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-200 rounded-lg appearance-none slider"
                aria-label="Control de volumen"
              />
              <span className="text-xs text-gray-500 w-8">{volume}%</span>
            </div>

            {/* Exercise List */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Ejercicios:</h4>
              <div className="space-y-2">
                {workout.exercises.map((exercise, index) => (
                  <div 
                    key={exercise.id}
                    className={`flex items-center justify-between p-2 rounded ${
                      index === currentExercise ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        index < currentExercise || (index === currentExercise && isResting) || workoutComplete ? 'bg-green-500 text-white' :
                        index === currentExercise ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {index < currentExercise || (index === currentExercise && isResting) || workoutComplete ? '✓' : 
                         index === currentExercise ? '▶' : index + 1}
                      </div>
                      <span className={`text-sm ${
                        index < currentExercise || (index === currentExercise && isResting) || workoutComplete ? 'text-green-700 line-through' :
                        index === currentExercise ? 'font-medium text-blue-900' : 'text-gray-700'
                      }`}>
                        {exercise.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {exercise.duration}s
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Bar */}
            <div className="mt-4 p-2 bg-gray-50 rounded text-center">
              <span className="text-xs text-gray-600">
                {workoutComplete ? '🏆 Rutina Completada' :
                 isResting ? '⏰ Descansando' :
                 isPlaying ? '▶️ Reproduciendo' : '⏸️ Pausado'} • 
                Ejercicio {currentExercise + 1} de {workout.exercises.length}
                {isResting && ` • Próximo: ${workout.exercises[currentExercise + 1]?.name}`}
              </span>
            </div>
          </div>
        </>
      ) : (
        // Vista Pantalla Completa
        <div className="h-screen bg-black text-white flex flex-col">
          {/* Header minimalista con botón salir */}
          <div className="flex justify-between items-center p-4 bg-black bg-opacity-50">
            <div className="text-sm opacity-75">
              {currentExercise + 1}/{workout.exercises.length}
            </div>
            <button 
              onClick={exitFullscreen}
              className="text-white hover:text-gray-300 text-lg font-bold"
              aria-label="Salir de pantalla completa"
            >
              ✕
            </button>
          </div>

          {/* Área principal del ejercicio */}
          <div className="flex-1 flex flex-col justify-center items-center p-6">
            {/* Exercise Info */}
            <div className="text-center mb-8">
              {isResting ? (
                <>
                  <h2 className="text-3xl font-bold text-orange-400 mb-4">
                    ⏰ Descanso
                  </h2>
                  <p className="text-lg text-gray-300 mb-2">
                    Prepárate para el próximo ejercicio:
                  </p>
                  <p className="text-xl font-semibold text-white">
                    {workout.exercises[currentExercise + 1]?.name}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {currentEx.name}
                  </h2>
                  <p className="text-lg text-gray-300">
                    {currentEx.instructions}
                  </p>
                </>
              )}
            </div>

            {/* Image Stage Fullscreen */}
            <div className={`rounded-2xl p-12 mb-8 ${
              isResting ? 'bg-orange-900 bg-opacity-30' : 'bg-gray-800 bg-opacity-50'
            }`}>
              <div className="text-9xl mb-4 transition-all duration-500">
                {isResting ? '😌' : currentEx.images[currentImageIndex]}
              </div>
              <div className="text-sm text-gray-400 text-center">
                {isResting ? 'Tiempo de Descanso' :
                 currentImageIndex === 0 ? 'Posición Inicial' : 
                 currentImageIndex === 1 ? 'Ejecución' : 'Posición Final'}
              </div>
            </div>

            {/* Timer grande */}
            <div className="text-center mb-8">
              <div className="text-6xl font-mono font-bold mb-2">
                {formatTime(totalTime - currentTime)}
              </div>
              <div className="text-sm text-gray-400">
                {formatTime(currentTime)} / {formatTime(totalTime)}
              </div>
            </div>

            {/* Progress Bar grande */}
            <div className="w-full max-w-md mb-8">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    isResting ? 'bg-orange-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Controles en la parte inferior */}
          <div className="p-6 bg-black bg-opacity-50">
            {/* Transport Controls */}
            <div className="flex items-center justify-center space-x-6 mb-4">
              <button 
                onClick={handlePrevious}
                disabled={currentExercise === 0}
                className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:hover:bg-gray-800"
                aria-label="Ejercicio anterior"
              >
                <SkipBack className="w-6 h-6 text-white" />
              </button>

              <button 
                onClick={handlePlayPause}
                className="p-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white"
                aria-label={isPlaying ? "Pausar" : "Reproducir"}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </button>

              <button 
                onClick={handleStop}
                className="p-3 rounded-full bg-gray-800 hover:bg-gray-700"
                aria-label="Detener"
              >
                <Square className="w-6 h-6 text-white" />
              </button>

              <button 
                onClick={handleNext}
                disabled={currentExercise === workout.exercises.length - 1}
                className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:hover:bg-gray-800"
                aria-label="Siguiente ejercicio"
              >
                <SkipForward className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button 
                onClick={toggleMute}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
                aria-label={isMuted ? "Activar audio" : "Silenciar audio"}
              >
                {isMuted ? 
                  <VolumeX className="w-5 h-5 text-white" /> : 
                  <Volume2 className="w-5 h-5 text-white" />
                }
              </button>
              
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume}
                onChange={handleVolumeChange}
                className="w-32 h-2 bg-gray-700 rounded-lg appearance-none"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume}%, #374151 ${volume}%, #374151 100%)`
                }}
                aria-label="Control de volumen"
              />
              <span className="text-sm text-gray-400 w-10">{volume}%</span>
            </div>

            {/* Status en pantalla completa */}
            <div className="text-center mt-4">
              <span className="text-sm text-gray-400">
                {isResting ? '⏰ Descansando' : '▶️ Reproduciendo'} • 
                {isResting && ` Próximo: ${workout.exercises[currentExercise + 1]?.name}`}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================
// EXPORT
// =====================================

export default WorkoutPlayerDemo;

// Export types for external use
export type { Exercise, Workout, WorkoutState, WorkoutStatus, WorkoutPhase };