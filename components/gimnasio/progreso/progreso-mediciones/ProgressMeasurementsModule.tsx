"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Weight, 
  Ruler, 
  Target, 
  Camera, 
  Plus,
  BarChart3,
  Activity,
  Award,
  Clock,
  Zap,
  Heart,
  LucideIcon
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

// =====================================
// INTERFACES Y TIPOS
// =====================================

interface MeasurementData {
  date: string;
  weight: number;
  bodyFat: number;
  muscle: number;
}

interface Goal {
  id: number;
  title: string;
  target: number;
  current: number;
  unit: string;
  type: 'weight' | 'bodyFat' | 'muscle';
  progress: number;
}

interface TimelineItem {
  date: string;
  type: 'measurement' | 'photo' | 'goal' | 'checkin';
  title: string;
  description: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'yellow' | 'red';
}

interface MetricCard {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  color: 'blue' | 'red' | 'green';
}

interface MeasurementType {
  id: keyof Pick<MeasurementData, 'weight' | 'bodyFat' | 'muscle'>;
  label: string;
  color: string;
  unit: string;
}

interface MeasurementFormData {
  weight: string;
  bodyFat: string;
  muscle: string;
  notes: string;
}

type TabId = 'overview' | 'measurements' | 'goals' | 'timeline';

interface Tab {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

// Props interfaces
interface OverviewSectionProps {
  measurements: MeasurementData[];
}

interface MeasurementsSectionProps {
  measurements: MeasurementData[];
  selectedMeasurement: keyof Pick<MeasurementData, 'weight' | 'bodyFat' | 'muscle'>;
  setSelectedMeasurement: (measurement: keyof Pick<MeasurementData, 'weight' | 'bodyFat' | 'muscle'>) => void;
}

interface MeasurementFormProps {
  onSubmit: (data: MeasurementFormData) => void;
  isLoading?: boolean;
}

interface GoalsSectionProps {
  goals: Goal[];
}

interface TimelineSectionProps {
  timeline: TimelineItem[];
}

// =====================================
// DATOS DE EJEMPLO
// =====================================

const mockMeasurements: MeasurementData[] = [
  { date: '2024-01-01', weight: 75.2, bodyFat: 18.5, muscle: 32.1 },
  { date: '2024-01-15', weight: 74.8, bodyFat: 18.2, muscle: 32.3 },
  { date: '2024-02-01', weight: 74.1, bodyFat: 17.8, muscle: 32.8 },
  { date: '2024-02-15', weight: 73.5, bodyFat: 17.4, muscle: 33.2 },
  { date: '2024-03-01', weight: 73.0, bodyFat: 17.0, muscle: 33.6 },
  { date: '2024-03-15', weight: 72.8, bodyFat: 16.8, muscle: 33.9 },
];

const mockGoals: Goal[] = [
  { id: 1, title: 'Perder 5kg', target: 70, current: 72.8, unit: 'kg', type: 'weight', progress: 84 },
  { id: 2, title: 'Grasa corporal < 15%', target: 15, current: 16.8, unit: '%', type: 'bodyFat', progress: 72 },
  { id: 3, title: 'Ganar masa muscular', target: 35, current: 33.9, unit: 'kg', type: 'muscle', progress: 83 },
];

const mockTimeline: TimelineItem[] = [
  { 
    date: '2024-03-15', 
    type: 'measurement', 
    title: 'Nueva medición registrada',
    description: 'Peso: 72.8kg, Grasa: 16.8%',
    icon: Weight,
    color: 'blue'
  },
  { 
    date: '2024-03-10', 
    type: 'photo', 
    title: 'Fotos de progreso',
    description: 'Nuevas fotos subidas',
    icon: Camera,
    color: 'green'
  },
  { 
    date: '2024-03-05', 
    type: 'goal', 
    title: 'Meta alcanzada',
    description: 'Objetivo de grasa corporal completado',
    icon: Award,
    color: 'yellow'
  },
  { 
    date: '2024-03-01', 
    type: 'checkin', 
    title: 'Check-in semanal',
    description: 'Energía: 8/10, Motivación: 9/10',
    icon: Heart,
    color: 'red'
  },
];

// =====================================
// COMPONENTE PRINCIPAL
// =====================================

const ProgressMeasurementsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [selectedMeasurement, setSelectedMeasurement] = useState<keyof Pick<MeasurementData, 'weight' | 'bodyFat' | 'muscle'>>('weight');

