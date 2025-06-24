// hooks/useAddressSearch.ts
"use client";

import { useState, useCallback } from 'react';

interface GeorefAddress {
  altura: { valor: number; unidad: string };
  calle: { nombre: string; categoria: string; id: string };
  ubicacion: { lat: number; lon: number } | null;
  provincia: { nombre: string; id: string };
  departamento: { nombre: string; id: string };
  localidad_censal: { nombre: string; id: string };
  nomenclatura: string;
}

interface GeorefSearchResponse {
  direcciones: GeorefAddress[];
  cantidad: number;
  total: number;
}

interface SearchResult {
  addresses: GeorefAddress[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  lastQuery: string;
}

export const useAddressSearch = () => {
  const [searchState, setSearchState] = useState<SearchResult>({
    addresses: [],
    loading: false,
    error: null,
    hasMore: false,
    lastQuery: ''
  });
  
  const [searchCache, setSearchCache] = useState<Map<string, GeorefAddress[]>>(new Map());

  const searchAddresses = useCallback(async (
    partialAddress: string,
    maxResults: number = 10
  ): Promise<void> => {
    console.log('🔍 Searching for:', partialAddress); // Debug log
    
    if (!partialAddress.trim()) {
      setSearchState({
        addresses: [],
        loading: false,
        error: null,
        hasMore: false,
        lastQuery: ''
      });
      return;
    }

    const cacheKey = `${partialAddress.toLowerCase()}-${maxResults}`;
    
    // Check cache first
    if (searchCache.has(cacheKey)) {
      const cachedResults = searchCache.get(cacheKey)!;
      console.log('📦 Using cached results:', cachedResults.length); // Debug log
      setSearchState({
        addresses: cachedResults,
        loading: false,
        error: null,
        hasMore: cachedResults.length >= maxResults,
        lastQuery: partialAddress
      });
      return;
    }

    setSearchState(prev => ({ ...prev, loading: true, error: null, lastQuery: partialAddress }));

    try {
      const cleanAddress = partialAddress.trim().replace(/\s+/g, ' ');
      const url = `https://apis.datos.gob.ar/georef/api/direcciones?direccion=${encodeURIComponent(cleanAddress)}&max=${maxResults}`;
      
      console.log('🌐 API URL:', url); // Debug log
      
      const response = await fetch(url);
      console.log('📡 Response status:', response.status); // Debug log
      
      if (response.status === 429) {
        throw new Error('Demasiadas consultas. Intenta de nuevo en unos segundos.');
      }
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data: GeorefSearchResponse = await response.json();
      console.log('📋 API Response:', data); // Debug log
      
      // Cache the results
      const newCache = new Map(searchCache);
      newCache.set(cacheKey, data.direcciones);
      setSearchCache(newCache);
      
      setSearchState({
        addresses: data.direcciones,
        loading: false,
        error: null,
        hasMore: data.total > data.cantidad,
        lastQuery: partialAddress
      });
      
    } catch (error) {
      console.error('❌ Search error:', error); // Debug log
      setSearchState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        lastQuery: partialAddress
      }));
    }
  }, [searchCache]);

  const clearSearch = useCallback(() => {
    setSearchState({
      addresses: [],
      loading: false,
      error: null,
      hasMore: false,
      lastQuery: ''
    });
  }, []);

  const clearCache = useCallback(() => {
    setSearchCache(new Map());
  }, []);

  return {
    ...searchState,
    searchAddresses,
    clearSearch,
    clearCache,
    cacheSize: searchCache.size
  };
};

