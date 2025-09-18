// types/index.ts
export interface Material {
    id: string;
    codigo: string;
    descripcion: string;
    categoria: string;
    stock: number;
  }
  
  export interface Base {
    id: number;
    nombre: string;
    codigo: string;
    descripcion?: string;
  }
  
  export interface Estacion {
    id: number;
    nombre: string;
    linea?: string;
    km?: number;
  }
  
  export interface Encargado {
    id: number;
    apellido: string;
    nombre: string;
    legajo?: string;
  }
  
  export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
  }
  
  export interface MaterialUtilizado {
    id: string;
    codigo: string;
    descripcion: string;
    cantidad: number;
  }
  
  export interface ParteDiario {
    id: number;
    fecha: string;
    base: string;
    estacion: string;
    encargado: string;
    materiales: MaterialUtilizado[];
    observaciones: string;
  }
  
  export interface NuevoParteDiario {
    fecha: string;
    base: string;
    estacion: string;
    encargado: string;
    materiales: MaterialUtilizado[];
    observaciones: string;
  }
  
  export interface Configuracion {
    bases: Base[];
    estaciones: Estacion[];
    encargados: Encargado[];
    categorias: Categoria[]; // Cambiado de string[] a Categoria[]
  }
  
  export interface ConfiguracionSistema {
    nombre_sistema: string;
    version: string;
    ubicacion: string;
    empresa: string;
    fecha_implementacion: string;
    alertas: {
      stock_minimo: number;
      stock_critico: number;
      dias_parte_diario: number;
    };
    reportes?: {
      formatos_exportacion: string[];
      tipos_reporte: string[];
    };
  }
  
  export interface DatosPaniol {
    materiales: Material[];
    configuracion: Configuracion;
    configuracion_sistema: ConfiguracionSistema;
  }
  
  export interface Estadisticas {
    totalMateriales: number;
    stockBajo: number;
    sinStock: number;
    partesHoy: number;
  }
  
  // Props para componentes
  export interface DashboardProps {
    estadisticas: Estadisticas;
    materiales: Material[];
  }
  
  export interface ParteDiarioProps {
    materiales: Material[];
    configuracion: Configuracion;
    partesDiarios: ParteDiario[];
    onAgregarParte: (parte: NuevoParteDiario) => void;
  }
  
  export interface StockProps {
    materiales: Material[];
    configuracion: Configuracion;
  }
  
  // Tipos de vista
  export type VistaActual = 'dashboard' | 'parte-diario' | 'stock';
  
  // Tipos para filtros y búsquedas
  export interface FiltroStock {
    busqueda: string;
    categoria: string;
  }
  
  export interface EstadoStock {
    texto: 'Sin Stock' | 'Stock Bajo' | 'OK';
    estilo: string;
  }
  
  // Tipos para hooks personalizados
  export interface UsePaniolReturn {
    materiales: Material[];
    partesDiarios: ParteDiario[];
    configuracion: Configuracion;
    estadisticas: Estadisticas;
    agregarParteDiario: (parte: NuevoParteDiario) => void;
    actualizarStock: (materialesUsados: MaterialUtilizado[]) => void;
  }
  
  // Tipos para formularios
  export type CampoParteDiario = keyof Omit<NuevoParteDiario, 'materiales'>;
  
  // Tipos de eventos comunes
  export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
  export type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;
  export type TextAreaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;
  export type FormChangeEvent = InputChangeEvent | SelectChangeEvent | TextAreaChangeEvent;
  
  // Tipos para validaciones
  export interface ValidacionParte {
    esValido: boolean;
    errores: string[];
  }
  
  // Tipos para reportes (futuro)
  export interface ReporteConfig {
    tipo: 'diario' | 'semanal' | 'mensual';
    fechaInicio: string;
    fechaFin: string;
    incluirObservaciones: boolean;
  }
  
  export interface DatosReporte {
    partes: ParteDiario[];
    totalMateriales: number;
    materialMasUsado: Material;
    estacionConMasTrabajos: string;
  }
  
  // Constantes tipadas
  export const STOCK_MINIMO = 5 as const;
  export const STOCK_CRITICO = 0 as const;
  
  // Enums para estados
  export enum EstadoMaterial {
    SIN_STOCK = 'SIN_STOCK',
    STOCK_BAJO = 'STOCK_BAJO',
    STOCK_NORMAL = 'STOCK_NORMAL'
  }
  
  export enum TipoMovimiento {
    ENTRADA = 'ENTRADA',
    SALIDA = 'SALIDA',
    AJUSTE = 'AJUSTE'
  }
  
  // Utilidad para type guards
  export const esMaterial = (obj: any): obj is Material => {
    return obj && 
           typeof obj.id === 'string' &&
           typeof obj.codigo === 'string' &&
           typeof obj.descripcion === 'string' &&
           typeof obj.categoria === 'string' &&
           typeof obj.stock === 'number';
  };
  
  export const esParteDiarioValido = (obj: any): obj is NuevoParteDiario => {
    return obj &&
           typeof obj.fecha === 'string' &&
           typeof obj.base === 'string' &&
           typeof obj.estacion === 'string' &&
           typeof obj.encargado === 'string' &&
           Array.isArray(obj.materiales) &&
           typeof obj.observaciones === 'string';
  };
  
  export const esCategoria = (obj: any): obj is Categoria => {
    return obj &&
           typeof obj.id === 'number' &&
           typeof obj.nombre === 'string' &&
           typeof obj.descripcion === 'string';
  };