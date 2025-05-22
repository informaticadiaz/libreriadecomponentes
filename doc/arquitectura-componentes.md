# Estructura de Carpetas - Sistema Inmobiliario con ShadCN UI

## 📁 Estructura Principal del Proyecto

```folder
src/
├── components/
│   ├── ui/                           # 🎨 Componentes ShadCN Base (Auto-generados)
│   │   ├── accordion.tsx
│   │   ├── alert.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── aspect-ratio.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── combobox.tsx
│   │   ├── command.tsx
│   │   ├── context-menu.tsx
│   │   ├── data-table.tsx
│   │   ├── date-picker.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── hover-card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── menubar.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── pagination.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── resizable.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── spinner.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toggle.tsx
│   │   ├── toggle-group.tsx
│   │   └── tooltip.tsx
│   │
│   ├── shared/                       # 🔧 Componentes Compartidos Personalizados
│   │   ├── forms/
│   │   │   ├── PropertyForm.tsx
│   │   │   ├── ClientForm.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   ├── UserForm.tsx
│   │   │   ├── SearchForm.tsx
│   │   │   └── FilterForm.tsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── PageLayout.tsx
│   │   │   ├── GridLayout.tsx
│   │   │   └── SidebarLayout.tsx
│   │   │
│   │   ├── navigation/
│   │   │   ├── MainNavigation.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── TopBar.tsx
│   │   │   ├── BackButton.tsx
│   │   │   └── BreadcrumbNav.tsx
│   │   │
│   │   ├── feedback/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── SuccessMessage.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   └── NotificationCenter.tsx
│   │   │
│   │   └── data-display/
│   │       ├── StatusBadge.tsx
│   │       ├── PriceDisplay.tsx
│   │       ├── DateDisplay.tsx
│   │       ├── ImageGallery.tsx
│   │       ├── StatCard.tsx
│   │       └── ChartContainer.tsx
│   │
│   ├── modules/                      # 🏗️ Componentes Específicos por Módulo
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   ├── PasswordResetForm.tsx
│   │   │   └── ProfileSettings.tsx
│   │   │
│   │   ├── properties/
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PropertyList.tsx
│   │   │   ├── PropertyDetails.tsx
│   │   │   ├── PropertySearch.tsx
│   │   │   ├── PropertyFilters.tsx
│   │   │   ├── PropertyMap.tsx
│   │   │   ├── PropertyGallery.tsx
│   │   │   ├── PropertyStatus.tsx
│   │   │   └── PropertyComparison.tsx
│   │   │
│   │   ├── clients/
│   │   │   ├── ClientCard.tsx
│   │   │   ├── ClientList.tsx
│   │   │   ├── ClientDetails.tsx
│   │   │   ├── ClientTimeline.tsx
│   │   │   ├── ClientInteractions.tsx
│   │   │   ├── ClientDocuments.tsx
│   │   │   └── ClientStatus.tsx
│   │   │
│   │   ├── payments/
│   │   │   ├── PaymentCard.tsx
│   │   │   ├── PaymentList.tsx
│   │   │   ├── PaymentSchedule.tsx
│   │   │   ├── PaymentTracker.tsx
│   │   │   ├── InvoiceGenerator.tsx
│   │   │   ├── PaymentMethods.tsx
│   │   │   └── FinancialSummary.tsx
│   │   │
│   │   └── reports/
│   │       ├── SalesReport.tsx
│   │       ├── FinancialReport.tsx
│   │       ├── PropertyReport.tsx
│   │       ├── ClientReport.tsx
│   │       ├── ReportFilters.tsx
│   │       ├── ReportChart.tsx
│   │       └── ReportExporter.tsx
│   │
│   └── providers/                    # 🌐 Context Providers
│       ├── ThemeProvider.tsx
│       ├── AuthProvider.tsx
│       ├── ToastProvider.tsx
│       ├── ModalProvider.tsx
│       └── DataProvider.tsx
│
├── hooks/                            # 🪝 Custom Hooks
│   ├── useAuth.ts
│   ├── useTheme.ts
│   ├── useProperties.ts
│   ├── useClients.ts
│   ├── usePayments.ts
│   ├── useReports.ts
│   ├── useComponentState.ts
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   └── usePermissions.ts
│
├── lib/                              # 📚 Utilidades y Configuraciones
│   ├── utils.ts                      # Funciones utilitarias generales
│   ├── variants.ts                   # Variantes de componentes (CVA)
│   ├── validations.ts               # Esquemas de validación (Zod)
│   ├── constants.ts                 # Constantes de la aplicación
│   ├── api.ts                       # Configuración de API
│   ├── auth.ts                      # Configuración de autenticación
│   └── permissions.ts               # Sistema de permisos
│
├── styles/                           # 🎨 Estilos Globales
│   ├── globals.css                  # Estilos globales con variables CSS
│   ├── components.css               # Estilos de componentes personalizados
│   └── animations.css               # Animaciones personalizadas
│
├── types/                            # 📝 Definiciones de Tipos TypeScript
│   ├── api.ts                       # Tipos de respuestas de API
│   ├── auth.ts                      # Tipos de autenticación
│   ├── property.ts                  # Tipos de propiedades
│   ├── client.ts                    # Tipos de clientes
│   ├── payment.ts                   # Tipos de pagos
│   ├── report.ts                    # Tipos de reportes
│   └── common.ts                    # Tipos comunes
│
├── domain/                           # 🏛️ Lógica de Negocio (Clean Architecture)
│   ├── entities/
│   │   ├── Property.ts
│   │   ├── Client.ts
│   │   ├── Payment.ts
│   │   └── User.ts
│   │
│   ├── repositories/
│   │   ├── PropertyRepository.ts
│   │   ├── ClientRepository.ts
│   │   ├── PaymentRepository.ts
│   │   └── UserRepository.ts
│   │
│   └── use-cases/
│       ├── properties/
│       ├── clients/
│       ├── payments/
│       └── reports/
│
├── infrastructure/                   # 🔧 Implementaciones Externas
│   ├── api/
│   │   ├── endpoints/
│   │   ├── interceptors/
│   │   └── services/
│   │
│   ├── storage/
│   │   ├── localStorage.ts
│   │   ├── sessionStorage.ts
│   │   └── indexedDB.ts
│   │
│   └── repositories/
│       ├── ApiPropertyRepository.ts
│       ├── ApiClientRepository.ts
│       └── ApiPaymentRepository.ts
│
└── app/                              # 📄 Páginas/Rutas (si usas App Router)
    ├── (auth)/
    │   ├── login/
    │   └── register/
    │
    ├── (dashboard)/
    │   ├── properties/
    │   ├── clients/
    │   ├── payments/
    │   └── reports/
    │
    ├── layout.tsx
    ├── page.tsx
    ├── loading.tsx
    ├── error.tsx
    └── not-found.tsx
```

## 🎯 Comandos de Instalación por Categoría

### Componentes de Formularios

```bash
npx shadcn-ui@latest add input textarea select checkbox radio-group switch slider form label calendar date-picker popover
```

### Componentes de Navegación

```bash
npx shadcn-ui@latest add navigation-menu breadcrumb tabs menubar dropdown-menu context-menu pagination
```

### Componentes de Layout

```bash
npx shadcn-ui@latest add card sheet separator scroll-area resizable aspect-ratio
```

### Componentes de Feedback

```bash
npx shadcn-ui@latest add dialog alert-dialog toast alert progress skeleton spinner
```

### Componentes de Datos

```bash
npx shadcn-ui@latest add table data-table badge avatar tooltip hover-card collapsible accordion
```

### Componentes de Acción

```bash
npx shadcn-ui@latest add button toggle toggle-group
```

### Componentes Especializados

```bash
npx shadcn-ui@latest add command combobox drawer
```

## 📋 Notas de Organización

1. **`/components/ui/`**: Contiene todos los componentes ShadCN sin modificar
2. **`/components/shared/`**: Componentes reutilizables personalizados
3. **`/components/modules/`**: Componentes específicos del dominio inmobiliario
4. **`/components/providers/`**: Context providers para estado global
5. **`/hooks/`**: Custom hooks para lógica reutilizable
6. **`/lib/`**: Utilidades, configuraciones y helpers
7. **`/types/`**: Definiciones de tipos TypeScript
8. **`/domain/`**: Lógica de negocio (Clean Architecture)
9. **`/infrastructure/`**: Implementaciones de servicios externos

Esta estructura sigue los principios de Clean Architecture y permite una fácil escalabilidad y mantenimiento del sistema inmobiliario.
