"use client"
import React, { useState } from 'react';
import { BarChart3, FileText, Package, Settings } from 'lucide-react';

// Importar componentes
import Dashboard from './Dashboard';
import ParteDiario from './ParteDiario';
import Stock from './Stock';

// Importar hooks y tipos
import { usePaniol } from './usePaniol';
import type { VistaActual } from './types';

const PaniolFerroviario: React.FC = () => {
  const [vistaActual, setVistaActual] = useState<VistaActual>('dashboard');

  // Hook personalizado que maneja todo el estado
  const {
    materiales,
    partesDiarios,
    configuracion,
    estadisticas,
    agregarParteDiario,
    eliminarParteDiario
  } = usePaniol();

  const handleVistaChange = (vista: VistaActual): void => {
    setVistaActual(vista);
  };

  // Configuración de navegación
  const navegacion = [
    {
      id: 'dashboard' as VistaActual,
      nombre: 'Dashboard',
      icono: BarChart3,
      descripcion: 'Vista general y estadísticas'
    },
    {
      id: 'parte-diario' as VistaActual,
      nombre: 'Parte Diario',
      icono: FileText,
      descripcion: 'Registro de trabajos y materiales'
    },
    {
      id: 'stock' as VistaActual,
      nombre: 'Stock',
      icono: Package,
      descripcion: 'Gestión de inventario'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header principal */}
      <header className="text-white p-4 shadow-lg bg-blue-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 rounded-lg mr-4">
              <Settings className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Sistema Pañol Eléctrico Ferroviario</h1>
              <p className="text-blue-200 text-sm">Gestión de materiales y partes diarios</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-blue-200 text-sm">📍 Berazategui, Buenos Aires</p>
              <p className="text-white font-medium">{new Date().toLocaleDateString('es-AR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p className="text-blue-300 text-sm">
                {materiales.length} materiales • {partesDiarios.length} partes registrados
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Navegación */}
      <nav className="bg-blue-800 text-white shadow-lg">
        <div className="px-4 py-2">
          <div className="flex space-x-1">
            {navegacion.map(({ id, nombre, icono: Icono, descripcion }) => (
              <button
                key={id}
                onClick={() => handleVistaChange(id)}
                className={`
                  flex items-center px-6 py-3 rounded-t-lg transition-all duration-200 relative
                  ${vistaActual === id 
                    ? 'bg-white text-blue-900 shadow-lg' 
                    : 'bg-blue-700 hover:bg-blue-600 text-white'
                  }
                `}
                type="button"
                title={descripcion}
              >
                <Icono className="h-5 w-5 mr-2" />
                <span className="font-medium">{nombre}</span>
                {vistaActual === id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-b-lg"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Área de contenido principal */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Indicador de vista actual */}
          <div className="mb-6">
            <div className="flex items-center gap-3 text-gray-600">
              {(() => {
                const vistaActiva = navegacion.find(nav => nav.id === vistaActual);
                if (vistaActiva) {
                  const IconoActivo = vistaActiva.icono;
                  return (
                    <>
                      <IconoActivo className="h-5 w-5" />
                      <span className="text-lg font-medium">{vistaActiva.nombre}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm">{vistaActiva.descripcion}</span>
                    </>
                  );
                }
                return null;
              })()}
            </div>
          </div>

          {/* Renderizado condicional de componentes */}
          {vistaActual === 'dashboard' && (
            <Dashboard 
              estadisticas={estadisticas} 
              materiales={materiales} 
            />
          )}
          
          {vistaActual === 'parte-diario' && (
            <ParteDiario 
              materiales={materiales}
              configuracion={configuracion}
              partesDiarios={partesDiarios}
              onAgregarParte={agregarParteDiario}
              onEliminarParte={eliminarParteDiario}
            />
          )}
          
          {vistaActual === 'stock' && (
            <Stock 
              materiales={materiales}
              configuracion={configuracion}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-white p-4 mt-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm">Sistema Pañol Eléctrico Ferroviario v2.0</p>
            <p className="text-xs text-gray-400">Trenes Argentinos - Berazategui</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Sistema Activo</span>
              </div>
              <span className="text-gray-400">|</span>
              <span>Última actualización: {new Date().toLocaleTimeString('es-AR')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PaniolFerroviario;