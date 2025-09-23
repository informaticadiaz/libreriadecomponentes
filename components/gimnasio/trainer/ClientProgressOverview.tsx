"use client";
import React, { useState } from 'react';
import { 
  TrendingUp,  
  Users, 
  Target, 
  Filter,
  Download,
  Eye,
  Award,
  AlertTriangle,
  Activity,
  Weight,
  Zap,
  ChevronRight,
  MoreVertical,
  Camera
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

// Definir tipos específicos
type MetricType = 'weight' | 'adherence' | 'bodyFat';
type StatusType = 'on-track' | 'needs-attention' | 'excellent';
type TimeframeType = '7d' | '30d' | '90d' | '1y';
type ViewModeType = 'overview' | 'individual';

interface ClientProgress {
  id: string;
  name: string;
  avatar: string;
  goal: string;
  startDate: string;
  progress: {
    weight: { start: number; current: number; target: number };
    bodyFat?: { start: number; current: number; target: number };
    adherence: number;
    workoutsCompleted: number;
    totalWorkouts: number;
  };
  recentData: Array<{
    date: string;
    weight: number;
    bodyFat?: number;
    adherence: number;
  }>;
  status: StatusType;
  lastUpdate: string;
}

interface OverviewStats {
  totalClients: number;
  averageAdherence: number;
  clientsOnTrack: number;
  needsAttention: number;
}

const ClientProgressOverview = () => {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<TimeframeType>('30d');
  const [viewMode, setViewMode] = useState<ViewModeType>('overview');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('weight');

  // Definir las métricas disponibles con tipo específico
  const availableMetrics: MetricType[] = ['weight', 'adherence', 'bodyFat'];

  // Mock data
  const overviewStats: OverviewStats = {
    totalClients: 24,
    averageAdherence: 78,
    clientsOnTrack: 18,
    needsAttention: 6
  };

  const clientsProgress: ClientProgress[] = [
    {
      id: '1',
      name: 'María González',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b25213b9?w=50&h=50&fit=crop&crop=face',
      goal: 'Pérdida de peso',
      startDate: '2024-01-15',
      progress: {
        weight: { start: 72, current: 68.5, target: 65 },
        bodyFat: { start: 28, current: 24, target: 20 },
        adherence: 92,
        workoutsCompleted: 23,
        totalWorkouts: 28
      },
      recentData: [
        { date: '2024-01-15', weight: 72, bodyFat: 28, adherence: 85 },
        { date: '2024-01-30', weight: 70.5, bodyFat: 26, adherence: 88 },
        { date: '2024-02-15', weight: 68.5, bodyFat: 24, adherence: 92 }
      ],
      status: 'excellent',
      lastUpdate: '2024-02-15'
    },
    {
      id: '2',
      name: 'Juan Pérez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      goal: 'Ganancia muscular',
      startDate: '2024-01-20',
      progress: {
        weight: { start: 70, current: 75.2, target: 78 },
        adherence: 45,
        workoutsCompleted: 12,
        totalWorkouts: 28
      },
      recentData: [
        { date: '2024-01-20', weight: 70, adherence: 80 },
        { date: '2024-02-05', weight: 72, adherence: 65 },
        { date: '2024-02-15', weight: 75.2, adherence: 45 }
      ],
      status: 'needs-attention',
      lastUpdate: '2024-02-10'
    },
    {
      id: '3',
      name: 'Ana López',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      goal: 'Tonificación',
      startDate: '2024-02-01',
      progress: {
        weight: { start: 63, current: 62, target: 60 },
        bodyFat: { start: 22, current: 20, target: 18 },
        adherence: 88,
        workoutsCompleted: 8,
        totalWorkouts: 10
      },
      recentData: [
        { date: '2024-02-01', weight: 63, bodyFat: 22, adherence: 90 },
        { date: '2024-02-08', weight: 62.5, bodyFat: 21, adherence: 85 },
        { date: '2024-02-15', weight: 62, bodyFat: 20, adherence: 88 }
      ],
      status: 'on-track',
      lastUpdate: '2024-02-15'
    }
  ];

  const getStatusColor = (status: StatusType): string => {
    switch (status) {
      case 'excellent': return 'bg-green-500/20 text-green-400 border-green-500/20';
      case 'on-track': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      case 'needs-attention': return 'bg-red-500/20 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusText = (status: StatusType): string => {
    switch (status) {
      case 'excellent': return 'Excelente';
      case 'on-track': return 'En progreso';
      case 'needs-attention': return 'Necesita atención';
      default: return status;
    }
  };

  const getStatusIcon = (status: StatusType): React.ReactElement => {
    switch (status) {
      case 'excellent': return <Award className="h-4 w-4" />;
      case 'on-track': return <TrendingUp className="h-4 w-4" />;
      case 'needs-attention': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getMetricLabel = (metric: MetricType): string => {
    switch (metric) {
      case 'weight': return 'Peso';
      case 'adherence': return 'Adherencia';
      case 'bodyFat': return 'Grasa';
      default: return metric;
    }
  };

  const ClientCard = ({ client }: { client: ClientProgress }) => {
    const weightProgress = ((client.progress.weight.start - client.progress.weight.current) / 
                           (client.progress.weight.start - client.progress.weight.target)) * 100;
    const isWeightGoalLoss = client.progress.weight.target < client.progress.weight.start;
    
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src={client.avatar}
              alt={client.name}
              className="h-12 w-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-white">{client.name}</h3>
              <p className="text-sm text-gray-400">{client.goal}</p>
            </div>
          </div>
          
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${getStatusColor(client.status)}`}>
            {getStatusIcon(client.status)}
            <span className="text-xs font-medium">{getStatusText(client.status)}</span>
          </div>
        </div>

        {/* Progress Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <p className="text-lg font-bold text-white">
              {client.progress.weight.current}kg
            </p>
            <p className={`text-xs ${
              isWeightGoalLoss 
                ? (client.progress.weight.current < client.progress.weight.start ? 'text-green-400' : 'text-gray-400')
                : (client.progress.weight.current > client.progress.weight.start ? 'text-green-400' : 'text-gray-400')
            }`}>
              {isWeightGoalLoss ? 'Perdidos' : 'Ganados'}: {Math.abs(client.progress.weight.current - client.progress.weight.start).toFixed(1)}kg
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-lg font-bold text-white">{client.progress.adherence}%</p>
            <p className="text-xs text-gray-400">Adherencia</p>
          </div>
        </div>

        {/* Workout Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Entrenamientos</span>
            <span className="text-white">
              {client.progress.workoutsCompleted}/{client.progress.totalWorkouts}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-fuchsia-500 to-violet-500 h-2 rounded-full transition-all"
              style={{ width: `${(client.progress.workoutsCompleted / client.progress.totalWorkouts) * 100}%` }}
            />
          </div>
        </div>

        {/* Weight Progress Chart */}
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">Progreso de Peso</p>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={client.recentData}>
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button 
            onClick={() => setSelectedClient(client.id)}
            className="flex-1 bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all flex items-center justify-center space-x-1"
          >
            <Eye className="h-4 w-4" />
            <span>Ver Detalle</span>
          </button>
          
          <button className="bg-gray-800 text-gray-400 hover:text-white py-2 px-3 rounded-lg text-sm transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  const DetailedView = ({ client }: { client: ClientProgress }) => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setSelectedClient(null)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-400 rotate-180" />
          </button>
          <img 
            src={client.avatar}
            alt={client.name}
            className="h-16 w-16 rounded-full"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">{client.name}</h2>
            <p className="text-gray-400">{client.goal}</p>
            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full border mt-2 ${getStatusColor(client.status)}`}>
              {getStatusIcon(client.status)}
              <span className="text-xs font-medium">{getStatusText(client.status)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 bg-gray-900 text-gray-400 hover:text-white px-4 py-2 rounded-lg transition-colors">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
          <button className="flex items-center space-x-2 bg-gray-900 text-gray-400 hover:text-white px-4 py-2 rounded-lg transition-colors">
            <Camera className="h-4 w-4" />
            <span>Fotos</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center space-x-2 mb-2">
            <Weight className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-gray-400">Peso Actual</span>
          </div>
          <p className="text-2xl font-bold text-white">{client.progress.weight.current}kg</p>
          <p className="text-sm text-gray-400">
            Objetivo: {client.progress.weight.target}kg
          </p>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-5 w-5 text-green-400" />
            <span className="text-sm text-gray-400">Adherencia</span>
          </div>
          <p className="text-2xl font-bold text-white">{client.progress.adherence}%</p>
          <p className="text-sm text-gray-400">Últimos 30 días</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-5 w-5 text-fuchsia-400" />
            <span className="text-sm text-gray-400">Entrenamientos</span>
          </div>
          <p className="text-2xl font-bold text-white">{client.progress.workoutsCompleted}</p>
          <p className="text-sm text-gray-400">
            de {client.progress.totalWorkouts} programados
          </p>
        </div>

        {client.progress.bodyFat && (
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-orange-400" />
              <span className="text-sm text-gray-400">Grasa Corporal</span>
            </div>
            <p className="text-2xl font-bold text-white">{client.progress.bodyFat.current}%</p>
            <p className="text-sm text-gray-400">
              Objetivo: {client.progress.bodyFat.target}%
            </p>
          </div>
        )}
      </div>

      {/* Progress Chart */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Progreso en el Tiempo</h3>
          <div className="flex space-x-2">
            {availableMetrics.map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedMetric === metric
                    ? 'bg-fuchsia-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {getMetricLabel(metric)}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={client.recentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
              />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="#8b5cf6"
                fill="url(#gradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goals Progress */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Progreso hacia Objetivos</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Pérdida de Peso</span>
              <span className="text-white">
                {Math.abs(client.progress.weight.current - client.progress.weight.start).toFixed(1)}kg / {Math.abs(client.progress.weight.target - client.progress.weight.start)}kg
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all"
                style={{ 
                  width: `${Math.min(100, Math.abs(client.progress.weight.current - client.progress.weight.start) / Math.abs(client.progress.weight.target - client.progress.weight.start) * 100)}%` 
                }}
              />
            </div>
          </div>

          {client.progress.bodyFat && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Reducción de Grasa</span>
                <span className="text-white">
                  {(client.progress.bodyFat.start - client.progress.bodyFat.current).toFixed(1)}% / {(client.progress.bodyFat.start - client.progress.bodyFat.target)}%
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-fuchsia-500 to-violet-500 h-3 rounded-full transition-all"
                  style={{ 
                    width: `${Math.min(100, (client.progress.bodyFat.start - client.progress.bodyFat.current) / (client.progress.bodyFat.start - client.progress.bodyFat.target) * 100)}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const selectedClientData = clientsProgress.find(c => c.id === selectedClient);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {!selectedClient ? (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Progreso de Clientes</h1>
                <p className="text-gray-400">Monitorea el avance de todos tus clientes</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 bg-gray-900 text-gray-400 hover:text-white px-4 py-2 rounded-lg transition-colors">
                  <Filter className="h-4 w-4" />
                  <span>Filtrar</span>
                </button>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-3 rounded-xl hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all">
                  <Download className="h-5 w-5" />
                  <span className="font-medium">Exportar Reporte</span>
                </button>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Clientes</p>
                    <p className="text-2xl font-bold text-white">{overviewStats.totalClients}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">En Progreso</p>
                    <p className="text-2xl font-bold text-green-400">{overviewStats.clientsOnTrack}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Necesitan Atención</p>
                    <p className="text-2xl font-bold text-red-400">{overviewStats.needsAttention}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Adherencia Promedio</p>
                    <p className="text-2xl font-bold text-fuchsia-400">{overviewStats.averageAdherence}%</p>
                  </div>
                  <Activity className="h-8 w-8 text-fuchsia-400" />
                </div>
              </div>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clientsProgress.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          </>
        ) : (
          selectedClientData && <DetailedView client={selectedClientData} />
        )}
      </div>
    </div>
  );
};

export default ClientProgressOverview;