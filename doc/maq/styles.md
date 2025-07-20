# Stylos

Basándome en la información de **monopolio.com.mx** como plataforma inmobiliaria inteligente que utiliza IA, aquí está la **guía de referencia de estilos** para los componentes:

## **Filosofía de Diseño**

**Confianza y Profesionalismo:** Monopolio es una plataforma financiera/inmobiliaria que maneja decisiones de alto valor, por lo que el diseño debe transmitir solidez, confiabilidad y expertise técnico.

**Accesibilidad de Datos:** Como democratiza información compleja del mercado inmobiliario, la interfaz debe hacer que datos sofisticados se sientan simples y comprensibles.

---

## **Paleta de Colores**

**Colores Primarios:**

- **Azul Corporativo:** `#1E40AF` - Para elementos principales, CTAs primarios, headers
- **Azul Claro:** `#3B82F6` - Estados hover, links, elementos interactivos
- **Azul Suave:** `#EFF6FF` - Fondos de cards, estados de foco

**Colores Secundarios:**

- **Verde Dinero:** `#10B981` - Precios, valores positivos, confirmaciones
- **Verde Claro:** `#D1FAE5` - Fondos de alertas positivas, métricas favorables

**Colores de Estado:**

- **Naranja Atención:** `#F59E0B` - Advertencias, información importante
- **Rojo Crítico:** `#EF4444` - Errores, valores negativos, alertas
- **Gris Neutral:** `#6B7280` - Texto secundario, placeholders

**Escala de Grises:**

- **Texto Principal:** `#111827`
- **Texto Secundario:** `#4B5563`
- **Bordes:** `#E5E7EB`
- **Fondos:** `#F9FAFB`

---

## **Tipografía**

**Font Stack Principal:**

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif
```

**Jerarquía Tipográfica:**

- **H1 - Títulos Principales:** 32px, font-weight: 700, line-height: 1.2
- **H2 - Secciones:** 24px, font-weight: 600, line-height: 1.3  
- **H3 - Subsecciones:** 20px, font-weight: 600, line-height: 1.4
- **Body - Texto Principal:** 16px, font-weight: 400, line-height: 1.5
- **Small - Texto Secundario:** 14px, font-weight: 400, line-height: 1.4
- **Caption - Metadatos:** 12px, font-weight: 500, line-height: 1.3

**Font Weights:**

- Regular (400) para texto corriente
- Medium (500) para labels y metadatos importantes  
- Semibold (600) para títulos y elementos destacados
- Bold (700) solo para títulos principales

---

## **Espaciado y Layout**

**Sistema de Espaciado (múltiplos de 4px):**

- **Micro:** 4px, 8px - Spacing interno en componentes pequeños
- **Pequeño:** 12px, 16px - Padding de botones, gaps entre elementos
- **Medio:** 20px, 24px - Margins entre secciones, padding de cards
- **Grande:** 32px, 40px - Separación entre módulos principales
- **Extra Grande:** 48px, 64px - Margins de layout principal

**Contenedores:**

- **Max Width:** 1200px para contenido principal
- **Gutter:** 24px en desktop, 16px en mobile
- **Cards:** border-radius: 8px, shadow: 0 1px 3px rgba(0,0,0,0.1)

---

## **Componentes Base**

**Botones:**

```css
Primary: bg-blue-600, hover:bg-blue-700, text-white, px-6 py-3, rounded-lg
Secondary: bg-white, border-gray-300, hover:bg-gray-50, text-gray-700
Outline: border-blue-600, text-blue-600, hover:bg-blue-50
```

**Inputs:**

```css
border: 1px solid #D1D5DB, focus:border-blue-500, focus:ring-2 focus:ring-blue-200
padding: 12px 16px, rounded-lg, placeholder:text-gray-400
```

**Cards:**

```css
background: white, border: 1px solid #E5E7EB, rounded-lg
padding: 24px, shadow: 0 1px 3px rgba(0,0,0,0.1)
hover: shadow: 0 4px 6px rgba(0,0,0,0.07)
```

---

## **Elementos Específicos Inmobiliarios**

**Price Tags:**

- Precios grandes: font-size: 28px, font-weight: 700, color: verde dinero
- Precios por m²: font-size: 16px, font-weight: 500, color: gris neutro

**Property Cards:**

- Imagen: aspect-ratio 4:3, border-radius: 8px
- Información: padding 16px, línea divisoria sutil
- Estado: badges con colores distintivos (disponible/vendido/reservado)

**Map Elements:**

- Markers: colores según rango de precios (verde=barato, amarillo=medio, rojo=caro)
- Info windows: fondo blanco, sombra pronunciada, border-radius: 12px

---

## **Estados Interactivos**

**Hover States:**

- Elevación sutil en cards (shadow increase)
- Cambio de color 1 tono más oscuro en botones
- Border color change en inputs

**Focus States:**

- Ring azul de 2px con 20% opacity
- Outline nunca removed, siempre visible para accesibilidad

**Loading States:**

- Skeletons en gris claro (`#F3F4F6`)
- Animación subtle pulse
- Spinners en color azul primario

---

## **Responsive Behavior**

**Breakpoints:**

- Mobile: < 640px
- Tablet: 640px - 1024px  
- Desktop: > 1024px

**Mobile Adaptations:**

- Font sizes reducidos 2-4px
- Padding reducido en cards (16px instead of 24px)
- Stack layouts instead of grid
- Touch targets mínimo 44px

Esta guía está diseñada para crear una experiencia que transmita **confianza profesional** mientras mantiene la **accesibilidad** y **claridad** necesaria para decisiones financieras importantes como la compra/renta de propiedades.
