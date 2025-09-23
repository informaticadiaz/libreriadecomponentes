"use client";
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  MessageCircle,
  Calendar,
  TrendingUp,
  User,
  Phone,
  Mail,
  Target,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronRight,
  Edit3,
  Eye
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'trial';
  goal: string;
  nextSession: string | null;
  lastActivity: string;
  adherence: number;
  progress: {
    weight: { current: number; change: number };
    workouts: { completed: number; total: number };
  };
  subscription: {
    plan: string;
    nextPayment: string;
    amount: number;
  };
}

const ClientManager = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive' | 'trial'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  // Mock data
  const clients: Client[] = [
    {
      id: '1',
      name: 'María González',
      email: 'maria@email.com',
      phone: '+54 11 1234-5678',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b25213b9?w=80&h=80&fit=crop&crop=face',
      joinDate: '2024-01-15',
      status: 'active',
      goal: 'Pérdida de peso',
      nextSession: '2024-02-15 10:00',
      lastActivity: 'Hace 2 horas',
      adherence: 92,
      progress: {
        weight: { current: 68.5, change: -3.2 },
        workouts: { completed: 23, total: 28 }
      },
      subscription: {
        plan: 'Premium',
        nextPayment: '2024-03-01',
        amount: 120
      }
    },
    {
      id: '2', 
      name: 'Juan Pérez',
      email: 'juan@email.com',
      phone: '+54 11 2345-6789',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
      joinDate: '2024-01-20',
      status: 'inactive',
      goal: 'Ganancia muscular',
      nextSession: null,
      lastActivity: 'Hace 5 días',
      adherence: 45,
      progress: {
        weight: { current: 75.2, change: 1.8 },
        workouts: { completed: 12, total: 28 }
      },
      subscription: {
        plan: 'Básico',
        nextPayment: '2024-02-20',
        amount: 80
      }
    },
    {
      id: '3',
      name: 'Ana López',
      email: 'ana@email.com', 
      phone: '+54 11 3456-7890',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
      joinDate: '2024-02-10',
      status: 'trial',
      goal: 'Tonificación',
      nextSession: '2024-02-16 14:00',
      lastActivity: 'Hace 1 hora',
      adherence: 85,
      progress: {
        weight: { current: 62.0, change: -1.5 },
        workouts: { completed: 8, total: 10 }
      },
      subscription: {
        plan: 'Trial',
        nextPayment: '2024-02-17',
        amount: 0
      }
    },
    {
      id: '4',
      name: 'Carlos Mendoza',
      email: 'carlos@email.com',
      phone: '+54 11 4567-8901',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
      joinDate: '2023-11-05',
      status: 'active',
      goal: 'Fuerza general',
      nextSession: '2024-02-16 16:00',
      lastActivity: 'Hace 30 min',
      adherence: 88,
      progress: {
        weight: { current: 82.1, change: 2.5 },
        workouts: { completed: 67, total: 75 }
      },
      subscription: {
        plan: 'Premium',
        nextPayment: '2024-02-25',
        amount: 120
      }
    }
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || client.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'inactive': return 'bg-red-500/20 text-red-400';
      case 'trial': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'trial': return 'Prueba';
      default: return status;
    }
  };

  const ClientCard = ({ client }: { client: Client }) => (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all group">
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
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(client.status)}`}>
              {getStatusText(client.status)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <MessageCircle className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Goal & Next Session */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Target className="h-4 w-4" />
          <span>{client.goal}</span>
        </div>
        
        {client.nextSession ? (
          <div className="flex items-center space-x-2 text-sm text-green-400">
            <Calendar className="h-4 w-4" />
            <span>Próxima: {new Date(client.nextSession).toLocaleDateString('es-ES', { 
              day: 'numeric', 
              month: 'short',
              hour: '2-digit',
              minute: '2-digit' 
            })}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-sm text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>Sin sesiones programadas</span>
          </div>
        )}
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-lg font-bold text-white">
            {client.progress.weight.current}kg
          </p>
          <p className={`text-xs ${client.progress.weight.change < 0 ? 'text-green-400' : 'text-blue-400'}`}>
            {client.progress.weight.change > 0 ? '+' : ''}{client.progress.weight.change}kg
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-lg font-bold text-white">{client.adherence}%</p>
          <p className="text-xs text-gray-400">Adherencia</p>
        </div>
      </div>

      {/* Workout Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Entrenamientos</span>
          <span className="text-white">
            {client.progress.workouts.completed}/{client.progress.workouts.total}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-fuchsia-500 to-violet-500 h-2 rounded-full transition-all"
            style={{ width: `${(client.progress.workouts.completed / client.progress.workouts.total) * 100}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button className="flex-1 bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all flex items-center justify-center space-x-1">
          <Eye className="h-4 w-4" />
          <span>Ver Perfil</span>
        </button>
        
        <button className="bg-gray-800 text-gray-400 hover:text-white py-2 px-3 rounded-lg text-sm transition-colors">
          <Edit3 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Mis Clientes</h1>
            <p className="text-gray-400">{filteredClients.length} clientes encontrados</p>
          </div>
          
          <button className="flex items-center space-x-2 bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-3 rounded-xl hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all">
            <Plus className="h-5 w-5" />
            <span className="font-medium">Agregar Cliente</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cliente por nombre o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-fuchsia-500 transition-colors"
            />
          </div>
          
          <div className="flex space-x-2">
            {['all', 'active', 'inactive', 'trial'].map((filter) => (
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
                 filter === 'active' ? 'Activos' :
                 filter === 'inactive' ? 'Inactivos' : 'Prueba'}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Clientes</p>
                <p className="text-2xl font-bold text-white">{clients.length}</p>
              </div>
              <User className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Activos</p>
                <p className="text-2xl font-bold text-green-400">
                  {clients.filter(c => c.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">En Prueba</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {clients.filter(c => c.status === 'trial').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Adherencia Prom.</p>
                <p className="text-2xl font-bold text-fuchsia-400">
                  {Math.round(clients.reduce((acc, c) => acc + c.adherence, 0) / clients.length)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-fuchsia-400" />
            </div>
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>

        {/* Empty State */}
        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No se encontraron clientes</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? 'Intenta con otros términos de búsqueda'
                : 'Agrega tu primer cliente para comenzar'
              }
            </p>
            <button className="bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all">
              Agregar Cliente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManager;