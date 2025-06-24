// hooks/useGeoRefPaginacion.ts
import { useState, useCallback, useEffect } from 'react';
import { georefService, CalleGeoRef, GeoRefResponse } from '@/services/georefService';

interface UseGeoRefPaginacionOptions {
  tamanoPagina?: number;
  filtroCategoria?: string;
  terminoBusqueda?: string;
  usarBusquedaInteligente?: boolean; // Nueva opción
}

export const useGeoRefPaginacion = (options: UseGeoRefPaginacionOptions = {}) => {
  const { 
    tamanoPagina = 50, 
    filtroCategoria, 
    terminoBusqueda,
    usarBusquedaInteligente = true 
  } = options;

  const [paginaActual, setPaginaActual] = useState(0);
  const [calles, setCalles] = useState<CalleGeoRef[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResultados, setTotalResultados] = useState(0);
  const [hayMasPaginas, setHayMasPaginas] = useState(false);

  const cargarPagina = useCallback(async (pagina: number, concatenar: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      let response: GeoRefResponse;
      let callesResultado: CalleGeoRef[];

      if (terminoBusqueda) {
        if (usarBusquedaInteligente) {
          // Para búsqueda inteligente, manejar paginación manualmente
          const todasLasCalles = await georefService.buscarPorNombreSimplificado(terminoBusqueda);
          const inicio = pagina * tamanoPagina;
          const fin = inicio + tamanoPagina;
          
          callesResultado = todasLasCalles.slice(inicio, fin);
          
          // Simular estructura de respuesta
          response = {
            calles: callesResultado,
            cantidad: callesResultado.length,
            total: todasLasCalles.length,
            inicio: inicio,
            parametros: { nombre: terminoBusqueda }
          };
        } else {
          response = await georefService.buscarCalles({
            nombre: terminoBusqueda,
            categoria: filtroCategoria,
            max: tamanoPagina,
            inicio: pagina * tamanoPagina
          });
          callesResultado = response.calles;
        }
      } else {
        response = await georefService.obtenerTodasLasCallesPaginadas(pagina, tamanoPagina);
        callesResultado = response.calles;
      }

      if (concatenar) {
        setCalles(prev => [...prev, ...callesResultado]);
      } else {
        setCalles(callesResultado);
      }

      setTotalResultados(response.total);
      setHayMasPaginas((pagina + 1) * tamanoPagina < response.total);
      setPaginaActual(pagina);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar calles');
      if (!concatenar) {
        setCalles([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [tamanoPagina, filtroCategoria, terminoBusqueda, usarBusquedaInteligente]);

  // Cargar primera página cuando cambien los filtros
  useEffect(() => {
    cargarPagina(0, false);
  }, [cargarPagina]);

  const cargarSiguientePagina = useCallback(() => {
    if (hayMasPaginas && !isLoading) {
      cargarPagina(paginaActual + 1, true);
    }
  }, [paginaActual, hayMasPaginas, isLoading, cargarPagina]);

  const reiniciar = useCallback(() => {
    setPaginaActual(0);
    setCalles([]);
    cargarPagina(0, false);
  }, [cargarPagina]);

  const irAPagina = useCallback((pagina: number) => {
    cargarPagina(pagina, false);
  }, [cargarPagina]);

  return {
    calles,
    isLoading,
    error,
    paginaActual,
    totalResultados,
    hayMasPaginas,
    totalPaginas: Math.ceil(totalResultados / tamanoPagina),
    cargarSiguientePagina,
    irAPagina,
    reiniciar
  };
};