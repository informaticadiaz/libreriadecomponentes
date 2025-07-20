'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import UserRegistrationForm from '@/components/maq/registration-form/useRegistrationForm';
import { AlertCircle } from 'lucide-react';

// Tipos TypeScript corregidos
interface UserData {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaNacimiento?: Date;
  tipoUsuario: 'comprador' | 'vendedor' | 'agente' | 'desarrollador';
  empresa?: string;
  licenciaAgente?: string;
  ciudadInteres: string[];
  rangoPresupuesto?: { min: number; max: number };
  tipoPropiedad?: string[];
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptMarketing: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    nombre: string;
  };
  errors?: Record<string, string>;
}

// Datos mock de ciudades mexicanas
const MEXICAN_CITIES = [
  'Ciudad de México',
  'Guadalajara',
  'Monterrey',
  'Puebla',
  'Tijuana',
  'León',
  'Juárez',
  'Torreón',
  'Querétaro',
  'San Luis Potosí',
  'Mérida',
  'Mexicali',
  'Aguascalientes',
  'Cuernavaca',
  'Saltillo',
  'Hermosillo',
  'Irapuato',
  'Gómez Palacio',
  'Durango',
  'Tampico',
  'Campeche',
  'Cozumel',
  'Puerto Vallarta',
  'Cancún',
  'Playa del Carmen'
];

export default function RegistrationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Función para simular llamada a API de registro
  const handleRegistration = async (userData: UserData) => {
    setIsLoading(true);
    setServerErrors({});

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular validación del servidor
      const mockErrors: Record<string, string> = {};
      
      // Ejemplo: verificar si el email ya existe
      if (userData.email === 'admin@monopolio.com.mx') {
        mockErrors.email = 'Este email ya está registrado';
      }

      // Ejemplo: verificar formato de licencia de agente
      if (userData.tipoUsuario === 'agente' && userData.licenciaAgente && 
          !/^[A-Z]{2}\d{6}$/.test(userData.licenciaAgente)) {
        mockErrors.licenciaAgente = 'Formato de licencia inválido (ej: AB123456)';
      }

      if (Object.keys(mockErrors).length > 0) {
        setServerErrors(mockErrors);
        return;
      }

      // Simular respuesta exitosa
      const response: ApiResponse = {
        success: true,
        message: 'Usuario registrado exitosamente',
        user: {
          id: '12345',
          email: userData.email,
          nombre: userData.nombre
        }
      };

      console.log('Usuario registrado:', response.user);
      
      // Mostrar mensaje de éxito
      setShowSuccessMessage(true);
      
      // Redireccionar después de 3 segundos
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 3000);

    } catch (error) {
      console.error('Error en registro:', error);
      setServerErrors({
        general: 'Error del servidor. Por favor intenta nuevamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para redireccionar al login
  const handleLoginRedirect = () => {
    router.push('/login');
  };

  // Función para buscar ciudades (simulación de API)
  const handleCitySearch = async (query: string): Promise<string[]> => {
    // Simular delay de búsqueda
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Filtrar ciudades que coincidan con la búsqueda
    return MEXICAN_CITIES.filter(city => 
      city.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10); // Limitar a 10 resultados
  };

  // Valores iniciales (opcional - puede venir de query params o localStorage)
  const getInitialValues = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('registrationDraft');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return {};
        }
      }
    }
    return {};
  };

  if (showSuccessMessage) {
    return (
      <main 
        role="main" 
        aria-label="Registro exitoso"
        className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 flex items-center justify-center p-4"
      >
        {/* Elementos decorativos de fondo */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-1/4 right-8 transform rotate-12">
            <Home size={120} className="text-white" />
          </div>
          <div className="absolute bottom-1/4 left-8 transform -rotate-12">
            <CheckCircle size={80} className="text-white" />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45">
            <Home size={200} className="text-white opacity-50" />
          </div>
        </div>

        <div className="relative z-10 max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 text-center border border-white/20 animate-in fade-in duration-1000">
            <div className="mb-6 animate-in slide-in-from-top duration-700 delay-200">
              <div className="mx-auto w-16 h-16 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 border border-green-400/30">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                ¡Cuenta creada exitosamente!
              </h2>
              <p className="text-white/80">
                Te estamos redirigiendo al inicio de sesión...
              </p>
            </div>
            
            <div className="flex items-center justify-center animate-in slide-in-from-bottom duration-700 delay-500">
              <Loader2 className="animate-spin h-6 w-6 text-white mr-2" />
              <span className="text-sm text-white/70">Redirigiendo...</span>
            </div>
          </div>
        </div>

        {/* Gradiente adicional */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/50 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500">
      {/* Header con estilo azul */}
      <header className="relative bg-white/10 backdrop-blur-md shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center animate-in slide-in-from-left duration-500">
              <div className="flex items-center gap-2 text-white">
                <Home className="w-6 h-6" />
                <h1 className="text-xl font-bold">
                  Monopolio.com.mx
                </h1>
              </div>
            </div>
            <nav className="flex items-center space-x-4 animate-in slide-in-from-right duration-500">
              <button
                onClick={handleLoginRedirect}
                className={cn(
                  "text-white/90 hover:text-white font-medium px-4 py-2 rounded-lg",
                  "transition-all duration-200 hover:bg-white/10"
                )}
              >
                Iniciar Sesión
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="relative">
        {/* Mensaje de error general */}
        {serverErrors.general && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <div className="mb-6 bg-red-900/20 backdrop-blur-sm border border-red-400/30 rounded-lg p-4 animate-in slide-in-from-top duration-300">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-300">
                    Error en el registro
                  </h3>
                  <p className="mt-1 text-sm text-red-200">
                    {serverErrors.general}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formulario de registro */}
        <UserRegistrationForm
          onSubmit={handleRegistration}
          onLoginRedirect={handleLoginRedirect}
          initialValues={getInitialValues()}
          isLoading={isLoading}
          serverErrors={serverErrors}
          showStepIndicator={true}
          compactMode={false}
          availableCities={MEXICAN_CITIES}
          onCitySearch={handleCitySearch}
        />
      </main>

      {/* Footer con estilo azul */}
      <footer className="relative bg-white/5 backdrop-blur-sm border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-white/70 animate-in fade-in duration-500">
            <p>&copy; 2024 Monopolio.com.mx. Todos los derechos reservados.</p>
            <div className="mt-2 space-x-4">
              <a 
                href="/terminos" 
                className="hover:text-white/90 transition-colors underline underline-offset-4"
              >
                Términos de Servicio
              </a>
              <a 
                href="/privacidad" 
                className="hover:text-white/90 transition-colors underline underline-offset-4"
              >
                Política de Privacidad
              </a>
              <a 
                href="/ayuda" 
                className="hover:text-white/90 transition-colors underline underline-offset-4"
              >
                Ayuda
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}