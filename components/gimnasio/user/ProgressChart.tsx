import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';
import { TrendingDown, TrendingUp, Target, Calendar, Award, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProgressData {
  date: string;
  weight: number;
  bodyFat?: number;
  muscle?: number;
}

interface ProgressChartProps {
  data: ProgressData[];
  currentWeight: number;
  targetWeight: number;
  startWeight: number;
  timeframe?: '1M' | '3M' | '6M' | '1Y';
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  currentWeight,
  targetWeight,
  startWeight,
  timeframe = '3M'
}) => {
  const [activeTab, setActiveTab] = useState<'weight' | 'bodyFat' | 'muscle'>('weight');
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);

  // Calculate progress metrics
  const weightLoss = startWeight - currentWeight;
  const progressToGoal = startWeight - targetWeight;
  const progressPercentage = Math.min((weightLoss / progressToGoal) * 100, 100);
  const isGaining = targetWeight > startWeight;
  
  // Trend calculation
  const recentData = data.slice(-7); // Last 7 entries
  const trend = recentData.length >= 2 
    ? recentData[recentData.length - 1].weight - recentData[0].weight 
    : 0;

  const timeframes = [
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '6M', value: '6M' },
    { label: '1Y', value: '1Y' }
  ];

  const tabs = [
    { key: 'weight', label: 'Peso', icon: TrendingDown },
    { key: 'bodyFat', label: 'Grasa', icon: Target },
    { key: 'muscle', label: 'Músculo', icon: TrendingUp }
  ];

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg bg-gray-900 border border-gray-700 p-3 shadow-lg">
          <p className="text-sm text-gray-300 mb-1">{label}</p>
          <p className="text-lg font-semibold text-white">
            {payload[0].value.toFixed(1)} {activeTab === 'weight' ? 'kg' : '%'}
          </p>
        </div>
      );
    }
    return null;
  };

  const getChartColor = () => {
    switch (activeTab) {
      case 'weight': return '#E879F9'; // fuchsia
      case 'bodyFat': return '#F59E0B'; // amber
      case 'muscle': return '#10B981'; // emerald
      default: return '#E879F9';
    }
  };

  const getDataKey = () => {
    switch (activeTab) {
      case 'weight': return 'weight';
      case 'bodyFat': return 'bodyFat';
      case 'muscle': return 'muscle';
      default: return 'weight';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Progress Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Current Progress */}
        <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="rounded-lg bg-fuchsia-500/20 p-2">
              <Target className="h-5 w-5 text-fuchsia-400" />
            </div>
            <span className="text-2xl font-bold text-white">{progressPercentage.toFixed(0)}%</span>
          </div>
          <p className="text-sm text-gray-400 mb-1">Progreso al objetivo</p>
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-fuchsia-500 to-violet-500 transition-all duration-500"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {Math.abs(targetWeight - currentWeight).toFixed(1)}kg restantes
          </p>
        </div>

        {/* Weekly Trend */}
        <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className={`rounded-lg p-2 ${trend < 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {trend < 0 ? (
                <TrendingDown className="h-5 w-5 text-green-400" />
              ) : (
                <TrendingUp className="h-5 w-5 text-red-400" />
              )}
            </div>
            <span className={`text-2xl font-bold ${trend < 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}kg
            </span>
          </div>
          <p className="text-sm text-gray-400">Tendencia semanal</p>
          <p className="text-xs text-gray-500 mt-2">
            {trend < 0 ? '¡Excelente progreso!' : 'Mantén el enfoque'}
          </p>
        </div>
      </div>

      {/* Chart Container */}
      <div className="rounded-2xl bg-gradient-to-br from-fuchsia-500 via-violet-600 to-purple-700 p-1">
        <div className="rounded-2xl bg-black p-6">
          
          {/* Chart Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Progreso</h3>
              <p className="text-sm text-gray-400">Seguimiento de {activeTab === 'weight' ? 'peso' : activeTab === 'bodyFat' ? 'grasa corporal' : 'masa muscular'}</p>
            </div>
            
            {/* Timeframe Selector */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              {timeframes.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setSelectedTimeframe(tf.value as any)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    selectedTimeframe === tf.value
                      ? 'bg-fuchsia-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex mb-6 bg-gray-900 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Chart */}
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={getChartColor()} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={getChartColor()} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey={getDataKey()}
                  stroke={getChartColor()}
                  strokeWidth={3}
                  fill="url(#colorGradient)"
                  dot={{ fill: getChartColor(), strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: getChartColor(), strokeWidth: 2, fill: '#000' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Current Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Inicial</p>
              <p className="text-lg font-bold text-white">{startWeight.toFixed(1)}kg</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Actual</p>
              <p className="text-lg font-bold text-fuchsia-400">{currentWeight.toFixed(1)}kg</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Objetivo</p>
              <p className="text-lg font-bold text-violet-400">{targetWeight.toFixed(1)}kg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Milestone */}
      <div className="rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 p-4">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-green-500/20 p-2">
            <Award className="h-5 w-5 text-green-400" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white">¡Logro desbloqueado!</p>
            <p className="text-sm text-gray-300">Has perdido {weightLoss.toFixed(1)}kg en tu jornada</p>
          </div>
          <button className="text-green-400 hover:text-green-300">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Demo Component
const ProgressChartDemo = () => {
  // Mock data for demonstration
  const mockData: ProgressData[] = [
    { date: '01/01', weight: 85.0, bodyFat: 22.0, muscle: 45.0 },
    { date: '08/01', weight: 84.2, bodyFat: 21.5, muscle: 45.2 },
    { date: '15/01', weight: 83.8, bodyFat: 21.2, muscle: 45.4 },
    { date: '22/01', weight: 83.1, bodyFat: 20.8, muscle: 45.8 },
    { date: '29/01', weight: 82.5, bodyFat: 20.5, muscle: 46.0 },
    { date: '05/02', weight: 82.0, bodyFat: 20.2, muscle: 46.3 },
    { date: '12/02', weight: 81.4, bodyFat: 19.8, muscle: 46.5 },
    { date: '19/02', weight: 80.9, bodyFat: 19.5, muscle: 46.8 },
    { date: '26/02', weight: 80.3, bodyFat: 19.2, muscle: 47.0 },
  ];

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Mi Progreso</h1>
          <p className="text-gray-400">Seguimiento detallado de tu evolución</p>
        </div>

        {/* Progress Chart */}
        <ProgressChart
          data={mockData}
          currentWeight={80.3}
          targetWeight={75.0}
          startWeight={85.0}
          timeframe="3M"
        />

        {/* Quick Navigation */}
        <div className="flex justify-between items-center pt-4">
          <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm">Rutinas</span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <span className="text-sm">Nutrición</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressChartDemo;