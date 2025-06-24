// utils/testBusquedaCalles.ts
import { georefService } from '../services/georefService';

export interface TestCase {
  busqueda: string;
  esperado: string[];
  descripcion: string;
}

export const casosDeTesteo: TestCase[] = [
  {
    busqueda: 'GUTIERREZ',
    esperado: ['336 GUTIERREZ', 'GUTIERREZ'],
    descripcion: 'Debe encontrar calles con números al inicio'
  },
  {
    busqueda: 'SAN MARTIN',
    esperado: ['25 SAN MARTIN', 'SAN MARTIN', 'AV SAN MARTIN'],
    descripcion: 'Debe encontrar todas las variantes de San Martín'
  },
  {
    busqueda: 'BELGRANO',
    esperado: ['118 BELGRANO', 'BELGRANO', 'AV BELGRANO'],
    descripcion: 'Debe encontrar calles y avenidas Belgrano'
  },
  {
    busqueda: 'MITRE',
    esperado: ['112 MITRE', 'MITRE'],
    descripcion: 'Caso típico con números'
  }
];

interface TestResult {
  caso: string;
  descripcion: string;
  esperado: string[];
  encontrado: string[];
  paso: boolean;
  tiempoMs: number;
  totalResultados: number;
  error?: string;
}

export class TestBusquedaCalles {
  static async ejecutarTodos(): Promise<{ pasaron: number; fallaron: number; resultados: TestResult[] }> {
    const resultados: TestResult[] = [];
    let pasaron = 0;
    let fallaron = 0;

    for (const caso of casosDeTesteo) {
      const resultado = await this.ejecutarTest(caso);
      resultados.push(resultado);
      
      if (resultado.paso) {
        pasaron++;
      } else {
        fallaron++;
      }
    }

    return { pasaron, fallaron, resultados };
  }

static async ejecutarTest(caso: TestCase): Promise<TestResult> {
    try {
      const inicioTiempo = Date.now();
      const calles = await georefService.buscarPorNombreSimplificado(caso.busqueda);
      const tiempoTranscurrido = Date.now() - inicioTiempo;

      const nombresEncontrados = calles.map(c => c.nombre);
      const encontroTodos = caso.esperado.every(esperado => 
        nombresEncontrados.some(encontrado => 
          encontrado.toLowerCase().includes(esperado.toLowerCase())
        )
      );

      return {
        caso: caso.busqueda,
        descripcion: caso.descripcion,
        esperado: caso.esperado,
        encontrado: nombresEncontrados.slice(0, 5), // Primeros 5 resultados
        paso: encontroTodos,
        tiempoMs: tiempoTranscurrido,
        totalResultados: calles.length
      };
    } catch (error) {
      return {
        caso: caso.busqueda,
        descripcion: caso.descripcion,
        esperado: caso.esperado,
        encontrado: [],
        paso: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        tiempoMs: 0,
        totalResultados: 0
      };
    }
  }

  static async probarBusquedaEspecifica(termino: string): Promise<
    | {
        termino: string;
        busquedaNormal: {
          resultados: number;
          tiempo: number;
          primeros: string[];
        };
        busquedaInteligente: {
          resultados: number;
          tiempo: number;
          primeros: { nombre: string; score: number }[];
        };
      }
    | { error: unknown }
  > {
    console.log(`🔍 Probando búsqueda: "${termino}"`);
    
    try {
      // Probar búsqueda normal
      const inicioNormal = Date.now();
      const resultadosNormales = await georefService.buscarCallesPorNombre(termino);
      const tiempoNormal = Date.now() - inicioNormal;

      // Probar búsqueda inteligente
      const inicioInteligente = Date.now();
      const resultadosInteligentes = await georefService.buscarPorNombreSimplificado(termino);
      const tiempoInteligente = Date.now() - inicioInteligente;

      const comparacion = {
        termino,
        busquedaNormal: {
          resultados: resultadosNormales.length,
          tiempo: tiempoNormal,
          primeros: resultadosNormales.slice(0, 3).map(c => c.nombre)
        },
        busquedaInteligente: {
          resultados: resultadosInteligentes.length,
          tiempo: tiempoInteligente,
          primeros: resultadosInteligentes.slice(0, 3).map(c => ({ 
            nombre: c.nombre, 
            score: c.score !== undefined ? c.score : 0
          }))
        }
      };

      console.table(comparacion);
      return comparacion;
    } catch (error) {
      console.error('Error en la prueba:', error);
      return { error };
    }
  }
}

// Función de utilidad para usar en consola o tests
export const probarBusqueda = (termino: string) => TestBusquedaCalles.probarBusquedaEspecifica(termino);