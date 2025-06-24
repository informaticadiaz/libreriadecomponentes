// hooks/useGeoref.ts
"use client";

import { useState, useCallback } from 'react';

interface GeorefAddress {
  altura: { valor: number; unidad: string };
  calle: { nombre: string; categoria: string; id: string };
  ubicacion: { lat: number; lon: number } | null;
  provincia: { nombre: string };
  nomenclatura: string;
}

interface GeorefResponse {
  direcciones: GeorefAddress[];
  cantidad: number;
  total: number;
}

interface ValidationResult {
  isValid: boolean;
  coordinates?: { lat: number; lon: number };
  normalizedAddress?: string;
  error?: string;
}

export const useGeoref = () => {
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState<Map<string, ValidationResult>>(new Map());

  const validateAddress = useCallback(async (
    address: string,
    province: string = 'buenos aires'
  ): Promise<ValidationResult> => {
    const cacheKey = `${address.toLowerCase()}-${province.toLowerCase()}`;
    
    // Check cache first
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }

    setLoading(true);
    
    try {
      const cleanAddress = address.trim().replace(/\s+/g, ' ');
      const url = `https://apis.datos.gob.ar/georef/api/direcciones?direccion=${encodeURIComponent(cleanAddress)}&provincia=${encodeURIComponent(province)}`;
      
      const response = await fetch(url);
      
      if (response.status === 429) {
        throw new Error('Rate limit excedido. Intenta de nuevo en unos minutos.');
      }
      
      if (!response.ok) {
        throw new Error('Error al conectar con el servicio de direcciones');
      }
      
      const data: GeorefResponse = await response.json();
      
      let result: ValidationResult;
      
      if (data.cantidad === 0) {
        result = {
          isValid: false,
          error: 'Dirección no encontrada'
        };
      } else {
        const addressData = data.direcciones[0];
        
        if (!addressData.ubicacion) {
          result = {
            isValid: false,
            error: 'No se pudieron obtener las coordenadas para esta dirección'
          };
        } else {
          result = {
            isValid: true,
            coordinates: addressData.ubicacion,
            normalizedAddress: addressData.nomenclatura
          };
        }
      }
      
      // Cache the result
      const newCache = new Map(cache);
      newCache.set(cacheKey, result);
      setCache(newCache);
      
      return result;
      
    } catch (error) {
      const errorResult: ValidationResult = {
        isValid: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      return errorResult;
    } finally {
      setLoading(false);
    }
  }, [cache]);

  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  return {
    validateAddress,
    loading,
    clearCache,
    cacheSize: cache.size
  };
};
