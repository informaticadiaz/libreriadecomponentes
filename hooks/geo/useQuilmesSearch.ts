// hooks/useQuilmesSearch.ts
"use client";

import { useState, useCallback } from 'react';
import type { GeorefAddress } from '@/types/georef';

interface QuilmesStreet {
  id: string;
  nombre: string;
  categoria: string;
}

interface QuilmesSearchHook {
  searchQuilmesAddresses: (query: string) => Promise<GeorefAddress[]>;
  searchQuilmesStreets: (streetQuery: string) => Promise<QuilmesStreet[]>;
  loading: boolean;
  error: string | null;
  streetSuggestions: QuilmesStreet[];
}

export const useQuilmesSearch = (): QuilmesSearchHook => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streetSuggestions, setStreetSuggestions] = useState<QuilmesStreet[]>([]);
  const [streetsCache, setStreetsCache] = useState<QuilmesStreet[]>([]);

  // Load all Quilmes streets (cache them)
  const loadQuilmesStreets = useCallback(async (): Promise<QuilmesStreet[]> => {
    if (streetsCache.length > 0) {
      return streetsCache;
    }

    try {
      const url = 'https://apis.datos.gob.ar/georef/api/calles?departamento=quilmes&provincia=buenos%20aires&max=1000';
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Error loading streets');
      
      const data = await response.json();
      const streets = data.calles || [];
      
      setStreetsCache(streets);
      return streets;
    } catch (error) {
      console.error('Error loading Quilmes streets:', error);
      return [];
    }
  }, [streetsCache]);

  // Fuzzy search for street names
  const searchQuilmesStreets = useCallback(async (streetQuery: string): Promise<QuilmesStreet[]> => {
    if (!streetQuery || streetQuery.length < 2) {
      setStreetSuggestions([]);
      return [];
    }

    try {
      const streets = await loadQuilmesStreets();
      const query = streetQuery.toLowerCase().trim();
      
      // Fuzzy matching algorithm
      const matches = streets.filter(street => {
        const streetName = street.nombre.toLowerCase();
        
        // Exact match
        if (streetName.includes(query)) return true;
        
        // Remove common prefixes/suffixes
        const cleanStreetName = streetName
          .replace(/^(av|avenida|calle|pasaje|diagonal)\s+/g, '')
          .replace(/\s+(norte|sur|este|oeste)$/g, '');
        
        // Partial match without prefixes
        if (cleanStreetName.includes(query)) return true;
        
        // Character similarity (for typos)
        const similarity = calculateSimilarity(query, cleanStreetName);
        return similarity > 0.6; // 60% similarity threshold
      });

      // Sort by relevance
      const sortedMatches = matches.sort((a, b) => {
        const aName = a.nombre.toLowerCase();
        const bName = b.nombre.toLowerCase();
        
        // Exact matches first
        if (aName.includes(query) && !bName.includes(query)) return -1;
        if (!aName.includes(query) && bName.includes(query)) return 1;
        
        // Then by length (shorter = more relevant)
        return aName.length - bName.length;
      });

      const topMatches = sortedMatches.slice(0, 10);
      setStreetSuggestions(topMatches);
      return topMatches;
      
    } catch (error) {
      console.error('Error searching streets:', error);
      setStreetSuggestions([]);
      return [];
    }
  }, [loadQuilmesStreets]);

  // Enhanced address search specifically for Quilmes
  const searchQuilmesAddresses = useCallback(async (query: string): Promise<GeorefAddress[]> => {
    if (!query || query.length < 3) return [];

    setLoading(true);
    setError(null);

    try {
      // Strategy 1: Direct search with Quilmes filters
      const directUrl = `https://apis.datos.gob.ar/georef/api/direcciones?direccion=${encodeURIComponent(query)}&departamento=quilmes&provincia=buenos%20aires&max=10`;
      const directResponse = await fetch(directUrl);
      const directData = await directResponse.json();
      
      let results: GeorefAddress[] = directData.direcciones || [];
      
      // Strategy 2: If no results, try fuzzy search with street suggestions
      if (results.length === 0) {
        console.log('🔍 No direct results, trying fuzzy search...');
        
        // Extract potential street name from query
        const parts = query.toLowerCase().split(/\s+/);
        const possibleStreet = parts.find(part => part.length >= 3 && !/^\d+$/.test(part));
        
        if (possibleStreet) {
          const streetMatches = await searchQuilmesStreets(possibleStreet);
          
          // Try search with suggested street names
          for (const street of streetMatches.slice(0, 3)) { // Try top 3 matches
            const newQuery = query.toLowerCase().replace(possibleStreet, street.nombre.toLowerCase());
            
            const fuzzyUrl = `https://apis.datos.gob.ar/georef/api/direcciones?direccion=${encodeURIComponent(newQuery)}&departamento=quilmes&provincia=buenos%20aires&max=5`;
            const fuzzyResponse = await fetch(fuzzyUrl);
            const fuzzyData = await fuzzyResponse.json();
            
            if (fuzzyData.direcciones && fuzzyData.direcciones.length > 0) {
              results = [...results, ...fuzzyData.direcciones];
              console.log(`✅ Found results with street: ${street.nombre}`);
            }
          }
        }
      }

      // Strategy 3: Partial number matching
      if (results.length === 0) {
        // Extract number from query and try without it
        const numberMatch = query.match(/\d+/);
        if (numberMatch) {
          const queryWithoutNumber = query.replace(/\d+/g, '').trim();
          if (queryWithoutNumber.length >= 3) {
            const partialUrl = `https://apis.datos.gob.ar/georef/api/direcciones?direccion=${encodeURIComponent(queryWithoutNumber)}&departamento=quilmes&provincia=buenos%20aires&max=10`;
            const partialResponse = await fetch(partialUrl);
            const partialData = await partialResponse.json();
            
            if (partialData.direcciones) {
              results = [...results, ...partialData.direcciones];
              console.log(`✅ Found results without number: ${queryWithoutNumber}`);
            }
          }
        }
      }

      // Remove duplicates
      const uniqueResults = results.filter((result: GeorefAddress, index: number, self: GeorefAddress[]) => 
        index === self.findIndex((r: GeorefAddress) => r.nomenclatura === result.nomenclatura)
      );

      setLoading(false);
      return uniqueResults;

    } catch (error) {
      console.error('Error in Quilmes search:', error);
      setError(error instanceof Error ? error.message : 'Error de búsqueda');
      setLoading(false);
      return [];
    }
  }, [searchQuilmesStreets]);

  return {
    searchQuilmesAddresses,
    searchQuilmesStreets,
    loading,
    error,
    streetSuggestions
  };
};

// Helper function for string similarity
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

export type { QuilmesStreet, QuilmesSearchHook };