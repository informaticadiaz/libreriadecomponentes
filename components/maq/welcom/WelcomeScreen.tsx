"use client"
import * as React from "react"
import { Home, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WelcomeScreenProps {
  onStart: () => void           // Callback para botón "Comenzar"
  onLogin: () => void           // Callback para "Ya tengo cuenta"
  appName: string               // Nombre de la aplicación
  subtitle?: string             // Subtítulo personalizable
  logoSrc?: string              // URL del logo opcional
  isLoading?: boolean           // Estado de carga
  className?: string
}

export function WelcomeScreen({
  onStart,
  onLogin,
  appName,
  subtitle = "Encuentra tu hogar ideal con la confianza de profesionales inmobiliarios",
  logoSrc,
  isLoading = false,
  className,
  ...props
}: WelcomeScreenProps) {
  return (
    <main 
      role="main" 
      aria-label="Pantalla de bienvenida"
      className={cn(
        "welcome-screen-container min-h-screen w-full relative overflow-hidden",
        "bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500",
        "flex items-center justify-center",
        className
      )}
      {...props}
    >
      {/* Elemento decorativo de fondo */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 right-8 transform rotate-12">
          <Home size={120} className="text-white" />
        </div>
        <div className="absolute bottom-1/4 left-8 transform -rotate-12">
          <Home size={80} className="text-white" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45">
          <Home size={200} className="text-white opacity-50" />
        </div>
      </div>

      <div className="welcome-content relative z-10 w-full max-w-md mx-auto px-4 sm:px-6 lg:max-w-lg lg:px-8">
        <div className="text-center space-y-8 animate-in fade-in duration-1000">
          
          {/* Branding Section */}
          <section aria-labelledby="welcome-title" className="branding-section space-y-6">
            <div className="animate-in slide-in-from-top duration-700 delay-200">
              {logoSrc ? (
                <img 
                  src={logoSrc} 
                  alt={`Logo de ${appName}`}
                  className="h-16 w-auto mx-auto mb-6"
                />
              ) : (
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Home size={32} className="text-white" />
                </div>
              )}
            </div>

            <div className="space-y-3 animate-in slide-in-from-top duration-700 delay-300">
              <h1 
                id="welcome-title"
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight"
              >
                Bienvenido a {appName}
              </h1>
              
              <p 
                id="welcome-subtitle"
                className="text-sm sm:text-base text-white/90 leading-relaxed max-w-sm mx-auto"
              >
                {subtitle}
              </p>
            </div>
          </section>

          {/* Actions Section */}
          <section 
            aria-label="Acciones principales" 
            className="actions-section space-y-3 pt-8 animate-in slide-in-from-bottom duration-700 delay-500"
          >
            <Button
              onClick={onStart}
              disabled={isLoading}
              size="lg"
              className={cn(
                "w-full max-w-xs mx-auto bg-white text-blue-600 hover:bg-gray-50",
                "font-semibold py-4 px-8 rounded-lg",
                "transition-all duration-200 hover:scale-[0.98] active:scale-95",
                "shadow-lg hover:shadow-xl",
                "focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              )}
              aria-describedby="start-description"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cargando...
                </>
              ) : (
                "Comenzar"
              )}
            </Button>
            
            <div id="start-description" className="sr-only">
              Iniciar el proceso de registro en la aplicación
            </div>

            <Button
              onClick={onLogin}
              disabled={isLoading}
              variant="outline"
              size="lg"
              className={cn(
                "w-full max-w-xs mx-auto border-white text-white hover:bg-white/10",
                "font-medium py-3.5 px-8 rounded-lg",
                "transition-all duration-200 hover:scale-[0.98] active:scale-95",
                "focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              aria-describedby="login-description"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cargando...
                </>
              ) : (
                "Ya tengo cuenta"
              )}
            </Button>
            
            <div id="login-description" className="sr-only">
              Acceder con una cuenta existente
            </div>
          </section>
        </div>
      </div>

      {/* Gradiente adicional para mejor legibilidad en mobile */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/50 to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </main>
  )
}

// Ejemplo de uso
export function WelcomeScreenExample() {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleStart = () => {
    setIsLoading(true)
    // Simular navegación
    setTimeout(() => {
      console.log("Navegando a registro...")
      setIsLoading(false)
    }, 2000)
  }

  const handleLogin = () => {
    setIsLoading(true)
    // Simular navegación
    setTimeout(() => {
      console.log("Navegando a login...")
      setIsLoading(false)
    }, 2000)
  }

  return (
    <WelcomeScreen
      appName="InmoApp"
      onStart={handleStart}
      onLogin={handleLogin}
      isLoading={isLoading}
      subtitle="Encuentra tu hogar ideal con la confianza de profesionales inmobiliarios"
    />
  )
}