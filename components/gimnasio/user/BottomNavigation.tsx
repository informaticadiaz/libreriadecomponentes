import React, { useState } from 'react';
import { Home, TrendingUp, MessageCircle, User, Dumbbell, Calendar, Bell } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  badge?: number;
  isActive?: boolean;
}

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  unreadMessages?: number;
  hasNotifications?: boolean;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  unreadMessages = 0,
}) => {
  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Inicio',
      icon: Home,
      isActive: activeTab === 'home'
    },
    {
      id: 'progress',
      label: 'Progreso',
      icon: TrendingUp,
      isActive: activeTab === 'progress'
    },
    {
      id: 'workouts',
      label: 'Rutinas',
      icon: Dumbbell,
      isActive: activeTab === 'workouts'
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageCircle,
      badge: unreadMessages,
      isActive: activeTab === 'chat'
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: User,
      isActive: activeTab === 'profile'
    }
  ];

  const NavigationButton: React.FC<{ item: NavigationItem }> = ({ item }) => {
    const Icon = item.icon;
    const isActive = item.isActive;

    return (
      <button
        onClick={() => onTabChange(item.id)}
        className={`relative flex flex-col items-center justify-center py-2 px-1 transition-all duration-200 ${
          isActive ? 'transform -translate-y-1' : ''
        }`}
      >
        {/* Background Gradient for Active */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-500/20 to-violet-500/20 rounded-2xl -m-1" />
        )}
        
        {/* Icon Container */}
        <div className={`relative p-2 rounded-2xl transition-all duration-200 ${
          isActive 
            ? 'bg-gradient-to-r from-fuchsia-600 to-violet-600 shadow-lg shadow-fuchsia-500/25' 
            : 'bg-transparent'
        }`}>
          <Icon 
            className={`h-5 w-5 transition-colors duration-200 ${
              isActive ? 'text-white' : 'text-gray-400'
            }`} 
          />
          
          {/* Badge */}
          {item.badge && item.badge > 0 && (
            <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-white">
                {item.badge > 9 ? '9+' : item.badge}
              </span>
            </div>
          )}
        </div>
        
        {/* Label */}
        <span className={`text-xs font-medium mt-1 transition-colors duration-200 ${
          isActive ? 'text-white' : 'text-gray-500'
        }`}>
          {item.label}
        </span>
        
        {/* Active Indicator Dot */}
        {isActive && (
          <div className="absolute -bottom-1 h-1 w-1 bg-gradient-to-r from-fuchsia-500 to-violet-500 rounded-full" />
        )}
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Background with blur effect */}
      <div className="bg-gray-950/90 backdrop-blur-xl border-t border-gray-800/50">
        {/* Safe area for iPhone notch */}
        <div className="px-4 pt-2 pb-safe">
          <div className="flex items-center justify-around">
            {navigationItems.map((item) => (
              <NavigationButton key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component with Navigation
const ClientAppDemo = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [unreadMessages, setUnreadMessages] = useState(2);

  // Mock content for each tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">¡Hola, María!</h1>
              <p className="text-gray-400">Es hora de entrenar 💪</p>
            </div>
            
            {/* Mock Today's Workout Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-500 via-violet-600 to-purple-700 p-1">
              <div className="rounded-2xl bg-black p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-fuchsia-300">Hoy • Lunes</p>
                    <h2 className="text-xl font-bold text-white">Push Day Intenso</h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500">
                    <Dumbbell className="h-5 w-5 text-white" />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Duración</p>
                    <p className="text-sm font-semibold text-white">45 min</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Ejercicios</p>
                    <p className="text-sm font-semibold text-white">8</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Nivel</p>
                    <p className="text-sm font-semibold text-yellow-400">Intermedio</p>
                  </div>
                </div>
                
                <button className="w-full rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 p-4 font-semibold text-white">
                  Comenzar Entrenamiento
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gray-900 p-4">
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-green-500/20 p-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Racha</p>
                    <p className="text-lg font-bold text-white">7 días</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl bg-gray-900 p-4">
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-fuchsia-500/20 p-2">
                    <TrendingUp className="h-5 w-5 text-fuchsia-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Peso</p>
                    <p className="text-lg font-bold text-white">-2.1kg</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Mi Progreso</h1>
              <p className="text-gray-400">Seguimiento detallado de tu evolución</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="rounded-lg bg-fuchsia-500/20 p-2">
                    <TrendingUp className="h-5 w-5 text-fuchsia-400" />
                  </div>
                  <span className="text-2xl font-bold text-white">78%</span>
                </div>
                <p className="text-sm text-gray-400">Progreso al objetivo</p>
              </div>
              
              <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="rounded-lg bg-green-500/20 p-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  </div>
                  <span className="text-2xl font-bold text-green-400">-0.5kg</span>
                </div>
                <p className="text-sm text-gray-400">Esta semana</p>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Progreso de Peso</h3>
              <div className="h-32 bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Gráfico de progreso</p>
              </div>
            </div>
          </div>
        );

      case 'workouts':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Mis Rutinas</h1>
              <p className="text-gray-400">Entrenamientos personalizados</p>
            </div>
            
            <div className="space-y-4">
              {['Push Day', 'Pull Day', 'Leg Day'].map((workout, index) => (
                <div key={index} className="bg-gray-900 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-violet-500/20 p-2 rounded-lg">
                        <Dumbbell className="h-5 w-5 text-violet-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{workout}</h3>
                        <p className="text-sm text-gray-400">8 ejercicios • 45 min</p>
                      </div>
                    </div>
                    <button className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Ver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'chat':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Mensajes</h1>
              <p className="text-gray-400">Comunicación con tu trainer</p>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
                    alt="Trainer"
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-gray-900" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Carlos Fitness</h3>
                  <p className="text-sm text-gray-400">¿Cómo te fue con el entrenamiento?</p>
                </div>
                {unreadMessages > 0 && (
                  <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadMessages}
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={() => setUnreadMessages(0)}
              className="w-full bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white p-4 rounded-xl font-semibold"
            >
              Abrir Chat
            </button>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Mi Perfil</h1>
              <p className="text-gray-400">Configuración y estadísticas</p>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b25213b9?w=80&h=80&fit=crop&crop=face"
                  alt="Profile"
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold text-white">María González</h3>
                  <p className="text-gray-400">Objetivo: Pérdida de peso</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: 'Configuración', icon: User },
                  { label: 'Notificaciones', icon: Bell },
                  { label: 'Mi Plan', icon: Calendar }
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
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* Main Content */}
      <div className="px-4 pt-8 pb-4">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadMessages={unreadMessages}
        hasNotifications={true}
      />
    </div>
  );
};

export default ClientAppDemo;