"use client"
import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Home, Building, Heart, RotateCcw, Sparkles } from 'lucide-react';

// Interfaz para las props del componente FloatingIcon
interface FloatingIconProps {
  icon: 'home' | 'building';
  top: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

// Interfaz para los elementos del array floatingIcons
interface FloatingIconData {
  id: number;
  icon: 'home' | 'building';
  top: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

const MonopolioMobile = () => {
  const [transactionType, setTransactionType] = useState<'comprar' | 'rentar'>('comprar');
  const [location, setLocation] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Generate floating icons for background animation
  const floatingIcons: FloatingIconData[] = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    icon: i % 2 === 0 ? 'home' : 'building',
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 4 + Math.random() * 2,
    size: 30 + Math.random() * 20
  }));

  const FloatingIcon: React.FC<FloatingIconProps> = ({ icon, top, left, delay, duration, size }) => (
    <div 
      className="absolute opacity-10 text-white/20 pointer-events-none"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        animation: `float ${duration}s ease-in-out ${delay}s infinite alternate`
      }}
    >
      <div 
        className="rounded-full border border-white/10 flex items-center justify-center backdrop-blur-sm"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {icon === 'home' ? (
          <Home className="w-4 h-4" />
        ) : (
          <Building className="w-4 h-4" />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Floating Background Icons */}
      <div className="absolute inset-0">
        {floatingIcons.map((item) => (
          <FloatingIcon key={item.id} {...item} />
        ))}
      </div>

      {/* Background Pattern - More subtle dotted pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '25px 25px'
        }}
      ></div>

      {/* Mobile Header */}
      <header className="relative z-50 px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-blue-600 font-bold text-xl">M</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-blue-400 p-2"
          >
            <div className="w-6 h-0.5 bg-blue-400 mb-1.5 rounded"></div>
            <div className="w-6 h-0.5 bg-blue-400 mb-1.5 rounded"></div>
            <div className="w-6 h-0.5 bg-blue-400 rounded"></div>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-40 px-6 pt-8 pb-32">
        {/* Main Title */}
        <div className="mb-8">
          <h1 className="text-white text-4xl font-light leading-tight mb-2">
            La mejor manera de
          </h1>
          <h2 className="text-white text-4xl font-light leading-tight mb-2">
            buscar propiedades
          </h2>
          <h3 className="text-white text-4xl font-light leading-tight">
            para
          </h3>
        </div>

        {/* Transaction Type Toggle */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 flex max-w-xs">
            <button
              onClick={() => setTransactionType('comprar')}
              className={`flex-1 px-4 py-3 rounded-full font-medium transition-all text-sm flex items-center justify-center gap-2 ${
                transactionType === 'comprar'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-white/80'
              }`}
            >
              Comprar
              <div className="w-4 h-4 flex items-center justify-center">
                <div className="w-2 h-2 bg-current rounded-sm"></div>
                <div className="w-1 h-1 bg-current rounded-sm ml-0.5 mt-0.5"></div>
              </div>
            </button>
            <button
              onClick={() => setTransactionType('rentar')}
              className={`flex-1 px-4 py-3 rounded-full font-medium transition-all text-sm flex items-center justify-center gap-2 ${
                transactionType === 'rentar'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-white/80'
              }`}
            >
              Rentar
              <div className="w-4 h-4 flex items-center justify-center">
                <div className="w-2 h-2 border border-current rounded-sm"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl mb-8">
          {/* Location Input */}
          <div className="mb-6">
            <div className="flex items-center text-gray-400 mb-2">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">¿Dónde?</span>
            </div>
            <input
              type="text"
              placeholder="Colonia, dirección o lugar"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-gray-800 text-lg placeholder-gray-400 border-none outline-none bg-transparent"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-6"></div>

          {/* Price Input */}
          <div className="mb-8">
            <div className="flex items-center text-gray-400 mb-2">
              <DollarSign className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">¿Hasta cuánto?</span>
            </div>
            <input
              type="text"
              placeholder="Cualquier precio"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full text-gray-800 text-lg placeholder-gray-400 border-none outline-none bg-transparent"
            />
          </div>

          {/* Search Button */}
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-2xl font-medium text-lg transition-colors flex items-center justify-center gap-3 shadow-lg">
            <Search className="w-5 h-5" />
            Buscar
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 z-50">
        <div className="flex justify-around items-center">
          <div className="flex flex-col items-center py-2">
            <Home className="w-6 h-6 text-blue-500 mb-1" />
            <span className="text-xs text-blue-500 font-medium">Inicio</span>
          </div>
          <div className="flex flex-col items-center py-2">
            <Sparkles className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-xs text-gray-400">Para ti</span>
          </div>
          <div className="flex flex-col items-center py-2">
            <Heart className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-xs text-gray-400">Favoritos</span>
          </div>
          <div className="flex flex-col items-center py-2">
            <RotateCcw className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-xs text-gray-400">Historial</span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-60" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-white w-64 h-full ml-auto p-6">
            <div className="space-y-6">
              <a href="#" className="block text-gray-800 text-lg">Buscar propiedades</a>
              <a href="#" className="block text-gray-800 text-lg">Estimación de valor</a>
              <a href="#" className="block text-gray-800 text-lg">Recursos</a>
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium mt-8">
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.1;
          }
          100% {
            transform: translateY(-15px) rotate(3deg);
            opacity: 0.05;
          }
        }
      `}</style>
    </div>
  );
};

export default MonopolioMobile;