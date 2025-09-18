"use client"
import React, { useState } from 'react';
import { Search, Plus, FileText, Package, Calendar, User, MapPin, Wrench } from 'lucide-react';

// Importar tipos
import type {
  Material,
  ParteDiario,
  NuevoParteDiario,
  Estadisticas,
  DashboardProps,
  ParteDiarioProps,
  StockProps,
  VistaActual,
  EstadoStock,
  FormChangeEvent,
  DatosPaniol
} from './types';

// Importar datos
import datosPaniol from './datos-paniol.json';

const ComponenteDashboard: React.FC<DashboardProps> = ({ estadisticas, materiales }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 text-sm font-medium">Total Materiales</p>
            <p className="text-2xl font-bold text-blue-900">{estadisticas.totalMateriales}</p>
          </div>
          <Package className="h-8 w-8 text-blue-600" />
        </div>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-yellow-600 text-sm font-medium">Stock Bajo</p>
            <p className="text-2xl font-bold text-yellow-900">{estadisticas.stockBajo}</p>
          </div>
          <Wrench className="h-8 w-8 text-yellow-600" />
        </div>
      </div>
      
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-600 text-sm font-medium">Sin Stock</p>
            <p className="text-2xl font-bold text-red-900">{estadisticas.sinStock}</p>
          </div>
          <FileText className="h-8 w-8 text-red-600" />
        </div>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-600 text-sm font-medium">Partes Hoy</p>
            <p className="text-2xl font-bold text-green-900">{estadisticas.partesHoy}</p>
          </div>
          <Calendar className="h-8 w-8 text-green-600" />
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Materiales con Stock Bajo</h3>
      <div className="space-y-2">
        {materiales.filter(m => m.stock < 5 && m.stock > 0).slice(0, 5).map(material => (
          <div key={material.id} className="flex justify-between items-center p-3 bg-yellow-50 rounded">
            <div>
              <p className="font-medium">{material.codigo}</p>
              <p className="text-sm text-gray-600">{material.descripcion}</p>
            </div>
            <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-sm">
              Stock: {material.stock}
            </span>
          </div>
        ))}
        {materiales.filter(m => m.stock < 5 && m.stock > 0).length === 0 && (
          <p className="text-gray-500 text-center py-4">No hay materiales con stock bajo</p>
        )}
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Materiales Sin Stock</h3>
      <div className="space-y-2">
        {materiales.filter(m => m.stock === 0).slice(0, 3).map(material => (
          <div key={material.id} className="flex justify-between items-center p-3 bg-red-50 rounded">
            <div>
              <p className="font-medium">{material.codigo}</p>
              <p className="text-sm text-gray-600">{material.descripcion}</p>
            </div>
            <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-sm">
              Sin Stock
            </span>
          </div>
        ))}
        {materiales.filter(m => m.stock === 0).length === 0 && (
          <p className="text-gray-500 text-center py-4">Todos los materiales tienen stock</p>
        )}
      </div>
    </div>
  </div>
);

const ComponenteParteDiario: React.FC<ParteDiarioProps> = ({ 
  materiales, 
  configuracion, 
  partesDiarios, 
  onAgregarParte 
}) => {
  const [nuevoParte, setNuevoParte] = useState<NuevoParteDiario>({
    fecha: new Date().toISOString().split('T')[0],
    base: '',
    estacion: '',
    encargado: '',
    materiales: [],
    observaciones: ''
  });
  
  const [materialSeleccionado, setMaterialSeleccionado] = useState<string>('');
  const [cantidadMaterial, setCantidadMaterial] = useState<string>('');

  const agregarMaterial = (): void => {
    if (materialSeleccionado && cantidadMaterial) {
      const material = materiales.find(m => m.id === materialSeleccionado);
      const cantidad = parseInt(cantidadMaterial);
      
      if (material && cantidad > 0 && cantidad <= material.stock) {
        setNuevoParte(prev => ({
          ...prev,
          materiales: [...prev.materiales, {
            id: material.id,
            codigo: material.codigo,
            descripcion: material.descripcion,
            cantidad
          }]
        }));
        setMaterialSeleccionado('');
        setCantidadMaterial('');
      } else if (material && cantidad > material.stock) {
        alert(`Stock insuficiente. Stock disponible: ${material.stock}`);
      }
    }
  };

  const removerMaterial = (index: number): void => {
    setNuevoParte(prev => ({
      ...prev,
      materiales: prev.materiales.filter((_, i) => i !== index)
    }));
  };

  const guardarParte = (): void => {
    if (nuevoParte.base && nuevoParte.estacion && nuevoParte.encargado && nuevoParte.materiales.length > 0) {
      onAgregarParte(nuevoParte);
      
      // Resetear formulario
      setNuevoParte({
        fecha: new Date().toISOString().split('T')[0],
        base: '',
        estacion: '',
        encargado: '',
        materiales: [],
        observaciones: ''
      });
      
      alert('Parte diario guardado exitosamente');
    } else {
      alert('Complete todos los campos obligatorios y agregue al menos un material');
    }
  };

  const handleInputChange = (field: keyof Omit<NuevoParteDiario, 'materiales'>) => 
    (e: FormChangeEvent): void => {
      setNuevoParte(prev => ({ ...prev, [field]: e.target.value }));
    };

  const materialDisponible = materiales.find(m => m.id === materialSeleccionado);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Nuevo Parte Diario</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input
              type="date"
              value={nuevoParte.fecha}
              onChange={handleInputChange('fecha')}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Base</label>
            <select
              value={nuevoParte.base}
              onChange={handleInputChange('base')}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Seleccionar base</option>
              {configuracion.bases.map(base => (
                <option key={base.id} value={base.nombre}>{base.nombre}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Estación</label>
            <select
              value={nuevoParte.estacion}
              onChange={handleInputChange('estacion')}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Seleccionar estación</option>
              {configuracion.estaciones.map(estacion => (
                <option key={estacion.id} value={estacion.nombre}>{estacion.nombre}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Encargado</label>
            <select
              value={nuevoParte.encargado}
              onChange={handleInputChange('encargado')}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Seleccionar encargado</option>
              {configuracion.encargados.map(encargado => (
                <option key={encargado.id} value={encargado.apellido}>
                  {encargado.apellido}, {encargado.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Materiales Utilizados</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
            <select
              value={materialSeleccionado}
              onChange={(e) => setMaterialSeleccionado(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">Seleccionar material</option>
              {materiales.filter(m => m.stock > 0).map(material => (
                <option key={material.id} value={material.id}>
                  [{material.categoria}] {material.codigo} - {material.descripcion.slice(0, 30)}...
                </option>
              ))}
            </select>
            
            <input
              type="number"
              placeholder="Cantidad"
              value={cantidadMaterial}
              onChange={(e) => setCantidadMaterial(e.target.value)}
              className="p-2 border border-gray-300 rounded"
              min="1"
              max={materialDisponible?.stock || 1}
            />
            
            <div className="text-sm text-gray-600 p-2 flex items-center">
              {materialDisponible ? `Stock: ${materialDisponible.stock}` : 'Seleccione un material'}
            </div>
            
            <button
              onClick={agregarMaterial}
              type="button"
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!materialSeleccionado || !cantidadMaterial || (materialDisponible?.stock || 0) === 0}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {nuevoParte.materiales.length > 0 && (
            <div className="space-y-2 mb-4">
              <h5 className="font-medium">Materiales agregados:</h5>
              {nuevoParte.materiales.map((material, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="font-medium">{material.codigo}</p>
                    <p className="text-sm text-gray-600">{material.descripcion}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 px-2 py-1 rounded text-sm">
                      Cant: {material.cantidad}
                    </span>
                    <button
                      onClick={() => removerMaterial(index)}
                      type="button"
                      className="text-red-600 hover:text-red-800 px-2"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Observaciones</label>
          <textarea
            value={nuevoParte.observaciones}
            onChange={handleInputChange('observaciones')}
            className="w-full p-2 border border-gray-300 rounded h-20"
            placeholder="Observaciones adicionales sobre la tarea realizada..."
          />
        </div>

        <button
          onClick={guardarParte}
          type="button"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!nuevoParte.base || !nuevoParte.estacion || !nuevoParte.encargado || nuevoParte.materiales.length === 0}
        >
          Guardar Parte Diario
        </button>
      </div>

      {partesDiarios.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Historial de Partes ({partesDiarios.length})</h3>
          <div className="space-y-4">
            {partesDiarios.slice(-5).reverse().map(parte => (
              <div key={parte.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{parte.fecha} - {parte.base}</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="h-4 w-4 inline mr-1" />{parte.estacion} • 
                      <User className="h-4 w-4 inline mx-1" />{parte.encargado}
                    </p>
                  </div>
                </div>
                <div className="text-sm">
                  <strong>Materiales utilizados:</strong> {parte.materiales.length} ítems
                  <ul className="text-xs text-gray-600 mt-1">
                    {parte.materiales.slice(0, 3).map((mat, idx) => (
                      <li key={idx}>• {mat.codigo}: {mat.cantidad} un.</li>
                    ))}
                    {parte.materiales.length > 3 && (
                      <li>• ... y {parte.materiales.length - 3} más</li>
                    )}
                  </ul>
                </div>
                {parte.observaciones && (
                  <p className="text-sm text-gray-600 mt-1 italic">{parte.observaciones}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ComponenteStock: React.FC<StockProps> = ({ materiales, configuracion }) => {
  const [busqueda, setBusqueda] = useState<string>('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('');

  // Filtrar materiales
  const materialesFiltrados: Material[] = materiales.filter(material => {
    const coincideBusqueda = material.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
                            material.codigo.includes(busqueda);
    const coincideCategoria = !categoriaFiltro || material.categoria === categoriaFiltro;
    return coincideBusqueda && coincideCategoria;
  });

  const getEstadoStock = (stock: number): EstadoStock => {
    if (stock === 0) return { texto: 'Sin Stock', estilo: 'bg-red-100 text-red-800' };
    if (stock < 5) return { texto: 'Stock Bajo', estilo: 'bg-yellow-100 text-yellow-800' };
    return { texto: 'OK', estilo: 'bg-green-100 text-green-800' };
  };

  // Estadísticas de la vista
  const estadisticasStock = {
    total: materialesFiltrados.length,
    sinStock: materialesFiltrados.filter(m => m.stock === 0).length,
    stockBajo: materialesFiltrados.filter(m => m.stock > 0 && m.stock < 5).length,
    stockOk: materialesFiltrados.filter(m => m.stock >= 5).length
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Gestión de Stock</h3>
        
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded text-center">
            <div className="text-2xl font-bold text-blue-900">{estadisticasStock.total}</div>
            <div className="text-sm text-blue-600">Total</div>
          </div>
          <div className="bg-green-50 p-3 rounded text-center">
            <div className="text-2xl font-bold text-green-900">{estadisticasStock.stockOk}</div>
            <div className="text-sm text-green-600">Stock OK</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded text-center">
            <div className="text-2xl font-bold text-yellow-900">{estadisticasStock.stockBajo}</div>
            <div className="text-sm text-yellow-600">Stock Bajo</div>
          </div>
          <div className="bg-red-50 p-3 rounded text-center">
            <div className="text-2xl font-bold text-red-900">{estadisticasStock.sinStock}</div>
            <div className="text-sm text-red-600">Sin Stock</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Buscar material</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Código o descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Todas las categorías</option>
              {configuracion.categorias.map(categoria => (
                <option key={categoria.id} value={categoria.nombre}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => { setBusqueda(''); setCategoriaFiltro(''); }}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-2 text-left">Código SAP</th>
                <th className="border border-gray-300 p-2 text-left">Descripción</th>
                <th className="border border-gray-300 p-2 text-left">Categoría</th>
                <th className="border border-gray-300 p-2 text-center">Stock</th>
                <th className="border border-gray-300 p-2 text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {materialesFiltrados.slice(0, 50).map(material => {
                const estadoStock = getEstadoStock(material.stock);
                return (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2 font-mono text-sm">
                      {material.codigo}
                    </td>
                    <td className="border border-gray-300 p-2 text-sm">
                      {material.descripcion}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {material.categoria}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-2 text-center font-semibold">
                      {material.stock}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${estadoStock.estilo}`}>
                        {estadoStock.texto}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-sm text-gray-600 flex justify-between">
          <span>
            Mostrando {Math.min(50, materialesFiltrados.length)} de {materialesFiltrados.length} materiales
          </span>
          {materialesFiltrados.length > 50 && (
            <span className="text-orange-600">
              Se muestran solo los primeros 50 resultados
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const PaniolFerroviario: React.FC = () => {
  const [vistaActual, setVistaActual] = useState<VistaActual>('dashboard');
  const [partesDiarios, setPartesDiarios] = useState<ParteDiario[]>([]);
  const [materiales, setMateriales] = useState<Material[]>(
    (datosPaniol as DatosPaniol).materiales
  );

  // Estadísticas del dashboard
  const estadisticas: Estadisticas = {
    totalMateriales: materiales.length,
    stockBajo: materiales.filter(m => m.stock < 5 && m.stock > 0).length,
    sinStock: materiales.filter(m => m.stock === 0).length,
    partesHoy: partesDiarios.filter(p => {
      const hoy = new Date().toISOString().split('T')[0];
      return p.fecha === hoy;
    }).length
  };

  const handleAgregarParte = (parte: NuevoParteDiario): void => {
    const nuevoParte: ParteDiario = {
      ...parte,
      id: Date.now()
    };
    
    setPartesDiarios(prev => [...prev, nuevoParte]);
    
    // Actualizar stock
    setMateriales(prev => prev.map(material => {
      const materialUsado = parte.materiales.find(m => m.id === material.id);
      if (materialUsado) {
        return { ...material, stock: Math.max(0, material.stock - materialUsado.cantidad) };
      }
      return material;
    }));
  };

  const handleVistaChange = (vista: VistaActual): void => {
    setVistaActual(vista);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Sistema Pañol Eléctrico Ferroviario</h1>
          <div className="text-right">
            <p className="text-blue-200">Berazategui - {new Date().toLocaleDateString('es-AR')}</p>
            <p className="text-blue-300 text-sm">{materiales.length} materiales registrados</p>
          </div>
        </div>
      </header>

      <nav className="bg-blue-800 text-white p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => handleVistaChange('dashboard')}
            className={`px-4 py-2 rounded transition-colors bg-blue-500 ${
              vistaActual === 'dashboard' ? 'bg-blue-600' : 'hover:bg-blue-700'
            }`}
            type="button"
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => handleVistaChange('parte-diario')}
            className={`px-4 py-2 rounded transition-colors bg-blue-500 ${
              vistaActual === 'parte-diario' ? 'bg-blue-600' : 'hover:bg-blue-700'
            }`}
            type="button"
          >
            📝 Parte Diario
          </button>
          <button
            onClick={() => handleVistaChange('stock')}
            className={`px-4 py-2 rounded transition-colors bg-blue-500 ${
              vistaActual === 'stock' ? 'bg-blue-600' : 'hover:bg-blue-700'
            }`}
            type="button"
          >
            📦 Stock
          </button>
        </div>
      </nav>

      <main className="p-6">
        {vistaActual === 'dashboard' && (
          <ComponenteDashboard estadisticas={estadisticas} materiales={materiales} />
        )}
        {vistaActual === 'parte-diario' && (
          <ComponenteParteDiario 
            materiales={materiales}
            configuracion={(datosPaniol as DatosPaniol).configuracion}
            partesDiarios={partesDiarios}
            onAgregarParte={handleAgregarParte}
          />
        )}
        {vistaActual === 'stock' && (
          <ComponenteStock 
            materiales={materiales}
            configuracion={(datosPaniol as DatosPaniol).configuracion}
          />
        )}
      </main>
    </div>
  );
};

export default PaniolFerroviario;