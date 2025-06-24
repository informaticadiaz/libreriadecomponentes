// components/AutocompletadoCallesQuilmes.tsx
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useGeoRefSearch } from '@/hooks/geo/useGeoRefSearch';
import { CalleGeoRef } from '@/services/georefService';

interface AutocompletadoCallesProps {
  onSeleccionarCalle: (calle: CalleGeoRef) => void;
  placeholder?: string;
  categoria?: string;
  className?: string;
  mostrarCategoria?: boolean;
  mostrarNomenclatura?: boolean;
  disabled?: boolean;
}

export const AutocompletadoCallesQuilmes: React.FC<AutocompletadoCallesProps> = ({
  onSeleccionarCalle,
  placeholder = "Buscar calles en Quilmes...",
  categoria,
  className = "",
  mostrarCategoria = true,
  mostrarNomenclatura = true,
  disabled = false
}) => {
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(-1);
  const [calleSeleccionada, setCalleSeleccionada] = useState<CalleGeoRef | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { 
    query, 
    setQuery, 
    resultados, 
    isLoading, 
    error, 
    totalResultados,
    reintentarBusqueda
  } = useGeoRefSearch({
    debounceMs: 200,
    minChars: 2,
    limite: 25,
    categoria
  });

  // Mostrar sugerencias cuando hay query y no hay calle seleccionada
  useEffect(() => {
    setMostrarSugerencias(query.length >= 2 && !calleSeleccionada);
    setIndiceSeleccionado(-1);
  }, [query, calleSeleccionada]);

  const manejarCambioInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    
    // Reset de selección si cambia el input
    if (calleSeleccionada) {
      setCalleSeleccionada(null);
    }
    
    setQuery(valor);
  };

  const manejarSeleccion = (calle: CalleGeoRef) => {
    setCalleSeleccionada(calle);
    setQuery(calle.nombre);
    setMostrarSugerencias(false);
    setIndiceSeleccionado(-1);
    onSeleccionarCalle(calle);
    inputRef.current?.blur();
  };

  const manejarTeclas = (e: React.KeyboardEvent) => {
    if (!mostrarSugerencias || resultados.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setIndiceSeleccionado(prev => 
          prev < resultados.length - 1 ? prev + 1 : 0
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setIndiceSeleccionado(prev => 
          prev > 0 ? prev - 1 : resultados.length - 1
        );
        break;

      case 'Enter':
        e.preventDefault();
        if (indiceSeleccionado >= 0) {
          manejarSeleccion(resultados[indiceSeleccionado]);
        }
        break;

      case 'Escape':
        setMostrarSugerencias(false);
        setIndiceSeleccionado(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const formatearNomenclatura = (calle: CalleGeoRef) => {
    return `${calle.nombre}, Quilmes, Buenos Aires`;
  };

  const obtenerIconoCategoria = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case 'avenida':
        return '🛣️';
      case 'calle':
        return '🏘️';
      case 'ruta':
        return '🚗';
      case 'autopista':
        return '🏎️';
      default:
        return '📍';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={manejarCambioInput}
          onKeyDown={manejarTeclas}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 text-sm border rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${calleSeleccionada ? 'border-green-300 bg-green-50' : ''}
          `}
          aria-expanded={mostrarSugerencias}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
        />
        
        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {calleSeleccionada && (
          <div className="absolute right-3 top-3 text-green-500">
            ✓
          </div>
        )}
      </div>

      {/* Lista de sugerencias */}
      {mostrarSugerencias && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-auto"
          role="listbox"
          aria-label="Calles disponibles en Quilmes"
        >
          {isLoading && (
            <li className="px-4 py-3 text-gray-500 text-sm">
              🔍 Buscando calles en Quilmes...
            </li>
          )}

          {error && (
            <li className="px-4 py-3 text-red-600 text-sm">
              <div className="flex items-center justify-between">
                <span>⚠️ {error}</span>
                <button
                  onClick={reintentarBusqueda}
                  className="ml-2 px-2 py-1 text-xs bg-red-100 hover:bg-red-200 rounded"
                >
                  Reintentar
                </button>
              </div>
            </li>
          )}

          {!isLoading && !error && resultados.length === 0 && query.length >= 2 && (
            <li className="px-4 py-3 text-gray-500 text-sm">
              📍 No se encontraron calles con {query} en Quilmes
            </li>
          )}

          {!isLoading && !error && resultados.map((calle, index) => (
            <li
              key={calle.id}
              className={`
                px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0
                ${index === indiceSeleccionado ? 'bg-blue-50 border-blue-200' : ''}
              `}
              onClick={() => manejarSeleccion(calle)}
              role="option"
              aria-selected={index === indiceSeleccionado}
            >
              <div className="flex items-start space-x-3">
                {mostrarCategoria && (
                  <span className="text-lg mt-0.5">
                    {obtenerIconoCategoria(calle.categoria)}
                  </span>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 truncate">
                      {calle.nombre}
                    </span>
                    {mostrarCategoria && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        {calle.categoria.toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  {mostrarNomenclatura && (
                    <p className="text-sm text-gray-500 mt-1 truncate">
                      {formatearNomenclatura(calle)}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}

          {!isLoading && !error && resultados.length > 0 && totalResultados > resultados.length && (
            <li className="px-4 py-2 text-xs text-gray-500 bg-gray-50 text-center">
              Mostrando {resultados.length} de {totalResultados} calles
            </li>
          )}
        </ul>
      )}
    </div>
  );
};