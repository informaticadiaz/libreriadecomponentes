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
    estaciones_dependientes: number[]; // IDs de las estaciones dependientes
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
    categorias: Categoria[];
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
    onEliminarParte?: (parteId: number) => void;
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
  
  // Helper function para obtener estaciones dependientes de una base
  export const getEstacionesPorBase = (
    baseId: number | string, 
    bases: Base[], 
    estaciones: Estacion[]
  ): Estacion[] => {
    const base = bases.find(b => b.id.toString() === baseId.toString() || b.nombre === baseId);
    if (!base) return [];
    
    return estaciones.filter(estacion => 
      base.estaciones_dependientes.includes(estacion.id)
    );
  };
  
  // Resto de tipos existentes...
  export interface UsePaniolReturn {
    materiales: Material[];
    partesDiarios: ParteDiario[];
    configuracion: Configuracion;
    estadisticas: Estadisticas;
    agregarParteDiario: (parte: NuevoParteDiario) => void;
    actualizarStock: (materialesUsados: Array<{id: string; cantidad: number}>) => void;
    restaurarStock?: (materialesUsados: Array<{id: string; cantidad: number}>) => void;
    eliminarParteDiario?: (parteId: number) => void;
  }
  
  export type CampoParteDiario = keyof Omit<NuevoParteDiario, 'materiales'>;
  
  export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
  export type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;
  export type TextAreaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;
  export type FormChangeEvent = InputChangeEvent | SelectChangeEvent | TextAreaChangeEvent;
  
  export interface ValidacionParte {
    esValido: boolean;
    errores: string[];
  }
  
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
  
  export const STOCK_MINIMO = 5 as const;
  export const STOCK_CRITICO = 0 as const;
  
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
  
  // Type guards actualizados
  export const esMaterial = (obj: unknown): obj is Material => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'id' in obj &&
      'codigo' in obj &&
      'descripcion' in obj &&
      'categoria' in obj &&
      'stock' in obj &&
      typeof (obj as Record<string, unknown>).id === 'string' &&
      typeof (obj as Record<string, unknown>).codigo === 'string' &&
      typeof (obj as Record<string, unknown>).descripcion === 'string' &&
      typeof (obj as Record<string, unknown>).categoria === 'string' &&
      typeof (obj as Record<string, unknown>).stock === 'number'
    );
  };
  
  export const esBase = (obj: unknown): obj is Base => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'id' in obj &&
      'nombre' in obj &&
      'codigo' in obj &&
      'estaciones_dependientes' in obj &&
      typeof (obj as Record<string, unknown>).id === 'number' &&
      typeof (obj as Record<string, unknown>).nombre === 'string' &&
      typeof (obj as Record<string, unknown>).codigo === 'string' &&
      Array.isArray((obj as Record<string, unknown>).estaciones_dependientes) &&
      (
        !('descripcion' in obj) ||
        typeof (obj as Record<string, unknown>).descripcion === 'string'
      )
    );
  };
  
  // Resto de type guards existentes...
  export const esEstacion = (obj: unknown): obj is Estacion => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'id' in obj &&
      'nombre' in obj &&
      typeof (obj as Record<string, unknown>).id === 'number' &&
      typeof (obj as Record<string, unknown>).nombre === 'string' &&
      (
        !('linea' in obj) ||
        typeof (obj as Record<string, unknown>).linea === 'string'
      ) &&
      (
        !('km' in obj) ||
        typeof (obj as Record<string, unknown>).km === 'number'
      )
    );
  };