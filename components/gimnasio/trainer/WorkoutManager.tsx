"use client";
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Copy,
  Edit3,
  Users,
  Clock,
  Dumbbell,
  Target,
  MoreVertical,
  X,
  Calendar,
  Share
} from 'lucide-react';
import { set } from 'date-fns';

// Tipos específicos para eliminar 'any'
type ExerciseCategory = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'cardio';
type WorkoutCategory = 'strength' | 'cardio' | 'flexibility' | 'mixed';
type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
type TabType = 'templates' | 'create' | 'library';

interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  equipment: string[];
  primaryMuscles: string[];
  difficulty: DifficultyLevel;
  instructions: string;
  videoUrl?: string;
}

interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  sets: number;
  reps: number;
  weight?: number;
  restSeconds: number;
  notes?: string;
  orderIndex: number;
}

interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  category: WorkoutCategory;
  difficulty: DifficultyLevel;
  estimatedDuration: number; // minutes
  exercises: WorkoutExercise[];
  isPublic: boolean;
  assignedClients: number;
  createdAt: string;
  lastUsed?: string;
}

// Tipo para el formulario de creación
interface NewWorkoutForm {
  name: string;
  description: string;
  category: WorkoutCategory;
  difficulty: DifficultyLevel;
  estimatedDuration: number;
}

