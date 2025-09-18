// components/ParteDiario.tsx
import React, { useState, useMemo } from 'react';
import { Plus, MapPin, User, Calendar, Building, Trash2, Package, Clock } from 'lucide-react';
import type {
  Material,
  ParteDiario,
  NuevoParteDiario,
  ParteDiarioProps,
  FormChangeEvent
} from './types';

const ComponenteParteDiario: React.FC<ParteDiarioProps> = ({ 
  materiales, 
  configuracion, 
  partesDiarios, 
  onAgregarParte,
  onEliminarParte
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

  // Función para obtener estaciones filtradas por base
  const estacionesFiltradas = useMemo(() => {
    if (!nuevoParte.base) {
      return configuracion.estaciones;
    }
    
    const base = configuracion.bases.find(b => b.nombre === nuevoParte.base);
    if (!base) return [];
    
    return configuracion.estaciones
      .filter(estacion => base.estaciones_dependientes.includes(estacion.id))
      .sort((a, b) => {
        if (a.km && b.km) return a.km - b.km;
        return a.nombre.localeCompare(b.nombre);
      });
  }, [nuevoParte.base, configuracion]);

  const agregarMaterial = (): void => {
    if (materialSeleccionado && cantidadMaterial) {
      const material = materiales.find(m => m.id === materialSeleccionado);
      const cantidad = parseInt(cantidadMaterial);
      
      // Verificar si el material ya está agregado
      const materialExistente = nuevoParte.materiales.find(m => m.id === materialSeleccionado);
      
      if (materialExistente) {
        // Si ya existe, actualizar cantidad
        if (material && cantidad > 0 && (materialExistente.cantidad + cantidad) <= material.stock) {
          setNuevoParte(prev => ({
            ...prev,
            materiales: prev.materiales.map(m => 
              m.id === materialSeleccionado 
                ? { ...m, cantidad: m.cantidad + cantidad }
                : m
            )
          }));
        } else {
          alert(`Stock insuficiente. Stock disponible: ${material?.stock}, ya agregado: ${materialExistente.cantidad}`);
        }
      } else {
        // Agregar nuevo material
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
        } else if (material && cantidad > material.stock) {
          alert(`Stock insuficiente. Stock disponible: ${material.stock}`);
        }
      }
      
      setMaterialSeleccionado('');
      setCantidadMaterial('');
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
      
      // Mostrar mensaje de éxito mejorado
      const totalMateriales = nuevoParte.materiales.reduce((sum, mat) => sum + mat.cantidad, 0);
      alert(`✅ Parte diario guardado exitosamente!\n📦 ${totalMateriales} materiales utilizados\n📍 ${nuevoParte.estacion}`);
    } else {
      alert('Complete todos los campos obligatorios y agregue al menos un material');
    }
  };

  const eliminarParte = (parteId: number): void => {
    if (confirm('¿Está seguro de eliminar este parte diario? Se restaurará el stock de los materiales.')) {
      onEliminarParte && onEliminarParte(parteId);
    }
  };

  const handleInputChange = (field: keyof Omit<NuevoParteDiario, 'materiales'>) => 
    (e: FormChangeEvent): void => {
      const newValue = e.target.value;
      
      setNuevoParte(prev => {
        const updated = { ...prev, [field]: newValue };
        
        // Si cambia la base, resetear la estación
        if (field === 'base' && prev.base !== newValue) {
          updated.estacion = '';
        }
        
        return updated;
      });
    };

  const materialDisponible = materiales.find(m => m.id === materialSeleccionado);
  const baseSeleccionada = configuracion.bases.find(b => b.nombre === nuevoParte.base);

  // Calcular totales para el resumen
  const totalMaterialesAgregados = nuevoParte.materiales.reduce((sum, mat) => sum + mat.cantidad, 0);

  return (
    <div className="space-y-6">
      {/* Formulario de nuevo parte diario */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center mb-4">
          <Calendar className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold">Nuevo Parte Diario</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Fecha</label>
            <input
              type="date"
              value={nuevoParte.fecha}
              onChange={handleInputChange('fecha')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Base</label>
            <select
              value={nuevoParte.base}
              onChange={handleInputChange('base')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar base</option>
              {configuracion.bases.map(base => (
                <option key={base.id} value={base.nombre}>
                  {base.nombre} ({base.estaciones_dependientes.length} estaciones)
                </option>
              ))}
            </select>
            {baseSeleccionada && (
              <p className="text-xs text-blue-600 mt-1">
                <Building className="h-3 w-3 inline mr-1" />
                {baseSeleccionada.descripcion}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Estación
              {nuevoParte.base && (
                <span className="text-blue-600 text-xs ml-1">
                  ({estacionesFiltradas.length} disponibles)
                </span>
              )}
            </label>
            <select
              value={nuevoParte.estacion}
              onChange={handleInputChange('estacion')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              disabled={!nuevoParte.base}
            >
              <option value="">
                {nuevoParte.base ? 'Seleccionar estación' : 'Primero seleccione una base'}
              </option>
              {estacionesFiltradas.map(estacion => (
                <option key={estacion.id} value={estacion.nombre}>
                  {estacion.nombre} {estacion.km && `(km ${estacion.km})`}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Encargado</label>
            <select
              value={nuevoParte.encargado}
              onChange={handleInputChange('encargado')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar encargado</option>
              {configuracion.encargados.map(encargado => (
                <option key={encargado.id} value={encargado.apellido}>
                  {encargado.apellido}, {encargado.nombre}
                  {encargado.legajo && ` (${encargado.legajo})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sección de materiales */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium flex items-center">
              <Package className="h-5 w-5 mr-2 text-green-600" />
              Materiales Utilizados
            </h4>
            {totalMaterialesAgregados > 0 && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {totalMaterialesAgregados} unidades
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
            <div className="md:col-span-2">
              <select
                value={materialSeleccionado}
                onChange={(e) => setMaterialSeleccionado(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar material</option>
                {materiales.filter(m => m.stock > 0).map(material => (
                  <option key={material.id} value={material.id}>
                    [{material.categoria}] {material.codigo} - {material.descripcion.slice(0, 25)}...
                  </option>
                ))}
              </select>
            </div>
            
            <input
              type="number"
              placeholder="Cantidad"
              value={cantidadMaterial}
              onChange={(e) => setCantidadMaterial(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
              max={materialDisponible?.stock || 1}
            />
            
            <div className="text-sm text-gray-600 p-2 flex items-center justify-center bg-gray-50 rounded-lg">
              {materialDisponible ? (
                <span className="font-medium">Stock: {materialDisponible.stock}</span>
              ) : (
                'Seleccione material'
              )}
            </div>
            
            <button
              onClick={agregarMaterial}
              type="button"
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 flex items-center justify-center disabled:bg-blue-700/50 disabled:cursor-not-allowed transition-colors"
              disabled={!materialSeleccionado || !cantidadMaterial || (materialDisponible?.stock || 0) === 0}
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar
            </button>
          </div>

          {/* Lista de materiales agregados */}
          {nuevoParte.materiales.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h5 className="font-medium mb-3 text-gray-700">Materiales agregados:</h5>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {nuevoParte.materiales.map((material, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{material.codigo}</p>
                      <p className="text-xs text-gray-600 line-clamp-1">{material.descripcion}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {material.cantidad} un.
                      </span>
                      <button
                        onClick={() => removerMaterial(index)}
                        type="button"
                        className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Observaciones */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-700">Observaciones</label>
          <textarea
            value={nuevoParte.observaciones}
            onChange={handleInputChange('observaciones')}
            className="w-full p-3 border border-gray-300 rounded-lg h-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Observaciones adicionales sobre la tarea realizada..."
          />
        </div>

        {/* Botón guardar */}
        <button
          onClick={guardarParte}
          type="button"
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-green-700/50 disabled:cursor-not-allowed font-medium transition-colors flex items-center"
          disabled={!nuevoParte.base || !nuevoParte.estacion || !nuevoParte.encargado || nuevoParte.materiales.length === 0}
        >
          <Calendar className="h-5 w-5 mr-2" />
          Guardar Parte Diario
        </button>
      </div>

      {/* Historial de partes diarios */}
      {partesDiarios.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gray-600" />
              Historial de Partes
            </h3>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {partesDiarios.length} registros
            </span>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {partesDiarios.slice(-10).reverse().map(parte => (
              <div key={parte.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg hover:bg-gray-100 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{parte.fecha}</p>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {parte.base}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="h-4 w-4 inline mr-1" />{parte.estacion} • 
                      <User className="h-4 w-4 inline mx-1" />{parte.encargado}
                    </p>
                  </div>
                  {onEliminarParte && (
                    <button
                      onClick={() => eliminarParte(parte.id)}
                      className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                      title="Eliminar parte diario"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="h-4 w-4 text-green-600" />
                    <strong>Materiales utilizados:</strong> {parte.materiales.length} ítems
                    <span className="text-xs text-gray-500">
                      ({parte.materiales.reduce((sum, mat) => sum + mat.cantidad, 0)} unidades total)
                    </span>
                  </div>
                  <ul className="text-xs text-gray-600 mt-1 ml-6">
                    {parte.materiales.slice(0, 3).map((mat, idx) => (
                      <li key={idx}>• {mat.codigo}: {mat.cantidad} un.</li>
                    ))}
                    {parte.materiales.length > 3 && (
                      <li>• ... y {parte.materiales.length - 3} más</li>
                    )}
                  </ul>
                </div>
                
                {parte.observaciones && (
                  <p className="text-sm text-gray-600 mt-2 italic bg-white p-2 rounded border-l-2 border-gray-300">
                    {parte.observaciones}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponenteParteDiario;