// services/georefService.ts
export interface CalleGeoRef {
  id: string;
  nombre: string;
  categoria: string;
  altura: {
    inicio: { derecha: number; izquierda: number };
    fin: { derecha: number; izquierda: number };
  };
  nomenclatura: string;
  departamento: { id: string; nombre: string };
  provincia: { id: string; nombre: string };
  localidad_censal: { id: string; nombre: string };
  geometria?: {
    type: string;
    coordinates: number[][][];
  };
  score?: number; // Agregamos la propiedad score como opcional
}

export interface GeoRefResponse {
  calles: CalleGeoRef[];
  cantidad: number;
  total: number;
  inicio: number;
  parametros: Record<string, unknown>;
}

export interface BusquedaCallesParams {
  nombre?: string;
  provincia?: string;
  departamento?: string;
  municipio?: string;
  categoria?: string;
  max?: number;
  inicio?: number;
  campos?: string;
}

export class GeoRefService {
  private readonly baseUrl = 'https://apis.datos.gob.ar/georef/api';
  private readonly PROVINCIA_BUENOS_AIRES_ID = '06';
  private readonly QUILMES_DEPARTAMENTO_ID = '06665';

  // Utilities para normalización de búsquedas
  private normalizarTerminoBusqueda(termino: string): string {
    return termino
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^\w\s]/g, ' ') // Reemplazar caracteres especiales por espacios
      .replace(/\s+/g, ' ') // Normalizar espacios múltiples
      .trim();
  }

  private extraerNombrePrincipal(nombre: string): string {
    // Remover números y códigos al inicio: "336 GUTIERREZ" -> "GUTIERREZ"
    return nombre.replace(/^\d+\s+/, '').trim();
  }

  private generarVariantesBusqueda(termino: string): string[] {
    const normalizado = this.normalizarTerminoBusqueda(termino);
    const variantes = new Set([normalizado]);

    // Agregar variantes comunes
    const palabras = normalizado.split(' ');
    
    // Buscar solo por la última palabra si hay múltiples
    if (palabras.length > 1) {
      variantes.add(palabras[palabras.length - 1]);
    }

    // Buscar por la primera palabra si es significativa
    if (palabras.length > 1 && palabras[0].length > 2) {
      variantes.add(palabras[0]);
    }

    // Agregar variante sin números si los hay
    const sinNumeros = normalizado.replace(/\d+/g, '').trim();
    if (sinNumeros && sinNumeros !== normalizado) {
      variantes.add(sinNumeros);
    }

    return Array.from(variantes).filter(v => v.length >= 2);
  }

  async buscarCalles(params: BusquedaCallesParams): Promise<GeoRefResponse> {
    const searchParams = new URLSearchParams();
    
    // Configuración específica para Quilmes, Buenos Aires
    searchParams.append('provincia', this.PROVINCIA_BUENOS_AIRES_ID);
    searchParams.append('departamento', 'quilmes');
    
    // Parámetros de búsqueda
    if (params.nombre) searchParams.append('nombre', params.nombre);
    if (params.categoria) searchParams.append('categoria', params.categoria);
    
    // Configuración de resultados
    searchParams.append('max', (params.max || 50).toString());
    searchParams.append('inicio', (params.inicio || 0).toString());
    searchParams.append('campos', params.campos || 'id,nombre,categoria,nomenclatura,departamento,provincia');

    const url = `${this.baseUrl}/calles?${searchParams.toString()}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`Error al buscar calles: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  // Búsqueda inteligente con múltiples estrategias
  async buscarCallesInteligente(terminoOriginal: string, limite: number = 20): Promise<CalleGeoRef[]> {
    const variantes = this.generarVariantesBusqueda(terminoOriginal);
    const resultadosUnicos = new Map<string, CalleGeoRef>();
    
    // Estrategia 1: Búsqueda exacta con término original
    try {
      const response1 = await this.buscarCalles({
        nombre: terminoOriginal,
        max: limite
      });
      
      response1.calles.forEach(calle => {
        resultadosUnicos.set(calle.id, { ...calle, score: 100 });
      });
    } catch (error) {
      console.warn('Error en búsqueda exacta:', error);
    }

    // Estrategia 2: Búsqueda por variantes si no hay suficientes resultados
    if (resultadosUnicos.size < 3) {
      for (const variante of variantes) {
        if (variante === terminoOriginal) continue; // Ya probamos esta
        
        try {
          const response = await this.buscarCalles({
            nombre: variante,
            max: limite
          });
          
          response.calles.forEach(calle => {
            if (!resultadosUnicos.has(calle.id)) {
              // Calcular score basado en similitud
              const score = this.calcularSimilitud(terminoOriginal, calle.nombre);
              resultadosUnicos.set(calle.id, { ...calle, score });
            }
          });
          
          // Si ya tenemos suficientes resultados, parar
          if (resultadosUnicos.size >= limite) break;
        } catch (error) {
          console.warn(`Error buscando variante "${variante}":`, error);
        }
      }
    }

    // Ordenar por score y filtrar duplicados
    return Array.from(resultadosUnicos.values())
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, limite);
  }

  private calcularSimilitud(termino1: string, termino2: string): number {
    const norm1 = this.normalizarTerminoBusqueda(termino1);
    const norm2 = this.normalizarTerminoBusqueda(termino2);
    const principal2 = this.extraerNombrePrincipal(norm2);

    // Coincidencia exacta del nombre principal
    if (norm1 === principal2) return 95;
    
    // Coincidencia exacta completa
    if (norm1 === norm2) return 90;
    
    // Contiene el término
    if (principal2.includes(norm1) || norm1.includes(principal2)) return 80;
    
    // Coincidencia de palabras
    const palabras1 = norm1.split(' ');
    const palabras2 = principal2.split(' ');
    const coincidencias = palabras1.filter(p1 => 
      palabras2.some(p2 => p2.includes(p1) || p1.includes(p2))
    ).length;
    
    if (coincidencias > 0) {
      return 60 + (coincidencias / Math.max(palabras1.length, palabras2.length)) * 20;
    }
    
    return 30; // Score mínimo
  }

  async buscarCallesPorNombre(nombre: string, limite: number = 20): Promise<CalleGeoRef[]> {
    return this.buscarCallesInteligente(nombre, limite);
  }

  async buscarAvenidas(nombre?: string, limite: number = 30): Promise<CalleGeoRef[]> {
    if (nombre) {
      return this.buscarCallesInteligente(nombre, limite).then(calles =>
        calles.filter(calle => calle.categoria.toLowerCase().includes('avenida'))
      );
    }
    
    const response = await this.buscarCalles({
      categoria: 'avenida',
      max: limite
    });
    
    return response.calles;
  }

  async obtenerTodasLasCallesPaginadas(pagina: number = 0, tamanoPagina: number = 100): Promise<GeoRefResponse> {
    return this.buscarCalles({
      max: tamanoPagina,
      inicio: pagina * tamanoPagina
    });
  }

  // Método específico para el caso "336 GUTIERREZ" -> "GUTIERREZ"
  async buscarPorNombreSimplificado(termino: string): Promise<CalleGeoRef[]> {
    // Primero intentar búsqueda directa
    let resultados = await this.buscarCallesInteligente(termino, 20);
    
    // Si no hay resultados satisfactorios, probar sin números/códigos
    if (resultados.length === 0 || (resultados[0]?.score ?? 0) < 70) {
      const terminoLimpio = this.extraerNombrePrincipal(termino);
      if (terminoLimpio !== termino && terminoLimpio.length >= 2) {
        const resultadosLimpios = await this.buscarCallesInteligente(terminoLimpio, 20);
        
        // Combinar y deduplicar resultados
        const todosResultados = [...resultados, ...resultadosLimpios];
        const unicos = new Map();
        
        todosResultados.forEach(calle => {
          if (!unicos.has(calle.id)) {
            unicos.set(calle.id, calle);
          }
        });
        
        resultados = Array.from(unicos.values())
          .sort((a, b) => (b.score || 0) - (a.score || 0));
      }
    }
    
    return resultados;
  }
}

export const georefService = new GeoRefService();
