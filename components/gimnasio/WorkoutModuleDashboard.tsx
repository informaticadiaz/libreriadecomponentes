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
  LucideIcon
} from 'lucide-react';

// Types y enums
type ExerciseCategory = 'strength' | 'cardio' | 'plyometric';
type TemplateDifficulty = 1 | 2 | 3 | 4 | 5;
type SessionStatus = 'completed' | 'in_progress' | 'scheduled';
type TabValue = 'overview' | 'exercises' | 'templates' | 'sessions';
type MuscleGroup = 'quadriceps' | 'glutes' | 'chest' | 'triceps' | 'abs' | 'core' | 'full_body' | 'back' | 'hamstrings' | 'shoulders';
type Equipment = 'bodyweight' | 'barbell' | 'dumbbell' | 'bench';
type FilterCategory = 'all' | ExerciseCategory;
type FilterDifficulty = 'all' | '1' | '2' | '3' | '4' | '5';

// Interfaces principales
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

// Props interfaces para componentes internos
interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'blue' | 'green' | 'orange' | 'red';
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

// Datos hardcodeados
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
    color = "blue" 
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full bg-${color}-100`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onAdd }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <img 
          src={exercise.image} 
          alt={exercise.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="text-xs">
            {getCategoryTranslation(exercise.category)}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <div className="flex items-center gap-1 bg-black/50 rounded px-2 py-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-xs text-white">{exercise.popularity}%</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">{exercise.name}</h3>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${i < exercise.difficulty ? 'bg-orange-400' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{exercise.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            {exercise.duration}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Flame className="h-3 w-3" />
            {exercise.calories} cal
          </div>
        </div>
        
        <div className="flex gap-1 mb-3 flex-wrap">
          {exercise.primaryMuscles.map((muscle: MuscleGroup) => (
            <Badge key={muscle} variant="outline" className="text-xs">
              {getMuscleGroupTranslation(muscle)}
            </Badge>
          ))}
        </div>
        
        <Button 
          size="sm" 
          className="w-full"
          onClick={() => onAdd(exercise)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar a rutina
        </Button>
      </CardContent>
    </Card>
  );

  const WorkoutTemplateCard: React.FC<WorkoutTemplateCardProps> = ({ template }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{template.name}</h3>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{template.popularity}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{template.duration}</p>
            <p className="text-xs text-muted-foreground">minutos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{template.exercises}</p>
            <p className="text-xs text-muted-foreground">ejercicios</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{template.calories}</p>
            <p className="text-xs text-muted-foreground">calorías</p>
          </div>
        </div>
        
        <div className="flex gap-1 mb-4 flex-wrap">
          {template.muscleGroups.map((group: MuscleGroup) => (
            <Badge key={group} variant="secondary" className="text-xs">
              {getMuscleGroupTranslation(group)}
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button className="flex-1">
            <Play className="h-4 w-4 mr-2" />
            Usar plantilla
          </Button>
          <Button variant="outline">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <span>Usado {template.uses} veces</span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${i < template.difficulty ? 'bg-red-400' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
    const getStatusColor = (status: SessionStatus): string => {
      const statusColors: Record<SessionStatus, string> = {
        completed: 'bg-green-100 text-green-800',
        in_progress: 'bg-blue-100 text-blue-800',
        scheduled: 'bg-yellow-100 text-yellow-800'
      };
      return statusColors[status];
    };
    
    const getStatusText = (status: SessionStatus): string => {
      const statusTexts: Record<SessionStatus, string> = {
        completed: 'Completado',
        in_progress: 'En progreso',
        scheduled: 'Programado'
      };
      return statusTexts[status];
    };
    
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.clientAvatar} />
                <AvatarFallback>{session.clientName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{session.clientName}</p>
                <p className="text-sm text-muted-foreground">{session.time}</p>
              </div>
            </div>
            <Badge className={getStatusColor(session.status)}>
              {getStatusText(session.status)}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium">{session.workout}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {session.duration} min
              </div>
              {session.status === 'completed' && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  Completado
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Centro de Entrenamientos</h1>
              <p className="text-muted-foreground">Gestiona ejercicios, plantillas y sesiones de entrenamiento</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Biblioteca
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo ejercicio
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard 
            icon={Dumbbell} 
            title="Ejercicios totales" 
            value={workoutStats.totalExercises}
            subtitle="En tu biblioteca"
            color="blue"
          />
          <StatsCard 
            icon={BookOpen} 
            title="Plantillas" 
            value={workoutStats.totalTemplates}
            subtitle="Rutinas creadas"
            color="green"
          />
          <StatsCard 
            icon={Users} 
            title="Sesiones hoy" 
            value={`${workoutStats.sessionsCompleted}/${workoutStats.sessionsToday}`}
            subtitle="Completadas/Totales"
            color="orange"
          />
          <StatsCard 
            icon={Flame} 
            title="Calorías quemadas" 
            value={workoutStats.totalCaloriesBurned}
            subtitle="Total del día"
            color="red"
          />
        </div>

        {/* Timer Widget */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Temporizador de Entrenamiento</h3>
                <p className="text-blue-100">Cronometra tus sesiones de entrenamiento</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold font-mono">{formatTime(timerSeconds)}</p>
                  <p className="text-sm text-blue-100">Tiempo transcurrido</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="secondary"
                    onClick={handleTimerToggle}
                  >
                    {timerActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={handleTimerReset}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="exercises">Ejercicios</TabsTrigger>
            <TabsTrigger value="templates">Plantillas</TabsTrigger>
            <TabsTrigger value="sessions">Sesiones</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Today's Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle>Sesiones de Hoy</CardTitle>
                  <CardDescription>Entrenamientos programados para hoy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {todaySessions.map((session: TodaySession) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </CardContent>
              </Card>

              {/* Popular Templates */}
              <Card>
                <CardHeader>
                  <CardTitle>Plantillas Populares</CardTitle>
                  <CardDescription>Tus rutinas más utilizadas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {workoutTemplates.slice(0, 3).map((template: WorkoutTemplate) => (
                    <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{template.name}</p>
                        <p className="text-sm text-muted-foreground">{template.duration} min • {template.exercises} ejercicios</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{template.uses} usos</Badge>
                        <Button size="sm">Usar</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Weekly Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Progreso Semanal</CardTitle>
                <CardDescription>Resumen de actividad de entrenamientos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day: string, index: number) => (
                    <div key={day} className="text-center">
                      <p className="text-sm font-medium mb-2">{day}</p>
                      <div className="space-y-1">
                        {[0, 1, 2, 3].map((session: number) => (
                          <div 
                            key={session} 
                            className={`h-8 rounded ${
                              (index < 5 && session < 2) ? 'bg-green-200' : 
                              (index < 5 && session < 3) ? 'bg-blue-200' : 'bg-gray-100'
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
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar ejercicios..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={filterCategory} onValueChange={(value: FilterCategory) => setFilterCategory(value)}>
                <SelectTrigger className="w-48">
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
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Dificultad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las dificultades</SelectItem>
                  <SelectItem value="1">Muy fácil</SelectItem>
                  <SelectItem value="2">Fácil</SelectItem>
                  <SelectItem value="3">Moderado</SelectItem>
                  <SelectItem value="4">Difícil</SelectItem>
                  <SelectItem value="5">Muy difícil</SelectItem>
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
              <Card className="fixed right-6 top-24 w-80 z-50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Constructor de Rutina</CardTitle>
                  <CardDescription>{selectedExercises.length} ejercicios seleccionados</CardDescription>
                </CardHeader>
                <CardContent className="max-h-60 overflow-y-auto space-y-2">
                  {selectedExercises.map((exercise: Exercise, index: number) => (
                    <div key={`${exercise.id}-${index}`} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{exercise.name}</span>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleRemoveExercise(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </CardContent>
                <div className="p-4 pt-0 flex gap-2">
                  <Button className="flex-1">Crear plantilla</Button>
                  <Button variant="outline" onClick={handleClearExercises}>
                    Limpiar
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Plantillas de Entrenamiento</h2>
                <p className="text-muted-foreground">Rutinas reutilizables para tus clientes</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva plantilla
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {workoutTemplates.map((template: WorkoutTemplate) => (
                <WorkoutTemplateCard key={template.id} template={template} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Programar Sesiones</h2>
                <p className="text-muted-foreground">Gestiona las sesiones de entrenamiento de tus clientes</p>
              </div>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Nueva sesión
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todaySessions.map((session: TodaySession) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>

            {/* Calendar View */}
            <Card>
              <CardHeader>
                <CardTitle>Vista Semanal</CardTitle>
                <CardDescription>Programación de entrenamientos para esta semana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-4 text-center">
                  {['Lun 28', 'Mar 29', 'Mié 30', 'Jue 31', 'Vie 1', 'Sáb 2', 'Dom 3'].map((day: string, index: number) => (
                    <div key={day} className="space-y-2">
                      <h3 className="font-medium text-sm">{day}</h3>
                      <div className="space-y-1">
                        {index < 5 && (
                          <>
                            <div className="bg-blue-100 text-blue-800 text-xs p-2 rounded">
                              María - 9:00
                            </div>
                            {index < 3 && (
                              <div className="bg-green-100 text-green-800 text-xs p-2 rounded">
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