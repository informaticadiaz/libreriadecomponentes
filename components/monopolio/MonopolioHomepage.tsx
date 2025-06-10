"use client";
import React, { useState } from 'react';
import { Search, MapPin, TrendingUp, Calculator, MessageCircle, Map, Menu, Bell, Filter } from 'lucide-react';

const MonopolioHomepage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('todos');
  const [transactionType, setTransactionType] = useState('comprar');

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">Monopolio</h1>
              </div>
              <nav className="hidden md:ml-8 md:flex space-x-8">
                <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">Comprar</a>
                <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">Rentar</a>
                <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">Vender</a>
                <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">Avalúos</a>
                <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">Insights</a>
              </nav>
            </div>
            
            {/* Right side */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <Bell className="h-5 w-5" />
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Iniciar Sesión
              </button>
              <button className="md:hidden">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Encuentra tu <span className="text-blue-600">propiedad ideal</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Busca toda la oferta del mercado de bienes raíces con nuestro motor de búsqueda inteligente. 
              Información precisa y confiable para tomar la mejor decisión.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
              {/* Transaction Type Tabs */}
              <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setTransactionType('comprar')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    transactionType === 'comprar' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Comprar
                </button>
                <button 
                  onClick={() => setTransactionType('rentar')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    transactionType === 'rentar' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Rentar
                </button>
                <button 
                  onClick={() => setTransactionType('vender')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    transactionType === 'vender' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Vender
                </button>
              </div>

              {/* Search Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Ciudad de México, Guadalajara, Monterrey..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select 
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todos">Todos los tipos</option>
                  <option value="casa">Casa</option>
                  <option value="departamento">Departamento</option>
                  <option value="terreno">Terreno</option>
                  <option value="oficina">Oficina</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Search className="h-5 w-5" />
                  Buscar Propiedades
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros Avanzados
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Monopolio?
            </h2>
            <p className="text-lg text-gray-600">
              Tecnología e inteligencia artificial para tomar mejores decisiones inmobiliarias
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Análisis de Precios</h3>
              <p className="text-gray-600">
                Comparamos precios con nuestra IA para saber si es justo o se puede negociar mejor
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Map className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Información de Zona</h3>
              <p className="text-gray-600">
                Descubre todo sobre los alrededores: tráfico, costo de vida, tendencias de precio
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Avalúos Digitales</h3>
              <p className="text-gray-600">
                Conoce el precio de cualquier propiedad en México con nuestra herramienta de valuación
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Asistente PAM</h3>
              <p className="text-gray-600">
                Pregúntale a Monopolio 24/7 vía WhatsApp cualquier duda sobre bienes raíces
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Mercado Inmobiliario en Tiempo Real
            </h2>
            <p className="text-lg text-gray-600">
              Precios promedio por m² en las principales ciudades de México
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Ciudad de México</h3>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$30,496</div>
              <p className="text-gray-600 mb-4">MXN por m²</p>
              <div className="text-sm text-green-600">+2.3% vs mes anterior</div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Guadalajara</h3>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$21,750</div>
              <p className="text-gray-600 mb-4">MXN por m²</p>
              <div className="text-sm text-green-600">+1.8% vs mes anterior</div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">San Pedro Garza García</h3>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$62,822</div>
              <p className="text-gray-600 mb-4">MXN por m²</p>
              <div className="text-sm text-green-600">+3.1% vs mes anterior</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para encontrar tu propiedad ideal?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a miles de usuarios que ya confían en Monopolio para sus decisiones inmobiliarias
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Comenzar Búsqueda
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Solicitar Avalúo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Monopolio</h3>
              <p className="text-gray-400">
                La plataforma de bienes raíces más avanzada de México, impulsada por inteligencia artificial.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Productos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Buscar Propiedades</a></li>
                <li><a href="#" className="hover:text-white">Avalúos Digitales</a></li>
                <li><a href="#" className="hover:text-white">Análisis de Mercado</a></li>
                <li><a href="#" className="hover:text-white">Asistente PAM</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Acerca de</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Soporte</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white">Términos de Uso</a></li>
                <li><a href="#" className="hover:text-white">Privacidad</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>&copy; 2025 Monopolio.com.mx. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MonopolioHomepage;