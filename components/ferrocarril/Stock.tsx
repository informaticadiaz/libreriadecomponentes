// components/Stock.tsx
import React, { useState, useMemo } from 'react';
import { Search, Package, Filter, Download, BarChart3, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import type { StockProps, EstadoStock } from './types';

const Stock: React.FC<StockProps> = ({ materiales, configuracion }) => {
  const [busqueda, setBusqueda] = useState<string>('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('');
  const [estadoFiltro, setEstadoFiltro] = useState<string>('');
  const [ordenarPor, setOrdenarPor] = useState<'codigo' | 'stock' | 'categoria'>('codigo');

  // Función para obtener estado del stock
  const getEstadoStock = (stock: number): EstadoStock => {
    if (stock === 0) return { texto: 'Sin Stock', estilo: 'bg-red-100 text-red-800 border-red-300' };
    if (stock < 5) return { texto: 'Stock Bajo', estilo: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    return { texto: 'OK', estilo: 'bg-green-100 text-green-800 border-green-300' };
  };

  // Filtrar y ordenar materiales
  const materialesFiltrados = useMemo(() => {
    const filtered = materiales.filter(material => {
      const coincideBusqueda = material.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
                              material.codigo.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = !categoriaFiltro || material.categoria === categoriaFiltro;
      
      let coincideEstado = true;
      if (estadoFiltro) {
        switch (estadoFiltro) {
          case 'sin-stock':
            coincideEstado = material.stock === 0;
            break;
          case 'stock-bajo':
            coincideEstado = material.stock > 0 && material.stock < 5;
            break;
          case 'stock-ok':
            coincideEstado = material.stock >= 5;
            break;
        }
      }
      
      return coincideBusqueda && coincideCategoria && coincideEstado;
    });

    // Ordenar
    filtered.sort((a, b) => {
      switch (ordenarPor) {
        case 'stock':
          return a.stock - b.stock;
        case 'categoria':
          return a.categoria.localeCompare(b.categoria) || a.codigo.localeCompare(b.codigo);
        default:
          return a.codigo.localeCompare(b.codigo);
      }
    });

    return filtered;
  }, [materiales, busqueda, categoriaFiltro, estadoFiltro, ordenarPor]);

  // Estadísticas calculadas
  const estadisticas = useMemo(() => ({
    total: materialesFiltrados.length,
    sinStock: materialesFiltrados.filter(m => m.stock === 0).length,
    stockBajo: materialesFiltrados.filter(m => m.stock > 0 && m.stock < 5).length,
    stockOk: materialesFiltrados.filter(m => m.stock >= 5).length,
    stockTotal: materialesFiltrados.reduce((sum, m) => sum + m.stock, 0),
    valorPromedio: materialesFiltrados.length > 0 ? 
      (materialesFiltrados.reduce((sum, m) => sum + m.stock, 0) / materialesFiltrados.length).toFixed(1) : '0'
  }), [materialesFiltrados]);

  const limpiarFiltros = () => {
    setBusqueda('');
    setCategoriaFiltro('');
    setEstadoFiltro('');
  };

  const exportarDatos = () => {
    // Generar CSV simple
    const headers = ['Código SAP', 'Descripción', 'Categoría', 'Stock', 'Estado'];
    const csvContent = [
      headers.join(','),
      ...materialesFiltrados.map(material => [
        material.codigo,
        `"${material.descripcion.replace(/"/g, '""')}"`,
        material.categoria,
        material.stock,
        getEstadoStock(material.stock).texto
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-paniol-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado y estadísticas rápidas */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            <Package className="h-6 w-6 mr-2 text-blue-600" />
            Gestión de Stock
          </h3>
          <button
            onClick={exportarDatos}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </button>
        </div>
        
        {/* Estadísticas principales */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center border">
            <div className="text-2xl font-bold text-blue-900">{estadisticas.total}</div>
            <div className="text-sm text-blue-600">Total Filtrado</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center border">
            <div className="text-2xl font-bold text-green-900">{estadisticas.stockOk}</div>
            <div className="text-sm text-green-600">Stock OK</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center border">
            <div className="text-2xl font-bold text-yellow-900">{estadisticas.stockBajo}</div>
            <div className="text-sm text-yellow-600">Stock Bajo</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center border">
            <div className="text-2xl font-bold text-red-900">{estadisticas.sinStock}</div>
            <div className="text-sm text-red-600">Sin Stock</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center border">
            <div className="text-2xl font-bold text-purple-900">{estadisticas.stockTotal}</div>
            <div className="text-sm text-purple-600">Total Unidades</div>
          </div>
        </div>

        {/* Alertas críticas */}
        {(estadisticas.sinStock > 0 || estadisticas.stockBajo > 10) && (
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-400 mr-2" />
              <div>
                <p className="text-orange-800 font-medium">Atención requerida</p>
                <p className="text-orange-700 text-sm">
                  {estadisticas.sinStock > 0 && `${estadisticas.sinStock} materiales sin stock`}
                  {estadisticas.sinStock > 0 && estadisticas.stockBajo > 10 && ' • '}
                  {estadisticas.stockBajo > 10 && `${estadisticas.stockBajo} materiales con stock crítico`}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Buscar material</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Código o descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {configuracion.categorias.map(categoria => (
                <option key={categoria.id} value={categoria.nombre}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="sin-stock">Sin Stock</option>
              <option value="stock-bajo">Stock Bajo</option>
              <option value="stock-ok">Stock OK</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ordenar por</label>
            <select
              value={ordenarPor}
              onChange={(e) => setOrdenarPor(e.target.value as 'codigo' | 'stock' | 'categoria')}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="codigo">Código SAP</option>
              <option value="stock">Stock (menor a mayor)</option>
              <option value="categoria">Categoría</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={limpiarFiltros}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Limpiar
            </button>
          </div>
        </div>

        {/* Tabla de materiales */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-3 text-left font-semibold">Código SAP</th>
                <th className="border border-gray-300 p-3 text-left font-semibold">Descripción</th>
                <th className="border border-gray-300 p-3 text-left font-semibold">Categoría</th>
                <th className="border border-gray-300 p-3 text-center font-semibold">Stock</th>
                <th className="border border-gray-300 p-3 text-center font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {materialesFiltrados.slice(0, 100).map(material => {
                const estadoStock = getEstadoStock(material.stock);
                return (
                  <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                    <td className="border border-gray-300 p-3 font-mono text-sm">
                      {material.codigo}
                    </td>
                    <td className="border border-gray-300 p-3 text-sm">
                      <div className="line-clamp-2">{material.descripcion}</div>
                    </td>
                    <td className="border border-gray-300 p-3">
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {material.categoria}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-3 text-center font-semibold text-lg">
                      <div className="flex items-center justify-center">
                        {material.stock === 0 && <TrendingDown className="h-4 w-4 text-red-500 mr-1" />}
                        {material.stock > 0 && material.stock < 5 && <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />}
                        {material.stock >= 5 && <TrendingUp className="h-4 w-4 text-green-500 mr-1" />}
                        {material.stock}
                      </div>
                    </td>
                    <td className="border border-gray-300 p-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${estadoStock.estilo}`}>
                        {estadoStock.texto}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Footer de la tabla */}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600 border-t pt-4">
          <div className="flex items-center gap-4">
            <span>
              Mostrando {Math.min(100, materialesFiltrados.length)} de {materialesFiltrados.length} materiales
            </span>
            {materialesFiltrados.length > 100 && (
              <span className="text-orange-600 font-medium">
                ⚠️ Se muestran solo los primeros 100 resultados
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-1" />
              Promedio: {estadisticas.valorPromedio} un.
            </span>
            <span>Total: {estadisticas.stockTotal} unidades</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stock;