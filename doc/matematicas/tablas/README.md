# 🔢 Multiplication Tables Trainer

Un componente educativo interactivo para que niños de 6-10 años aprendan y practiquen las tablas de multiplicar de forma divertida y accesible.

## ✨ Características

- **Múltiples modos de aprendizaje**: Exploración, práctica libre y quiz con puntuación
- **Accesibilidad completa**: Navegación por teclado, ARIA labels, contrastes adecuados
- **Progreso persistente**: Guarda automáticamente en localStorage sin necesidad de backend
- **Feedback inmediato**: Respuestas visuales y mensajes motivacionales
- **Internacionalización**: Estructura lista para múltiples idiomas
- **Responsive**: Optimizado para móviles y tablets
- **TypeScript estricto**: Sin `any`, tipado completo
- **Tests incluidos**: Cobertura básica con Vitest

## 🚀 Instalación

### Prerequisitos

- Next.js 14/15 con App Router
- React 18+
- TypeScript
- Tailwind CSS
- shadcn/ui

### Paso 1: Instalar dependencias base

```bash
# Si es un proyecto nuevo con Next.js
npx create-next-app@latest mi-app --typescript --tailwind --eslint --app

cd mi-app

# Instalar shadcn/ui
npx shadcn-ui@latest init
```

### Paso 2: Instalar componentes de shadcn/ui necesarios

```bash
# Componentes requeridos
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card  
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add select
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add alert-dialog

# Iconos
npm install lucide-react
```

### Paso 3: Agregar utilidades adicionales

```bash
# Para fechas (en ProgressOverview)
npm install date-fns

# Para desarrollo y testing (opcional)
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
```

### Paso 4: Copiar archivos del componente

Copia todos los archivos proporcionados manteniendo la estructura:

```dir
components/
└── learning/
    ├── MultiplicationTablesTrainer.tsx
    ├── types.ts
    ├── i18n.ts
    ├── storage.ts
    ├── hooks/
    │   └── useTrainerState.ts
    └── ui/
        ├── Panel.tsx (+ StatCard, QuestionCard)
        ├── TableExplorer.tsx (+ PracticeSettings)
        └── QuizResults.tsx (+ ProgressOverview)

app/
└── learn/
    └── page.tsx

lib/
└── utils.ts
```

### Paso 5: Configurar Tailwind (si es necesario)

Asegúrate de que tu `tailwind.config.js` incluye:

```js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 📖 Uso básico

### Implementación simple

```tsx
import { MultiplicationTablesTrainer } from '@/components/learning/MultiplicationTablesTrainer';

export default function Page() {
  return (
    <div className="container mx-auto py-8">
      <MultiplicationTablesTrainer />
    </div>
  );
}
```

### Configuración avanzada

```tsx
import { MultiplicationTablesTrainer } from '@/components/learning/MultiplicationTablesTrainer';
import type { ProgressSnapshot } from '@/components/learning/types';

export default function Page() {
  const handleProgressChange = (snapshot: ProgressSnapshot) => {
    console.log('Progreso actualizado:', snapshot);
    // Enviar a analytics, mostrar notificaciones, etc.
  };

  return (
    <MultiplicationTablesTrainer
      minTable={1}
      maxTable={12}
      defaultMode="practice"
      defaultSelectedTables={[2, 3, 4, 5]}
      defaultQuestionCount={10}
      enableTimer={true}
      onProgressChange={handleProgressChange}
      i18n={{
        feedback: {
          correct: '¡Perfecto!',
          excellent: '¡Increíble trabajo!'
        }
      }}
      className="bg-white rounded-lg shadow-sm"
    />
  );
}
```

## 🔧 API del Componente

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `minTable` | `number` | `1` | Tabla mínima disponible |
| `maxTable` | `number` | `12` | Tabla máxima disponible |
| `defaultMode` | `'explore' \| 'practice' \| 'quiz'` | `'explore'` | Modo inicial |
| `defaultSelectedTables` | `number[]` | `[2,3,4]` | Tablas preseleccionadas |
| `defaultQuestionCount` | `number` | `10` | Cantidad de preguntas por defecto |
| `enableTimer` | `boolean` | `true` | Habilitar timer en modo quiz |
| `i18n` | `Partial<I18nStrings>` | `undefined` | Textos personalizados |
| `onProgressChange` | `(snapshot: ProgressSnapshot) => void` | `undefined` | Callback al cambiar progreso |
| `className` | `string` | `undefined` | Clases CSS adicionales |

### Tipos exportados

```tsx
import type { 
  TablesTrainerProps,
  Mode,
  Question,
  ProgressSnapshot,
  QuizResult 
} from '@/components/learning/types';
```

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch

# UI de tests (si instalaste @vitest/ui)
npm run test:ui
```

### Tests incluidos

- ✅ Funciones de almacenamiento (localStorage)
- ✅ Generación de preguntas
- ✅ Cálculo de precisión y rachas
- ✅ Funciones de internacionalización
- ✅ Validaciones de tipos

## ♿ Accesibilidad

El componente cumple con WCAG 2.1 AA:

- **Navegación por teclado**: Tab, Enter, flechas
- **Screen readers**: ARIA labels, live regions, semantic HTML
- **Contraste**: Mínimo 4.5:1 en todos los elementos
- **Focus visible**: Indicadores claros de foco
- **Textos descriptivos**: Labels y descripciones apropiadas

### Atajos de teclado

- `Tab` / `Shift+Tab`: Navegar entre elementos
- `Enter`: Enviar respuesta / Continuar
- `Espacio`: Activar checkboxes y botones
- `Escape`: Cerrar diálogos (futuro)

## 📱 Responsividad

- **Mobile First**: Optimizado para pantallas pequeñas
- **Breakpoints**: sm (640px), md (768px), lg (1024px)
- **Touch-friendly**: Botones grandes, espaciado adecuado
- **Orientación**: Funciona en portrait y landscape

## 🎨 Personalización

### Temas de colores

El componente usa las variables CSS de Tailwind. Para personalizar:

```css
/* En tu globals.css */
:root {
  --primary: 220 14.3% 95.9%;    /* Azul personalizado */
  --secondary: 210 40% 98%;      /* Gris personalizado */
  /* ... otros colores */
}
```

### Textos personalizados

```tsx
const customI18n = {
  modes: {
    explore: 'Explorar',
    practice: 'Entrenar', 
    quiz: 'Desafío'
  },
  feedback: {
    correct: '¡Excelente!',
    incorrect: 'Sigue intentando',
    perfectScore: '¡Eres un genio!'
  }
};

<MultiplicationTablesTrainer i18n={customI18n} />
```

## 🔄 Migración y actualizaciones

### Desde versión anterior

Si ya tienes una versión anterior:

1. Haz backup de los datos de localStorage
2. Actualiza los archivos
3. Verifica que las props siguen siendo compatibles
4. Ejecuta los tests

### Datos de localStorage

Los datos se guardan en:

- `multiplication_trainer_progress`: Progreso del usuario
- `multiplication_trainer_settings`: Configuraciones

## 🐛 Troubleshooting

### Errores comunes

#### **Error: Cannot find module '@/components/ui/...'**

```bash
# Instalar componentes faltantes de shadcn/ui
npx shadcn-ui@latest add [component-name]
```

#### **Error: localStorage is not defined**

```tsx
// El componente maneja esto automáticamente, pero si necesitas:
if (typeof window !== 'undefined') {
  // código que usa localStorage
}
```

#### **Estilos no se aplican correctamente**

```bash
# Verificar que Tailwind incluye los archivos del componente
# en tailwind.config.js -> content array
```

#### **TypeScript errors**

```bash
# Verificar versiones
npm list typescript @types/react @types/node

# Si hay conflictos, actualizar
npm update
```

## 📄 Licencia

MIT License. Ver archivo LICENSE para más detalles.

## 🤝 Contribuciones

1. Fork el proyecto
2. Crea una branch para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la branch (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📞 Soporte

- **Issues**: Reporta bugs en GitHub Issues
- **Documentación**: Revisa el README y comentarios en el código
- **Ejemplos**: Ver `app/learn/page.tsx` para uso completo

---

## 📋 Checklist de instalación

- [ ] Next.js 14+ con TypeScript instalado
- [ ] Tailwind CSS configurado
- [ ] shadcn/ui inicializado
- [ ] Componentes de shadcn/ui instalados
- [ ] Archivos del componente copiados
- [ ] Ejemplo de uso funcionando
- [ ] Tests ejecutándose (opcional)
- [ ] ESLint sin errores
- [ ] TypeScript compilando sin errores

¡Ya estás listo para usar el Multiplication Tables Trainer! 🎉