  const tabs: Tab[] = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'measurements', label: 'Mediciones', icon: Ruler },
    { id: 'goals', label: 'Objetivos', icon: Target },
    { id: 'timeline', label: 'Timeline', icon: Clock },
  ];

  const handleMeasurementSubmit = (data: MeasurementFormData): void => {
    console.log('Submitting measurement:', data);
    // Aquí iría la lógica para enviar los datos al backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Progreso y Mediciones
          </h1>
          <p className="text-gray-600">
            Seguimiento completo del progreso de tus clientes
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white rounded-xl p-1 shadow-sm">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <OverviewSection measurements={mockMeasurements} />
            </motion.div>
          )}

          {activeTab === 'measurements' && (
            <motion.div
              key="measurements"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <MeasurementsSection 
                measurements={mockMeasurements}
                selectedMeasurement={selectedMeasurement}
                setSelectedMeasurement={setSelectedMeasurement}
              />
              <MeasurementForm onSubmit={handleMeasurementSubmit} />
            </motion.div>
          )}

          {activeTab === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <GoalsSection goals={mockGoals} />
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <TimelineSection timeline={mockTimeline} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// =====================================
// SECCIÓN DE RESUMEN
// =====================================

const OverviewSection: React.FC<OverviewSectionProps> = ({ measurements }) => {
  const { latestData, previousData } = useMemo(() => {
    const latest = measurements[measurements.length - 1];
    const previous = measurements[measurements.length - 2];
    return { latestData: latest, previousData: previous };
  }, [measurements]);

  const cards: MetricCard[] = useMemo(() => [
    {
      title: 'Peso Actual',
      value: `${latestData.weight} kg`,
      change: latestData.weight - previousData.weight,
      icon: Weight,
      color: 'blue'
    },
    {
      title: 'Grasa Corporal',
      value: `${latestData.bodyFat}%`,
      change: latestData.bodyFat - previousData.bodyFat,
      icon: Activity,
      color: 'red'
    },
    {
      title: 'Masa Muscular',
      value: `${latestData.muscle} kg`,
      change: latestData.muscle - previousData.muscle,
      icon: Zap,
      color: 'green'
    }
  ], [latestData, previousData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${
              card.color === 'blue' ? 'bg-blue-100' :
              card.color === 'red' ? 'bg-red-100' : 'bg-green-100'
            }`}>
              <card.icon className={`w-6 h-6 ${
                card.color === 'blue' ? 'text-blue-600' :
                card.color === 'red' ? 'text-red-600' : 'text-green-600'
              }`} />
            </div>
            <div className={`flex items-center ${
              card.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {card.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span className="text-sm font-medium">
                {Math.abs(card.change).toFixed(1)}
              </span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

// =====================================
// SECCIÓN DE MEDICIONES
// =====================================

const MeasurementsSection: React.FC<MeasurementsSectionProps> = ({ 
  measurements, 
  selectedMeasurement, 
  setSelectedMeasurement 
}) => {
  const measurementTypes: MeasurementType[] = [
    { id: 'weight', label: 'Peso', color: '#3B82F6', unit: 'kg' },
    { id: 'bodyFat', label: 'Grasa Corporal', color: '#EF4444', unit: '%' },
    { id: 'muscle', label: 'Masa Muscular', color: '#10B981', unit: 'kg' },
  ];

  const currentType = measurementTypes.find(t => t.id === selectedMeasurement);

  if (!currentType) {
    return <div>Error: Tipo de medición no encontrado</div>;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Gráfico de Progreso</h2>
        <div className="flex space-x-2">
          {measurementTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedMeasurement(type.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedMeasurement === type.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={measurements}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentType.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={currentType.color} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#888"
              fontSize={12}
              tickFormatter={(value: string) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
            />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip 
              contentStyle={{
                background: 'white',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [`${value} ${currentType.unit}`, currentType.label]}
              labelFormatter={(value: string) => new Date(value).toLocaleDateString('es-ES')}
            />
            <Area
              type="monotone"
              dataKey={selectedMeasurement}
              stroke={currentType.color}
              strokeWidth={3}
              fill="url(#colorGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// =====================================
// FORMULARIO DE MEDICIONES
// =====================================

const MeasurementForm: React.FC<MeasurementFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<MeasurementFormData>({
    weight: '',
    bodyFat: '',
    muscle: '',
    notes: ''
  });

  const handleInputChange = (field: keyof MeasurementFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ weight: '', bodyFat: '', muscle: '', notes: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Nueva Medición</h2>
        <div className="p-2 bg-blue-100 rounded-lg">
          <Plus className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peso (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={handleInputChange('weight')}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="72.5"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grasa Corporal (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.bodyFat}
              onChange={handleInputChange('bodyFat')}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="16.5"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Masa Muscular (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.muscle}
              onChange={handleInputChange('muscle')}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="34.0"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas (opcional)
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={handleInputChange('notes')}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Observaciones sobre la medición..."
            disabled={isLoading}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            {isLoading ? 'Guardando...' : 'Guardar Medición'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// =====================================
// SECCIÓN DE OBJETIVOS
// =====================================

const GoalsSection: React.FC<GoalsSectionProps> = ({ goals }) => {
  return (
    <div className="space-y-6">
      {goals.map((goal, index) => (
        <motion.div
          key={goal.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {goal.progress}%
            </span>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Actual: {goal.current}{goal.unit}</span>
              <span>Objetivo: {goal.target}{goal.unit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${goal.progress}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
              />
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Target className="w-4 h-4 mr-2" />
            {goal.progress >= 100 ? '¡Objetivo completado!' : `${(100 - goal.progress).toFixed(0)}% restante`}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// =====================================
// SECCIÓN DE TIMELINE
// =====================================

const TimelineSection: React.FC<TimelineSectionProps> = ({ timeline }) => {
  const getColorClasses = (color: TimelineItem['color']) => {
    const colorMap = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
      red: { bg: 'bg-red-100', text: 'text-red-600' },
    };
    return colorMap[color];
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Timeline de Progreso</h2>
      
      <div className="space-y-6">
        {timeline.map((item, index) => {
          const colorClasses = getColorClasses(item.color);
          return (
            <motion.div
              key={`${item.date}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-4"
            >
              <div className={`p-2 rounded-xl ${colorClasses.bg} flex-shrink-0`}>
                <item.icon className={`w-5 h-5 ${colorClasses.text}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(item.date).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressMeasurementsModule;