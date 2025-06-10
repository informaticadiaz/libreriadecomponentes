"use client";
import React, { useState } from 'react';
import { Search, MapPin, Home, Building, DollarSign } from 'lucide-react';

// Definir tipos para las props del componente FloatingIcon
interface FloatingIconProps {
  icon: 'home' | 'building' | 'EB';
  top: number;
  left: number;
  delay: number;
  duration: number;
}

// Definir tipo para los elementos del array floatingIcons
interface FloatingIconData {
  id: number;
  icon: 'home' | 'building' | 'EB';
  top: number;
  left: number;
  delay: number;
  duration: number;
}

// Definir tipo para el estado de transactionType
type TransactionType = 'comprar' | 'rentar';

const MonopolioHomepage: React.FC = () => {
  const [transactionType, setTransactionType] = useState<TransactionType>('comprar');
  const [location, setLocation] = useState<string>('');
  const [price, setPrice] = useState<string>('');

  // Generate floating icons for background animation
  const floatingIcons: FloatingIconData[] = Array.from({ length: 20 }, (_, i): FloatingIconData => ({
    id: i,
    icon: i % 3 === 0 ? 'home' : i % 3 === 1 ? 'building' : 'EB',
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 3 + Math.random() * 2
  }));

  const FloatingIcon: React.FC<FloatingIconProps> = ({ icon, top, left, delay, duration }) => (
    <div 
      className="absolute opacity-20 text-white/30"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        animation: `float ${duration}s ease-in-out ${delay}s infinite alternate`
      }}
    >
      {icon === 'home' ? (
        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
          <Home className="w-6 h-6" />
        </div>
      ) : icon === 'building' ? (
        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
          <Building className="w-6 h-6" />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-sm font-bold">
          EB
        </div>
      )}
    </div>
  );

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLocation(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPrice(e.target.value);
  };

  const handleTransactionTypeChange = (type: TransactionType): void => {
    setTransactionType(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      {/* Floating Background Icons */}
      <div className="absolute inset-0">
        {floatingIcons.map((item) => (
          <FloatingIcon key={item.id} {...item} />
        ))}
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-indigo-900/50"></div>
      
      {/* Dotted Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      ></div>

      {/* Header */}
      <header className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">M</span>
              </div>
              <span className="text-white text-xl font-semibold">Monopolio</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-white/90 hover:text-white transition-colors">
                Buscar propiedades
              </a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">
                Estimación de valor
              </a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">
                Recursos
              </a>
            </nav>
          </div>

          {/* Login Button */}
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium transition-colors">
            Iniciar sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-40 flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="text-white text-5xl md:text-6xl font-light mb-4 leading-tight">
            La mejor manera de buscar
          </h1>
          <h2 className="text-white text-5xl md:text-6xl font-light mb-12 leading-tight">
            propiedades para <span className="text-blue-400 font-medium">comprar</span>
          </h2>

          {/* Transaction Type Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 flex">
              <button
                onClick={() => handleTransactionTypeChange('comprar')}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  transactionType === 'comprar'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Comprar 🏠
              </button>
              <button
                onClick={() => handleTransactionTypeChange('rentar')}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  transactionType === 'rentar'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Rentar 🏠
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-full p-2 max-w-3xl mx-auto shadow-2xl">
            <div className="flex items-center">
              {/* Location Input */}
              <div className="flex-1 flex items-center px-4">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <div className="flex flex-col text-left">
                  <span className="text-xs text-gray-500">¿Dónde?</span>
                  <input
                    type="text"
                    placeholder="Colonia, dirección o lugar"
                    value={location}
                    onChange={handleLocationChange}
                    className="text-gray-800 placeholder-gray-400 border-none outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="w-px h-12 bg-gray-200"></div>

              {/* Price Input */}
              <div className="flex-1 flex items-center px-4">
                <DollarSign className="w-5 h-5 text-gray-400 mr-3" />
                <div className="flex flex-col text-left">
                  <span className="text-xs text-gray-500">¿Hasta cuánto?</span>
                  <input
                    type="text"
                    placeholder="Cualquier precio"
                    value={price}
                    onChange={handlePriceChange}
                    className="text-gray-800 placeholder-gray-400 border-none outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Search Button */}
              <button className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-colors ml-2">
                <Search className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Logo */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30">
        <div className="bg-blue-500 rounded-2xl p-6 shadow-2xl">
          <div className="text-white text-4xl font-bold">M</div>
        </div>
      </div>

      {/* Help Button */}
      <button className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors z-50">
        <span className="text-lg">💬</span>
      </button>

      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          100% {
            transform: translateY(-20px) rotate(5deg);
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
};

export default MonopolioHomepage;