"use client";
import React from 'react';
import { Play, Clock, Dumbbell, Target, ChevronRight } from 'lucide-react';

interface WorkoutCardProps {
  workoutName: string;
  duration: number;
  exercises: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  isCompleted?: boolean;
  onStartWorkout: () => void;
}

const TodaysWorkoutCard: React.FC<WorkoutCardProps> = ({
  workoutName,
  duration,
  exercises,
  difficulty,
  progress,
  isCompleted = false,
  onStartWorkout
}) => {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-500 via-violet-600 to-purple-700 p-1">
      {/* Gradient Border Effect */}
      <div className="rounded-2xl bg-black p-6">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-fuchsia-300">Hoy • {new Date().toLocaleDateString('es-ES', { weekday: 'long' })}</p>
            <h2 className="text-2xl font-bold text-white">{workoutName}</h2>
          </div>
          
          {isCompleted ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <button 
              onClick={onStartWorkout}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-fuchsia-500/25"
            >
              <Play className="h-5 w-5 text-white ml-0.5" fill="currentColor" />
            </button>
          )}
        </div>

        {/* Stats Row */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-violet-500/20 p-2">
              <Clock className="h-4 w-4 text-violet-300" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Duración</p>
              <p className="text-sm font-semibold text-white">{duration} min</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-fuchsia-500/20 p-2">
              <Dumbbell className="h-4 w-4 text-fuchsia-300" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Ejercicios</p>
              <p className="text-sm font-semibold text-white">{exercises}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-purple-500/20 p-2">
              <Target className="h-4 w-4 text-purple-300" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Nivel</p>
              <p className={`text-sm font-semibold ${getDifficultyColor(difficulty)}`}>{difficulty}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {!isCompleted && progress > 0 && (
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-gray-300">Progreso del entrenamiento</p>
              <p className="text-sm font-semibold text-fuchsia-300">{progress}%</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-800">
              <div 
                className="h-full bg-gradient-to-r from-fuchsia-500 to-violet-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <button 
          onClick={onStartWorkout}
          className="group flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 p-4 transition-all duration-200 hover:from-fuchsia-500 hover:to-violet-500 hover:shadow-lg hover:shadow-fuchsia-500/25"
        >
          <span className="font-semibold text-white">
            {isCompleted ? 'Ver Resumen' : progress > 0 ? 'Continuar Entrenamiento' : 'Comenzar Entrenamiento'}
          </span>
          <ChevronRight className="h-5 w-5 text-white transition-transform group-hover:translate-x-1" />
        </button>

        {/* Decorative Elements */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-fuchsia-500/10 to-violet-500/10 blur-xl" />
        <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-gradient-to-tr from-purple-500/10 to-fuchsia-500/10 blur-lg" />
      </div>
    </div>
  );
};

// Demo Component
const WorkoutCardDemo = () => {
  const [workoutState, setWorkoutState] = React.useState({
    isCompleted: false,
    progress: 0
  });

  const handleStartWorkout = () => {
    if (workoutState.isCompleted) {
      // Navigate to summary
      console.log('Navigate to workout summary');
    } else if (workoutState.progress > 0) {
      // Continue workout
      console.log('Continue workout');
    } else {
      // Start new workout
      setWorkoutState({ isCompleted: false, progress: 35 });
      console.log('Start new workout');
    }
  };

  const toggleComplete = () => {
    setWorkoutState(prev => ({
      isCompleted: !prev.isCompleted,
      progress: prev.isCompleted ? 100 : 0
    }));
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="mx-auto max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">GymPro</h1>
          <p className="text-gray-400">Cliente Dashboard</p>
        </div>

        {/* Main Workout Card */}
        <TodaysWorkoutCard
          workoutName="Push Day Intenso"
          duration={45}
          exercises={8}
          difficulty="Intermediate"
          progress={workoutState.progress}
          isCompleted={workoutState.isCompleted}
          onStartWorkout={handleStartWorkout}
        />

        {/* Demo Controls */}
        <div className="rounded-lg bg-gray-900 p-4">
          <p className="text-sm font-medium text-gray-300 mb-3">Demo Controls:</p>
          <div className="flex gap-2">
            <button 
              onClick={() => setWorkoutState({ isCompleted: false, progress: 0 })}
              className="rounded-lg bg-gray-800 px-3 py-2 text-xs text-white hover:bg-gray-700"
            >
              Reset
            </button>
            <button 
              onClick={() => setWorkoutState({ isCompleted: false, progress: 65 })}
              className="rounded-lg bg-violet-600 px-3 py-2 text-xs text-white hover:bg-violet-700"
            >
              In Progress
            </button>
            <button 
              onClick={toggleComplete}
              className="rounded-lg bg-green-600 px-3 py-2 text-xs text-white hover:bg-green-700"
            >
              Toggle Complete
            </button>
          </div>
        </div>

        {/* Quick Stats Preview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-gray-900 p-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-fuchsia-500/20 p-2">
                <svg className="h-5 w-5 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400">Racha</p>
                <p className="text-lg font-bold text-white">7 días</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gray-900 p-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-violet-500/20 p-2">
                <svg className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400">Peso</p>
                <p className="text-lg font-bold text-white">-2.1kg</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCardDemo;