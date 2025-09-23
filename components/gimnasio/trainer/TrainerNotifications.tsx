"use client";
import React, { useState } from 'react';
import { 
  Bell, 
  MessageCircle, 
  Calendar, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  User,
  Dumbbell,
  Target,
  TrendingUp,
  Clock,
  Settings,
  Filter,
  MoreHorizontal,
  X,
  Check,
  Star,
  Archive,
  Trash2,
  Eye,
  Phone,
  Mail
} from 'lucide-react';

interface TrainerNotification {
  id: string;
  type: 'message' | 'payment' | 'schedule' | 'client_progress' | 'client_inactive' | 'goal_achieved' | 'system' | 'renewal';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  clientId?: string;
  clientName?: string;
  clientAvatar?: string;
  actionLabel?: string;
  actionUrl?: string;
  metadata?: {
    amount?: number;
    sessionTime?: string;
    goalType?: string;
    daysInactive?: number;
  };
}

interface NotificationStats {
  total: number;
  unread: number;
  highPriority: number;
  todayCount: number;
}

const TrainerNotifications = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'messages' | 'payments' | 'clients'>('all');
  const [showActions, setShowActions] = useState<string | null>(null);

  // Mock data
  const stats: NotificationStats = {
    total: 23,
    unread: 8,
    highPriority: 3,
    todayCount: 12
  };

  const notifications: TrainerNotification[] = [
    {
      id: '1',
      type: 'payment',
      title: 'Pago Pendiente',
      message: 'María González tiene un pago vencido de $120',
      timestamp: '2024-02-15T10:30:00Z',
      isRead: false,
      priority: 'high',
      clientId: '1',
      clientName: 'María González',
      clientAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b25213b9?w=50&h=50&fit=crop&crop=face',
      actionLabel: 'Ver Factura',
      metadata: { amount: 120 }
    },
    {
      id: '2',
      type: 'goal_achieved',
      title: '¡Meta Alcanzada!',
      message: 'Juan Pérez alcanzó su objetivo de peso',
      timestamp: '2024-02-15T09:15:00Z',
      isRead: false,
      priority: 'medium',
      clientId: '2',
      clientName: 'Juan Pérez',
      clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      actionLabel: 'Felicitar',
      metadata: { goalType: 'weight_gain' }
    },
    {
      id: '3',
      type: 'client_inactive',
      title: 'Cliente Inactivo',
      message: 'Ana López no ha entrenado en 5 días',
      timestamp: '2024-02-15T08:00:00Z',
      isRead: false,
      priority: 'urgent',
      clientId: '3',
      clientName: 'Ana López',
      clientAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      actionLabel: 'Contactar',
      metadata: { daysInactive: 5 }
    },
    {
      id: '4',
      type: 'message',
      title: 'Nuevo Mensaje',
      message: 'Carlos pregunta sobre su plan nutricional',
      timestamp: '2024-02-15T07:45:00Z',
      isRead: true,
      priority: 'medium',
      clientId: '4',
      clientName: 'Carlos Mendoza',
      clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      actionLabel: 'Responder'
    },
    {
      id: '5',
      type: 'schedule',
      title: 'Próxima Sesión',
      message: 'Sesión con Laura en 30 minutos',
      timestamp: '2024-02-15T07:30:00Z',
      isRead: true,
      priority: 'high',
      clientId: '5',
      clientName: 'Laura Torres',
      clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face',
      actionLabel: 'Ver Detalles',
      metadata: { sessionTime: '2024-02-15T11:00:00Z' }
    },
    {
      id: '6',
      type: 'renewal',
      title: 'Renovación Próxima',
      message: 'El plan de Pedro vence en 3 días',
      timestamp: '2024-02-14T16:20:00Z',
      isRead: true,
      priority: 'medium',
      clientId: '6',
      clientName: 'Pedro Silva',
      clientAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face',
      actionLabel: 'Renovar Plan'
    },
    {
      id: '7',
      type: 'client_progress',
      title: 'Progreso Destacado',
      message: 'Sofia ha perdido 2kg esta semana',
      timestamp: '2024-02-14T14:10:00Z',
      isRead: true,
      priority: 'low',
      clientId: '7',
      clientName: 'Sofia Herrera',
      clientAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop&crop=face',
      actionLabel: 'Ver Progreso'
    },
    {
      id: '8',
      type: 'system',
      title: 'Actualización Disponible',
      message: 'Nueva versión de la app con mejoras',
      timestamp: '2024-02-14T12:00:00Z',
      isRead: false,
      priority: 'low',
      actionLabel: 'Ver Cambios'
    }
  ];

  const filteredNotifications = notifications.filter(notification => {
    switch (selectedFilter) {
      case 'unread':
        return !notification.isRead;
      case 'messages':
        return notification.type === 'message';
      case 'payments':
        return notification.type === 'payment' || notification.type === 'renewal';
      case 'clients':
        return ['client_progress', 'client_inactive', 'goal_achieved'].includes(notification.type);
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageCircle className="h-5 w-5 text-blue-400" />;
      case 'payment': return <DollarSign className="h-5 w-5 text-green-400" />;
      case 'schedule': return <Calendar className="h-5 w-5 text-purple-400" />;
      case 'client_progress': return <TrendingUp className="h-5 w-5 text-green-400" />;
      case 'client_inactive': return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'goal_achieved': return <Target className="h-5 w-5 text-yellow-400" />;
      case 'renewal': return <Clock className="h-5 w-5 text-orange-400" />;
      case 'system': return <Settings className="h-5 w-5 text-gray-400" />;
      default: return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-500/5';
      case 'high': return 'border-l-orange-500 bg-orange-500/5';
      case 'medium': return 'border-l-yellow-500 bg-yellow-500/5';
      case 'low': return 'border-l-gray-500 bg-gray-500/5';
      default: return 'border-l-gray-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `Hace ${days} día${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      const minutes = Math.floor(diff / (1000 * 60));
      return `Hace ${minutes} min`;
    }
  };

  const markAsRead = (notificationId: string) => {
    // Aquí implementarías la lógica para marcar como leída
    console.log('Marking as read:', notificationId);
  };

  const dismissNotification = (notificationId: string) => {
    // Aquí implementarías la lógica para descartar
    console.log('Dismissing:', notificationId);
  };

  const handleAction = (notification: TrainerNotification) => {
    // Aquí implementarías la lógica para las acciones específicas
    console.log('Action for:', notification.actionLabel, notification);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      
      {/* Header */}
      <div className="p-6 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Centro de Notificaciones</h1>
            <p className="text-gray-400 mt-1">
              {unreadCount > 0 
                ? `Tienes ${unreadCount} notificación${unreadCount > 1 ? 'es' : ''} sin leer`
                : 'Todas las notificaciones están al día'
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            {unreadCount > 0 && (
              <button className="bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all">
                Marcar todas como leídas
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Bell className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Sin Leer</p>
              <p className="text-2xl font-bold text-red-400">{stats.unread}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Alta Prioridad</p>
              <p className="text-2xl font-bold text-orange-400">{stats.highPriority}</p>
            </div>
            <Star className="h-8 w-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Hoy</p>
              <p className="text-2xl font-bold text-blue-400">{stats.todayCount}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 mb-6">
        <div className="flex space-x-2">
          {[
            { id: 'all', label: 'Todas', count: notifications.length },
            { id: 'unread', label: 'Sin leer', count: notifications.filter(n => !n.isRead).length },
            { id: 'messages', label: 'Mensajes', count: notifications.filter(n => n.type === 'message').length },
            { id: 'payments', label: 'Pagos', count: notifications.filter(n => ['payment', 'renewal'].includes(n.type)).length },
            { id: 'clients', label: 'Clientes', count: notifications.filter(n => ['client_progress', 'client_inactive', 'goal_achieved'].includes(n.type)).length }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id as any)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center space-x-2 ${
                selectedFilter === filter.id
                  ? 'bg-fuchsia-600 text-white'
                  : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              <span>{filter.label}</span>
              {filter.count > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedFilter === filter.id ? 'bg-white/20' : 'bg-gray-700'
                }`}>
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-6 space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No hay notificaciones</h3>
            <p className="text-gray-400">
              {selectedFilter === 'all' 
                ? 'No tienes notificaciones en este momento'
                : 'No hay notificaciones en esta categoría'
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-xl border-l-4 bg-gray-900 border border-gray-800 transition-all hover:border-gray-700 ${
                getPriorityColor(notification.priority)
              } ${!notification.isRead ? 'ring-2 ring-fuchsia-500/20' : ''}`}
            >
              <div className="p-4">
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Client Avatar (if applicable) */}
                  {notification.clientAvatar && (
                    <img 
                      src={notification.clientAvatar}
                      alt={notification.clientName}
                      className="h-10 w-10 rounded-full"
                    />
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        <button
                          onClick={() => setShowActions(
                            showActions === notification.id ? null : notification.id
                          )}
                          className="p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    <p className={`mt-1 ${!notification.isRead ? 'text-gray-300' : 'text-gray-400'}`}>
                      {notification.message}
                    </p>

                    {/* Metadata */}
                    {notification.metadata && (
                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                        {notification.metadata.amount && (
                          <span>Monto: ${notification.metadata.amount}</span>
                        )}
                        {notification.metadata.daysInactive && (
                          <span>Días inactivo: {notification.metadata.daysInactive}</span>
                        )}
                        {notification.metadata.goalType && (
                          <span>Tipo: {notification.metadata.goalType}</span>
                        )}
                      </div>
                    )}

                    {/* Action Button */}
                    {notification.actionLabel && (
                      <button
                        onClick={() => handleAction(notification)}
                        className="mt-3 bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:shadow-lg hover:shadow-fuchsia-500/25 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      >
                        {notification.actionLabel}
                      </button>
                    )}
                  </div>

                  {/* Unread indicator */}
                  {!notification.isRead && (
                    <div className="h-2 w-2 bg-fuchsia-500 rounded-full mt-2"></div>
                  )}
                </div>

                {/* Quick Actions Menu */}
                {showActions === notification.id && (
                  <div className="mt-3 pt-3 border-t border-gray-700 flex items-center space-x-3">
                    {!notification.isRead && (
                      <button
                        onClick={() => {
                          markAsRead(notification.id);
                          setShowActions(null);
                        }}
                        className="flex items-center space-x-1 text-sm text-green-400 hover:text-green-300 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                        <span>Marcar leída</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        dismissNotification(notification.id);
                        setShowActions(null);
                      }}
                      className="flex items-center space-x-1 text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span>Descartar</span>
                    </button>

                    {notification.clientId && (
                      <>
                        <button className="flex items-center space-x-1 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          <span>Mensaje</span>
                        </button>
                        
                        <button className="flex items-center space-x-1 text-sm text-purple-400 hover:text-purple-300 transition-colors">
                          <Eye className="h-4 w-4" />
                          <span>Ver Perfil</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrainerNotifications;