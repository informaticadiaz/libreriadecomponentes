# Guía de Componentes ShadCN UI - Sistema Inmobiliario

## 1. Instalación y Configuración Base

### 1.1 Instalación Inicial

```bash
npx shadcn-ui@latest init
```

### 1.2 Configuración de Tailwind CSS

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Sistema de colores personalizado
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Colores específicos del sistema inmobiliario
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        // Colores del dominio inmobiliario
        property: {
          available: "hsl(var(--property-available))",
          reserved: "hsl(var(--property-reserved))",
          sold: "hsl(var(--property-sold))",
          maintenance: "hsl(var(--property-maintenance))",
        },
        financial: {
          income: "hsl(var(--financial-income))",
          expense: "hsl(var(--financial-expense))",
          pending: "hsl(var(--financial-pending))",
          approved: "hsl(var(--financial-approved))",
        },
        client: {
          lead: "hsl(var(--client-lead))",
          prospect: "hsl(var(--client-prospect))",
          active: "hsl(var(--client-active))",
          inactive: "hsl(var(--client-inactive))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
```

## 2. Sistema de Colores CSS (globals.css)

```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Colores base del sistema */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;

    /* Colores extendidos para el sistema */
    --success: 142.1 76.2% 36.3%;
    --success-foreground: 355.7 100% 97.3%;
    --warning: 32.5 94.6% 43.7%;
    --warning-foreground: 355.7 100% 97.3%;
    --info: 204.1 94.1% 53.9%;
    --info-foreground: 355.7 100% 97.3%;

    /* Colores específicos del dominio inmobiliario */
    --property-available: 142.1 76.2% 36.3%; /* Verde - Disponible */
    --property-reserved: 32.5 94.6% 43.7%; /* Amarillo - Reservada */
    --property-sold: 0 84.2% 60.2%; /* Rojo - Vendida */
    --property-maintenance: 262.1 83.3% 57.8%; /* Morado - Mantenimiento */

    --financial-income: 142.1 76.2% 36.3%; /* Verde - Ingresos */
    --financial-expense: 0 84.2% 60.2%; /* Rojo - Gastos */
    --financial-pending: 32.5 94.6% 43.7%; /* Amarillo - Pendiente */
    --financial-approved: 204.1 94.1% 53.9%; /* Azul - Aprobado */

    --client-lead: 204.1 94.1% 53.9%; /* Azul - Lead */
    --client-prospect: 32.5 94.6% 43.7%; /* Amarillo - Prospecto */
    --client-active: 142.1 76.2% 36.3%; /* Verde - Activo */
    --client-inactive: 215.4 16.3% 46.9%; /* Gris - Inactivo */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;

    /* Colores extendidos para modo oscuro */
    --success: 142.1 70.6% 45.3%;
    --success-foreground: 144.9 80.4% 10%;
    --warning: 32.5 85.6% 55.7%;
    --warning-foreground: 20.5 90.2% 4.3%;
    --info: 204.1 85.1% 65.9%;
    --info-foreground: 213.3 100% 6.1%;

    /* Ajuste de colores del dominio para modo oscuro */
    --property-available: 142.1 70.6% 45.3%;
    --property-reserved: 32.5 85.6% 55.7%;
    --property-sold: 0 62.8% 50.6%;
    --property-maintenance: 262.1 73.3% 67.8%;

    --financial-income: 142.1 70.6% 45.3%;
    --financial-expense: 0 62.8% 50.6%;
    --financial-pending: 32.5 85.6% 55.7%;
    --financial-approved: 204.1 85.1% 65.9%;

    --client-lead: 204.1 85.1% 65.9%;
    --client-prospect: 32.5 85.6% 55.7%;
    --client-active: 142.1 70.6% 45.3%;
    --client-inactive: 215 15.2% 75.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## 3. Componentes ShadCN UI Requeridos

### 3.1 Componentes de Entrada de Datos

```bash
# Formularios y campos de entrada
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add form
npx shadcn-ui@latest add label

# Selectores de fecha y hora
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add date-picker
npx shadcn-ui@latest add popover
```

### 3.2 Componentes de Navegación

```bash
# Navegación
npx shadcn-ui@latest add navigation-menu
npx shadcn-ui@latest add breadcrumb
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add menubar
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add context-menu

# Paginación
npx shadcn-ui@latest add pagination
```

### 3.3 Componentes de Layout

```bash
# Contenedores y layout
npx shadcn-ui@latest add card
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add resizable
npx shadcn-ui@latest add aspect-ratio
```

### 3.4 Componentes de Feedback

```bash
# Notificaciones y feedback
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add alert-dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add spinner
```

### 3.5 Componentes de Datos

```bash
# Visualización de datos
npx shadcn-ui@latest add table
npx shadcn-ui@latest add data-table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add hover-card
npx shadcn-ui@latest add collapsible
npx shadcn-ui@latest add accordion
```

### 3.6 Componentes de Acción

```bash
# Botones y acciones
npx shadcn-ui@latest add button
npx shadcn-ui@latest add toggle
npx shadcn-ui@latest add toggle-group
```

### 3.7 Componentes Específicos

```bash
# Componentes especializados
npx shadcn-ui@latest add command
npx shadcn-ui@latest add combobox
npx shadcn-ui@latest add drawer
```

## 4. Estructura de Componentes Personalizados

### 4.1 Estructura de Directorios

```folder
src/
├── components/
│   ├── ui/                    # Componentes ShadCN base
│   ├── shared/                # Componentes compartidos customizados
│   │   ├── forms/
│   │   ├── layouts/
│   │   ├── navigation/
│   │   ├── feedback/
│   │   └── data-display/
│   ├── modules/               # Componentes específicos por módulo
│   │   ├── auth/
│   │   ├── properties/
│   │   ├── clients/
│   │   ├── payments/
│   │   └── reports/
│   └── providers/             # Context providers
├── hooks/                     # Custom hooks
├── lib/                       # Utilidades y configuraciones
├── styles/                    # Estilos globales
└── types/                     # Definiciones de tipos
```

### 4.2 Ejemplo de Componente Personalizado Reutilizable

```typescript
// src/components/shared/forms/PropertyForm.tsx
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PropertyFormProps {
  variant?: "create" | "edit" | "view"
  className?: string
  onSubmit?: (data: PropertyData) => void
  initialData?: Partial<PropertyData>
  status?: "available" | "reserved" | "sold" | "maintenance"
}

export function PropertyForm({ 
  variant = "create", 
  className, 
  onSubmit, 
  initialData,
  status 
}: PropertyFormProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-property-available text-property-available-foreground"
      case "reserved":
        return "bg-property-reserved text-property-reserved-foreground"
      case "sold":
        return "bg-property-sold text-property-sold-foreground"
      case "maintenance":
        return "bg-property-maintenance text-property-maintenance-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {variant === "create" && "Nueva Propiedad"}
            {variant === "edit" && "Editar Propiedad"}
            {variant === "view" && "Detalles de Propiedad"}
          </CardTitle>
          {status && (
            <Badge className={getStatusColor(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Contenido del formulario */}
      </CardContent>
    </Card>
  )
}
```

## 5. Sistema de Variantes y Configuración

### 5.1 Configuración de Variantes

```typescript
// src/lib/variants.ts
import { cva, type VariantProps } from "class-variance-authority"

// Variantes para status de propiedades
export const propertyStatusVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      status: {
        available: "bg-property-available/10 text-property-available border border-property-available/20",
        reserved: "bg-property-reserved/10 text-property-reserved border border-property-reserved/20",
        sold: "bg-property-sold/10 text-property-sold border border-property-sold/20",
        maintenance: "bg-property-maintenance/10 text-property-maintenance border border-property-maintenance/20",
      },
    },
    defaultVariants: {
      status: "available",
    },
  }
)

// Variantes para status financiero
export const financialStatusVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      status: {
        income: "bg-financial-income/10 text-financial-income border border-financial-income/20",
        expense: "bg-financial-expense/10 text-financial-expense border border-financial-expense/20",
        pending: "bg-financial-pending/10 text-financial-pending border border-financial-pending/20",
        approved: "bg-financial-approved/10 text-financial-approved border border-financial-approved/20",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  }
)

// Variantes para status de cliente
export const clientStatusVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      status: {
        lead: "bg-client-lead/10 text-client-lead border border-client-lead/20",
        prospect: "bg-client-prospect/10 text-client-prospect border border-client-prospect/20",
        active: "bg-client-active/10 text-client-active border border-client-active/20",
        inactive: "bg-client-inactive/10 text-client-inactive border border-client-inactive/20",
      },
    },
    defaultVariants: {
      status: "lead",
    },
  }
)
```

## 6. Hooks Personalizados para Clean Architecture

### 6.1 Hook para Gestión de Temas

```typescript
// src/hooks/useTheme.ts
import { useContext, useEffect } from "react"
import { ThemeContext } from "@/providers/ThemeProvider"

export function useTheme() {
  const context = useContext(ThemeContext)
  
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  const { theme, setTheme, themes } = context

  const applyCustomTheme = (customTheme: Record<string, string>) => {
    const root = document.documentElement
    Object.entries(customTheme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
  }

  return {
    theme,
    setTheme,
    themes,
    applyCustomTheme,
  }
}
```

### 6.2 Hook para Gestión de Estado de Componentes

```typescript
// src/hooks/useComponentState.ts
import { useState, useCallback } from "react"

interface ComponentState {
  loading: boolean
  error: string | null
  success: boolean
}

export function useComponentState(initialState?: Partial<ComponentState>) {
  const [state, setState] = useState<ComponentState>({
    loading: false,
    error: null,
    success: false,
    ...initialState,
  })

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading, error: null }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false, success: false }))
  }, [])

  const setSuccess = useCallback((success: boolean) => {
    setState(prev => ({ ...prev, success, loading: false, error: null }))
  }, [])

  const reset = useCallback(() => {
    setState({ loading: false, error: null, success: false })
  }, [])

  return {
    ...state,
    setLoading,
    setError,
    setSuccess,
    reset,
  }
}
```

## 7. Providers y Context para Clean Architecture

### 7.1 Theme Provider

```typescript
// src/providers/ThemeProvider.tsx
"use client"

import { createContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextProps {
  theme: Theme
  setTheme: (theme: Theme) => void
  themes: Theme[]
  systemTheme: "light" | "dark"
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system")
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setSystemTheme(mediaQuery.matches ? "dark" : "light")

    const listener = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light")
    }

    mediaQuery.addEventListener("change", listener)
    return () => mediaQuery.removeEventListener("change", listener)
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme, systemTheme])

  const value = {
    theme,
    setTheme,
    themes: ["light", "dark", "system"] as Theme[],
    systemTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
```

## 8. Utilidades y Helpers

### 8.1 Utilidades para Clases CSS

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility para generar clases de color dinámicamente
export function getColorClasses(
  color: string,
  variant: "solid" | "outline" | "ghost" = "solid"
) {
  const baseClasses = {
    solid: `bg-${color} text-${color}-foreground`,
    outline: `border border-${color} text-${color} bg-transparent`,
    ghost: `text-${color} bg-${color}/10 hover:bg-${color}/20`,
  }

  return baseClasses[variant]
}

// Utility para formatear currency
export function formatCurrency(amount: number, currency: string = "MXN") {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
  }).format(amount)
}

// Utility para formatear fechas
export function formatDate(date: Date | string, format: "short" | "long" = "short") {
  const dateObj = typeof date === "string" ? new Date(date) : date
  
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: format === "short" ? "short" : "full",
  }).format(dateObj)
}
```

## 9. Configuración de Clean Architecture

### 9.1 Estructura de Capas

```folder
src/
├── domain/                    # Lógica de negocio
│   ├── entities/             # Entidades del dominio
│   ├── repositories/         # Interfaces de repositorios
│   └── use-cases/           # Casos de uso
├── infrastructure/           # Implementaciones externas
│   ├── api/                 # Servicios de API
│   ├── storage/             # Persistencia
│   └── repositories/        # Implementaciones de repositorios
├── presentation/            # Capa de presentación
│   ├── components/          # Componentes UI
│   ├── hooks/              # Custom hooks
│   ├── stores/             # Estado global
│   └── pages/              # Páginas/Rutas
└── shared/                 # Código compartido
    ├── constants/
    ├── types/
    └── utils/
```

### 9.2 Ejemplo de Implementación Clean Architecture

```typescript
// src/domain/entities/Property.ts
export interface Property {
  id: string
  name: string
  price: number
  status: "available" | "reserved" | "sold" | "maintenance"
  developmentId: string
  createdAt: Date
  updatedAt: Date
}

