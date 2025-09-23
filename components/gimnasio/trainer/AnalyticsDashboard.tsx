"use client";
import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign,
  Target,
  Activity,
  Clock,
  Star,
  Award,
  AlertTriangle,
  Download,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

type TimeframeType = '7d' | '30d' | '90d' | '1y';
type MetricType = 'revenue' | 'clients' | 'sessions' | 'adherence';

interface TimeframePeriod {
  id: TimeframeType;
  label: string;
}

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  period: string;
  icon: React.ElementType;
  color: string;
}

interface ChartData {
  date: string;
  revenue: number;
  clients: number;
  sessions: number;
  adherence: number;
}

const AnalyticsDashboard = () => {
  const [timeframe, setTimeframe] = useState<TimeframeType>('30d');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('revenue');

  // Mock data
  const metrics: MetricCard[] = [
    {
      title: 'Ingresos Totales',
      value: '$12,450',
      change: 12.5,
      trend: 'up',
      period: 'vs mes anterior',
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      title: 'Clientes Activos',
      value: 24,
      change: 8.3,
      trend: 'up',
      period: 'vs mes anterior',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: 'Sesiones Completadas',
      value: 156,
      change: -2.1,
      trend: 'down',
      period: 'vs mes anterior',
      icon: Activity,
      color: 'text-purple-400'
    },
    {
      title: 'Adherencia Promedio',
      value: '84%',
      change: 5.2,
      trend: 'up',
      period: 'vs mes anterior',
      icon: Target,
      color: 'text-fuchsia-400'
    },
    {
      title: 'Retención de Clientes',
      value: '92%',
      change: 1.8,
      trend: 'up',
      period: 'últimos 6 meses',
      icon: Star,
      color: 'text-yellow-400'
    },
    {
      title: 'Tiempo Promedio de Respuesta',
      value: '2.3h',
      change: -15.6,
      trend: 'up',
      period: 'vs mes anterior',
      icon: Clock,
      color: 'text-orange-400'
    }
  ];

  const chartData: ChartData[] = [
    { date: '01/02', revenue: 980, clients: 20, sessions: 45, adherence: 78 },
    { date: '05/02', revenue: 1240, clients: 21, sessions: 52, adherence: 82 },
    { date: '10/02', revenue: 1100, clients: 22, sessions: 48, adherence: 85 },
    { date: '15/02', revenue: 1350, clients: 23, sessions: 58, adherence: 87 },
    { date: '20/02', revenue: 1180, clients: 24, sessions: 51, adherence: 84 },
    { date: '25/02', revenue: 1420, clients: 24, sessions: 62, adherence: 88 },
    { date: '28/02', revenue: 1550, clients: 25, sessions: 68, adherence: 91 }
  ];

  const clientGrowthData = [
    { month: 'Ago', nuevos: 5, perdidos: 2, neto: 3 },
    { month: 'Sep', nuevos: 8, perdidos: 1, neto: 7 },
    { month: 'Oct', nuevos: 6, perdidos: 3, neto: 3 },
    { month: 'Nov', nuevos: 9, perdidos: 2, neto: 7 },
    { month: 'Dic', nuevos: 7, perdidos: 1, neto: 6 },
    { month: 'Ene', nuevos: 11, perdidos: 4, neto: 7 },
    { month: 'Feb', nuevos: 8, perdidos: 2, neto: 6 }
  ];

  const revenueByServiceData = [
    { name: 'Entrenamiento Personal', value: 7500, color: '#8b5cf6' },
    { name: 'Planes Nutricionales', value: 2800, color: '#10b981' },
    { name: 'Evaluaciones', value: 1200, color: '#f59e0b' },
    { name: 'Consultas Online', value: 950, color: '#ef4444' }
  ];

  const topClientsData = [
    { name: 'María González', revenue: 480, sessions: 12, adherence: 95 },
    { name: 'Carlos Mendoza', revenue: 360, sessions: 9, adherence: 92 },
    { name: 'Ana López', revenue: 320, sessions: 8, adherence: 88 },
    { name: 'Juan Pérez', revenue: 280, sessions: 7, adherence: 85 },
    { name: 'Laura Torres', revenue: 240, sessions: 6, adherence: 82 }
  ];

  // Array tipado para los períodos de tiempo
  const timeframePeriods: TimeframePeriod[] = [
    { id: '7d', label: '7 días' },
    { id: '30d', label: '30 días' },
    { id: '90d', label: '3 meses' },
    { id: '1y', label: '1 año' }
  ];

  // Función para verificar si un string es un MetricType válido
  const isValidMetricType = (value: string): value is MetricType => {
    return ['revenue', 'clients', 'sessions', 'adherence'].includes(value);
  };

  // Handler para el cambio de métrica con validación de tipo
  const handleMetricChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (isValidMetricType(value)) {
      setSelectedMetric(value);
    }
  };

  const getMetricColor = (metric: MetricType): string => {
    switch (metric) {
      case 'revenue': return '#10b981';
      case 'clients': return '#3b82f6';
      case 'sessions': return '#8b5cf6';
      case 'adherence': return '#f59e0b';
      default: return '#8b5cf6';
    }
  };

  {/*
    const getMetricLabel = (metric: MetricType): string => {
      switch (metric) {
        case 'revenue': return 'Ingresos ($)';
        case 'clients': return 'Clientes';
        case 'sessions': return 'Sesiones';
        case 'adherence': return 'Adherencia (%)';
        default: return metric;
      }
    };
  */}

  const MetricCard = ({ metric }: { metric: MetricCard }) => {
    const Icon = metric.icon;
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-${metric.color.split('-')[1]}-500/20`}>
            <Icon className={`h-6 w-6 ${metric.color}`} />
          </div>
          <div className={`flex items-center space-x-1 text-sm ${
            metric.trend === 'up' ? 'text-green-400' : 
            metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
          }`}>
            {metric.trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : 
             metric.trend === 'down' ? <ArrowDownRight className="h-4 w-4" /> : null}
            <span>{Math.abs(metric.change)}%</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
          <p className="text-sm text-gray-400">{metric.title}</p>
          <p className="text-xs text-gray-500 mt-1">{metric.period}</p>
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
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-gray-400">Métricas y análisis de tu negocio</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gray-900 rounded-lg p-1">
              {timeframePeriods.map((period) => (
                <button
                  key={period.id}
                  onClick={() => setTimeframe(period.id)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    timeframe === period.id
                      ? 'bg-fuchsia-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
            
            <button className="flex items-center space-x-2 bg-gray-900 text-gray-400 hover:text-white px-4 py-2 rounded-lg transition-colors">
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>

        {/* Main Chart */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Tendencias</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <select 
                  value={selectedMetric}
                  onChange={handleMetricChange}
                  className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 appearance-none pr-8"
                >
                  <option value="revenue">Ingresos</option>
                  <option value="clients">Clientes</option>
                  <option value="sessions">Sesiones</option>
                  <option value="adherence">Adherencia</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <button className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  labelStyle={{ color: '#F9FAFB' }}
                />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={getMetricColor(selectedMetric)}
                  fill={getMetricColor(selectedMetric)}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Client Growth */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Crecimiento de Clientes</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clientGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Bar dataKey="nuevos" fill="#10b981" name="Nuevos" />
                  <Bar dataKey="perdidos" fill="#ef4444" name="Perdidos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue by Service */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Ingresos por Servicio</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueByServiceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {revenueByServiceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {revenueByServiceData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-400">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Top Clientes</h3>
            <button className="flex items-center space-x-1 text-sm text-fuchsia-400 hover:text-fuchsia-300">
              <span>Ver todos</span>
              <Eye className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Cliente</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Ingresos</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Sesiones</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Adherencia</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Trend</th>
                </tr>
              </thead>
              <tbody>
                {topClientsData.map((client, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-fuchsia-600 to-violet-600 rounded-full flex items-center justify-center text-xs font-semibold">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium text-white">{client.name}</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 font-semibold text-green-400">
                      ${client.revenue}
                    </td>
                    <td className="text-right py-3 px-4 text-white">
                      {client.sessions}
                    </td>
                    <td className="text-right py-3 px-4">
                      <span className={`${
                        client.adherence >= 90 ? 'text-green-400' :
                        client.adherence >= 80 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {client.adherence}%
                      </span>
                    </td>
                    <td className="text-right py-3 px-4">
                      <div className="flex items-center justify-end space-x-1">
                        <TrendingUp className="h-4 w-4 text-green-400" />
                        <span className="text-green-400 text-sm">+{Math.floor(Math.random() * 10 + 5)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights and Recommendations */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Insights y Recomendaciones</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <span className="font-medium text-green-400">Crecimiento Positivo</span>
              </div>
              <p className="text-sm text-gray-300">
                Tus ingresos han crecido un 12.5% este mes. Mantén este momentum.
              </p>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <span className="font-medium text-yellow-400">Oportunidad</span>
              </div>
              <p className="text-sm text-gray-300">
                3 clientes tienen baja adherencia. Considera contactarlos.
              </p>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="h-5 w-5 text-blue-400" />
                <span className="font-medium text-blue-400">Logro</span>
              </div>
              <p className="text-sm text-gray-300">
                Tu tiempo de respuesta mejoró 15.6% este mes. ¡Excelente!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;