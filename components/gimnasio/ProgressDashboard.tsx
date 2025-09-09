"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  TrendingUp, 
  TrendingDown, 
  Camera, 
  Calendar,
  Target,
  Weight,
  Ruler,
  Activity,
  Heart,
  Battery,
  Moon,
  Droplets,
  Plus,
  Download,
  Share,
  MoreVertical,
  LucideIcon
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Interfaces para tipar los datos
interface ClientData {
  name: string;
  avatar: string;
  goal: string;
  startDate: string;
  currentStreak: number;
  totalDays: number;
}

interface WeightProgressData {
  date: string;
  weight: number;
  target: number;
}

interface MeasurementData {
  name: string;
  current: number;
  initial: number;
  target: number;
  unit: string;
  change: number;
}

interface CheckinData {
  date: string;
  energy: number;
  motivation: number;
  sleep: number;
  stress: number;
  nutrition: number;
}

interface Goal {
  title: string;
  current: number;
  target: number;
  unit: string;
  progress: number;
}

interface ProgressPhoto {
  date: string;
  type: 'front' | 'side';
  url: string;
}

type ChangeType = 'positive' | 'negative';
type TabValue = 'overview' | 'weight' | 'measurements' | 'checkins' | 'photos';

// Props interfaces para componentes internos
interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  change?: string;
  changeType?: ChangeType;
  subtitle?: string;
}

interface MeasurementCardProps {
  measurement: MeasurementData;
}

interface CheckinCardProps {
  checkin: CheckinData;
}

// Datos hardcodeados para el dashboard
const clientData: ClientData = {
  name: "María González",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e57004?w=150&h=150&fit=crop&crop=face",
  goal: "Pérdida de peso",
  startDate: "15 Sep 2024",
  currentStreak: 12,
  totalDays: 45
};

const weightProgressData: WeightProgressData[] = [
  { date: '15 Sep', weight: 72.5, target: 65 },
  { date: '22 Sep', weight: 71.8, target: 65 },
  { date: '29 Sep', weight: 71.2, target: 65 },
  { date: '06 Oct', weight: 70.5, target: 65 },
  { date: '13 Oct', weight: 69.8, target: 65 },
  { date: '20 Oct', weight: 69.3, target: 65 },
  { date: '27 Oct', weight: 68.7, target: 65 }
];

const measurementsData: MeasurementData[] = [
  { name: 'Cintura', current: 78, initial: 85, target: 75, unit: 'cm', change: -7 },
  { name: 'Cadera', current: 98, initial: 102, target: 95, unit: 'cm', change: -4 },
  { name: 'Brazo', current: 28, initial: 26, target: 30, unit: 'cm', change: +2 },
  { name: 'Muslo', current: 58, initial: 62, target: 55, unit: 'cm', change: -4 },
];

const checkinData: CheckinData[] = [
  { date: '27 Oct', energy: 8, motivation: 9, sleep: 7, stress: 3, nutrition: 8 },
  { date: '20 Oct', energy: 7, motivation: 8, sleep: 8, stress: 4, nutrition: 7 },
  { date: '13 Oct', energy: 9, motivation: 9, sleep: 6, stress: 2, nutrition: 9 },
  { date: '06 Oct', energy: 6, motivation: 7, sleep: 7, stress: 5, nutrition: 8 },
];

const goals: Goal[] = [
  { title: "Perder 7.5kg", current: 3.8, target: 7.5, unit: "kg", progress: 51 },
  { title: "Entrenar 4x semana", current: 14, target: 16, unit: "días", progress: 88 },
  { title: "8 horas de sueño", current: 7.2, target: 8, unit: "hrs", progress: 90 },
];

const progressPhotos: ProgressPhoto[] = [
  { date: '15 Sep 2024', type: 'front', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=300&fit=crop' },
  { date: '15 Oct 2024', type: 'front', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=300&fit=crop' },
  { date: '15 Sep 2024', type: 'side', url: 'https://images.unsplash.com/photo-1594736797933-d0d3dc5ca0b8?w=200&h=300&fit=crop' },
  { date: '15 Oct 2024', type: 'side', url: 'https://images.unsplash.com/photo-1594736797531-516da82d6c33?w=200&h=300&fit=crop' },
];

const ProgressDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('overview');

  const StatsCard: React.FC<StatsCardProps> = ({ 
    icon: Icon, 
    title, 
    value, 
    change, 
    changeType, 
    subtitle 
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          </div>
          {change && (
            <div className={`flex items-center gap-1 text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'positive' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {change}
            </div>
          )}
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );

  const MeasurementCard: React.FC<MeasurementCardProps> = ({ measurement }) => {
    const progress: number = Math.abs((measurement.current - measurement.initial) / Math.abs(measurement.target - measurement.initial)) * 100;
    const isPositive: boolean = measurement.change > 0;
    
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-medium">{measurement.name}</h3>
            <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-blue-600'}`}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(measurement.change)}{measurement.unit}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Actual</span>
              <span className="font-medium">{measurement.current}{measurement.unit}</span>
            </div>
            <Progress value={Math.min(progress, 100)} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Inicial: {measurement.initial}{measurement.unit}</span>
              <span>Meta: {measurement.target}{measurement.unit}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const CheckinCard: React.FC<CheckinCardProps> = ({ checkin }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-medium">{checkin.date}</p>
          <Badge variant="outline">Completo</Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Battery className="h-4 w-4 text-yellow-500" />
            <div>
              <p className="text-xs text-muted-foreground">Energía</p>
              <p className="text-sm font-medium">{checkin.energy}/10</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            <div>
              <p className="text-xs text-muted-foreground">Motivación</p>
              <p className="text-sm font-medium">{checkin.motivation}/10</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Sueño</p>
              <p className="text-sm font-medium">{checkin.sleep}/10</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Nutrición</p>
              <p className="text-sm font-medium">{checkin.nutrition}/10</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const handleTabChange = (value: string): void => {
    setActiveTab(value as TabValue);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={clientData.avatar} />
                <AvatarFallback>MG</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{clientData.name}</h1>
                <p className="text-muted-foreground">Objetivo: {clientData.goal}</p>
                <p className="text-sm text-muted-foreground">Inicio: {clientData.startDate} • {clientData.totalDays} días</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                🔥 {clientData.currentStreak} días seguidos
              </Badge>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Reporte
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard 
            icon={Weight} 
            title="Peso Actual" 
            value="68.7 kg" 
            change="-3.8 kg" 
            changeType="negative"
            subtitle="Meta: 65 kg"
          />
          <StatsCard 
            icon={Target} 
            title="Progreso Meta" 
            value="51%" 
            change="+8% esta semana" 
            changeType="positive"
            subtitle="3.3 kg restantes"
          />
          <StatsCard 
            icon={Activity} 
            title="Entrenamientos" 
            value="14/16" 
            change="4 esta semana" 
            changeType="positive"
            subtitle="Este mes"
          />
          <StatsCard 
            icon={Calendar} 
            title="Último Check-in" 
            value="27 Oct" 
            subtitle="Muy buena adherencia"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="w-full">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="weight">Peso</TabsTrigger>
            <TabsTrigger value="measurements">Mediciones</TabsTrigger>
            <TabsTrigger value="checkins">Check-ins</TabsTrigger>
            <TabsTrigger value="photos">Fotos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Goals Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Objetivos del Programa</CardTitle>
                <CardDescription>Progreso hacia las metas establecidas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {goals.map((goal: Goal, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{goal.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">{goal.progress}% completado</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weight Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Peso</CardTitle>
                <CardDescription>Evolución en las últimas 6 semanas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weightProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 2', 'dataMax + 1']} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#2563eb" 
                      strokeWidth={3}
                      dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#dc2626" 
                      strokeDasharray="5 5"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weight" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Registro de Peso</CardTitle>
                  <CardDescription>Evolución detallada del peso corporal</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={weightProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#2563eb" 
                        fill="#2563eb20"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Nueva Medición</CardTitle>
                    <CardDescription>Registrar peso actual</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-green-600">-3.8 kg</p>
                      <p className="text-sm text-muted-foreground">Perdidos</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">51%</p>
                      <p className="text-sm text-muted-foreground">Progreso</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Peso inicial:</span>
                      <span className="font-medium">72.5 kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Peso actual:</span>
                      <span className="font-medium">68.7 kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Meta:</span>
                      <span className="font-medium">65.0 kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Restante:</span>
                      <span className="font-medium text-orange-600">3.7 kg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="measurements" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Mediciones Corporales</h2>
                <p className="text-muted-foreground">Seguimiento de circunferencias y composición corporal</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Medición
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {measurementsData.map((measurement: MeasurementData, index: number) => (
                <MeasurementCard key={index} measurement={measurement} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="checkins" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Check-ins Semanales</h2>
                <p className="text-muted-foreground">Evaluación subjetiva del bienestar y progreso</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Check-in
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {checkinData.map((checkin: CheckinData, index: number) => (
                <CheckinCard key={index} checkin={checkin} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Fotos de Progreso</h2>
                <p className="text-muted-foreground">Comparación visual de la transformación</p>
              </div>
              <Button>
                <Camera className="h-4 w-4 mr-2" />
                Subir Foto
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {progressPhotos.map((photo: ProgressPhoto, index: number) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-[3/4] relative">
                    <img 
                      src={photo.url} 
                      alt={`Progreso ${photo.type} - ${photo.date}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        {photo.type === 'front' ? 'Frente' : 'Perfil'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium">{photo.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProgressDashboard;