"use client";
import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Home, Building, Heart, RotateCcw, Sparkles } from 'lucide-react';

interface FloatingIconProps {
  icon: string;
  top: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

const MonopolioMobile: React.FC = () => {
  const [transactionType, setTransactionType] = useState<'comprar' | 'rentar'>('comprar');
  const [location, setLocation] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState<boolean>(false);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [wordIndex, setWordIndex] = useState<number>(0);
  
  // ✅ Estado para los íconos flotantes
  const [floatingIcons, setFloatingIcons] = useState<Array<{
    id: number;
    icon: string;
    top: number;
    left: number;
    delay: number;
    duration: number;
    size: number;
  }>>([]);

  const words = React.useMemo(() => ['comprar', 'rentar'], []);

  // ✅ Generar íconos flotantes solo en el cliente
  useEffect(() => {
    const icons = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      icon: i % 2 === 0 ? 'home' : 'building',
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 4 + Math.random() * 2,
      size: 30 + Math.random() * 20
    }));
    setFloatingIcons(icons);
  }, []); // Solo se ejecuta una vez al montar el componente

  // Typewriter effect
  useEffect(() => {
    const currentWord = words[wordIndex];
    const typeSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 500 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayedText.length < currentWord.length) {
          setDisplayedText(currentWord.slice(0, displayedText.length + 1));
        } else {
          // Word completed, pause then start deleting
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        // Deleting
        if (displayedText.length > 0) {
          setDisplayedText(displayedText.slice(0, -1));
        } else {
          // Word deleted, move to next word
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, wordIndex, words]);

  const handleTransactionTypeClick = (type: 'comprar' | 'rentar'): void => {
    setTransactionType(type);
  };

  const handleMenuToggle = (): void => {
    if (!isMenuOpen) {
      setIsMenuOpen(true);
      setIsMenuAnimating(true);
    } else {
      setIsMenuAnimating(false);
      setTimeout(() => setIsMenuOpen(false), 300);
    }
  };

  const handleMenuClose = (): void => {
    setIsMenuAnimating(false);
    setTimeout(() => setIsMenuOpen(false), 300);
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };
  };

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
      />

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
            onClick={handleMenuToggle}
            className="text-blue-400 p-2"
            type="button"
          >
            <div className="w-6 h-0.5 bg-blue-400 mb-1.5 rounded" />
            <div className="w-6 h-0.5 bg-blue-400 mb-1.5 rounded" />
            <div className="w-6 h-0.5 bg-blue-400 rounded" />
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
            para{' '}
            <span className="text-blue-400 relative">
              {displayedText}
              <span className="animate-pulse">|</span>
            </span>
          </h3>
        </div>

        {/* Transaction Type Toggle */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 flex max-w-xs">
            <button
              onClick={() => handleTransactionTypeClick('comprar')}
              type="button"
              className={`flex-1 px-4 py-3 rounded-full font-medium transition-all text-sm flex items-center justify-center gap-2 ${
                transactionType === 'comprar'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-white/80'
              }`}
            >
              Comprar
              <div className="w-4 h-4 flex items-center justify-center">
                <div className="w-2 h-2 bg-current rounded-sm" />
                <div className="w-1 h-1 bg-current rounded-sm ml-0.5 mt-0.5" />
              </div>
            </button>
            <button
              onClick={() => handleTransactionTypeClick('rentar')}
              type="button"
              className={`flex-1 px-4 py-3 rounded-full font-medium transition-all text-sm flex items-center justify-center gap-2 ${
                transactionType === 'rentar'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-white/80'
              }`}
            >
              Rentar
              <div className="w-4 h-4 flex items-center justify-center">
                <div className="w-2 h-2 border border-current rounded-sm" />
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
              onChange={handleInputChange(setLocation)}
              className="w-full text-gray-800 text-lg placeholder-gray-400 border-none outline-none bg-transparent"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-6" />

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
              onChange={handleInputChange(setPrice)}
              className="w-full text-gray-800 text-lg placeholder-gray-400 border-none outline-none bg-transparent"
            />
          </div>

          {/* Search Button */}
          <button 
            type="button"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-2xl font-medium text-lg transition-colors flex items-center justify-center gap-3 shadow-lg"
          >
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
        <div 
          className={`fixed inset-0 bg-black/50 menu-overlay transition-opacity ${
            isMenuAnimating ? 'opacity-100 duration-700 ease-in' : 'opacity-0 duration-300 ease-in'
          }`} 
          onClick={handleMenuClose}
          style={{ zIndex: 9999 }}
        >
          <div 
            className={`bg-white w-80 h-full ml-auto flex flex-col transform transition-all ${
              isMenuAnimating ? 'translate-x-0 duration-500 ease-in' : 'translate-x-full duration-300 ease-in'
            }`}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            style={{ zIndex: 10000 }}
          >
            {/* Menu Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <button 
                  onClick={handleMenuClose}
                  type="button"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <button 
                type="button"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full font-medium transition-colors"
              >
                Iniciar sesión
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Menú Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Menú</h3>
                
                <div className="space-y-1">
                  <a href="#" className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-lg transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">M</span>
                      </div>
                      <span className="text-gray-900 font-medium">Inicio</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>

                  <a href="#" className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-lg transition-colors group">
                    <div className="flex items-center gap-4">
                      <Home className="w-6 h-6 text-gray-600" />
                      <span className="text-gray-900 font-medium">Comprar</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>

                  <a href="#" className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-lg transition-colors group">
                    <div className="flex items-center gap-4">
                      <Building className="w-6 h-6 text-gray-600" />
                      <span className="text-gray-900 font-medium">Rentar</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>

                  <a href="#" className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-lg transition-colors group">
                    <div className="flex items-center gap-4">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="text-gray-900 font-medium">Estimación de valor</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>

                  <a href="#" className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-lg transition-colors group">
                    <div className="flex items-center gap-4">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-gray-900 font-medium">Recursos</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Asistencia Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Asistencia</h3>
                
                <a href="#" className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-lg transition-colors group">
                  <div className="flex items-center gap-4">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-900 font-medium">Necesito ayuda</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Menu Footer */}
            <div className="p-6 border-t border-gray-100 text-center">
              <div className="flex justify-center gap-6 mb-4">
                <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Términos y condiciones</a>
                <span className="text-gray-300">•</span>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Política de privacidad</a>
              </div>
              <p className="text-xs text-gray-400">Copyright © 2025 DD360</p>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations */}
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
        
        /* Ensure menu appears above everything */
        .menu-overlay {
          z-index: 9999;
        }
      `}</style>
    </div>
  );
};

export default MonopolioMobile;