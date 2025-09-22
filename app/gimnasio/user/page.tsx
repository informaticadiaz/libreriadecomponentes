"use client";
import React, { useState } from 'react';
import { 
  Home, 
  Dumbbell, 
  Apple, 
  TrendingUp, 
  MessageCircle, 
  Bell, 
  User 
} from 'lucide-react';

import NotificationsPanelDemo from '@/components/gimnasio/user/NotificationsPanel';
import  WorkoutCardDemo from '@/components/gimnasio/user/WorkoutCard';
import  WorkoutPlayer  from '@/components/gimnasio/user/WorkoutPlayer';
import  NutritionTracker  from '@/components/gimnasio/user/NutritionTracker';
import  ProgressChart from '@/components/gimnasio/user/ProgressChart';
import  QuickChat  from '@/components/gimnasio/user/QuickChat';

const ProfilePage = () => (
  <div className="min-h-screen bg-gray-950 text-white p-6">
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-fuchsia-600 to-violet-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
        <p className="text-gray-400">Juan Pérez</p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-900 rounded-xl p-4">
          <h3 className="font-semibold text-white mb-3">Estadísticas</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-fuchsia-400">7</p>
              <p className="text-xs text-gray-400">Días de racha</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">12</p>
              <p className="text-xs text-gray-400">Entrenamientos</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-xl p-4">
          <h3 className="font-semibold text-white mb-3">Mi Trainer</h3>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-fuchsia-600 to-violet-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">CF</span>
            </div>
            <div>
              <p className="font-semibold text-white">Carlos Fitness</p>
              <p className="text-sm text-gray-400">Entrenador Personal</p>
            </div>
          </div>
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

const GymProApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const navigationItems: BottomNavItem[] = [
    {
      id: 'home',
      label: 'Inicio',
      icon: Home,
      component: WorkoutCardDemo
    },
    {
      id: 'workouts',
      label: 'Entrenar',
      icon: Dumbbell,
      component: WorkoutPlayer
    },
    {
      id: 'nutrition',
      label: 'Nutrición',
      icon: Apple,
      component: NutritionTracker
    },
    {
      id: 'progress',
      label: 'Progreso',
      icon: TrendingUp,
      component: ProgressChart
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageCircle,
      component: QuickChat,
      hasNotification: true,
      notificationCount: 2
    },
    {
      id: 'notifications',
      label: 'Alertas',
      icon: Bell,
      component: NotificationsPanelDemo,
      hasNotification: true,
      notificationCount: 3
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: User,
      component: ProfilePage
    }
  ];

  const activeComponent = navigationItems.find(item => item.id === activeTab)?.component;
  const ActiveComponent = activeComponent || WorkoutCardDemo;

  return (
    <div className="relative">
      {/* Main Content */}
      <div className="pb-20">
        <ActiveComponent />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800/50 z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                  isActive
                    ? 'bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white shadow-lg scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <div className="relative">
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} />
                  
                  {/* Notification Badge */}
                  {item.hasNotification && item.notificationCount && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {item.notificationCount > 9 ? '9+' : item.notificationCount}
                    </div>
                  )}
                </div>
                
                <span className={`text-xs font-medium mt-1 ${
                  isActive ? 'text-white' : ''
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GymProApp;