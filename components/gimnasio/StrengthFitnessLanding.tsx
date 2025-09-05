"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, Trophy, Users, Dumbbell, Clock, Star, ArrowRight } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

interface Achievement {
  title: string;
  icon: string;
}

const StrengthFitnessLanding: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const sections = ['hero', 'about', 'plans'];
      
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop - 100 && scrollPosition < offsetTop + offsetHeight - 100) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const plans: Plan[] = [
    {
      id: 'premium',
      name: 'MEMBRESÍA PREMIUM',
      price: '$45.000',
      highlighted: true,
      features: [
        'Acceso ilimitado al gimnasio',
        'Entrenamiento personalizado',
        'Plan nutricional incluido',
        'Clases grupales premium',
        'Seguimiento con entrenador',
        'Acceso a área VIP'
      ]
    },
    {
      id: 'standard',
      name: 'MEMBRESÍA ESTÁNDAR',
      price: '$35.000',
      features: [
        'Acceso ilimitado al gimnasio',
        'Rutinas de entrenamiento',
        'Clases grupales básicas',
        'Asesoramiento inicial',
        'Uso de todas las máquinas',
        'Horario extendido'
      ]
    }
  ];

  const achievements: Achievement[] = [
    { title: 'Gimnasio del Año', icon: '🏆' },
    { title: '+5000 Miembros', icon: '👥' },
    { title: '15 Años Experiencia', icon: '⭐' },
    { title: 'Equipos de Última Generación', icon: '💪' },
    { title: 'Entrenadores Certificados', icon: '🎯' },
    { title: 'Ambiente Motivador', icon: '🔥' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-pink-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                SF
              </div>
              <div>
                <div className="text-lg font-bold text-white">STRENGTH FITNESS</div>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <button 
                onClick={() => scrollToSection('hero')}
                className={`transition-colors duration-300 ${activeSection === 'hero' ? 'text-pink-500' : 'text-white hover:text-pink-400'}`}
              >
                HOME
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className={`transition-colors duration-300 ${activeSection === 'about' ? 'text-pink-500' : 'text-white hover:text-pink-400'}`}
              >
                SOBRE NOSOTROS
              </button>
              <button 
                onClick={() => scrollToSection('plans')}
                className={`transition-colors duration-300 ${activeSection === 'plans' ? 'text-pink-500' : 'text-white hover:text-pink-400'}`}
              >
                MEMBRESÍAS
              </button>
              <button className="text-white hover:text-pink-400 transition-colors duration-300">
                CONTACTO
              </button>
            </div>

            <div className="flex space-x-4">
              <div className="w-6 h-6 border border-white/30 rounded flex items-center justify-center text-xs">f</div>
              <div className="w-6 h-6 border border-white/30 rounded flex items-center justify-center text-xs">ig</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/90 via-purple-600/90 to-black/90 z-10"></div>
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-pink-400 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute bottom-32 left-40 w-16 h-16 border border-purple-400 rounded-full animate-ping delay-500"></div>
        </div>

        <div className={`relative z-20 text-center max-w-4xl mx-auto px-4 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent animate-pulse">
              En Tu Barrio
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              En Tu Fuerza
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto leading-relaxed">
            El gimnasio más completo con equipos de última generación y entrenadores certificados
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => scrollToSection('plans')}
              className="group bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-2"
            >
              <span>ÚNETE AHORA</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="border-2 border-white/50 hover:border-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-white/10 backdrop-blur-sm">
              TOUR VIRTUAL
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/70" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold">
                  <span className="text-white">STRENGTH FITNESS</span>
                  <br />
                  <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    TU GIMNASIO
                  </span>
                </h2>
                <p className="text-white/80 text-lg">Gimnasio | Entrenamiento | Resultados</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <div 
                    key={achievement.title}
                    className={`text-center p-4 rounded-lg bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 transform transition-all duration-500 hover:scale-105 ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="text-2xl mb-2">{achievement.icon}</div>
                    <div className="text-sm font-semibold text-white/90 leading-tight">
                      {achievement.title}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => scrollToSection('plans')}
                className="group bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <span>¡Entrena Con Nosotros!</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-2xl border border-white/10 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Dumbbell className="w-24 h-24 text-pink-400 mx-auto animate-pulse" />
                  <div className="text-xl font-semibold text-white">
                    +15 Años de Experiencia
                  </div>
                  <div className="text-white/70">
                    Transformando vidas a través del fitness
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 bg-gradient-to-br from-purple-900/30 via-black to-pink-900/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">MEMBRESÍAS</span>
              <br />
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                DISPONIBLES
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Planes de entrenamiento diseñados para alcanzar tus objetivos.
              Cuando te unes a nosotros, obtienes acceso completo a nuestras instalaciones y servicios.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={plan.id}
                className={`relative p-8 rounded-2xl border transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${
                  plan.highlighted 
                    ? 'bg-gradient-to-br from-pink-500/20 to-purple-600/20 border-pink-500/50 shadow-pink-500/25 shadow-xl' 
                    : 'bg-gradient-to-br from-white/5 to-white/10 border-white/20'
                } ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-2 rounded-full text-sm font-bold">
                      MÁS POPULAR
                    </div>
                  </div>
                )}

                <div className="aspect-video bg-gradient-to-br from-black/50 to-black/80 rounded-lg mb-6 flex items-center justify-center border border-white/10">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    {plan.highlighted && (
                      <div className="text-pink-400 text-sm">CON NUTRICIÓN</div>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3 text-white/90">
                      <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-center">
                  <div className={`text-3xl font-bold mb-6 ${
                    plan.highlighted 
                      ? 'bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent' 
                      : 'text-white'
                  }`}>
                    {plan.price}
                  </div>
                  
                  <button className={`w-full py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white transform hover:scale-105'
                      : 'border-2 border-white/50 hover:border-white text-white hover:bg-white/10'
                  }`}>
                    ELEGIR PLAN
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                SF
              </div>
              <div>
                <div className="text-xl font-bold text-white">STRENGTH FITNESS</div>
                <div className="text-white/60 text-sm">Tu fuerza, nuestro compromiso</div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-8 text-white/60">
              <span>© 2025 Strength Fitness</span>
              <span>|</span>
              <span>Todos los derechos reservados</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StrengthFitnessLanding;