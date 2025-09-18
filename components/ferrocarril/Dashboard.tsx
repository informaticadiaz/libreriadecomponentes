// components/Dashboard.tsx
import React from 'react';
import { Package, Calendar, Wrench, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import type { DashboardProps } from './types';

const Dashboard: React.FC<DashboardProps> = ({ estadisticas, materiales }) => {
  const materialesStockBajo = materiales.filter(m => m.stock < 5 && m.stock > 0);
  const materialesSinStock = materiales.filter(m => m.stock === 0);
  const materialesStockOk = materiales.filter(m => m.stock >= 5);

  // Estadísticas adicionales
  const categoriasMasUsadas = materiales.reduce((acc, material) => {
    acc[material.categoria] = (acc[material.categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategorias = Object.entries(categoriasMasUsadas)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Tarjetas de métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Materiales</p>
              <p className="text-3xl font-bold text-blue-900">{estadisticas.totalMateriales}</p>
              <p className="text-xs text-blue-500 mt-1">
                {materialesStockOk.length} con stock normal
              </p>
            </div>
            <Package className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Stock Bajo</p>
              <p className="text-3xl font-bold text-yellow-900">{estadisticas.stockBajo}</p>
              <p className="text-xs text-yellow-600 mt-1">
                {((estadisticas.stockBajo / estadisticas.totalMateriales) * 100).toFixed(1)}% del total
              </p>
            </div>
            <Wrench className="h-10 w-10 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Sin Stock</p>
              <p className="text-3xl font-bold text-red-900">{estadisticas.sinStock}</p>
              <p className="text-xs text-red-600 mt-1">
                Requieren reposición urgente
              </p>
            </div>
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Partes Hoy</p>
              <p className="text-3xl font-bold text-green-900">{estadisticas.partesHoy}</p>
              <p className="text-xs text-green-600 mt-1">
                Trabajos registrados
              </p>
            </div>
            <Calendar className="h-10 w-10 text-green-600" />
          </div>
        </div>
      </div>

      {/* Sección de alertas críticas */}
      {(estadisticas.sinStock > 0 || estadisticas.stockBajo > 5) && (
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-orange-600 mr-2" />
            <h3 className="text-lg font-semibold text-orange-900">Alertas de Stock</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {estadisticas.sinStock > 0 && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">🚨 Materiales agotados ({estadisticas.sinStock})</h4>
                <p className="text-sm text-red-600">Reposición inmediata necesaria</p>
              </div>
            )}
            {estadisticas.stockBajo > 5 && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">⚠️ Stock bajo crítico ({estadisticas.stockBajo})</h4>
                <p className="text-sm text-yellow-600">Planificar reposición próxima</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Materiales con stock bajo */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Materiales con Stock Bajo</h3>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              {materialesStockBajo.length}
            </span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {materialesStockBajo.slice(0, 10).map(material => (
              <div key={material.id} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-sm">{material.codigo}</p>
                  <p className="text-xs text-gray-600 line-clamp-2">{material.descripcion}</p>
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mt-1">
                    {material.categoria}
                  </span>
                </div>
                <div className="text-right">
                  <span className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded text-sm font-bold">
                    {material.stock}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">unidades</p>
                </div>
              </div>
            ))}
            {materialesStockBajo.length === 0 && (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-2" />
                <p className="text-gray-500">¡Excelente! No hay materiales con stock bajo</p>
              </div>
            )}
            {materialesStockBajo.length > 10 && (
              <p className="text-center text-sm text-gray-500 py-2">
                ... y {materialesStockBajo.length - 10} materiales más
              </p>
            )}
          </div>
        </div>

        {/* Materiales sin stock */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Materiales Sin Stock</h3>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {materialesSinStock.length}
            </span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {materialesSinStock.slice(0, 8).map(material => (
              <div key={material.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-sm">{material.codigo}</p>
                  <p className="text-xs text-gray-600 line-clamp-2">{material.descripcion}</p>
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mt-1">
                    {material.categoria}
                  </span>
                </div>
                <div className="text-right">
                  <span className="bg-red-200 text-red-900 px-3 py-1 rounded text-sm font-bold">
                    AGOTADO
                  </span>
                </div>
              </div>
            ))}
            {materialesSinStock.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-green-400 mx-auto mb-2" />
                <p className="text-gray-500">¡Perfecto! Todos los materiales tienen stock</p>
              </div>
            )}
            {materialesSinStock.length > 8 && (
              <p className="text-center text-sm text-gray-500 py-2">
                ... y {materialesSinStock.length - 8} materiales más
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Estadísticas por categoría */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Top Categorías por Cantidad</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topCategorias.map(([categoria, cantidad], index) => (
            <div key={categoria} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">#{index + 1}</p>
                  <p className="font-semibold text-indigo-900">{categoria}</p>
                  <p className="text-xs text-indigo-600">{cantidad} materiales</p>
                </div>
                <div className="text-right">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-indigo-600">{cantidad}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen de salud del stock */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Estado General del Stock</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Stock Normal</span>
            <div className="flex items-center">
              <div className="w-48 bg-gray-200 rounded-full h-2 mr-3">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(materialesStockOk.length / estadisticas.totalMateriales) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">{materialesStockOk.length}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Stock Bajo</span>
            <div className="flex items-center">
              <div className="w-48 bg-gray-200 rounded-full h-2 mr-3">
                <div 
                  className="bg-yellow-600 h-2 rounded-full" 
                  style={{ width: `${(estadisticas.stockBajo / estadisticas.totalMateriales) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">{estadisticas.stockBajo}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Sin Stock</span>
            <div className="flex items-center">
              <div className="w-48 bg-gray-200 rounded-full h-2 mr-3">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${(estadisticas.sinStock / estadisticas.totalMateriales) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">{estadisticas.sinStock}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;