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
  Dumbbell,
  Zap,
  Trophy,
  Flame,
  Activity,
  Heart,
  Battery,
  Moon,
  Droplets,
  Plus,
  Download,
  Share,
  MoreVertical,
  Timer,
  Users,
  Award,
  LucideIcon
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Interfaces de tipos
interface ClientData {
  name: string;
  avatar: string;
  goal: string;
  startDate: string;
  currentStreak: number;
  totalDays: number;
}

interface WeightProgress {
  date: string;
  weight: number;
  target: number;
}

interface Measurement {
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

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  subtitle?: string;
}

interface MeasurementCardProps {
  measurement: Measurement;
}

interface CheckinCardProps {
  checkin: CheckinData;
}

type TabValue = 'overview' | 'weight' | 'measurements' | 'checkins' | 'photos';

// Datos hardcodeados para el dashboard
const clientData: ClientData = {
  name: "María González",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e57004?w=150&h=150&fit=crop&crop=face",
  goal: "Pérdida de peso",
  startDate: "15 Sep 2024",
  currentStreak: 12,
  totalDays: 45
};

const weightProgressData: WeightProgress[] = [
  { date: '15 Sep', weight: 72.5, target: 65 },
  { date: '22 Sep', weight: 71.8, target: 65 },
  { date: '29 Sep', weight: 71.2, target: 65 },
  { date: '06 Oct', weight: 70.5, target: 65 },
  { date: '13 Oct', weight: 69.8, target: 65 },
  { date: '20 Oct', weight: 69.3, target: 65 },
  { date: '27 Oct', weight: 68.7, target: 65 }
];

