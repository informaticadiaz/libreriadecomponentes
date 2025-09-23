"use client";
import React, { useState } from 'react';
import { 
  MessageCircle, 
  Search, 
  Phone, 
  Video, 
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Camera,
  Mic,
  Image,
  FileText,
  Clock,
  Check,
  CheckCheck,
  Star,
  Pin,
  Archive,
  Trash2,
  Plus,
  Filter,
  Users,
  Bell,
  Zap,
  Calendar
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'file' | 'workout' | 'nutrition';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachments?: Array<{
    type: 'image' | 'file' | 'workout' | 'nutrition';
    url: string;
    name: string;
  }>;
}

interface Conversation {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  lastMessage: Message;
  unreadCount: number;
  isOnline: boolean;
  isPinned: boolean;
  isArchived: boolean;
  lastActivity: string;
  goal: string;
  status: 'active' | 'trial' | 'paused';
}

interface QuickReply {
  id: string;
  text: string;
  category: 'motivation' | 'scheduling' | 'nutrition' | 'workout';
}

const ClientCommunication = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'pinned' | 'archived'>('all');

  // Mock data
  const quickReplies: QuickReply[] = [
    { id: '1', text: '¡Excelente trabajo! 💪', category: 'motivation' },
    { id: '2', text: 'Agenda tu próxima sesión', category: 'scheduling' },
    { id: '3', text: 'Recuerda hidratarte bien', category: 'nutrition' },
    { id: '4', text: 'Revisa la técnica del ejercicio', category: 'workout' }
  ];

  const conversations: Conversation[] = [
    {
      id: '1',
      clientId: '1',
      clientName: 'María González',
      clientAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b25213b9?w=50&h=50&fit=crop&crop=face',
      lastMessage: {
        id: '1',
        senderId: '1',
        content: '¡Terminé el entrenamiento de hoy! Me siento genial 🔥',
        type: 'text',
        timestamp: '2024-02-15T10:30:00Z',
        status: 'read'
      },
      unreadCount: 2,
      isOnline: true,
      isPinned: true,
      isArchived: false,
      lastActivity: 'Hace 15 min',
      goal: 'Pérdida de peso',
      status: 'active'
    },
    {
      id: '2',
      clientId: '2',
      clientName: 'Juan Pérez',
      clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      lastMessage: {
        id: '2',
        senderId: 'trainer',
        content: 'Hola Juan, veo que no has entrenado esta semana. ¿Todo bien?',
        type: 'text',
        timestamp: '2024-02-14T16:20:00Z',
        status: 'delivered'
      },
      unreadCount: 0,
      isOnline: false,
      isPinned: false,
      isArchived: false,
      lastActivity: 'Hace 1 día',
      goal: 'Ganancia muscular',
      status: 'active'
    },
    {
      id: '3',
      clientId: '3',
      clientName: 'Ana López',
      clientAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      lastMessage: {
        id: '3',
        senderId: '3',
        content: '¿Puedo cambiar mi cita de mañana?',
        type: 'text',
        timestamp: '2024-02-15T09:15:00Z',
        status: 'read'
      },
      unreadCount: 1,
      isOnline: true,
      isPinned: false,
      isArchived: false,
      lastActivity: 'Hace 2 horas',
      goal: 'Tonificación',
      status: 'trial'
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      senderId: '1',
      content: 'Hola! ¿Cómo estuvo el entrenamiento de ayer?',
      type: 'text',
      timestamp: '2024-02-15T08:00:00Z',
      status: 'read'
    },
    {
      id: '2',
      senderId: 'trainer',
      content: '¡Hola María! Quiero saber cómo te fue con las sentadillas',
      type: 'text',
      timestamp: '2024-02-15T08:30:00Z',
      status: 'read'
    },
    {
      id: '3',
      senderId: '1',
      content: '¡Estuvo genial! Logré hacer las 4 series completas 💪',
      type: 'text',
      timestamp: '2024-02-15T09:00:00Z',
      status: 'read'
    },
    {
      id: '4',
      senderId: 'trainer',
      content: '¡Excelente progreso! Aquí tienes el plan para mañana',
      type: 'workout',
      timestamp: '2024-02-15T09:30:00Z',
      status: 'read',
      attachments: [{
        type: 'workout',
        url: '#',
        name: 'Pull Day - Día 3'
      }]
    },
    {
      id: '5',
      senderId: '1',
      content: '¡Terminé el entrenamiento de hoy! Me siento genial 🔥',
      type: 'text',
      timestamp: '2024-02-15T10:30:00Z',
      status: 'read'
    }
  ];

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      selectedFilter === 'all' ||
      (selectedFilter === 'unread' && conv.unreadCount > 0) ||
      (selectedFilter === 'pinned' && conv.isPinned) ||
      (selectedFilter === 'archived' && conv.isArchived);
    return matchesSearch && matchesFilter && !conv.isArchived;
  });

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'trial': return 'bg-yellow-500';
      case 'paused': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const ConversationList = () => (
    <div className="w-full lg:w-1/3 bg-gray-900 border-r border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Mensajes</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <Users className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar conversaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-fuchsia-500"
          />
        </div>

        {/* Filters */}
        <div className="flex space-x-1">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'unread', label: 'No leídos' },
            { id: 'pinned', label: 'Fijados' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id as any)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                selectedFilter === filter.id
                  ? 'bg-fuchsia-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations */}
      <div className="overflow-y-auto h-full">
        {filteredConversations.map(conversation => (
          <div
            key={conversation.id}
            onClick={() => setSelectedConversation(conversation.id)}
            className={`p-4 border-b border-gray-800 cursor-pointer transition-colors hover:bg-gray-800 ${
              selectedConversation === conversation.id ? 'bg-gray-800' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={conversation.clientAvatar}
                  alt={conversation.clientName}
                  className="h-12 w-12 rounded-full"
                />
                {conversation.isOnline && (
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                )}
                <div className={`absolute -top-1 -left-1 h-3 w-3 ${getStatusColor(conversation.status)} rounded-full`}></div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-white truncate">{conversation.clientName}</h3>
                    {conversation.isPinned && <Pin className="h-3 w-3 text-fuchsia-400" />}
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-400">{conversation.lastActivity}</span>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-fuchsia-600 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 truncate">
                  {conversation.lastMessage.content}
                </p>
                
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{conversation.goal}</span>
                  <div className="flex items-center space-x-1">
                    {conversation.lastMessage.senderId === 'trainer' && (
                      <div className="text-gray-400">
                        {conversation.lastMessage.status === 'sent' && <Check className="h-3 w-3" />}
                        {conversation.lastMessage.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
                        {conversation.lastMessage.status === 'read' && <CheckCheck className="h-3 w-3 text-blue-400" />}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ChatArea = () => {
    if (!selectedConv) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-950">
          <div className="text-center">
            <MessageCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Selecciona una conversación</h3>
            <p className="text-gray-400">Elige un cliente para comenzar a chatear</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col bg-gray-950">
        {/* Chat Header */}
        <div className="p-4 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={selectedConv.clientAvatar}
                  alt={selectedConv.clientName}
                  className="h-10 w-10 rounded-full"
                />
                {selectedConv.isOnline && (
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white">{selectedConv.clientName}</h3>
                <p className="text-sm text-gray-400">
                  {selectedConv.isOnline ? 'En línea' : selectedConv.lastActivity}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Phone className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Video className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Calendar className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.senderId === 'trainer' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.senderId === 'trainer'
                  ? 'bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white'
                  : 'bg-gray-800 text-white'
              }`}>
                {message.type === 'workout' && message.attachments ? (
                  <div className="space-y-2">
                    <p>{message.content}</p>
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4" />
                        <span className="text-sm font-medium">{message.attachments[0].name}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>{message.content}</p>
                )}
                
                <div className={`flex items-center justify-end mt-1 space-x-1 ${
                  message.senderId === 'trainer' ? 'text-white/70' : 'text-gray-400'
                }`}>
                  <span className="text-xs">{formatTime(message.timestamp)}</span>
                  {message.senderId === 'trainer' && (
                    <div>
                      {message.status === 'sent' && <Check className="h-3 w-3" />}
                      {message.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
                      {message.status === 'read' && <CheckCheck className="h-3 w-3 text-blue-200" />}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Replies */}
        {showQuickReplies && (
          <div className="px-4 py-2 bg-gray-900 border-t border-gray-800">
            <div className="flex flex-wrap gap-2">
              {quickReplies.map(reply => (
                <button
                  key={reply.id}
                  onClick={() => {
                    setMessageInput(reply.text);
                    setShowQuickReplies(false);
                  }}
                  className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-700 transition-colors"
                >
                  {reply.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="p-4 bg-gray-900 border-t border-gray-800">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowQuickReplies(!showQuickReplies)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Smile className="h-5 w-5" />
            </button>

            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <Paperclip className="h-5 w-5" />
            </button>

            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <Camera className="h-5 w-5" />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="w-full bg-gray-800 text-white rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                onKeyPress={(e) => e.key === 'Enter' && messageInput.trim() && setMessageInput('')}
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors">
                <Mic className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => messageInput.trim() && setMessageInput('')}
              disabled={!messageInput.trim()}
              className={`p-3 rounded-full transition-all ${
                messageInput.trim()
                  ? 'bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white hover:shadow-lg hover:shadow-fuchsia-500/25'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-950 flex">
      <ConversationList />
      <ChatArea />
    </div>
  );
};

export default ClientCommunication;