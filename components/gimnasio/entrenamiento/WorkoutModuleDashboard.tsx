"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Play,
  Pause,
  RotateCcw,
  Dumbbell,
  Users,
  Calendar,
  Clock,
  Star,
  BookOpen,
  Copy,
  Edit,
  Flame,
  CheckCircle,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';

// Types
type ExerciseCategory = 'strength' | 'cardio' | 'plyometric';
type TemplateDifficulty = 1 | 2 | 3 | 4 | 5;
type SessionStatus = 'completed' | 'in_progress' | 'scheduled';
type TabValue = 'overview' | 'exercises' | 'templates' | 'sessions';
type MuscleGroup = 'quadriceps' | 'glutes' | 'chest' | 'triceps' | 'abs' | 'core' | 'full_body' | 'back' | 'hamstrings' | 'shoulders';
type Equipment = 'bodyweight' | 'barbell' | 'dumbbell' | 'bench';
type FilterCategory = 'all' | ExerciseCategory;
type FilterDifficulty = 'all' | '1' | '2' | '3' | '4' | '5';

// Interfaces
interface Exercise {
  id: number;
  name: string;
  category: ExerciseCategory;
  primaryMuscles: MuscleGroup[];
  equipment: Equipment[];
  difficulty: TemplateDifficulty;
  image: string;
  description: string;
  instructions: string;
  duration: string;
  calories: number;
  popularity: number;
}

interface WorkoutTemplate {
  id: number;
  name: string;
  category: ExerciseCategory;
  difficulty: TemplateDifficulty;
  duration: number;
  exercises: number;
  calories: number;
  description: string;
  muscleGroups: MuscleGroup[];
  equipment: Equipment[];
  popularity: number;
  uses: number;
}

interface TodaySession {
  id: number;
  clientName: string;
  clientAvatar: string;
  time: string;
  workout: string;
  duration: number;
  status: SessionStatus;
}

interface WorkoutStats {
  totalTemplates: number;
  totalExercises: number;
  sessionsToday: number;
  sessionsCompleted: number;
  averageDuration: number;
  totalCaloriesBurned: number;
}

interface StatsCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'fire' | 'power' | 'energy' | 'strength';
}

interface ExerciseCardProps {
  exercise: Exercise;
  onAdd: (exercise: Exercise) => void;
}

interface WorkoutTemplateCardProps {
  template: WorkoutTemplate;
}

interface SessionCardProps {
  session: TodaySession;
}

// Datos de ejemplo
const exercisesLibrary: Exercise[] = [
  {
    id: 1,
    name: "Sentadillas",
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    equipment: ["bodyweight"],
    difficulty: 2,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
    description: "Ejercicio fundamental para el tren inferior",
    instructions: "Mantén la espalda recta, baja hasta que los muslos estén paralelos al suelo",
    duration: "45 seg",
    calories: 8,
    popularity: 95
  },
  {
    id: 2,
    name: "Flexiones",
    category: "strength", 
    primaryMuscles: ["chest", "triceps"],
    equipment: ["bodyweight"],
    difficulty: 2,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
    description: "Ejercicio básico para el tren superior",
    instructions: "Mantén el cuerpo en línea recta, baja controladamente",
    duration: "30 seg",
    calories: 6,
    popularity: 88
  },
  {
    id: 3,
    name: "Plancha",
    category: "strength",
    primaryMuscles: ["abs", "core"],
    equipment: ["bodyweight"],
    difficulty: 3,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop",
    description: "Ejercicio isométrico para el core",
    instructions: "Mantén el cuerpo rígido en posición de plancha",
    duration: "60 seg",
    calories: 5,
    popularity: 92
  },
  {
    id: 4,
    name: "Burpees",
    category: "plyometric",
    primaryMuscles: ["full_body"],
    equipment: ["bodyweight"],
    difficulty: 4,
    image: "https://images.unsplash.com/photo-1594736797933-d0d3dc5ca0b8?w=200&h=200&fit=crop",
    description: "Ejercicio completo de alta intensidad",
    instructions: "Combina sentadilla, plancha, flexión y salto",
    duration: "30 seg",
    calories: 12,
    popularity: 76
  },
  {
    id: 5,
    name: "Press Banca",
    category: "strength",
    primaryMuscles: ["chest", "triceps"],
    equipment: ["barbell", "bench"],
    difficulty: 3,
    image: "https://images.unsplash.com/photo-1594736797531-516da82d6c33?w=200&h=200&fit=crop",
    description: "Ejercicio principal para el pecho",
    instructions: "Controla el peso en bajada y subida explosiva",
    duration: "45 seg",
    calories: 10,
    popularity: 89
  },
  {
    id: 6,
    name: "Peso Muerto",
    category: "strength",
    primaryMuscles: ["back", "glutes", "hamstrings"],
    equipment: ["barbell"],
    difficulty: 4,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
    description: "Rey de los ejercicios de fuerza",
    instructions: "Mantén la espalda recta durante todo el movimiento",
    duration: "50 seg",
    calories: 15,
    popularity: 94
  }
];

const workoutTemplates: WorkoutTemplate[] = [
  {
    id: 1,
    name: "HIIT Principiante",
    category: "cardio",
    difficulty: 2,
    duration: 20,
    exercises: 6,
    calories: 180,
    description: "Entrenamiento intervalos alta intensidad para principiantes",
    muscleGroups: ["full_body"],
    equipment: ["bodyweight"],
    popularity: 4.8,
    uses: 234
  },
  {
    id: 2,
    name: "Fuerza Tren Superior",
    category: "strength", 
    difficulty: 3,
    duration: 45,
    exercises: 8,
    calories: 220,
    description: "Rutina completa para desarrollar fuerza en brazos, pecho y espalda",
    muscleGroups: ["chest", "back", "shoulders"],
    equipment: ["dumbbell", "barbell"],
    popularity: 4.9,
    uses: 156
  },
  {
    id: 3,
    name: "Core & Abs Intenso",
    category: "strength",
    difficulty: 4,
    duration: 25,
    exercises: 10,
    calories: 150,
    description: "Rutina específica para fortalecer el core y abdominales",
    muscleGroups: ["abs", "core"],
    equipment: ["bodyweight"],
    popularity: 4.7,
    uses: 189
  }
];

const todaySessions: TodaySession[] = [
  {
    id: 1,
    clientName: "María González",
    clientAvatar: "https://images.unsplash.com/photo-1494790108755-2616b2e57004?w=40&h=40&fit=crop&crop=face",
    time: "09:00",
    workout: "HIIT Principiante",
    duration: 20,
    status: "completed"
  },
  {
    id: 2,
    clientName: "Carlos Ruiz",
    clientAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    time: "10:30",
    workout: "Fuerza Tren Superior",
    duration: 45,
    status: "in_progress"
  },
  {
    id: 3,
    clientName: "Ana López", 
    clientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    time: "15:00",
    workout: "Core & Abs Intenso",
    duration: 25,
    status: "scheduled"
  },
  {
    id: 4,
    clientName: "Diego Fernández",
    clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    time: "17:30",
    workout: "HIIT Principiante",
    duration: 20,
    status: "scheduled"
  }
];

const workoutStats: WorkoutStats = {
  totalTemplates: 12,
  totalExercises: 48,
  sessionsToday: 4,
  sessionsCompleted: 1,
  averageDuration: 32,
  totalCaloriesBurned: 1250
};

const WorkoutModuleDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('overview');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<FilterDifficulty>('all');
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!timerActive && timerSeconds !== 0) {
      clearInterval(interval!);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerSeconds]);

  const formatTime = (seconds: number): string => {
    const mins: number = Math.floor(seconds / 60);
    const secs: number = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getMuscleGroupTranslation = (muscle: MuscleGroup): string => {
    const translations: Record<MuscleGroup, string> = {
      quadriceps: 'Cuádriceps',
      glutes: 'Glúteos',
      chest: 'Pecho',
      triceps: 'Tríceps',
      abs: 'Abdomen',
      core: 'Core',
      full_body: 'Cuerpo completo',
      back: 'Espalda',
      hamstrings: 'Isquios',
      shoulders: 'Hombros'
    };
    return translations[muscle] || muscle;
  };

  const getCategoryTranslation = (category: ExerciseCategory): string => {
    const translations: Record<ExerciseCategory, string> = {
      strength: 'Fuerza',
      cardio: 'Cardio',
      plyometric: 'Pliométrico'
    };
    return translations[category];
  };

  const filteredExercises: Exercise[] = exercisesLibrary.filter(exercise => {
    const matchesSearch: boolean = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory: boolean = filterCategory === 'all' || exercise.category === filterCategory;
    const matchesDifficulty: boolean = filterDifficulty === 'all' || exercise.difficulty.toString() === filterDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleTabChange = (value: string): void => {
    setActiveTab(value as TabValue);
  };

  const handleAddExercise = (exercise: Exercise): void => {
    setSelectedExercises(prev => [...prev, exercise]);
  };

  const handleRemoveExercise = (index: number): void => {
    setSelectedExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearExercises = (): void => {
    setSelectedExercises([]);
  };

  const handleTimerToggle = (): void => {
    setTimerActive(!timerActive);
  };

  const handleTimerReset = (): void => {
    setTimerSeconds(0);
    setTimerActive(false);
  };

  const StatsCard: React.FC<StatsCardProps> = ({ 
    icon: Icon, 
    title, 
    value, 
    subtitle, 
    color = "fire" 
  }) => {
    const getColorClasses = (color: string) => {
      const colors = {
        fire: 'from-red-600 to-orange-600 shadow-red-500/25',
        power: 'from-purple-600 to-pink-600 shadow-purple-500/25',
        energy: 'from-yellow-600 to-orange-600 shadow-yellow-500/25',
        strength: 'from-gray-800 to-gray-600 shadow-gray-500/25'
      };
      return colors[color as keyof typeof colors] || colors.fire;
    };

    return (
      <Card className="relative overflow-hidden bg-gradient-to-br border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
        <div className={`absolute inset-0 bg-gradient-to-br ${getColorClasses(color)} opacity-90`} />
        <div className="absolute inset-0 bg-black/10" />
        <CardContent className="relative p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
              <Icon className="h-8 w-8 text-white drop-shadow-lg" />
            </div>
            <div>
              <p className="text-3xl font-black tracking-tight drop-shadow-lg">{value}</p>
              <p className="text-sm font-bold text-white/90 uppercase tracking-wide">{title}</p>
              {subtitle && <p className="text-xs text-white/80 font-medium">{subtitle}</p>}
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
            <Icon className="h-24 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  };

  const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onAdd }) => (
    <Card className="relative overflow-hidden bg-white border-2 border-transparent hover:border-red-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl group cursor-pointer">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={exercise.image} 
          alt={exercise.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-3 left-3">
          <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0 font-bold text-xs shadow-lg">
            {getCategoryTranslation(exercise.category)}
          </Badge>
        </div>
        
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 bg-black/70 rounded-full px-3 py-1 backdrop-blur-sm">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-xs text-white font-bold">{exercise.popularity}%</span>
          </div>
        </div>

        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full border-2 border-white ${i < exercise.difficulty ? 'bg-red-500' : 'bg-transparent'} transition-all duration-200`}
              />
            ))}
          </div>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-black text-lg text-gray-900 group-hover:text-red-600 transition-colors duration-200">{exercise.name}</h3>
          <Flame className="h-5 w-5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 font-medium">{exercise.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700 font-bold">
            <Clock className="h-4 w-4 text-red-500" />
            {exercise.duration}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 font-bold">
            <Flame className="h-4 w-4 text-orange-500" />
            {exercise.calories} cal
          </div>
        </div>
        
        <div className="flex gap-1 mb-4 flex-wrap">
          {exercise.primaryMuscles.map((muscle: MuscleGroup) => (
            <Badge key={muscle} variant="outline" className="text-xs border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600 transition-colors font-medium">
              {getMuscleGroupTranslation(muscle)}
            </Badge>
          ))}
        </div>
        
        <Button 
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold text-sm py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg border-0"
          onClick={() => onAdd(exercise)}
        >
          <Plus className="h-4 w-4 mr-2" />
          AGREGAR A RUTINA
        </Button>
      </CardContent>
    </Card>
  );

  const WorkoutTemplateCard: React.FC<WorkoutTemplateCardProps> = ({ template }) => (
    <Card className="relative overflow-hidden bg-white hover:shadow-2xl transition-all duration-300 hover:scale-102 group border-2 border-transparent hover:border-red-500">
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="relative p-6">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="font-black text-xl text-gray-900 group-hover:text-red-600 transition-colors duration-200">{template.name}</h3>
            <p className="text-sm text-gray-600 font-medium mt-1">{template.description}</p>
          </div>
          <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-3 py-1">
            <Star className="h-4 w-4 text-white fill-current" />
            <span className="text-sm font-bold text-white">{template.popularity}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 group-hover:from-blue-500/20 group-hover:to-blue-600/20 transition-all duration-300">
            <p className="text-3xl font-black text-blue-600">{template.duration}</p>
            <p className="text-xs text-blue-700 uppercase font-bold tracking-wide">minutos</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10 group-hover:from-green-500/20 group-hover:to-green-600/20 transition-all duration-300">
            <p className="text-3xl font-black text-green-600">{template.exercises}</p>
            <p className="text-xs text-green-700 uppercase font-bold tracking-wide">ejercicios</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-600/10 group-hover:from-orange-500/20 group-hover:to-red-600/20 transition-all duration-300">
            <p className="text-3xl font-black text-red-600">{template.calories}</p>
            <p className="text-xs text-red-700 uppercase font-bold tracking-wide">calorías</p>
          </div>
        </div>
        
        <div className="flex gap-1 mb-5 flex-wrap">
          {template.muscleGroups.map((group: MuscleGroup) => (
            <Badge key={group} className="bg-gradient-to-r from-gray-800 to-gray-600 text-white text-xs font-bold border-0">
              {getMuscleGroupTranslation(group)}
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2 mb-4">
          <Button className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold border-0 transition-all duration-300 hover:scale-105">
            <Play className="h-4 w-4 mr-2" />
            USAR PLANTILLA
          </Button>
          <Button variant="outline" className="border-2 border-gray-300 hover:border-red-500 hover:text-red-600 transition-all duration-300 hover:scale-105">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="border-2 border-gray-300 hover:border-red-500 hover:text-red-600 transition-all duration-300 hover:scale-105">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="font-bold">Usado <span className="text-red-600">{template.uses}</span> veces</span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full border border-red-300 ${i < template.difficulty ? 'bg-red-500' : 'bg-gray-200'} transition-all duration-200`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
    const getStatusConfig = (status: SessionStatus) => {
      const configs = {
        completed: { 
          color: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white', 
          text: 'COMPLETADO',
          icon: CheckCircle 
        },
        in_progress: { 
          color: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white', 
          text: 'EN PROGRESO',
          icon: Zap 
        },
        scheduled: { 
          color: 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white', 
          text: 'PROGRAMADO',
          icon: Clock 
        }
      };
      return configs[status];
    };
    
    const statusConfig = getStatusConfig(session.status);
    const StatusIcon = statusConfig.icon;
    
    return (
      <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 group border-2 border-transparent hover:border-red-500">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-red-500 ring-offset-2 group-hover:ring-4 transition-all duration-300">
                <AvatarImage src={session.clientAvatar} />
                <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-600 text-white font-bold">
                  {session.clientName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-black text-gray-900 group-hover:text-red-600 transition-colors duration-200">{session.clientName}</p>
                <p className="text-sm text-gray-600 font-bold">{session.time}</p>
              </div>
            </div>
            <Badge className={`${statusConfig.color} font-bold text-xs px-3 py-1 flex items-center gap-1 border-0 shadow-lg`}>
              <StatusIcon className="h-3 w-3" />
              {statusConfig.text}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <p className="font-black text-lg text-gray-900">{session.workout}</p>
            <div className="flex items-center gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2 font-bold">
                <Clock className="h-4 w-4 text-red-500" />
                {session.duration} min
              </div>
              {session.status === 'completed' && (
                <div className="flex items-center gap-2 text-green-600 font-bold">
                  <CheckCircle className="h-4 w-4" />
                  ¡Misión cumplida!
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-700 to-orange-600 rounded-2xl border-0 shadow-2xl">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute -right-10 -top-10 opacity-10">
            <Dumbbell className="h-32 w-32 rotate-12" />
          </div>
          <div className="relative p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">POWER GYM</h1>
                <p className="text-red-100 font-bold text-lg mt-2">Centro de Entrenamientos - Fuerza • Pasión • Resultados</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold transition-all duration-300 hover:scale-105 bg-transparent">
                  <BookOpen className="h-4 w-4 mr-2" />
                  BIBLIOTECA
                </Button>
                <Button className="bg-white text-red-600 hover:bg-red-50 font-black transition-all duration-300 hover:scale-105 shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  NUEVO EJERCICIO
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard 
            icon={Dumbbell} 
            title="Ejercicios totales" 
            value={workoutStats.totalExercises}
            subtitle="En tu arsenal"
            color="strength"
          />
          <StatsCard 
            icon={Target} 
            title="Plantillas" 
            value={workoutStats.totalTemplates}
            subtitle="Rutinas explosivas"
            color="power"
          />
          <StatsCard 
            icon={Users} 
            title="Sesiones hoy" 
            value={`${workoutStats.sessionsCompleted}/${workoutStats.sessionsToday}`}
            subtitle="Guerreros activos"
            color="energy"
          />
          <StatsCard 
            icon={Flame} 
            title="Calorías quemadas" 
            value={workoutStats.totalCaloriesBurned}
            subtitle="Energía liberada"
            color="fire"
          />
        </div>

        {/* Timer Widget */}
        <Card className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-red-900 to-black border-0 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20" />
          <CardContent className="relative p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">CRONÓMETRO DE BATALLA</h3>
                <p className="text-red-200 font-bold">Mide tu fuerza, cronometra tu pasión</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-5xl font-black font-mono text-white drop-shadow-lg tracking-wider">
                    {formatTime(timerSeconds)}
                  </p>
                  <p className="text-sm text-red-200 uppercase font-bold tracking-wide mt-2">Tiempo de guerra</p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white font-black p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-lg border-0"
                    onClick={handleTimerToggle}
                  >
                    {timerActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <Button 
                    className="bg-gray-700 hover:bg-gray-600 text-white font-black p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-lg border-0"
                    onClick={handleTimerReset}
                  >
                    <RotateCcw className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-0 p-2 rounded-xl">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-600 data-[state=active]:text-white font-black text-gray-300 transition-all duration-300"
            >
              RESUMEN
            </TabsTrigger>
            <TabsTrigger 
              value="exercises"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-600 data-[state=active]:text-white font-black text-gray-300 transition-all duration-300"
            >
              EJERCICIOS
            </TabsTrigger>
            <TabsTrigger 
              value="templates"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-600 data-[state=active]:text-white font-black text-gray-300 transition-all duration-300"
            >
              PLANTILLAS
            </TabsTrigger>
            <TabsTrigger 
              value="sessions"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-600 data-[state=active]:text-white font-black text-gray-300 transition-all duration-300"
            >
              SESIONES
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Today's Sessions */}
              <Card className="bg-white shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-t-lg">
                  <CardTitle className="font-black text-xl">GUERREROS DE HOY</CardTitle>
                  <CardDescription className="text-gray-200 font-bold">Entrenamientos programados para conquistar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  {todaySessions.map((session: TodaySession) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </CardContent>
              </Card>

              {/* Popular Templates */}
              <Card className="bg-white shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-lg">
                  <CardTitle className="font-black text-xl">RUTINAS LEGENDARIAS</CardTitle>
                  <CardDescription className="text-red-100 font-bold">Tus entrenamientos más poderosos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  {workoutTemplates.slice(0, 3).map((template: WorkoutTemplate) => (
                    <div key={template.id} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 transition-all duration-300 hover:shadow-lg group">
                      <div>
                        <p className="font-black text-gray-900 group-hover:text-red-600 transition-colors duration-200">{template.name}</p>
                        <p className="text-sm text-gray-600 font-bold">{template.duration} min • {template.exercises} ejercicios</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold border-0">{template.uses} usos</Badge>
                        <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold border-0 transition-all duration-300 hover:scale-105">
                          USAR
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Weekly Progress */}
            <Card className="bg-white shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="font-black text-xl">PROGRESO DE CONQUISTA</CardTitle>
                <CardDescription className="text-purple-100 font-bold">Tu dominio semanal del entrenamiento</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-7 gap-4">
                  {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map((day: string, index: number) => (
                    <div key={day} className="text-center">
                      <p className="text-sm font-black mb-3 text-gray-700">{day}</p>
                      <div className="space-y-2">
                        {[0, 1, 2, 3].map((session: number) => (
                          <div 
                            key={session} 
                            className={`h-10 rounded-lg transition-all duration-300 hover:scale-105 ${
                              (index < 5 && session < 2) ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg' : 
                              (index < 5 && session < 3) ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exercises" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex gap-4 items-center bg-white p-6 rounded-xl shadow-xl border-0">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="Buscar ejercicios de combate..." 
                  className="pl-12 h-12 text-lg font-bold border-2 border-gray-300 focus:border-red-500 rounded-xl"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={filterCategory} onValueChange={(value: FilterCategory) => setFilterCategory(value)}>
                <SelectTrigger className="w-52 h-12 border-2 border-gray-300 focus:border-red-500 rounded-xl font-bold">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="strength">Fuerza</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="plyometric">Pliométrico</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterDifficulty} onValueChange={(value: FilterDifficulty) => setFilterDifficulty(value)}>
                <SelectTrigger className="w-52 h-12 border-2 border-gray-300 focus:border-red-500 rounded-xl font-bold">
                  <SelectValue placeholder="Dificultad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las dificultades</SelectItem>
                  <SelectItem value="1">Principiante</SelectItem>
                  <SelectItem value="2">Fácil</SelectItem>
                  <SelectItem value="3">Moderado</SelectItem>
                  <SelectItem value="4">Difícil</SelectItem>
                  <SelectItem value="5">Extremo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Exercise Library */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map((exercise: Exercise) => (
                <ExerciseCard 
                  key={exercise.id} 
                  exercise={exercise} 
                  onAdd={handleAddExercise}
                />
              ))}
            </div>

            {/* Workout Builder Sidebar */}
            {selectedExercises.length > 0 && (
              <Card className="fixed right-6 top-24 w-80 z-50 shadow-2xl border-0 bg-gradient-to-br from-red-600 to-orange-600 text-white">
                <CardHeader>
                  <CardTitle className="text-lg font-black">CONSTRUCTOR DE RUTINA</CardTitle>
                  <CardDescription className="text-red-100 font-bold">{selectedExercises.length} ejercicios listos para batalla</CardDescription>
                </CardHeader>
                <CardContent className="max-h-60 overflow-y-auto space-y-2">
                  {selectedExercises.map((exercise: Exercise, index: number) => (
                    <div key={`${exercise.id}-${index}`} className="flex items-center justify-between p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                      <span className="text-sm font-bold">{exercise.name}</span>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-white hover:bg-white/20 font-black"
                        onClick={() => handleRemoveExercise(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </CardContent>
                <div className="p-4 pt-0 flex gap-2">
                  <Button className="flex-1 bg-white text-red-600 hover:bg-red-50 font-black">CREAR PLANTILLA</Button>
                  <Button variant="outline" onClick={handleClearExercises} className="border-white text-white hover:bg-white hover:text-red-600 font-bold">
                    LIMPIAR
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-xl border-0">
              <div>
                <h2 className="text-2xl font-black text-gray-900">ARSENAL DE PLANTILLAS</h2>
                <p className="text-gray-600 font-bold">Rutinas probadas en combate para tus guerreros</p>
              </div>
              <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-black transition-all duration-300 hover:scale-105 border-0 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                NUEVA PLANTILLA
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {workoutTemplates.map((template: WorkoutTemplate) => (
                <WorkoutTemplateCard key={template.id} template={template} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-xl border-0">
              <div>
                <h2 className="text-2xl font-black text-gray-900">PROGRAMAR BATALLAS</h2>
                <p className="text-gray-600 font-bold">Organiza las sesiones de entrenamiento de tus atletas</p>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black transition-all duration-300 hover:scale-105 border-0 shadow-lg">
                <Calendar className="h-4 w-4 mr-2" />
                NUEVA SESIÓN
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todaySessions.map((session: TodaySession) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>

            {/* Calendar View */}
            <Card className="bg-white shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="font-black text-xl">CALENDARIO DE GUERRA</CardTitle>
                <CardDescription className="text-indigo-100 font-bold">Programación estratégica para esta semana</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-7 gap-4 text-center">
                  {['LUN 28', 'MAR 29', 'MIÉ 30', 'JUE 31', 'VIE 1', 'SÁB 2', 'DOM 3'].map((day: string, index: number) => (
                    <div key={day} className="space-y-3">
                      <h3 className="font-black text-sm text-gray-700">{day}</h3>
                      <div className="space-y-2">
                        {index < 5 && (
                          <>
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs p-3 rounded-lg font-bold shadow-lg hover:scale-105 transition-transform cursor-pointer">
                              María - 9:00
                            </div>
                            {index < 3 && (
                              <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xs p-3 rounded-lg font-bold shadow-lg hover:scale-105 transition-transform cursor-pointer">
                                Carlos - 10:30
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WorkoutModuleDashboard;