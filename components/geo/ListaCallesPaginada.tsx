// components/ListaCallesPaginada.tsx
"use client";
import React, { useEffect, useRef } from 'react';
import { useGeoRefPaginacion } from '@/hooks/geo/useGeoRefPaginacion';
import { CalleGeoRef } from '@/services/georefService';

interface ListaCallesPaginadaProps {
  terminoBusqueda?: string;
  filtroCategoria?: string;
  onSeleccionarCalle: (calle: CalleGeoRef) => void;
  className?: string;
  usarScrollInfinito?: boolean;
}

export const ListaCallesPaginada: React.FC<ListaCallesPaginadaProps> = ({
  terminoBusqueda,
  filtroCategoria,
  onSeleccionarCalle,
  className = "",
  usarScrollInfinito = true
}) => {
  const observerRef = useRef<HTMLDivElement>(null);
  
  const {
    calles,
    isLoading,
    error,
    paginaActual,
    totalResultados,
    hayMasPaginas,
    totalPaginas,
    cargarSiguientePagina,
    irAPagina,
    reiniciar
  } = useGeoRefPaginacion({
    tamanoPagina: 50,
    filtroCategoria,
    terminoBusqueda
  });

  // Intersection Observer para scroll infinito
  useEffect(() => {
    if (!usarScrollInfinito) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hayMasPaginas && !isLoading) {
          cargarSiguientePagina();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hayMasPaginas, isLoading, cargarSiguientePagina, usarScrollInfinito]);

  const formatearCategoria = (categoria: string) => {
    return categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase();
  };

  if (error) {
    return (
      <div className={`p-6 text-center ${className}`}>
        <div className="text-red-500 mb-4">
          <p className="text-lg font-semibold">⚠️ Error al cargar calles</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
        <button
          onClick={reiniciar}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Header con información */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800">
          Calles de Quilmes, Buenos Aires
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {terminoBusqueda && `Resultados para: "${terminoBusqueda}" • `}
          {filtroCategoria && `Categoría: ${formatearCategoria(filtroCategoria)} • `}
          Total: {totalResultados.toLocaleString()} calles
        </p>
      </div>

      {/* Lista de calles */}
      <div className="space-y-2">
        {calles.map((calle, index) => (
          <div
            key={`${calle.id}-${index}`}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onSeleccionarCalle(calle)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{calle.nombre}</h4>
                <p className="text-sm text-gray-500 mt-1">{calle.nomenclatura}</p>
                
                {calle.altura && (
                  <div className="text-xs text-gray-400 mt-2">
                    Numeración: {calle.altura.inicio.izquierda}-{calle.altura.fin.derecha}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-end space-y-1">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {formatearCategoria(calle.categoria)}
                </span>
                <span className="text-xs text-gray-400">
                  ID: {calle.id}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading y scroll infinito */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Cargando calles...</span>
        </div>
      )}

      {/* Elemento observado para scroll infinito */}
      {usarScrollInfinito && hayMasPaginas && (
        <div ref={observerRef} className="h-4" />
      )}

      {/* Paginación manual */}
      {!usarScrollInfinito && totalPaginas > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => irAPagina(paginaActual - 1)}
            disabled={paginaActual === 0}
            className="px-3 py-2 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <span className="text-sm text-gray-600">
            Página {paginaActual + 1} de {totalPaginas}
          </span>
          
          <button
            onClick={() => irAPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas - 1}
            className="px-3 py-2 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Estado sin más resultados */}
      {!hayMasPaginas && calles.length > 0 && (
        <div className="text-center py-6 text-gray-500 text-sm">
          📍 Se han mostrado todas las calles disponibles
        </div>
      )}
    </div>
  );
};