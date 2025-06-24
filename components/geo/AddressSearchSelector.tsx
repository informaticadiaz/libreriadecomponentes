// components/AddressSearchSelector.tsx
"use client";

import React, { useState } from 'react';
import { AddressResultsList } from './AddressResultsList';
import { ValidationResult } from './ValidationResult';
import { useAddressSearch } from '@/hooks/geo/useAddressSearch';
import { useAddressSelection } from '@/hooks/geo/useAddressSelection';
import type { GeorefAddress, AddressValidationResult } from '@/types/georef';

interface AddressSearchSelectorProps {
  deliveryZoneConfig: {
    center: { lat: number; lon: number };
    polygon?: { lat: number; lon: number }[];
    radiusKm?: number;
  };
  title?: string;
  onAddressConfirmed?: (address: GeorefAddress, validationResult: AddressValidationResult) => void;
}

interface QuilmesStreet {
  id: string;
  nombre: string;
  categoria: string;
}

interface QuilmesDepartment {
  id: string;
  nombre: string;
  centroide: {
    lat: number;
    lon: number;
  };
}


export const AddressSearchSelector: React.FC<AddressSearchSelectorProps> = ({
  deliveryZoneConfig,
  title = "Buscar y Seleccionar Dirección",
  onAddressConfirmed
}) => {
  const [currentQuery, setCurrentQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  
  // SINGLE INSTANCE of useAddressSearch hook - this is the key fix!
  const { 
    addresses, 
    loading: searchLoading, 
    error: searchError,
    lastQuery,
    searchAddresses
  } = useAddressSearch();
  
  const { 
    selectedAddress, 
    selectAddress, 
    clearSelection 
  } = useAddressSelection({ 
    deliveryZoneConfig,
    onAddressSelected: (result) => {
      setShowResults(false);
      onAddressConfirmed?.(result.address, result.validationResult);
    }
  });

  const handleSearch = (query: string) => {
    console.log('🔍 Parent search triggered with query:', query); // Debug log
    setCurrentQuery(query);
    setShowResults(query.length >= 3);
    
    // Call searchAddresses directly from the parent's hook instance
    if (query.length >= 3) {
      console.log('🎯 Calling searchAddresses from parent with:', query);
      searchAddresses(query, 10);
    }
  };

  const handleAddressSelect = async (address: GeorefAddress) => {
    console.log('🎯 Address selected:', address); // Debug log
    await selectAddress(address);
  };

  const handleClearAll = () => {
    setCurrentQuery('');
    setShowResults(false);
    clearSelection();
  };

  // Test API directly with specific Quilmes searches
  const testQuilmesSearch = async (testQuery: string, context: string = "") => {
    console.log(`🔍 Testing Quilmes search: "${testQuery}" ${context}`);
    try {
      // Test multiple search strategies
      const searches = [
        { url: `https://apis.datos.gob.ar/georef/api/direcciones?direccion=${encodeURIComponent(testQuery)}&max=10`, desc: "Sin filtros" },
        { url: `https://apis.datos.gob.ar/georef/api/direcciones?direccion=${encodeURIComponent(testQuery)}&provincia=buenos%20aires&max=10`, desc: "Con provincia" },
        { url: `https://apis.datos.gob.ar/georef/api/direcciones?direccion=${encodeURIComponent(testQuery)}&departamento=quilmes&max=10`, desc: "Con departamento" },
        { url: `https://apis.datos.gob.ar/georef/api/direcciones?direccion=${encodeURIComponent(testQuery)}&provincia=buenos%20aires&departamento=quilmes&max=10`, desc: "Con provincia y departamento" }
      ];
      
      const results = [];
      
      for (const search of searches) {
        console.log(`🔗 ${search.desc}: ${search.url}`);
        
        const response = await fetch(search.url);
        const data = await response.json();
        
        results.push({
          strategy: search.desc,
          count: data.cantidad || 0,
          total: data.total || 0,
          addresses: data.direcciones || []
        });
        
        console.log(`📋 ${search.desc}: ${data.cantidad || 0} resultados`);
      }
      
      // Show comprehensive results
      let message = `Resultados para "${testQuery}":\n`;
      results.forEach(result => {
        message += `\n${result.strategy}: ${result.count} direcciones`;
        if (result.addresses.length > 0) {
          message += `\n  Ejemplo: ${result.addresses[0].nomenclatura}`;
        }
      });
      
      alert(message);
      
    } catch (error) {
      console.error('❌ Quilmes Test Error:', error);
      alert(`❌ Error en test de Quilmes: ${error}`);
    }
  };

  // Test if Quilmes department exists
  const testQuilmesDepartment = async () => {
    console.log('🏛️ Testing if Quilmes department exists');
    try {
      const url = 'https://apis.datos.gob.ar/georef/api/departamentos?provincia=buenos%20aires&nombre=quilmes';
      console.log('🔗 Department URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('📋 Department data:', data);
      
      if (data.cantidad > 0) {
        const dept: QuilmesDepartment = data.departamentos[0];
        alert(`✅ Departamento Quilmes encontrado!\nID: ${dept.id}\nNombre: ${dept.nombre}\nCentro: ${dept.centroide.lat}, ${dept.centroide.lon}`);
      } else {
        alert('❌ Departamento Quilmes NO encontrado en la API');
      }
    } catch (error) {
      console.error('❌ Department Test Error:', error);
      alert(`❌ Error buscando departamento: ${error}`);
    }
  };

  // Test streets in Quilmes
  const testQuilmesStreets = async () => {
    console.log('🛣️ Testing streets in Quilmes');
    try {
      const url = 'https://apis.datos.gob.ar/georef/api/calles?departamento=quilmes&provincia=buenos%20aires&max=20';
      console.log('🔗 Streets URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('📋 Streets data:', data);
      
      if (data.cantidad > 0) {
        let message = `✅ ${data.cantidad} calles encontradas en Quilmes:\n`;
        data.calles.slice(0, 5).forEach((calle: QuilmesStreet) => {
          message += `\n• ${calle.nombre} (${calle.categoria})`;
        });
        if (data.cantidad > 5) {
          message += `\n... y ${data.cantidad - 5} más`;
        }
        alert(message);
      } else {
        alert('❌ No se encontraron calles en Quilmes');
      }
    } catch (error) {
      console.error('❌ Streets Test Error:', error);
      alert(`❌ Error buscando calles: ${error}`);
    }
  };

  // Debug info - can be removed in production
  console.log('🎛️ AddressSearchSelector state:', {
    currentQuery,
    showResults,
    addresses: addresses.length,
    searchLoading,
    searchError,
    lastQuery,
    selectedAddress: !!selectedAddress
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">
          Busca tu dirección y selecciona la correcta de la lista
        </p>
      </div>

      {/* Search Input - now just a controlled input without its own hook */}
      <div className="flex justify-center mb-4">
        <AddressSearchInputSimple
          onSearch={handleSearch}
          loading={searchLoading}
          placeholder="Buscar dirección (ej: Gutierrez 2444)"
        />
      </div>

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
          <strong>Debug Info:</strong><br/>
          Query: {currentQuery} | Show Results: {showResults.toString()} | 
          Addresses: {addresses.length} | Loading: {searchLoading.toString()} | 
          Error: {searchError || 'none'} | Last Query: {lastQuery}
          
          <div className="mt-2 space-x-1 space-y-1">
            {/* Basic tests */}
            <button 
              onClick={() => testQuilmesSearch('corrientes 1234')}
              className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
            >
              Test: Corrientes 1234
            </button>
            <button 
              onClick={() => testQuilmesSearch('santa fe 2000')}
              className="px-2 py-1 bg-green-500 text-white text-xs rounded"
            >
              Test: Santa Fe 2000
            </button>
            
            {/* Quilmes specific tests */}
            <button 
              onClick={() => testQuilmesSearch('gutierrez 2444')}
              className="px-2 py-1 bg-purple-500 text-white text-xs rounded"
            >
              Test: Gutierrez 2444
            </button>
            <button 
              onClick={() => testQuilmesSearch('rivadavia 100')}
              className="px-2 py-1 bg-orange-500 text-white text-xs rounded"
            >
              Test: Rivadavia 100
            </button>
            <button 
              onClick={() => testQuilmesSearch('mitre 500')}
              className="px-2 py-1 bg-pink-500 text-white text-xs rounded"
            >
              Test: Mitre 500
            </button>
            
            {/* Quilmes infrastructure tests */}
            <button 
              onClick={testQuilmesDepartment}
              className="px-2 py-1 bg-red-500 text-white text-xs rounded"
            >
              Check: Depto Quilmes
            </button>
            <button 
              onClick={testQuilmesStreets}
              className="px-2 py-1 bg-indigo-500 text-white text-xs rounded"
            >
              Check: Calles Quilmes
            </button>
            
            {/* Hook test */}
            <button 
              onClick={() => handleSearch('corrientes 1234')}
              className="px-2 py-1 bg-gray-600 text-white text-xs rounded"
            >
              Hook Test: Corrientes
            </button>
          </div>
        </div>
      )}

      {/* Results List */}
      {showResults && (
        <div className="flex justify-center mb-6">
          <AddressResultsList
            addresses={addresses}
            onAddressSelect={handleAddressSelect}
            loading={searchLoading}
            error={searchError}
            lastQuery={lastQuery}
            emptyMessage="No se encontraron direcciones. Intenta con una búsqueda diferente."
          />
        </div>
      )}

      {/* Selected Address Validation */}
      {selectedAddress && (
        <div className="mb-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Dirección Seleccionada:
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-medium text-blue-900">
                {selectedAddress.address.nomenclatura}
              </p>
              <p className="text-sm text-blue-700">
                📍 {selectedAddress.address.localidad_censal?.nombre}, {selectedAddress.address.departamento?.nombre}, {selectedAddress.address.provincia?.nombre}
              </p>
            </div>
          </div>
          
          <ValidationResult
            result={selectedAddress.validationResult}
            onClear={handleClearAll}
          />
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p className="mb-2">
          💡 <strong>Tip:</strong> Escribe solo calle y altura (ej: Gutierrez 2444) para mejores resultados
        </p>
        <p className="mb-2">
          🧪 <strong>Prueba con:</strong> Corrientes 1234, Santa Fe 2000, Florida 500
        </p>
        <p>
          Utilizamos el servicio oficial de normalización de direcciones del gobierno argentino
        </p>
      </div>
    </div>
  );
};

// Simple controlled input component without its own hook
interface AddressSearchInputSimpleProps {
  onSearch: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
}

const AddressSearchInputSimple: React.FC<AddressSearchInputSimpleProps> = ({
  onSearch,
  loading = false,
  placeholder = "Buscar dirección"
}) => {
  const [query, setQuery] = useState('');
  const debounceRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  React.useEffect(() => {
    console.log('🎯 Simple input effect triggered with query:', query);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      console.log('⏰ Simple input debounce finished, calling onSearch with:', query);
      onSearch(query);
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    console.log('⌨️ Simple input changed to:', newQuery);
    setQuery(newQuery);
  };

  const clearInput = () => {
    console.log('🧹 Simple input clearing');
    setQuery('');
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {loading ? (
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          ) : query && (
            <button
              onClick={clearInput}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      <p className="mt-1 text-sm text-gray-600">
        Escribe al menos 3 caracteres para buscar
      </p>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-1 text-xs text-gray-500">
          Simple Input Debug: {query} | Length: {query.length} | Loading: {loading.toString()}
        </div>
      )}
    </div>
  );
};