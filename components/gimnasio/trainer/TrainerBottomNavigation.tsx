"use client";
import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  Dumbbell, 
  Apple, 
  MessageCircle, 
  Bell, 
  Settings,
  Calendar,
  BarChart3,
  User,
  Plus,
  Search,
  TrendingUp
} from 'lucide-react';

import TrainerDashboard from '@/components/gimnasio/trainer/TrainerDashboard'
import ClientManager from '@/components/gimnasio/trainer/ClientManager'
import WorkoutManager from '@/components/gimnasio/trainer/WorkoutManager'
import ClientProgressOverview from '@/components/gimnasio/trainer/ClientProgressOverview'
import ClientCommunication from '@/components/gimnasio/trainer/ClientCommunication'
import TrainerNotifications from '@/components/gimnasio/trainer/TrainerNotifications'
import NutritionManager from '@/components/gimnasio/trainer/NutritionManager'
import AnalyticsDashboard from '@/components/gimnasio/trainer/AnalyticsDashboard'



// ProfileView permanece igual
const ProfileView = () => (
  <div className="space-y-6">
    <div className="text-center">
      <div className="w-20 h-20 bg-gradient-to-r from-fuchsia-600 to-violet-600 rounded-full mx-auto mb-4 flex items-center justify-center">
        <User className="h-10 w-10 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
      <p className="text-gray-400">Carlos Fitness - Entrenador Personal</p>
    </div>
    
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <h3 className="font-semibold text-white mb-3">Estadísticas del Negocio</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-fuchsia-400">24</p>
            <p className="text-xs text-gray-400">Clientes Activos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">$3,250</p>
            <p className="text-xs text-gray-400">Ingresos del Mes</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <h3 className="font-semibold text-white mb-3">Configuración</h3>
        <div className="space-y-4">
          {[
            { label: 'Perfil Profesional', icon: User },
            { label: 'Notificaciones', icon: Bell },
            { label: 'Configuración', icon: Settings }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-gray-400" />
                  <span className="text-white">{item.label}</span>
                </div>
                <div className="h-2 w-2 bg-gray-600 rounded-full" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

interface BottomNavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  component: React.ComponentType;
  hasNotification?: boolean;
  notificationCount?: number;
}

const TrainerBottomNavigation = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [unreadMessages] = useState(8);
  const [unreadNotifications] = useState(12);

  // Sistema de navegación completo con todos los componentes creados
  const navItems: BottomNavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      component: TrainerDashboard
    },
    {
      id: 'clients',
      label: 'Clientes',
      icon: Users,
      component: ClientManager
    },
    {
      id: 'workouts',
      label: 'Entrenamientos',
      icon: Dumbbell,
      component: WorkoutManager
    },
    {
      id: 'nutrition',
      label: 'Nutrición',
      icon: Apple,
      component: NutritionManager
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageCircle,
      component: ClientCommunication,
      hasNotification: unreadMessages > 0,
      notificationCount: unreadMessages
    }
  ];

  // Navegación extendida (accesible via menu o gestos)
  const extendedNavItems = [
    {
      id: 'progress',
      label: 'Progreso',
      icon: TrendingUp,
      component: ClientProgressOverview
    },
    {
      id: 'notifications',
      label: 'Notificaciones',
      icon: Bell,
      component: TrainerNotifications,
      hasNotification: unreadNotifications > 0,
      notificationCount: unreadNotifications
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      component: AnalyticsDashboard
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: User,
      component: ProfileView
    }
  ];

  // Combinar ambas navegaciones para el renderizado
  const allNavItems = [...navItems, ...extendedNavItems];

  const renderContent = () => {
    const activeItem = allNavItems.find(item => item.id === activeTab);
    if (!activeItem) return null;

    const Component = activeItem.component;
    return <Component />;
  };

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* Header con acceso rápido a funciones adicionales */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-white">
              {allNavItems.find(item => item.id === activeTab)?.label || 'GymSoft Pro'}
            </h2>
          </div>
          
          {/* Acceso rápido a funciones avanzadas */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`p-2 rounded-lg transition-colors relative ${
                activeTab === 'notifications' 
                  ? 'bg-fuchsia-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('progress')}
              className={`p-2 rounded-lg transition-colors ${
                activeTab === 'progress' 
                  ? 'bg-fuchsia-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <TrendingUp className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`p-2 rounded-lg transition-colors ${
                activeTab === 'analytics' 
                  ? 'bg-fuchsia-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`p-2 rounded-lg transition-colors ${
                activeTab === 'profile' 
                  ? 'bg-fuchsia-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pt-6 pb-4">
        {renderContent()}
      </div>

      {/* Bottom Navigation - Solo las funciones principales */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all ${
                  isActive 
                    ? 'text-fuchsia-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="relative">
                  <Icon className={`h-6 w-6 ${isActive ? 'text-fuchsia-400' : ''}`} />
                  {item.hasNotification && item.notificationCount && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {item.notificationCount > 9 ? '9+' : item.notificationCount}
                    </span>
                  )}
                </div>
                <span className={`text-xs font-medium ${
                  isActive ? 'text-fuchsia-400' : ''
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Indicador de funciones adicionales disponibles */}
        <div className="text-center mt-2">
          <div className="inline-flex items-center space-x-1 text-xs text-gray-500">
            <span>•</span>
            <span>Progreso, Analytics, Notificaciones disponibles en el header</span>
            <span>•</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerBottomNavigation;