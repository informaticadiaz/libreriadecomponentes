"use client";
import React, { useState } from 'react';
import { 
  Apple, 
  Plus, 
  Search, 
  Filter,
  Users,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  Edit3,
  Copy,
  Trash2,
  Eye,
  Share,
  ChefHat,
  Utensils,
  Calculator,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Camera,
  Book,
  Download,
  Upload
} from 'lucide-react';

interface MacroTarget {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

interface Food {
  id: string;
  name: string;
  category: 'protein' | 'carbs' | 'vegetables' | 'fruits' | 'fats' | 'dairy' | 'grains';
  calories: number; // per 100g
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  verified: boolean;
}

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: Array<{
    foodId: string;
    food: Food;
    quantity: number; // in grams
  }>;
  totalMacros: MacroTarget;
}

interface NutritionPlan {
  id: string;
  name: string;
  description: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  status: 'active' | 'draft' | 'completed';
  goal: 'weight_loss' | 'weight_gain' | 'maintenance' | 'muscle_gain';
  startDate: string;
  endDate?: string;
  dailyTargets: MacroTarget;
  meals: Meal[];
  adherence?: number;
  createdAt: string;
  lastModified: string;
}

interface ClientNutritionOverview {
  clientId: string;
  clientName: string;
  clientAvatar: string;
  currentPlan: NutritionPlan | null;
  adherence: number;
  lastLoggedMeal: string;
  weeklyProgress: Array<{
    date: string;
    caloriesConsumed: number;
    targetCalories: number;
  }>;
}