const measurementsData: Measurement[] = [
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

export default function GymProgressDashboard() {
  const [activeTab, setActiveTab] = useState<TabValue>('overview');

  const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, title, value, change, changeType, subtitle }) => (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:to-slate-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-bl-full"></div>
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">{title}</span>
          </div>
          {change && (
            <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-full ${
              changeType === 'positive' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {changeType === 'positive' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {change}
            </div>
          )}
        </div>
        <div>
          <p className="text-3xl font-black text-white mb-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 font-medium">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );

  const MeasurementCard: React.FC<MeasurementCardProps> = ({ measurement }) => {
    const progress = Math.abs((measurement.current - measurement.initial) / Math.abs(measurement.target - measurement.initial)) * 100;
    const isPositive = measurement.change > 0;
    
    return (
      <Card className="border-0 bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-white text-lg">{measurement.name}</h3>
            <div className={`flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full ${
              isPositive 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
            }`}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(measurement.change)}{measurement.unit}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-medium">Actual</span>
              <span className="font-bold text-white text-lg">{measurement.current}{measurement.unit}</span>
            </div>
            <div className="relative">
              <Progress 
                value={Math.min(progress, 100)} 
                className="h-3 bg-slate-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-80" 
                   style={{ width: `${Math.min(progress, 100)}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Inicial: {measurement.initial}{measurement.unit}</span>
              <span>Meta: {measurement.target}{measurement.unit}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const CheckinCard: React.FC<CheckinCardProps> = ({ checkin }) => (
    <Card className="border-0 bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-5">
          <p className="text-sm font-bold text-white">{checkin.date}</p>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold border-0">
            ✓ COMPLETO
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50">
            <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Energía</p>
              <p className="text-lg font-black text-white">{checkin.energy}/10</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50">
            <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Motivación</p>
              <p className="text-lg font-black text-white">{checkin.motivation}/10</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500">
              <Moon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Sueño</p>
              <p className="text-lg font-black text-white">{checkin.sleep}/10</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
              <Droplets className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Nutrición</p>
              <p className="text-lg font-black text-white">{checkin.nutrition}/10</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Patrón de fondo sutil */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div className="relative overflow-hidden rounded-xl border-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-bl-full"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-gradient-to-r from-orange-500 to-red-500 shadow-2xl">
                  <AvatarImage src={clientData.avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-2xl">MG</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <Flame className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-black text-white mb-1">{clientData.name}</h1>
                <p className="text-orange-400 font-bold text-lg">🎯 {clientData.goal}</p>
                <p className="text-slate-400 font-medium">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Inicio: {clientData.startDate} • {clientData.totalDays} días de transformación
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-lg px-4 py-2 border-0 shadow-lg">
                🔥 {clientData.currentStreak} DÍAS SEGUIDOS
              </Badge>
              <Button variant="outline" size="lg" className="border-slate-600 bg-slate-800/50 text-white hover:bg-slate-700 font-bold">
                <Share className="h-4 w-4 mr-2" />
                COMPARTIR
              </Button>
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-black shadow-lg">
                <Download className="h-4 w-4 mr-2" />
                REPORTE
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard 
            icon={Dumbbell} 
            title="Peso Actual" 
            value="68.7 kg" 
            change="-3.8 kg" 
            changeType="negative"
            subtitle="Meta: 65 kg restantes"
          />
          <StatsCard 
            icon={Target} 
            title="Progreso Meta" 
            value="51%" 
            change="+8% esta semana" 
            changeType="positive"
            subtitle="3.3 kg para el objetivo"
          />
          <StatsCard 
            icon={Trophy} 
            title="Entrenamientos" 
            value="14/16" 
            change="4 esta semana" 
            changeType="positive"
            subtitle="Mes actual completado"
          />
          <StatsCard 
            icon={Timer} 
            title="Último Check-in" 
            value="27 Oct" 
            subtitle="Adherencia excelente"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className="space-y-8">
          <div className="relative">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800 border-0 p-1 rounded-xl">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white font-bold text-slate-300"
              >
                RESUMEN
              </TabsTrigger>
              <TabsTrigger 
                value="weight"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white font-bold text-slate-300"
              >
                PESO
              </TabsTrigger>
              <TabsTrigger 
                value="measurements"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white font-bold text-slate-300"
              >
                MEDICIONES
              </TabsTrigger>
              <TabsTrigger 
                value="checkins"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white font-bold text-slate-300"
              >
                CHECK-INS
              </TabsTrigger>
              <TabsTrigger 
                value="photos"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white font-bold text-slate-300"
              >
                FOTOS
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-8">
            {/* Goals Progress */}
            <Card className="border-0 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black text-white">OBJETIVOS DEL PROGRAMA</CardTitle>
                    <CardDescription className="text-slate-400 font-medium">Progreso hacia las metas establecidas</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {goals.map((goal: Goal, index: number) => (
                  <div key={index} className="space-y-3 p-4 rounded-lg bg-slate-800/50">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-lg">{goal.title}</span>
                      <span className="text-slate-300 font-bold">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={goal.progress} className="h-3 bg-slate-700" />
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-90" 
                           style={{ width: `${goal.progress}%` }}></div>
                    </div>
                    <p className="text-sm text-slate-400 font-bold">{goal.progress}% COMPLETADO</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weight Trend Chart */}
            <Card className="border-0 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black text-white">TENDENCIA DE PESO</CardTitle>
                    <CardDescription className="text-slate-400 font-medium">Evolución en las últimas 6 semanas</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={weightProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis domain={['dataMin - 2', 'dataMax + 1']} stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151', 
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="url(#gradient1)" 
                      strokeWidth={4}
                      dot={{ fill: '#F97316', strokeWidth: 3, r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#EF4444" 
                      strokeDasharray="8 8"
                      strokeWidth={3}
                    />
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F97316" />
                        <stop offset="100%" stopColor="#EF4444" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weight" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-0 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                      <Dumbbell className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black text-white">REGISTRO DE PESO</CardTitle>
                      <CardDescription className="text-slate-400 font-medium">Evolución detallada del peso corporal</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={weightProgressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151', 
                          borderRadius: '8px',
                          color: '#fff'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#F97316" 
                        fill="url(#areaGradient)"
                        strokeWidth={3}
                      />
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#F97316" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black text-white">NUEVA MEDICIÓN</CardTitle>
                      <CardDescription className="text-slate-400 font-medium">Registrar peso actual</CardDescription>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-bold">
                    <Plus className="h-4 w-4 mr-2" />
                    AGREGAR
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 border border-green-500/30 rounded-lg bg-green-500/10 text-center">
                      <p className="text-3xl font-black text-green-400">-3.8 kg</p>
                      <p className="text-sm text-green-300 font-bold uppercase tracking-wide">Perdidos</p>
                    </div>
                    <div className="p-6 border border-blue-500/30 rounded-lg bg-blue-500/10 text-center">
                      <p className="text-3xl font-black text-blue-400">51%</p>
                      <p className="text-sm text-blue-300 font-bold uppercase tracking-wide">Progreso</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 p-4 rounded-lg bg-slate-800/50">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Peso inicial:</span>
                      <span className="font-black text-white text-lg">72.5 kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Peso actual:</span>
                      <span className="font-black text-white text-lg">68.7 kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Meta:</span>
                      <span className="font-black text-white text-lg">65.0 kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Restante:</span>
                      <span className="font-black text-orange-400 text-lg">3.7 kg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="measurements" className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-white">MEDICIONES CORPORALES</h2>
                <p className="text-slate-400 font-medium">Seguimiento de circunferencias y composición corporal</p>
              </div>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-bold text-lg px-6 py-3">
                <Plus className="h-5 w-5 mr-2" />
                NUEVA MEDICIÓN
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {measurementsData.map((measurement: Measurement, index: number) => (
                <MeasurementCard key={index} measurement={measurement} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="checkins" className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-white">CHECK-INS SEMANALES</h2>
                <p className="text-slate-400 font-medium">Evaluación subjetiva del bienestar y progreso</p>
              </div>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-bold text-lg px-6 py-3">
                <Plus className="h-5 w-5 mr-2" />
                NUEVO CHECK-IN
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {checkinData.map((checkin: CheckinData, index: number) => (
                <CheckinCard key={index} checkin={checkin} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-white">FOTOS DE PROGRESO</h2>
                <p className="text-slate-400 font-medium">Comparación visual de la transformación</p>
              </div>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-bold text-lg px-6 py-3">
                <Camera className="h-5 w-5 mr-2" />
                SUBIR FOTO
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {progressPhotos.map((photo: ProgressPhoto, index: number) => (
                <Card key={index} className="overflow-hidden border-0 bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20">
                  <div className="aspect-[3/4] relative">
                    <img 
                      src={photo.url} 
                      alt={`Progreso ${photo.type} - ${photo.date}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold border-0">
                        {photo.type === 'front' ? 'FRENTE' : 'PERFIL'}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <CardContent className="p-4 bg-slate-900">
                    <p className="text-sm font-bold text-white">{photo.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}