const WorkoutManager = () => {
  const [activeTab, setActiveTab] = useState<TabType>('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutTemplate | null>(null);

  editingWorkout

  // Mock exercises library
  const exercisesLibrary: Exercise[] = [
    {
      id: '1',
      name: 'Press de Banca',
      category: 'chest',
      equipment: ['barbell', 'bench'],
      primaryMuscles: ['pectorales', 'triceps'],
      difficulty: 3,
      instructions: 'Acuéstate en el banco con los pies firmes en el suelo...'
    },
    {
      id: '2',
      name: 'Sentadilla',
      category: 'legs',
      equipment: ['barbell'],
      primaryMuscles: ['cuádriceps', 'glúteos'],
      difficulty: 3,
      instructions: 'Posición de pie con pies separados al ancho de hombros...'
    },
    {
      id: '3',
      name: 'Peso Muerto',
      category: 'back',
      equipment: ['barbell'],
      primaryMuscles: ['isquiotibiales', 'espalda baja'],
      difficulty: 4,
      instructions: 'De pie frente a la barra con pies separados...'
    }
  ];

  // Mock workout templates
  const workoutTemplates: WorkoutTemplate[] = [
    {
      id: '1',
      name: 'Push Day Intenso',
      description: 'Entrenamiento enfocado en empuje: pecho, hombros y tríceps',
      category: 'strength',
      difficulty: 4,
      estimatedDuration: 60,
      exercises: [
        {
          id: '1',
          exerciseId: '1',
          exercise: exercisesLibrary[0],
          sets: 4,
          reps: 8,
          weight: 80,
          restSeconds: 120,
          orderIndex: 1
        }
      ],
      isPublic: false,
      assignedClients: 12,
      createdAt: '2024-01-15',
      lastUsed: '2024-02-10'
    },
    {
      id: '2',
      name: 'Leg Day Completo',
      description: 'Entrenamiento completo de piernas y glúteos',
      category: 'strength',
      difficulty: 5,
      estimatedDuration: 75,
      exercises: [
        {
          id: '2',
          exerciseId: '2',
          exercise: exercisesLibrary[1],
          sets: 4,
          reps: 10,
          weight: 100,
          restSeconds: 180,
          orderIndex: 1
        }
      ],
      isPublic: true,
      assignedClients: 8,
      createdAt: '2024-01-20',
      lastUsed: '2024-02-12'
    }
  ];

  const [workouts, setWorkouts] = useState<WorkoutTemplate[]>(workoutTemplates);


  setWorkouts
  
  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workout.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || workout.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (level: DifficultyLevel): string => {
    switch (level) {
      case 1: return 'text-green-400';
      case 2: return 'text-green-400';
      case 3: return 'text-yellow-400';
      case 4: return 'text-orange-400';
      case 5: return 'text-red-400';
    }
  };

  const getDifficultyText = (level: DifficultyLevel): string => {
    switch (level) {
      case 1: return 'Muy Fácil';
      case 2: return 'Fácil';
      case 3: return 'Intermedio';
      case 4: return 'Difícil';
      case 5: return 'Muy Difícil';
    }
  };

  const getCategoryColor = (category: WorkoutCategory): string => {
    switch (category) {
      case 'strength': return 'bg-red-500/20 text-red-400';
      case 'cardio': return 'bg-blue-500/20 text-blue-400';
      case 'flexibility': return 'bg-green-500/20 text-green-400';
      case 'mixed': return 'bg-purple-500/20 text-purple-400';
    }
  };

  const getCategoryText = (category: WorkoutCategory): string => {
    switch (category) {
      case 'strength': return 'Fuerza';
      case 'cardio': return 'Cardio';
      case 'flexibility': return 'Flexibilidad';
      case 'mixed': return 'Mixto';
    }
  };

  // Helper function para verificar si un string es una categoría válida
  const isValidWorkoutCategory = (value: string): value is WorkoutCategory => {
    return ['strength', 'cardio', 'flexibility', 'mixed'].includes(value);
  };

  // Helper function para verificar si un número es un nivel de dificultad válido
  const isValidDifficultyLevel = (value: number): value is DifficultyLevel => {
    return [1, 2, 3, 4, 5].includes(value);
  };

  const WorkoutCard = ({ workout }: { workout: WorkoutTemplate }) => (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-white text-lg">{workout.name}</h3>
            {workout.isPublic && (
              <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                Público
              </div>
            )}
          </div>
          <p className="text-gray-400 text-sm mb-3">{workout.description}</p>
          
          <div className="flex items-center space-x-4 text-sm">
            <span className={`px-2 py-1 rounded-full ${getCategoryColor(workout.category)}`}>
              {getCategoryText(workout.category)}
            </span>
            <span className={getDifficultyColor(workout.difficulty)}>
              {getDifficultyText(workout.difficulty)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-gray-400 mb-1">
            <Clock className="h-4 w-4" />
          </div>
          <p className="text-lg font-bold text-white">{workout.estimatedDuration}</p>
          <p className="text-xs text-gray-400">minutos</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-gray-400 mb-1">
            <Dumbbell className="h-4 w-4" />
          </div>
          <p className="text-lg font-bold text-white">{workout.exercises.length}</p>
          <p className="text-xs text-gray-400">ejercicios</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-gray-400 mb-1">
            <Users className="h-4 w-4" />
          </div>
          <p className="text-lg font-bold text-white">{workout.assignedClients}</p>
          <p className="text-xs text-gray-400">clientes</p>
        </div>
      </div>

      {/* Last Used */}
      {workout.lastUsed && (
        <div className="text-xs text-gray-400 mb-4">
          Última vez usado: {new Date(workout.lastUsed).toLocaleDateString('es-ES')}
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <button className="flex-1 bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all flex items-center justify-center space-x-1">
          <Calendar className="h-4 w-4" />
          <span>Asignar</span>
        </button>
        
        <button 
          onClick={() => setEditingWorkout(workout)}
          className="bg-gray-800 text-gray-400 hover:text-white py-2 px-3 rounded-lg text-sm transition-colors"
        >
          <Edit3 className="h-4 w-4" />
        </button>
        
        <button className="bg-gray-800 text-gray-400 hover:text-white py-2 px-3 rounded-lg text-sm transition-colors">
          <Copy className="h-4 w-4" />
        </button>
        
        <button className="bg-gray-800 text-gray-400 hover:text-white py-2 px-3 rounded-lg text-sm transition-colors">
          <Share className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const CreateWorkoutForm = () => {
    const [newWorkout, setNewWorkout] = useState<NewWorkoutForm>({
      name: '',
      description: '',
      category: 'strength',
      difficulty: 3,
      estimatedDuration: 60
    });

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      if (isValidWorkoutCategory(value)) {
        setNewWorkout({...newWorkout, category: value});
      }
    };

    const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = parseInt(e.target.value);
      if (isValidDifficultyLevel(value)) {
        setNewWorkout({...newWorkout, difficulty: value});
      }
    };

    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Crear Nuevo Entrenamiento</h2>
          <button 
            onClick={() => setShowCreateModal(false)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre del Entrenamiento
              </label>
              <input
                type="text"
                value={newWorkout.name}
                onChange={(e) => setNewWorkout({...newWorkout, name: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fuchsia-500"
                placeholder="Ej: Push Day Intenso"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duración Estimada (min)
              </label>
              <input
                type="number"
                value={newWorkout.estimatedDuration}
                onChange={(e) => setNewWorkout({...newWorkout, estimatedDuration: parseInt(e.target.value) || 0})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              value={newWorkout.description}
              onChange={(e) => setNewWorkout({...newWorkout, description: e.target.value})}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fuchsia-500"
              placeholder="Describe el objetivo y características del entrenamiento..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoría
              </label>
              <select
                value={newWorkout.category}
                onChange={handleCategoryChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fuchsia-500"
              >
                <option value="strength">Fuerza</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibilidad</option>
                <option value="mixed">Mixto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dificultad
              </label>
              <select
                value={newWorkout.difficulty}
                onChange={handleDifficultyChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fuchsia-500"
              >
                <option value={1}>Muy Fácil</option>
                <option value={2}>Fácil</option>
                <option value={3}>Intermedio</option>
                <option value={4}>Difícil</option>
                <option value={5}>Muy Difícil</option>
              </select>
            </div>
          </div>

          {/* Exercise Builder Area */}
          <div className="border-t border-gray-800 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Ejercicios</h3>
            
            {/* Add Exercise Button */}
            <button className="w-full border-2 border-dashed border-gray-700 rounded-lg py-8 text-gray-400 hover:border-fuchsia-500 hover:text-fuchsia-400 transition-all flex flex-col items-center space-y-2">
              <Plus className="h-8 w-8" />
              <span>Agregar Ejercicio</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-800">
            <button className="flex-1 bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all">
              Crear Entrenamiento
            </button>
            <button 
              onClick={() => setShowCreateModal(false)}
              className="bg-gray-800 text-gray-400 hover:text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Entrenamientos</h1>
            <p className="text-gray-400">Crea y gestiona rutinas para tus clientes</p>
          </div>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-3 rounded-xl hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Crear Entrenamiento</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg">
          {[
            { id: 'templates' as const, label: 'Mis Plantillas', icon: Dumbbell },
            { id: 'create' as const, label: 'Crear Nuevo', icon: Plus },
            { id: 'library' as const, label: 'Biblioteca', icon: Target }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'templates' && (
          <>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar entrenamientos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-fuchsia-500 transition-colors"
                />
              </div>
              
              <div className="flex space-x-2">
                {(['all', 'strength', 'cardio', 'flexibility', 'mixed'] as const).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-fuchsia-600 text-white'
                        : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
                    }`}
                  >
                    {category === 'all' ? 'Todos' : getCategoryText(category as WorkoutCategory)}
                  </button>
                ))}
              </div>
            </div>

            {/* Workouts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
            </div>

            {/* Empty State */}
            {filteredWorkouts.length === 0 && (
              <div className="text-center py-12">
                <Dumbbell className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No se encontraron entrenamientos</h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery 
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Crea tu primer entrenamiento para comenzar'
                  }
                </p>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all"
                >
                  Crear Entrenamiento
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'create' && <CreateWorkoutForm />}

        {activeTab === 'library' && (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Biblioteca de Ejercicios</h3>
            <p className="text-gray-400">Próximamente: biblioteca completa de ejercicios</p>
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-950 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CreateWorkoutForm />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutManager;