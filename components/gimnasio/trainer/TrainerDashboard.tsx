"use client";
import React from 'react';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  MessageCircle, 
  Bell, 
  Plus,
  Activity,
  DollarSign,
  Clock,
  Target,
  ChevronRight,
  Dumbbell,
  AlertTriangle
} from 'lucide-react';

interface ClientActivity {
  id: string;
  name: string;
  avatar: string;
  activity: string;
  time: string;
  status: 'completed' | 'missed' | 'scheduled';
}

interface TodaySession {
  id: string;
  clientName: string;
  time: string;
  type: 'workout' | 'nutrition' | 'assessment';
  status: 'upcoming' | 'in-progress' | 'completed';
}

interface DashboardStats {
  activeClients: number;
  todaySessions: number;
  monthlyRevenue: number;
  unreadMessages: number;
}

const TrainerDashboard = () => {
  // const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');

  // Mock data
  const stats: DashboardStats = {
    activeClients: 24,
    todaySessions: 6,
    monthlyRevenue: 3250,
    unreadMessages: 8
  };

  const recentActivities: ClientActivity[] = [
    {
      id: '1',
      name: 'María González',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b25213b9?w=50&h=50&fit=crop&crop=face',
      activity: 'Completó Push Day',
      time: 'Hace 15 min',
      status: 'completed'
    },
    {
      id: '2', 
      name: 'Juan Pérez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      activity: 'Perdió entrenamiento',
      time: 'Hace 1 hora',
      status: 'missed'
    },
    {
      id: '3',
      name: 'Ana López',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      activity: 'Próxima sesión',
      time: 'En 30 min',
      status: 'scheduled'
    }
  ];

  const todaySessions: TodaySession[] = [
    {
      id: '1',
      clientName: 'Carlos Mendoza',
      time: '09:00',
      type: 'workout',
      status: 'completed'
    },
    {
      id: '2',
      clientName: 'Ana López', 
      time: '10:30',
      type: 'assessment',
      status: 'in-progress'
    },
    {
      id: '3',
      clientName: 'Pedro Silva',
      time: '14:00',
      type: 'nutrition',
      status: 'upcoming'
    },
    {
      id: '4',
      clientName: 'Laura Torres',
      time: '16:00',
      type: 'workout',
      status: 'upcoming'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'missed': return 'text-red-400';
      case 'scheduled': return 'text-blue-400';
      case 'in-progress': return 'text-fuchsia-400';
      case 'upcoming': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'workout': return <Dumbbell className="h-4 w-4" />;
      case 'nutrition': return <Target className="h-4 w-4" />;
      case 'assessment': return <Activity className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-3 bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors relative">
              <Bell className="h-5 w-5 text-gray-400" />
              {stats.unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  {stats.unreadMessages}
                </span>
              )}
            </button>
            
            <button className="flex items-center space-x-2 bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-3 rounded-xl hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all">
              <Plus className="h-5 w-5" />
              <span className="font-medium">Nuevo Cliente</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Clientes Activos</p>
                <p className="text-2xl font-bold text-white">{stats.activeClients}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Sesiones Hoy</p>
                <p className="text-2xl font-bold text-white">{stats.todaySessions}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Calendar className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Ingresos del Mes</p>
                <p className="text-2xl font-bold text-white">${stats.monthlyRevenue}</p>
              </div>
              <div className="p-3 bg-fuchsia-500/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-fuchsia-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Mensajes</p>
                <p className="text-2xl font-bold text-white">{stats.unreadMessages}</p>
              </div>
              <div className="p-3 bg-violet-500/20 rounded-lg">
                <MessageCircle className="h-6 w-6 text-violet-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Agenda del Día */}
          <div className="lg:col-span-2 bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Agenda del Día</h2>
              <button className="text-sm text-fuchsia-400 hover:text-fuchsia-300 flex items-center space-x-1">
                <span>Ver calendario completo</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {todaySessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      session.type === 'workout' ? 'bg-fuchsia-500/20' :
                      session.type === 'nutrition' ? 'bg-green-500/20' :
                      'bg-blue-500/20'
                    }`}>
                      {getTypeIcon(session.type)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{session.clientName}</p>
                      <p className="text-sm text-gray-400 capitalize">{session.type}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium text-white">{session.time}</p>
                    <p className={`text-sm ${getStatusColor(session.status)} capitalize`}>
                      {session.status === 'in-progress' ? 'En curso' :
                       session.status === 'upcoming' ? 'Próxima' : 'Completada'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Actividad Reciente</h2>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <img 
                    src={activity.avatar}
                    alt={activity.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {activity.name}
                    </p>
                    <p className={`text-xs ${getStatusColor(activity.status)}`}>
                      {activity.activity}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  
                  {activity.status === 'missed' && (
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  )}
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2 text-sm text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
              Ver toda la actividad
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Acciones Rápidas</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors group">
              <div className="p-3 bg-fuchsia-500/20 rounded-lg mb-2 group-hover:bg-fuchsia-500/30 transition-colors">
                <Dumbbell className="h-6 w-6 text-fuchsia-400" />
              </div>
              <span className="text-sm font-medium text-white">Crear Entrenamiento</span>
            </button>

            <button className="flex flex-col items-center p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors group">
              <div className="p-3 bg-green-500/20 rounded-lg mb-2 group-hover:bg-green-500/30 transition-colors">
                <Target className="h-6 w-6 text-green-400" />
              </div>
              <span className="text-sm font-medium text-white">Plan Nutricional</span>
            </button>

            <button className="flex flex-col items-center p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors group">
              <div className="p-3 bg-blue-500/20 rounded-lg mb-2 group-hover:bg-blue-500/30 transition-colors">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-sm font-medium text-white">Ver Progreso</span>
            </button>

            <button className="flex flex-col items-center p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors group">
              <div className="p-3 bg-violet-500/20 rounded-lg mb-2 group-hover:bg-violet-500/30 transition-colors">
                <MessageCircle className="h-6 w-6 text-violet-400" />
              </div>
              <span className="text-sm font-medium text-white">Enviar Mensaje</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;