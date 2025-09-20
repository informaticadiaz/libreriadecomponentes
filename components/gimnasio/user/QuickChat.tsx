"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Camera, Mic, Plus, X, Check, CheckCheck, Clock, Image, Smile } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'client' | 'trainer' | 'system';
  timestamp: Date;
  type: 'text' | 'image' | 'system';
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  imageUrl?: string;
}

interface QuickChatProps {
  trainerName: string;
  trainerAvatar: string;
  isTrainerOnline: boolean;
  onSendMessage: (content: string, type: 'text' | 'image') => void;
  onClose?: () => void;
}

const QuickChat: React.FC<QuickChatProps> = ({
  isTrainerOnline,
  onSendMessage,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Hola! ¿Cómo te fue con el entrenamiento de hoy?',
      sender: 'trainer',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text',
      status: 'read'
    },
    {
      id: '2',
      content: '¡Muy bien! Completé todos los ejercicios. Me costó un poco el último set de sentadillas pero lo logré 💪',
      sender: 'client',
      timestamp: new Date(Date.now() - 3000000),
      type: 'text',
      status: 'read'
    },
    {
      id: '3',
      content: '¡Excelente! Eso significa que estás progresando. ¿Cómo te sientes?',
      sender: 'trainer',
      timestamp: new Date(Date.now() - 2400000),
      type: 'text',
      status: 'read'
    },
    {
      id: '4',
      content: 'Me siento genial, con más energía que antes 🔥',
      sender: 'client',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text',
      status: 'read'
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickReplies = [
    '¡Perfecto! 💪',
    'Me costó un poco',
    'Todo bien',
    'Tengo una duda',
    'Necesito ayuda',
    '¡Gracias!'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string, type: 'text' | 'image' = 'text') => {
    if (!content.trim() && type === 'text') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'client',
      timestamp: new Date(),
      type,
      status: 'sending'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setShowQuickReplies(false);
    
    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 500);

    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 1000);

    onSendMessage(content, type);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-500" />;
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-fuchsia-400" />;
      default:
        return null;
    }
  };

  const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isClient = message.sender === 'client';
    const isSystem = message.sender === 'system';

    if (isSystem) {
      return (
        <div className="flex justify-center my-4">
          <div className="bg-gray-800 rounded-full px-4 py-2">
            <p className="text-xs text-gray-400">{message.content}</p>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex ${isClient ? 'justify-end' : 'justify-start'} mb-3`}>
        <div className={`max-w-[80%] ${isClient ? 'order-1' : ''}`}>
          <div 
            className={`rounded-2xl px-3 py-2 ${
              isClient 
                ? 'bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white rounded-br-md' 
                : 'bg-gray-800 text-white rounded-bl-md'
            }`}
          >
            {message.type === 'image' ? (
              <div className="space-y-2">
                <img 
                  src={message.imageUrl} 
                  alt="Shared image"
                  className="rounded-lg max-w-full h-auto"
                />
                {message.content && (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>
            ) : (
              <p className="text-sm leading-relaxed">{message.content}</p>
            )}
          </div>
          
          <div className={`flex items-center space-x-1 mt-1 px-1 ${isClient ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
            {isClient && getStatusIcon(message.status)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 text-white">
      
      {/* Minimal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800/50">
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${isTrainerOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
          <span className="text-xs text-gray-400">
            {isTrainerOnline ? 'En línea' : 'Desconectado'}
          </span>
        </div>
        
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {showQuickReplies && (
        <div className="px-3 pb-2">
          <div className="flex flex-wrap gap-1.5">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(reply)}
                className="bg-gray-800 hover:bg-gray-700 text-xs px-2.5 py-1.5 rounded-full transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attachment Menu */}
      {showAttachMenu && (
        <div className="px-3 pb-2">
          <div className="flex items-center justify-center space-x-6 bg-gray-900 rounded-2xl py-3">
            <button className="flex flex-col items-center space-y-1 p-2 hover:bg-gray-800 rounded-xl transition-colors">
              <div className="bg-blue-500 p-2 rounded-full">
                <Camera className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs text-gray-400">Foto</span>
            </button>
            
            <button className="flex flex-col items-center space-y-1 p-2 hover:bg-gray-800 rounded-xl transition-colors">
              <div className="bg-green-500 p-2 rounded-full">
                <Image className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs text-gray-400">Galería</span>
            </button>
            
            <button className="flex flex-col items-center space-y-1 p-2 hover:bg-gray-800 rounded-xl transition-colors">
              <div className="bg-red-500 p-2 rounded-full">
                <Mic className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs text-gray-400">Audio</span>
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 bg-gray-900/50 backdrop-blur-sm border-t border-gray-800/50">
        <div className="flex items-center space-x-2">
          
          {/* Attachment Button */}
          <button
            onClick={() => {
              setShowAttachMenu(!showAttachMenu);
              setShowQuickReplies(false);
            }}
            className={`p-2 rounded-full transition-colors ${
              showAttachMenu 
                ? 'bg-fuchsia-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Plus className={`h-4 w-4 transition-transform ${showAttachMenu ? 'rotate-45' : ''}`} />
          </button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Mensaje..."
              className="w-full bg-gray-800 text-white rounded-full px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all"
            />
            
            {/* Quick Replies Toggle */}
            <button
              onClick={() => {
                setShowQuickReplies(!showQuickReplies);
                setShowAttachMenu(false);
              }}
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
            >
              <Smile className="h-4 w-4" />
            </button>
          </div>

          {/* Send Button */}
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim()}
            className={`p-2.5 rounded-full transition-all ${
              inputValue.trim()
                ? 'bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white hover:shadow-lg hover:shadow-fuchsia-500/25'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Demo Component
const QuickChatDemo = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleSendMessage = (content: string, type: 'text' | 'image') => {
    console.log('Sending message:', { content, type });
    // Here you would integrate with your backend/Supabase
  };

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Chat con tu trainer</h2>
          <p className="text-gray-400 mb-6">Comunicación directa y rápida</p>
          <button 
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all"
          >
            Abrir Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm h-full max-h-[600px] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <QuickChat
          trainerName="Carlos Fitness"
          trainerAvatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
          isTrainerOnline={true}
          onSendMessage={handleSendMessage}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </div>
  );
};

export default QuickChatDemo;