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
  
  // Utilidad para type guards con tipos seguros
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
  
  export const esParteDiarioValido = (obj: unknown): obj is NuevoParteDiario => {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }
    
    const objRecord = obj as Record<string, unknown>;
    
    return (
      'fecha' in objRecord &&
      'base' in objRecord &&
      'estacion' in objRecord &&
      'encargado' in objRecord &&
      'materiales' in objRecord &&
      'observaciones' in objRecord &&
      typeof objRecord.fecha === 'string' &&
      typeof objRecord.base === 'string' &&
      typeof objRecord.estacion === 'string' &&
      typeof objRecord.encargado === 'string' &&
      Array.isArray(objRecord.materiales) &&
      typeof objRecord.observaciones === 'string' &&
      objRecord.materiales.every((material: unknown) => esMaterialUtilizado(material))
    );
  };
  
  export const esCategoria = (obj: unknown): obj is Categoria => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'id' in obj &&
      'nombre' in obj &&
      'descripcion' in obj &&
      typeof (obj as Record<string, unknown>).id === 'number' &&
      typeof (obj as Record<string, unknown>).nombre === 'string' &&
      typeof (obj as Record<string, unknown>).descripcion === 'string'
    );
  };
  
  export const esMaterialUtilizado = (obj: unknown): obj is MaterialUtilizado => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'id' in obj &&
      'codigo' in obj &&
      'descripcion' in obj &&
      'cantidad' in obj &&
      typeof (obj as Record<string, unknown>).id === 'string' &&
      typeof (obj as Record<string, unknown>).codigo === 'string' &&
      typeof (obj as Record<string, unknown>).descripcion === 'string' &&
      typeof (obj as Record<string, unknown>).cantidad === 'number'
    );
  };
  
  export const esBase = (obj: unknown): obj is Base => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'id' in obj &&
      'nombre' in obj &&
      'codigo' in obj &&
      typeof (obj as Record<string, unknown>).id === 'number' &&
      typeof (obj as Record<string, unknown>).nombre === 'string' &&
      typeof (obj as Record<string, unknown>).codigo === 'string' &&
      (
        !('descripcion' in obj) ||
        typeof (obj as Record<string, unknown>).descripcion === 'string'
      )
    );
  };
  
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
  
  export const esEncargado = (obj: unknown): obj is Encargado => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'id' in obj &&
      'apellido' in obj &&
      'nombre' in obj &&
      typeof (obj as Record<string, unknown>).id === 'number' &&
      typeof (obj as Record<string, unknown>).apellido === 'string' &&
      typeof (obj as Record<string, unknown>).nombre === 'string' &&
      (
        !('legajo' in obj) ||
        typeof (obj as Record<string, unknown>).legajo === 'string'
      )
    );
  };
  
  export const esParteDiario = (obj: unknown): obj is ParteDiario => {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }
    
    const objRecord = obj as Record<string, unknown>;
    
    return (
      'id' in objRecord &&
      'fecha' in objRecord &&
      'base' in objRecord &&
      'estacion' in objRecord &&
      'encargado' in objRecord &&
      'materiales' in objRecord &&
      'observaciones' in objRecord &&
      typeof objRecord.id === 'number' &&
      typeof objRecord.fecha === 'string' &&
      typeof objRecord.base === 'string' &&
      typeof objRecord.estacion === 'string' &&
      typeof objRecord.encargado === 'string' &&
      Array.isArray(objRecord.materiales) &&
      typeof objRecord.observaciones === 'string' &&
      objRecord.materiales.every((material: unknown) => esMaterialUtilizado(material))
    );
  };