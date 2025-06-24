// pages/quilmes-calles.tsx
"use client";
import React from 'react';
import { BuscadorCallesInteligente } from '@/components/geo/BuscadorCallesInteligente';
import { TestBusquedaCalles } from '@/utils/testBusquedaCalles';

const QuilmesCallesPage: React.FC = () => {
  const ejecutarTests = async () => {
    console.log('🧪 Ejecutando tests de búsqueda...');
    const resultados = await TestBusquedaCalles.ejecutarTodos();
    console.log('📊 Resultados:', resultados);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Calles de Quilmes, Buenos Aires
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Búsqueda inteligente que encuentra 336 GUTIERREZ cuando buscas GUTIERREZ
            </p>
          </div>

          {/* Área principal de búsqueda */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              🔍 Buscar Calles en Quilmes
            </h2>
            
            <BuscadorCallesInteligente
              onSeleccionarCalle={(calle) => {
                console.log('Calle seleccionada:', calle);
                // Aquí puedes manejar la selección de la calle
              }}
              className="max-w-2xl mx-auto"
            />
          </div>

          {/* Ejemplos rápidos */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-700">
                ✅ Prueba estos ejemplos que funcionan:
              </h3>
              <ul className="space-y-2 text-sm">
                <li><code className="bg-gray-100 px-2 py-1 rounded">GUTIERREZ</code> → Encuentra 336 GUTIERREZ</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">SAN MARTIN</code> → Encuentra todas las variantes</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">BELGRANO</code> → Encuentra 118 BELGRANO</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">MITRE</code> → Encuentra 112 MITRE</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">
                🔧 Características técnicas:
              </h3>
              <ul className="space-y-2 text-sm">
                <li>• Búsqueda inteligente con normalización</li>
                <li>• Múltiples estrategias de coincidencia</li>
                <li>• Sistema de puntuación por relevancia</li>
                <li>• Deduplicación automática de resultados</li>
                <li>• Optimización específica para Quilmes</li>
              </ul>
            </div>
          </div>

          {/* Botón para tests */}
          <div className="text-center">
            <button
              onClick={ejecutarTests}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🧪 Ejecutar Tests de Validación
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Abre la consola del navegador para ver los resultados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuilmesCallesPage;