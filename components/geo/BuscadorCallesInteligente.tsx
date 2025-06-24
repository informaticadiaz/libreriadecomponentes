// components/BuscadorCallesInteligente.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { georefService, CalleGeoRef } from '@/services/georefService';

interface BuscadorCallesInteligenteProps {
  onSeleccionarCalle: (calle: CalleGeoRef) => void;
  placeholder?: string;
  className?: string;
  mostrarTutorial?: boolean;
}

export const BuscadorCallesInteligente: React.FC<BuscadorCallesInteligenteProps> = ({
  onSeleccionarCalle,
  placeholder = "Ej: GUTIERREZ (funciona para 336 GUTIERREZ)",
  className = "",
  mostrarTutorial = true
}) => {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<CalleGeoRef[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [ejemplosVisible, setEjemplosVisible] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const ejemplosBusqueda = [
    { consulta: 'GUTIERREZ', descripcion: 'Encuentra "336 GUTIERREZ" y otras variantes' },
    { consulta: 'SAN MARTIN', descripcion: 'Encuentra todas las calles San Martín' },
    { consulta: 'RIVADAVIA', descripcion: 'Encuentra Av. Rivadavia y Calle Rivadavia' },
    { consulta: '25 DE MAYO', descripcion: 'Encuentra calles con fechas' }
  ];

  const buscarCalles = async (termino: string) => {
    if (termino.length < 2) {
      setResultados([]);
      setMostrarResultados(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const calles = await georefService.buscarPorNombreSimplificado(termino);
      setResultados(calles);
      setMostrarResultados(true);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setResultados([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      buscarCalles(query);
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  const manejarSeleccion = (calle: CalleGeoRef) => {
    setQuery(calle.nombre);
    setMostrarResultados(false);
    onSeleccionarCalle(calle);
  };

  const probarEjemplo = (ejemplo: string) => {
    setQuery(ejemplo);
    inputRef.current?.focus();
  };

  const obtenerExplicacionResultado = (calle: CalleGeoRef, busqueda: string) => {
    const nombreLimpio = calle.nombre.replace(/^\d+\s+/, '');
    const busquedaNormalizada = busqueda.toLowerCase().trim();
    const nombreNormalizado = nombreLimpio.toLowerCase();

    if (nombreNormalizado === busquedaNormalizada) {
      return "✅ Coincidencia exacta del nombre principal";
    } else if (nombreNormalizado.includes(busquedaNormalizada)) {
      return "🎯 Encontrado en el nombre de la calle";
    } else if (calle.nombre.toLowerCase().includes(busquedaNormalizada)) {
      return "📍 Encontrado en el nombre completo";
    }
    return "🔍 Coincidencia parcial";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Input de búsqueda */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Tutorial */}
      {mostrarTutorial && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-blue-500 text-xl">💡</div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">
                Búsqueda Inteligente Activada
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Esta búsqueda encuentra calles aunque tengan números o códigos al inicio. 
                Por ejemplo, buscar GUTIERREZ encontrará 336 GUTIERREZ.
              </p>
              
              <button
                onClick={() => setEjemplosVisible(!ejemplosVisible)}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                {ejemplosVisible ? 'Ocultar ejemplos' : 'Ver ejemplos'}
              </button>
              
              {ejemplosVisible && (
                <div className="mt-3 space-y-2">
                  {ejemplosBusqueda.map((ejemplo, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-blue-600">{ejemplo.descripcion}</span>
                      <button
                        onClick={() => probarEjemplo(ejemplo.consulta)}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Probar {ejemplo.consulta}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Resultados */}
      {mostrarResultados && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-auto">
          {resultados.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <div className="text-lg mb-2">🔍</div>
              <p className="text-sm">No se encontraron calles con {query}</p>
              <p className="text-xs text-gray-400 mt-1">
                Intenta con términos más simples o verifica la ortografía
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              <div className="px-4 py-2 bg-gray-50 border-b">
                <p className="text-xs text-gray-600">
                  {resultados.length} resultado{resultados.length !== 1 ? 's' : ''} encontrado{resultados.length !== 1 ? 's' : ''} para {query}
                </p>
              </div>
              
              {resultados.map((calle, index) => (
                <div
                  key={calle.id}
                  onClick={() => manejarSeleccion(calle)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{calle.nombre}</h4>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {calle.categoria}
                        </span>
{/*

                        {calle.score && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                            {Math.round(calle.score)}% match
                            </span>
                        )}
   */                 }
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {calle.nomenclatura}
                      </p>
                      
                      <div className="text-xs text-gray-500">
                        {obtenerExplicacionResultado(calle, query)}
                      </div>
                      
                      {calle.altura && (
                        <div className="text-xs text-gray-400 mt-1">
                          Numeración: {calle.altura.inicio.izquierda}-{calle.altura.fin.derecha}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-gray-400 text-sm">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
