import React, { useState } from 'react';
import { Bell, Check, X, Dumbbell, MessageCircle, Trophy, Calendar, Flame, Heart, Clock, ChevronRight, MoreHorizontal } from 'lucide-react';

interface Notification {
  id: string;
  type: 'workout' | 'message' | 'achievement' | 'reminder' | 'progress' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    trainerName?: string;
    workoutName?: string;
    achievementType?: string;
    value?: number;
  };
}

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onAction: (notification: Notification) => void;
  onClearAll: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onMarkAsRead,
  onDismiss,
  onAction,
  onClearAll
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [showActions, setShowActions] = useState<string | null>(null);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return <Dumbbell className="h-5 w-5 text-fuchsia-400" />;
      case 'message':
        return <MessageCircle className="h-5 w-5 text-blue-400" />;
      case 'achievement':
        return <Trophy className="h-5 w-5 text-yellow-400" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-orange-400" />;
      case 'progress':
        return <Flame className="h-5 w-5 text-green-400" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const getNotificationBackground = (type: string, isRead: boolean) => {
    const baseClasses = "rounded-xl p-4 border transition-all duration-200";
    
    if (!isRead) {
      switch (type) {
        case 'workout':
          return `${baseClasses} bg-fuchsia-500/10 border-fuchsia-500/20`;
        case 'message':
          return `${baseClasses} bg-blue-500/10 border-blue-500/20`;
        case 'achievement':
          return `${baseClasses} bg-yellow-500/10 border-yellow-500/20`;
        case 'reminder':
          return `${baseClasses} bg-orange-500/10 border-orange-500/20`;
        case 'progress':
          return `${baseClasses} bg-green-500/10 border-green-500/20`;
        default:
          return `${baseClasses} bg-gray-800 border-gray-700`;
      }
    }
    
    return `${baseClasses} bg-gray-900 border-gray-800`;
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes <= 1 ? 'Ahora' : `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') {
      return !notification.isRead;
    }
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const [showSwipeActions, setShowSwipeActions] = useState(false);

    return (
      <div className="relative overflow-hidden">
        {/* Swipe Actions Background */}
        {showSwipeActions && (
          <div className="absolute inset-0 flex items-center justify-end space-x-2 pr-4 bg-gray-800">
            <button
              onClick={() => {
                onMarkAsRead(notification.id);
                setShowSwipeActions(false);
              }}
              className="bg-green-600 hover:bg-green-700 p-2 rounded-full transition-colors"
            >
              <Check className="h-4 w-4 text-white" />
            </button>
            <button
              onClick={() => {
                onDismiss(notification.id);
                setShowSwipeActions(false);
              }}
              className="bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        )}

        {/* Main Notification */}
        <div 
          className={getNotificationBackground(notification.type, notification.isRead)}
          onClick={() => {
            if (!notification.isRead) {
              onMarkAsRead(notification.id);
            }
            if (notification.actionUrl) {
              onAction(notification);
            }
          }}
        >
          <div className="flex items-start space-x-3">
            
            {/* Icon */}
            <div className={`p-2 rounded-lg ${
              notification.type === 'workout' ? 'bg-fuchsia-500/20' :
              notification.type === 'message' ? 'bg-blue-500/20' :
              notification.type === 'achievement' ? 'bg-yellow-500/20' :
              notification.type === 'reminder' ? 'bg-orange-500/20' :
              notification.type === 'progress' ? 'bg-green-500/20' :
              'bg-gray-700'
            }`}>
              {getNotificationIcon(notification.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={`font-semibold text-sm ${notification.isRead ? 'text-gray-300' : 'text-white'}`}>
                    {notification.title}
                  </h3>
                  <p className={`text-sm mt-1 ${notification.isRead ? 'text-gray-500' : 'text-gray-400'}`}>
                    {notification.message}
                  </p>
                  
                  {/* Metadata */}
                  {notification.metadata && (
                    <div className="flex items-center space-x-2 mt-2">
                      {notification.metadata.trainerName && (
                        <span className="text-xs text-blue-400">
                          {notification.metadata.trainerName}
                        </span>
                      )}
                      {notification.metadata.workoutName && (
                        <span className="text-xs text-fuchsia-400">
                          {notification.metadata.workoutName}
                        </span>
                      )}
                      {notification.metadata.achievementType && (
                        <span className="text-xs text-yellow-400">
                          {notification.metadata.achievementType}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Timestamp & Actions */}
                <div className="flex items-center space-x-2 ml-2">
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(notification.timestamp)}
                  </span>
                  
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-fuchsia-500 rounded-full" />
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActions(showActions === notification.id ? null : notification.id);
                    }}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Action Button */}
              {notification.actionLabel && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction(notification);
                  }}
                  className="mt-3 bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:shadow-lg hover:shadow-fuchsia-500/25 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1"
                >
                  <span>{notification.actionLabel}</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Actions Menu */}
          {showActions === notification.id && (
            <div className="mt-3 pt-3 border-t border-gray-700 flex items-center space-x-3">
              {!notification.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                    setShowActions(null);
                  }}
                  className="flex items-center space-x-1 text-sm text-green-400 hover:text-green-300 transition-colors"
                >
                  <Check className="h-4 w-4" />
                  <span>Marcar leída</span>
                </button>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss(notification.id);
                  setShowActions(null);
                }}
                className="flex items-center space-x-1 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Descartar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      
      {/* Header */}
      <div className="p-4 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Notificaciones</h1>
            <p className="text-sm text-gray-400">
              {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
            </p>
          </div>
          
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-sm text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
            >
              Limpiar todo
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-3 bg-gray-900/30">
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
              filter === 'all'
                ? 'bg-fuchsia-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
              filter === 'unread'
                ? 'bg-fuchsia-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sin leer ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-4 pb-20">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {filter === 'unread' ? 'Todo leído' : 'Sin notificaciones'}
            </h3>
            <p className="text-gray-400 text-sm">
              {filter === 'unread' 
                ? 'Has leído todas tus notificaciones'
                : 'Te notificaremos cuando haya algo nuevo'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3 py-4">
            {filteredNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Demo Component
const NotificationsPanelDemo = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'workout',
      title: 'Entrenamiento de hoy',
      message: 'Es hora de tu sesión Push Day Intenso',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      isRead: false,
      actionLabel: 'Comenzar',
      actionUrl: '/workout/start',
      metadata: {
        workoutName: 'Push Day Intenso'
      }
    },
    {
      id: '2',
      type: 'message',
      title: 'Mensaje de tu trainer',
      message: '¡Excelente trabajo en el entrenamiento de ayer! Sigue así',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false,
      actionLabel: 'Responder',
      actionUrl: '/chat',
      metadata: {
        trainerName: 'Carlos Fitness'
      }
    },
    {
      id: '3',
      type: 'achievement',
      title: '¡Nuevo logro desbloqueado!',
      message: 'Has completado 7 días seguidos de entrenamiento',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      isRead: false,
      actionLabel: 'Ver logros',
      actionUrl: '/achievements',
      metadata: {
        achievementType: 'Racha de 7 días'
      }
    },
    {
      id: '4',
      type: 'progress',
      title: 'Progreso semanal',
      message: 'Has perdido 0.5kg esta semana. ¡Sigue así!',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      isRead: true,
      actionLabel: 'Ver progreso',
      actionUrl: '/progress'
    },
    {
      id: '5',
      type: 'reminder',
      title: 'Recordatorio de check-in',
      message: 'No olvides completar tu check-in semanal',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isRead: true,
      actionLabel: 'Hacer check-in',
      actionUrl: '/checkin'
    }
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleAction = (notification: Notification) => {
    console.log('Action triggered:', notification.actionUrl);
    // Here you would navigate to the action URL
    handleMarkAsRead(notification.id);
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <NotificationsPanel
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onDismiss={handleDismiss}
        onAction={handleAction}
        onClearAll={handleClearAll}
      />
    </div>
  );
};

export default NotificationsPanelDemo;