const NutritionManager = () => {
  const [activeTab, setActiveTab] = useState<'plans' | 'clients' | 'library' | 'create'>('plans');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'draft'>('all');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Mock data
  const foodLibrary: Food[] = [
    {
      id: '1',
      name: 'Pechuga de Pollo',
      category: 'protein',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      verified: true
    },
    {
      id: '2',
      name: 'Arroz Integral',
      category: 'carbs',
      calories: 123,
      protein: 2.6,
      carbs: 25,
      fat: 1,
      fiber: 3,
      verified: true
    },
    {
      id: '3',
      name: 'Palta',
      category: 'fats',
      calories: 160,
      protein: 2,
      carbs: 9,
      fat: 15,
      fiber: 7,
      verified: true
    }
  ];

  const nutritionPlans: NutritionPlan[] = [
    {
      id: '1',
      name: 'Plan Pérdida de Peso - María',
      description: 'Plan hipocalórico personalizado para pérdida de peso gradual',
      clientId: '1',
      clientName: 'María González',
      clientAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b25213b9?w=50&h=50&fit=crop&crop=face',
      status: 'active',
      goal: 'weight_loss',
      startDate: '2024-02-01',
      endDate: '2024-04-01',
      dailyTargets: {
        calories: 1400,
        protein: 105,
        carbs: 140,
        fat: 47
      },
      meals: [],
      adherence: 88,
      createdAt: '2024-01-30',
      lastModified: '2024-02-10'
    },
    {
      id: '2',
      name: 'Plan Ganancia Muscular - Juan',
      description: 'Plan hipercalórico con alta proteína para ganancia de masa muscular',
      clientId: '2',
      clientName: 'Juan Pérez',
      clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      status: 'active',
      goal: 'muscle_gain',
      startDate: '2024-01-15',
      dailyTargets: {
        calories: 2800,
        protein: 168,
        carbs: 350,
        fat: 93
      },
      meals: [],
      adherence: 72,
      createdAt: '2024-01-10',
      lastModified: '2024-02-08'
    },
    {
      id: '3',
      name: 'Plan Mantenimiento - Ana',
      description: 'Plan balanceado para mantenimiento de peso actual',
      clientId: '3',
      clientName: 'Ana López',
      clientAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      status: 'draft',
      goal: 'maintenance',
      startDate: '2024-02-20',
      dailyTargets: {
        calories: 1800,
        protein: 108,
        carbs: 225,
        fat: 60
      },
      meals: [],
      createdAt: '2024-02-15',
      lastModified: '2024-02-15'
    }
  ];

  const clientsOverview: ClientNutritionOverview[] = [
    {
      clientId: '1',
      clientName: 'María González',
      clientAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b25213b9?w=50&h=50&fit=crop&crop=face',
      currentPlan: nutritionPlans[0],
      adherence: 88,
      lastLoggedMeal: '2024-02-15T14:30:00Z',
      weeklyProgress: [
        { date: '2024-02-09', caloriesConsumed: 1380, targetCalories: 1400 },
        { date: '2024-02-10', caloriesConsumed: 1420, targetCalories: 1400 },
        { date: '2024-02-11', caloriesConsumed: 1350, targetCalories: 1400 },
        { date: '2024-02-12', caloriesConsumed: 1450, targetCalories: 1400 },
        { date: '2024-02-13', caloriesConsumed: 1390, targetCalories: 1400 },
        { date: '2024-02-14', caloriesConsumed: 1340, targetCalories: 1400 },
        { date: '2024-02-15', caloriesConsumed: 1410, targetCalories: 1400 }
      ]
    },
    {
      clientId: '2',
      clientName: 'Juan Pérez',
      clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      currentPlan: nutritionPlans[1],
      adherence: 72,
      lastLoggedMeal: '2024-02-14T20:00:00Z',
      weeklyProgress: [
        { date: '2024-02-09', caloriesConsumed: 2650, targetCalories: 2800 },
        { date: '2024-02-10', caloriesConsumed: 2750, targetCalories: 2800 },
        { date: '2024-02-11', caloriesConsumed: 2200, targetCalories: 2800 },
        { date: '2024-02-12', caloriesConsumed: 2900, targetCalories: 2800 },
        { date: '2024-02-13', caloriesConsumed: 2450, targetCalories: 2800 },
        { date: '2024-02-14', caloriesConsumed: 2100, targetCalories: 2800 },
        { date: '2024-02-15', caloriesConsumed: 2800, targetCalories: 2800 }
      ]
    }
  ];

  const filteredPlans = nutritionPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || plan.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'weight_loss': return 'bg-red-500/20 text-red-400';
      case 'weight_gain': return 'bg-green-500/20 text-green-400';
      case 'muscle_gain': return 'bg-blue-500/20 text-blue-400';
      case 'maintenance': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getGoalText = (goal: string) => {
    switch (goal) {
      case 'weight_loss': return 'Pérdida de Peso';
      case 'weight_gain': return 'Ganancia de Peso';
      case 'muscle_gain': return 'Ganancia Muscular';
      case 'maintenance': return 'Mantenimiento';
      default: return goal;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'draft': return 'Borrador';
      case 'completed': return 'Completado';
      default: return status;
    }
  };

  const PlanCard = ({ plan }: { plan: NutritionPlan }) => (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img 
            src={plan.clientAvatar}
            alt={plan.clientName}
            className="h-12 w-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-white">{plan.name}</h3>
            <p className="text-sm text-gray-400">{plan.clientName}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(plan.status)}`}>
            {getStatusText(plan.status)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs ${getGoalColor(plan.goal)}`}>
            {getGoalText(plan.goal)}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-4">{plan.description}</p>

      {/* Macros Overview */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="text-center">
          <p className="text-lg font-bold text-white">{plan.dailyTargets.calories}</p>
          <p className="text-xs text-gray-400">Calorías</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-blue-400">{plan.dailyTargets.protein}g</p>
          <p className="text-xs text-gray-400">Proteína</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-400">{plan.dailyTargets.carbs}g</p>
          <p className="text-xs text-gray-400">Carbos</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-yellow-400">{plan.dailyTargets.fat}g</p>
          <p className="text-xs text-gray-400">Grasas</p>
        </div>
      </div>

      {/* Adherence */}
      {plan.adherence && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Adherencia</span>
            <span className="text-white">{plan.adherence}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-fuchsia-500 to-violet-500 h-2 rounded-full transition-all"
              style={{ width: `${plan.adherence}%` }}
            />
          </div>
        </div>
      )}

      {/* Dates */}
      <div className="text-xs text-gray-500 mb-4">
        <p>Inicio: {new Date(plan.startDate).toLocaleDateString('es-ES')}</p>
        {plan.endDate && (
          <p>Fin: {new Date(plan.endDate).toLocaleDateString('es-ES')}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button 
          onClick={() => setSelectedPlan(plan.id)}
          className="flex-1 bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all flex items-center justify-center space-x-1"
        >
          <Eye className="h-4 w-4" />
          <span>Ver Plan</span>
        </button>
        
        <button className="bg-gray-800 text-gray-400 hover:text-white py-2 px-3 rounded-lg text-sm transition-colors">
          <Edit3 className="h-4 w-4" />
        </button>
        
        <button className="bg-gray-800 text-gray-400 hover:text-white py-2 px-3 rounded-lg text-sm transition-colors">
          <Copy className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const ClientOverviewCard = ({ client }: { client: ClientNutritionOverview }) => (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img 
            src={client.clientAvatar}
            alt={client.clientName}
            className="h-12 w-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-white">{client.clientName}</h3>
            <p className="text-sm text-gray-400">
              Último registro: {new Date(client.lastLoggedMeal).toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>
        
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
          client.adherence >= 80 ? 'bg-green-500/20 text-green-400' :
          client.adherence >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {client.adherence >= 80 ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <span className="text-xs font-medium">{client.adherence}% adherencia</span>
        </div>
      </div>

      {/* Current Plan */}
      {client.currentPlan ? (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">Plan Actual</p>
          <p className="font-medium text-white">{client.currentPlan.name}</p>
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
            <span>{client.currentPlan.dailyTargets.calories} cal</span>
            <span className={getGoalColor(client.currentPlan.goal).replace('bg-', 'text-').replace('/20', '')}>
              {getGoalText(client.currentPlan.goal)}
            </span>
          </div>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-gray-800 rounded-lg text-center">
          <p className="text-sm text-gray-400">Sin plan asignado</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex space-x-2">
        <button className="flex-1 bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all">
          Ver Progreso
        </button>
        <button className="bg-gray-800 text-gray-400 hover:text-white py-2 px-3 rounded-lg text-sm transition-colors">
          <ChefHat className="h-4 w-4" />
        </button>
        <button className="bg-gray-800 text-gray-400 hover:text-white py-2 px-3 rounded-lg text-sm transition-colors">
          <Calendar className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const CreatePlanForm = () => (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h2 className="text-2xl font-bold text-white mb-6">Crear Nuevo Plan Nutricional</h2>
      
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre del Plan
            </label>
            <input
              type="text"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fuchsia-500"
              placeholder="Ej: Plan Pérdida de Peso - Cliente"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cliente
            </label>
            <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fuchsia-500">
              <option value="">Seleccionar cliente</option>
              <option value="1">María González</option>
              <option value="2">Juan Pérez</option>
              <option value="3">Ana López</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fuchsia-500"
            placeholder="Describe el objetivo y características del plan..."
          />
        </div>

        {/* Goals and Macros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Objetivo
            </label>
            <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fuchsia-500">
              <option value="weight_loss">Pérdida de Peso</option>
              <option value="weight_gain">Ganancia de Peso</option>
              <option value="muscle_gain">Ganancia Muscular</option>
              <option value="maintenance">Mantenimiento</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duración (semanas)
            </label>
            <input
              type="number"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fuchsia-500"
              placeholder="8"
            />
          </div>
        </div>

        {/* Macro Targets */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Objetivos Diarios</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Calorías
              </label>
              <input
                type="number"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fuchsia-500"
                placeholder="1500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Proteína (g)
              </label>
              <input
                type="number"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fuchsia-500"
                placeholder="120"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Carbohidratos (g)
              </label>
              <input
                type="number"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fuchsia-500"
                placeholder="150"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Grasas (g)
              </label>
              <input
                type="number"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fuchsia-500"
                placeholder="50"
              />
            </div>
          </div>
        </div>

        {/* Template Options */}
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Crear desde Plantilla</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left">
              <h4 className="font-medium text-white mb-2">Plan Pérdida de Peso</h4>
              <p className="text-sm text-gray-400">1400 cal • Alta proteína</p>
            </button>
            <button className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left">
              <h4 className="font-medium text-white mb-2">Plan Ganancia Muscular</h4>
              <p className="text-sm text-gray-400">2800 cal • Hipercalórico</p>
            </button>
            <button className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left">
              <h4 className="font-medium text-white mb-2">Plan Mantenimiento</h4>
              <p className="text-sm text-gray-400">2000 cal • Balanceado</p>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-6 border-t border-gray-800">
          <button className="flex-1 bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all">
            Crear Plan
          </button>
          <button className="bg-gray-800 text-gray-400 hover:text-white py-3 px-6 rounded-lg font-medium transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Nutrición</h1>
            <p className="text-gray-400">Gestiona planes nutricionales para tus clientes</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 bg-gray-900 text-gray-400 hover:text-white px-4 py-2 rounded-lg transition-colors">
              <Upload className="h-4 w-4" />
              <span>Importar</span>
            </button>
            <button 
              onClick={() => setActiveTab('create')}
              className="flex items-center space-x-2 bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-3 rounded-xl hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Crear Plan</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg">
          {[
            { id: 'plans', label: 'Mis Planes', icon: ChefHat },
            { id: 'clients', label: 'Clientes', icon: Users },
            { id: 'library', label: 'Biblioteca', icon: Book },
            { id: 'create', label: 'Crear Nuevo', icon: Plus }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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
        {activeTab === 'plans' && (
          <>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar planes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-fuchsia-500 transition-colors"
                />
              </div>
              
              <div className="flex space-x-2">
                {['all', 'active', 'draft'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter as any)}
                    className={`px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                      selectedFilter === filter
                        ? 'bg-fuchsia-600 text-white'
                        : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
                    }`}
                  >
                    {filter === 'all' ? 'Todos' : 
                     filter === 'active' ? 'Activos' : 'Borradores'}
                  </button>
                ))}
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </>
        )}

        {activeTab === 'clients' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientsOverview.map((client) => (
              <ClientOverviewCard key={client.clientId} client={client} />
            ))}
          </div>
        )}

        {activeTab === 'library' && (
          <div className="text-center py-12">
            <Book className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Biblioteca de Alimentos</h3>
            <p className="text-gray-400">Próximamente: biblioteca completa de alimentos y recetas</p>
          </div>
        )}

        {activeTab === 'create' && <CreatePlanForm />}

        {/* Empty State */}
        {activeTab === 'plans' && filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No se encontraron planes</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? 'Intenta con otros términos de búsqueda'
                : 'Crea tu primer plan nutricional para comenzar'
              }
            </p>
            <button 
              onClick={() => setActiveTab('create')}
              className="bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all"
            >
              Crear Plan Nutricional
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionManager;