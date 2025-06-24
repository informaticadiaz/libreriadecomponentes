// hooks/useGeoRefCache.ts
import { useEffect, useState } from 'react';
import { CalleGeoRef } from '@/services/georefService';

interface CacheEntry {
  data: CalleGeoRef[];
  timestamp: number;
  ttl: number;
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos
const cache = new Map<string, CacheEntry>();

export const useGeoRefCache = () => {
  const [cacheSize, setCacheSize] = useState(0);

  useEffect(() => {
    setCacheSize(cache.size);
  }, []);

  const obtenerCache = (clave: string): CalleGeoRef[] | null => {
    const entrada = cache.get(clave);
    
    if (!entrada) return null;
    
    // Verificar si el cache expiró
    if (Date.now() - entrada.timestamp > entrada.ttl) {
      cache.delete(clave);
      setCacheSize(cache.size);
      return null;
    }
    
    return entrada.data;
  };

  const guardarCache = (clave: string, data: CalleGeoRef[], ttl: number = CACHE_DURATION) => {
    cache.set(clave, {
      data,
      timestamp: Date.now(),
      ttl
    });
    setCacheSize(cache.size);
  };

  const limpiarCache = () => {
    cache.clear();
    setCacheSize(0);
  };

  const limpiarCacheExpirado = () => {
    const ahora = Date.now();
    let eliminados = 0;
    
    for (const [clave, entrada] of cache.entries()) {
      if (ahora - entrada.timestamp > entrada.ttl) {
        cache.delete(clave);
        eliminados++;
      }
    }
    
    setCacheSize(cache.size);
    return eliminados;
  };

  return {
    obtenerCache,
    guardarCache,
    limpiarCache,
    limpiarCacheExpirado,
    cacheSize,
    estadisticasCache: {
      entradas: cache.size,
      memoriaAproximada: cache.size * 1024 // Estimación en bytes
    }
  };
};