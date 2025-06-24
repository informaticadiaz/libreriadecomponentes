// hooks/useGeoRefSearch.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { georefService, CalleGeoRef } from '@/services/georefService';

interface UseGeoRefSearchOptions {
  debounceMs?: number;
  minChars?: number;
  limite?: number;
  categoria?: string;
}

export const useGeoRefSearch = (options: UseGeoRefSearchOptions = {}) => {
  const {
    debounceMs = 300,
    minChars = 2,
    limite = 20,
    categoria
  } = options;

  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<CalleGeoRef[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResultados, setTotalResultados] = useState(0);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const buscar = useCallback(async (termino: string) => {
    if (termino.length < minChars) {
      setResultados([]);
      setTotalResultados(0);
      return;
    }

    // Cancelar búsqueda anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      let calles: CalleGeoRef[];
      
      if (categoria) {
        if (categoria === 'avenida') {
          calles = await georefService.buscarAvenidas(termino, limite);
        } else {
          const response = await georefService.buscarCalles({
            nombre: termino,
            categoria,
            max: limite
          });
          calles = response.calles;
          setTotalResultados(response.total);
        }
      } else {
        calles = await georefService.buscarCallesPorNombre(termino, limite);
      }

      setResultados(calles);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(`Error en la búsqueda: ${err.message}`);
        setResultados([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [minChars, limite, categoria]);

  // Debounce de la búsqueda
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      buscar(query);
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, buscar, debounceMs]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const limpiarResultados = useCallback(() => {
    setResultados([]);
    setQuery('');
    setError(null);
    setTotalResultados(0);
  }, []);

  return {
    query,
    setQuery,
    resultados,
    isLoading,
    error,
    totalResultados,
    limpiarResultados,
    reintentarBusqueda: () => buscar(query)
  };
};