// src/domain/repositories/PropertyRepository.ts
export interface PropertyRepository {
  findAll(): Promise<Property[]>
  findById(id: string): Promise<Property | null>
  create(property: Omit<Property, "id" | "createdAt" | "updatedAt">): Promise<Property>
  update(id: string, property: Partial<Property>): Promise<Property>
  delete(id: string): Promise<void>
}

// src/domain/use-cases/GetPropertiesUseCase.ts
export class GetPropertiesUseCase {
  constructor(private propertyRepository: PropertyRepository) {}

  async execute(): Promise<Property[]> {
    return await this.propertyRepository.findAll()
  }
}

// src/presentation/hooks/useProperties.ts
export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const { loading, setLoading, setError } = useComponentState()

  const getProperties = useCallback(async () => {
    setLoading(true)
    try {
      const useCase = new GetPropertiesUseCase(propertyRepository)
      const result = await useCase.execute()
      setProperties(result)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

  return {
    properties,
    loading,
    getProperties,
  }
}
```

## 10. Buenas Prácticas Implementadas

### 10.1 Principios SOLID

- **Single Responsibility**: Cada componente tiene una responsabilidad específica
- **Open/Closed**: Componentes extensibles mediante props y variantes
- **Liskov Substitution**: Interfaces consistentes entre componentes similares
- **Interface Segregation**: Props específicas para cada componente
- **Dependency Inversion**: Uso de abstracciones (repositories, interfaces)

### 10.2 Patrones de Diseño

- **Repository Pattern**: Para acceso a datos
- **Observer Pattern**: Para gestión de estado reactivo
- **Factory Pattern**: Para creación de variantes de componentes
- **Provider Pattern**: Para inyección de dependencias

### 10.3 Convenciones de Naming

- **Componentes**: PascalCase (ej: `PropertyCard`)
- **Hooks**: camelCase con prefijo "use" (ej: `useProperties`)
- **Variables CSS**: kebab-case (ej: `--property-available`)
- **Tipos**: PascalCase (ej: `PropertyStatus`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `API_ENDPOINTS`)

Esta arquitectura garantiza un código mantenible, escalable y reutilizable, siguiendo las mejores prácticas de Clean Architecture y design systems modernos.
