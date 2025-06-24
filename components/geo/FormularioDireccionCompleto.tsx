// components/FormularioDireccionCompleto.tsx
"use client";
import React, { useState, useCallback } from 'react';
import { AutocompletadoCallesQuilmes } from './AutocompletadoCallesQuilmes';
import { CalleGeoRef } from '@/services/georefService';

interface DireccionCompleta {
  calle: CalleGeoRef | null;
  numero: string;
  piso?: string;
  departamento?: string;
  entreCalle1?: string;
  entreCalle2?: string;
  observaciones?: string;
  coordenadas?: {
    latitud: number;
    longitud: number;
  };
}

interface FormularioDireccionCompletoProps {
  onDireccionCompleta: (direccion: DireccionCompleta) => void;
  direccionInicial?: Partial<DireccionCompleta>;
  className?: string;
  mostrarCamposOpcionales?: boolean;
  validarNumeracion?: boolean;
}

export const FormularioDireccionCompleto: React.FC<FormularioDireccionCompletoProps> = ({
  onDireccionCompleta,
  direccionInicial = {},
  className = "",
  mostrarCamposOpcionales = true,
  validarNumeracion = true
}) => {
  const [direccion, setDireccion] = useState<DireccionCompleta>({
    calle: null,
    numero: '',
    piso: '',
    departamento: '',
    entreCalle1: '',
    entreCalle2: '',
    observaciones: '',
    ...direccionInicial
  });

  const [errores, setErrores] = useState<Record<string, string>>({});
  const [validandoNumeracion, setValidandoNumeracion] = useState(false);

  const validarNumeroCalle = useCallback(async (calle: CalleGeoRef, numero: string) => {
    if (!validarNumeracion || !numero || !calle.altura) return true;

    const num = parseInt(numero);
    if (isNaN(num)) return false;

    const { inicio, fin } = calle.altura;
    
    // Verificar si el número está en el rango válido
    const enRangoIzquierdo = num >= inicio.izquierda && num <= fin.izquierda;
    const enRangoDerecho = num >= inicio.derecha && num <= fin.derecha;
    
    return enRangoIzquierdo || enRangoDerecho;
  }, [validarNumeracion]);

  const validarFormulario = useCallback((): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!direccion.calle) {
      nuevosErrores.calle = 'Debe seleccionar una calle';
    }

    if (!direccion.numero.trim()) {
      nuevosErrores.numero = 'El número de calle es requerido';
    } else if (!/^\d+$/.test(direccion.numero.trim())) {
      nuevosErrores.numero = 'El número debe contener solo dígitos';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }, [direccion]);

  const manejarSeleccionCalle = useCallback(async (calle: CalleGeoRef) => {
    const nuevaDireccion = { ...direccion, calle };
    setDireccion(nuevaDireccion);

    // Limpiar error de calle
    if (errores.calle) {
      setErrores(prev => ({ ...prev, calle: '' }));
    }

    // Validar numeración si ya hay número ingresado
    if (direccion.numero && validarNumeracion) {
      setValidandoNumeracion(true);
      
      try {
        const esValido = await validarNumeroCalle(calle, direccion.numero);
        if (!esValido) {
          setErrores(prev => ({
            ...prev,
            numero: `El número ${direccion.numero} no está en el rango válido para ${calle.nombre}`
          }));
        } else {
          setErrores(prev => ({ ...prev, numero: '' }));
        }
      } finally {
        setValidandoNumeracion(false);
      }
    }

    // Emitir dirección actualizada si está completa
    if (nuevaDireccion.calle && nuevaDireccion.numero) {
      onDireccionCompleta(nuevaDireccion);
    }
  }, [direccion, errores.calle, validarNumeracion, validarNumeroCalle, onDireccionCompleta]);

  const manejarCambioNumero = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const numero = e.target.value;
    const nuevaDireccion = { ...direccion, numero };
    setDireccion(nuevaDireccion);

    // Validar numeración si hay calle seleccionada
    if (direccion.calle && numero && validarNumeracion) {
      setValidandoNumeracion(true);
      
      try {
        const esValido = await validarNumeroCalle(direccion.calle, numero);
        if (!esValido && direccion.calle.altura) {
          const { inicio, fin } = direccion.calle.altura;
          setErrores(prev => ({
            ...prev,
            numero: `Rango válido: ${inicio.izquierda}-${fin.izquierda} (impar) o ${inicio.derecha}-${fin.derecha} (par)`
          }));
        } else {
          setErrores(prev => ({ ...prev, numero: '' }));
        }
      } finally {
        setValidandoNumeracion(false);
      }
    }

    // Emitir dirección actualizada si está completa
    if (nuevaDireccion.calle && numero) {
      onDireccionCompleta(nuevaDireccion);
    }
  }, [direccion, validarNumeracion, validarNumeroCalle, onDireccionCompleta]);

  const manejarCambioGenerico = (campo: keyof DireccionCompleta) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const nuevaDireccion = { ...direccion, [campo]: e.target.value };
    setDireccion(nuevaDireccion);
    onDireccionCompleta(nuevaDireccion);
  };

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      onDireccionCompleta(direccion);
    }
  };

  const obtenerDireccionFormateada = (): string => {
    if (!direccion.calle || !direccion.numero) return '';
    
    let direccionStr = `${direccion.calle.nombre} ${direccion.numero}`;
    
    if (direccion.piso) {
      direccionStr += `, Piso ${direccion.piso}`;
    }
    
    if (direccion.departamento) {
      direccionStr += `, Depto ${direccion.departamento}`;
    }
    
    direccionStr += ', Quilmes, Buenos Aires';
    
    return direccionStr;
  };

  return (
    <form onSubmit={manejarEnvio} className={`space-y-6 ${className}`}>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Dirección en Quilmes, Buenos Aires
        </h3>

        {/* Selector de calle */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calle *
          </label>
          <AutocompletadoCallesQuilmes
            onSeleccionarCalle={manejarSeleccionCalle}
            placeholder="Buscar calle en Quilmes..."
            className="w-full"
            mostrarCategoria={true}
            mostrarNomenclatura={true}
          />
          {errores.calle && (
            <p className="mt-1 text-sm text-red-600">{errores.calle}</p>
          )}
        </div>

        {/* Número de calle */}
        <div className="mb-4">
          <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-2">
            Número *
          </label>
          <div className="relative">
            <input
              id="numero"
              type="text"
              value={direccion.numero}
              onChange={manejarCambioNumero}
              placeholder="Ej: 1234"
              className={`
                w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errores.numero ? 'border-red-300' : 'border-gray-300'}
              `}
            />
            {validandoNumeracion && (
              <div className="absolute right-3 top-2">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          {errores.numero && (
            <p className="mt-1 text-sm text-red-600">{errores.numero}</p>
          )}
          {direccion.calle?.altura && !errores.numero && (
            <p className="mt-1 text-xs text-gray-500">
              Numeración disponible: {direccion.calle.altura.inicio.izquierda}-{direccion.calle.altura.fin.derecha}
            </p>
          )}
        </div>

        {/* Campos opcionales */}
        {mostrarCamposOpcionales && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="piso" className="block text-sm font-medium text-gray-700 mb-2">
                  Piso
                </label>
                <input
                  id="piso"
                  type="text"
                  value={direccion.piso}
                  onChange={manejarCambioGenerico('piso')}
                  placeholder="Ej: 3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento
                </label>
                <input
                  id="departamento"
                  type="text"
                  value={direccion.departamento}
                  onChange={manejarCambioGenerico('departamento')}
                  placeholder="Ej: A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entre calle 1
                </label>
                <AutocompletadoCallesQuilmes
                  onSeleccionarCalle={(calle) => setDireccion(prev => ({ ...prev, entreCalle1: calle.nombre }))}
                  placeholder="Primera calle de referencia"
                  className="w-full"
                  mostrarCategoria={false}
                  mostrarNomenclatura={false}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entre calle 2
                </label>
                <AutocompletadoCallesQuilmes
                  onSeleccionarCalle={(calle) => setDireccion(prev => ({ ...prev, entreCalle2: calle.nombre }))}
                  placeholder="Segunda calle de referencia"
                  className="w-full"
                  mostrarCategoria={false}
                  mostrarNomenclatura={false}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                id="observaciones"
                rows={3}
                value={direccion.observaciones}
                onChange={manejarCambioGenerico('observaciones')}
                placeholder="Información adicional sobre la dirección..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {/* Dirección formateada */}
        {direccion.calle && direccion.numero && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h4 className="text-sm font-medium text-green-800 mb-2">
              Dirección completa:
            </h4>
            <p className="text-sm text-green-700">
              {obtenerDireccionFormateada()}
            </p>
          </div>
        )}
      </div>
    </form>
  );
};