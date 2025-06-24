// pages/ejemplos-uso.tsx
"use client";
import React, { useState } from 'react';
import { AutocompletadoCallesQuilmes } from '@/components/geo/AutocompletadoCallesQuilmes';
import { ListaCallesPaginada } from '@/components/geo/ListaCallesPaginada';
import { FormularioDireccionCompleto } from '@/components/geo/FormularioDireccionCompleto';
import { CalleGeoRef } from '@/services/georefService';

interface DireccionCompleta {
  calle: CalleGeoRef | null;
  numero: string;
  piso?: string;
  departamento?: string;
  entreCalle1?: string;
  entreCalle2?: string;
  observaciones?: string;
  coordenadas?: {
    latitud: number;
    longitud: number;
  };
}


const EjemplosUsoGeoRef: React.FC = () => {
  const [calleSeleccionada, setCalleSeleccionada] = useState<CalleGeoRef | null>(null);
  const [direccionCompleta, setDireccionCompleta] = useState<DireccionCompleta | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');
  const [terminoBusqueda, setTerminoBusqueda] = useState<string>('');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Ejemplos de Uso - GeoRef API Quilmes
      </h1>

      {/* Ejemplo 1: Autocompletado básico */}
      <section className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">
          1. Búsqueda básica de calles
        </h2>
        <AutocompletadoCallesQuilmes
          onSeleccionarCalle={setCalleSeleccionada}
          placeholder="Buscar cualquier calle en Quilmes..."
          className="mb-4"
        />
        {calleSeleccionada && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h3 className="font-medium text-blue-800">Calle seleccionada:</h3>
            <p className="text-blue-700">
              {calleSeleccionada.nombre} ({calleSeleccionada.categoria}) - ID: {calleSeleccionada.id}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              {calleSeleccionada.nomenclatura}
            </p>
          </div>
        )}
      </section>

      {/* Ejemplo 2: Búsqueda por categoría */}
      <section className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">
          2. Búsqueda de avenidas específicamente
        </h2>
        <AutocompletadoCallesQuilmes
          onSeleccionarCalle={(calle) => console.log('Avenida seleccionada:', calle)}
          categoria="avenida"
          placeholder="Buscar avenidas en Quilmes..."
          className="mb-4"
        />
      </section>

      {/* Ejemplo 3: Lista paginada con filtros */}
      <section className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">
          3. Lista completa con filtros y paginación
        </h2>
        
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Filtrar por nombre..."
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          />
          
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Todas las categorías</option>
            <option value="calle">Calles</option>
            <option value="avenida">Avenidas</option>
            <option value="pasaje">Pasajes</option>
            <option value="ruta">Rutas</option>
          </select>
        </div>
        
        <ListaCallesPaginada
          terminoBusqueda={terminoBusqueda}
          filtroCategoria={filtroCategoria}
          onSeleccionarCalle={(calle) => console.log('Seleccionada desde lista:', calle)}
          className="max-h-96 overflow-auto"
          usarScrollInfinito={true}
        />
      </section>

      {/* Ejemplo 4: Formulario completo de dirección */}
      <section className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">
          4. Formulario completo de dirección
        </h2>
        <FormularioDireccionCompleto
          onDireccionCompleta={setDireccionCompleta}
          mostrarCamposOpcionales={true}
          validarNumeracion={true}
        />
        {direccionCompleta?.calle && direccionCompleta?.numero && (
          <div className="mt-4 p-4 bg-green-50 rounded-md">
            <h3 className="font-medium text-green-800">Dirección procesada:</h3>
            <pre className="text-sm text-green-700 mt-2">
              {JSON.stringify(direccionCompleta, null, 2)}
            </pre>
          </div>
        )}
      </section>

      {/* Ejemplo 5: Casos de uso específicos */}
      <section className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">
          5. Casos de uso específicos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Validación de direcciones de entrega</h3>
            <AutocompletadoCallesQuilmes
              onSeleccionarCalle={(calle) => {
                // Lógica específica para validar zona de entrega
                const zonasValidas = ['calle', 'avenida'];
                if (zonasValidas.includes(calle.categoria.toLowerCase())) {
                  console.log('✅ Dirección válida para entrega');
                } else {
                  console.log('❌ Zona no disponible para entrega');
                }
              }}
              placeholder="Verificar dirección de entrega..."
            />
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Búsqueda para servicios de emergencia</h3>
            <AutocompletadoCallesQuilmes
              onSeleccionarCalle={(calle) => {
                // Información adicional para servicios de emergencia
                console.log('🚨 Calle para emergencia:', {
                  nombre: calle.nombre,
                  categoria: calle.categoria,
                  coordenadas: calle.geometria,
                  numeracion: calle.altura
                });
              }}
              placeholder="Localizar para emergencia..."
              mostrarNomenclatura={true}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default EjemplosUsoGeoRef;