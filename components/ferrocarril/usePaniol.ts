// hooks/usePaniol.ts
import { useState, useMemo } from 'react';
import type {
  Material,
  ParteDiario,
  NuevoParteDiario,
  Estadisticas,
  DatosPaniol,
  UsePaniolReturn
} from './types';
import datosPaniol from './datos-paniol.json';

export const usePaniol = (): UsePaniolReturn => {
  const [partesDiarios, setPartesDiarios] = useState<ParteDiario[]>([]);
  const [materiales, setMateriales] = useState<Material[]>(
    (datosPaniol as DatosPaniol).materiales
  );

  // Configuración estática del sistema
  const configuracion = (datosPaniol as DatosPaniol).configuracion;

  // Estadísticas calculadas
  const estadisticas: Estadisticas = useMemo(() => ({
    totalMateriales: materiales.length,
    stockBajo: materiales.filter(m => m.stock < 5 && m.stock > 0).length,
    sinStock: materiales.filter(m => m.stock === 0).length,
    partesHoy: partesDiarios.filter(p => {
      const hoy = new Date().toISOString().split('T')[0];
      return p.fecha === hoy;
    }).length
  }), [materiales, partesDiarios]);

  // Función para agregar un nuevo parte diario
  const agregarParteDiario = (parte: NuevoParteDiario): void => {
    const nuevoParte: ParteDiario = {
      ...parte,
      id: Date.now()
    };
    
    setPartesDiarios(prev => [...prev, nuevoParte]);
    
    // Actualizar stock automáticamente
    actualizarStock(parte.materiales);
  };

  // Función para actualizar stock
  const actualizarStock = (materialesUsados: Array<{id: string; cantidad: number}>): void => {
    setMateriales(prev => prev.map(material => {
      const materialUsado = materialesUsados.find(m => m.id === material.id);
      if (materialUsado) {
        return { 
          ...material, 
          stock: Math.max(0, material.stock - materialUsado.cantidad) 
        };
      }
      return material;
    }));
  };

  // Función para restaurar stock (útil para correcciones)
  const restaurarStock = (materialesUsados: Array<{id: string; cantidad: number}>): void => {
    setMateriales(prev => prev.map(material => {
      const materialUsado = materialesUsados.find(m => m.id === material.id);
      if (materialUsado) {
        return { 
          ...material, 
          stock: material.stock + materialUsado.cantidad 
        };
      }
      return material;
    }));
  };

  // Función para eliminar un parte diario
  const eliminarParteDiario = (parteId: number): void => {
    const parte = partesDiarios.find(p => p.id === parteId);
    if (parte) {
      // Restaurar stock antes de eliminar
      restaurarStock(parte.materiales);
      setPartesDiarios(prev => prev.filter(p => p.id !== parteId));
    }
  };

  return {
    materiales,
    partesDiarios,
    configuracion,
    estadisticas,
    agregarParteDiario,
    actualizarStock,
    restaurarStock,
    eliminarParteDiario
  };
};