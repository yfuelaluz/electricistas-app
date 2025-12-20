# 🚀 Sistema de Componentes Modernos - ELIENAI SPA

Esta aplicación ha sido completamente renovada con un diseño moderno, profesional y funcional. A continuación se detallan todos los componentes y funcionalidades implementadas.

## 🎨 Paleta de Colores

La aplicación utiliza una paleta de colores moderna basada en azul:

### Colores Principales
- **Primary (Azul)**: `#3b82f6` - Color principal de la marca
- **Secondary (Gris oscuro)**: `#0f172a` - Para textos y elementos secundarios
- **Accent (Cyan)**: `#06b6d4` - Para destacar elementos importantes

### Colores de Estado
- **Success (Verde)**: `#10b981`
- **Warning (Amarillo)**: `#f59e0b`
- **Error (Rojo)**: `#ef4444`
- **Info (Azul)**: `#3b82f6`

## 📦 Componentes UI Disponibles

### 1. Button (Botón Moderno)
Botón con múltiples variantes y estados de carga.

```tsx
import { Button } from '@/components/ui/button';

<Button variant="primary" size="md" isLoading={false}>
  Clic aquí
</Button>
```

**Variantes**: `primary`, `secondary`, `accent`, `outline`, `ghost`
**Tamaños**: `sm`, `md`, `lg`

### 2. Card (Tarjeta Moderna)
Contenedor elegante con efectos glassmorphism.

```tsx
import { Card } from '@/components/ui/Card';

<Card hover glass>
  Contenido de la tarjeta
</Card>
```

**Props**:
- `hover`: Efecto hover (elevación)
- `glass`: Efecto glassmorphism
- `gradient`: Fondo con gradiente

### 3. Modal (Diálogo Modal)
Modal responsivo con animaciones suaves.

```tsx
import { Modal } from '@/components/ui/Modal';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Título del Modal"
  size="md"
>
  Contenido del modal
</Modal>
```

**Tamaños**: `sm`, `md`, `lg`, `xl`

### 4. Badge (Insignia)
Etiquetas coloridas para estados y categorías.

```tsx
import { Badge } from '@/components/ui/Badge';

<Badge variant="success" size="md">
  Verificado
</Badge>
```

**Variantes**: `primary`, `success`, `warning`, `error`, `info`

### 5. Rating (Sistema de Valoración)
Componente de estrellas interactivo.

```tsx
import { Rating } from '@/components/ui/Rating';

<Rating
  value={4.5}
  onChange={(value) => console.log(value)}
  size="lg"
  showValue
/>
```

### 6. Navigation (Navegación Principal)
Barra de navegación moderna con menú responsive.

```tsx
import Navigation from '@/components/ui/Navigation';

<Navigation />
```

### 7. Footer (Pie de Página)
Footer completo con enlaces y redes sociales.

```tsx
import Footer from '@/components/ui/Footer';

<Footer />
```

## 🛠 Componentes de Servicios

### 1. MapLocation (Geolocalización)
Mapa interactivo con ubicación y direcciones.

```tsx
import MapLocation from '@/components/services/MapLocation';

<MapLocation
  address="Valparaíso, Chile"
  lat={-33.047}
  lng={-71.627}
  onLocationSelect={(location) => console.log(location)}
/>
```

**Funcionalidades**:
- Obtener ubicación del usuario
- Mostrar mapa de Google Maps
- Botón "Cómo llegar" (abre Google Maps)

### 2. RatingSystem (Sistema de Valoraciones)
Sistema completo de reseñas y valoraciones.

```tsx
import RatingSystem from '@/components/services/RatingSystem';

<RatingSystem
  targetId="professional-1"
  targetType="professional"
  currentUserType="client"
  reviews={reviews}
  averageRating={4.7}
  totalReviews={10}
  onSubmitReview={(review) => console.log(review)}
/>
```

**Funcionalidades**:
- Mostrar valoración promedio
- Lista de reseñas con verificación
- Formulario para dejar valoración
- Diferenciación cliente/profesional

### 3. PaymentGateway (Pasarela de Pagos)
Sistema seguro de procesamiento de pagos.

```tsx
import PaymentGateway from '@/components/services/PaymentGateway';

<PaymentGateway
  amount={85000}
  serviceName="Instalación Eléctrica"
  professionalName="Juan Electricista"
  onPaymentSuccess={(paymentId) => console.log(paymentId)}
  onPaymentCancel={() => console.log('Cancelado')}
/>
```

**Funcionalidades**:
- Múltiples métodos de pago
- Proceso de pago paso a paso
- Protección de pago (escrow)
- Confirmación segura

### 4. SubscriptionPlans (Planes de Suscripción)
Planes con toggle mensual/anual.

```tsx
import SubscriptionPlans from '@/components/services/SubscriptionPlans';

<SubscriptionPlans
  userType="client" // o "professional"
  currentPlan="premium"
  onSelectPlan={(planId) => console.log(planId)}
/>
```

**Funcionalidades**:
- Planes para clientes y profesionales
- Toggle mensual/anual con descuento
- Comparación de características
- Destacado de plan popular

## 📱 Páginas Implementadas

### 1. Página Principal (`/`)
La página de inicio original con mejoras visuales.

### 2. Servicios (`/servicios`)
Catálogo completo de servicios con:
- Grid de servicios con cards modernas
- Sistema de geolocalización
- Valoraciones de clientes
- Pasarela de pagos integrada

### 3. Suscripciones (`/suscripciones`)
Página de planes con:
- Toggle cliente/profesional
- Comparación de planes
- FAQs
- CTA de registro

### 4. Electricidad (`/electricidad`)
Servicios especializados de electricidad.

### 5. Carpintería (`/carpinteria`)
Servicios de carpintería.

## 🎯 Características Principales

### ✨ Diseño Moderno
- Gradientes suaves y profesionales
- Efectos glassmorphism
- Sombras y elevaciones sutiles
- Animaciones fluidas

### 🎨 Sistema de Colores
- Paleta coherente basada en azul
- Configuración centralizada en Tailwind
- Variables CSS para fácil personalización

### 📱 Totalmente Responsive
- Mobile-first design
- Breakpoints optimizados
- Menú hamburguesa en móviles

### ♿ Accesibilidad
- Contraste adecuado
- Focus states visibles
- Skip links para teclado
- ARIA labels

### 🔒 Seguridad
- Procesamiento de pagos seguro
- Protección de datos
- Verificación de usuarios

### 🌍 Geolocalización
- Obtener ubicación del usuario
- Integración con Google Maps
- Direcciones automáticas

### ⭐ Sistema de Valoraciones
- Estrellas interactivas
- Verificación de usuarios
- Comentarios y fechas

### 💳 Pagos Seguros
- Múltiples métodos
- Protección escrow
- Proceso paso a paso

### 📊 Suscripciones
- Planes flexibles
- Toggle mensual/anual
- Descuentos por anualidad

## 🚀 Cómo Usar

### Desarrollo
```bash
cd electricistas-app
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Navegación
- **Inicio**: `/`
- **Servicios**: `/servicios`
- **Suscripciones**: `/suscripciones`
- **Electricidad**: `/electricidad`
- **Carpintería**: `/carpinteria`

## 🎨 Personalización

### Cambiar Colores
Edita `tailwind.config.js`:
```js
colors: {
  primary: {
    500: '#TU_COLOR',
    // ...
  }
}
```

### Agregar Nuevos Servicios
Edita `/servicios/page.tsx` y agrega al array `services`:
```tsx
{
  id: 'mi-servicio',
  name: 'Mi Servicio',
  category: 'Categoría',
  price: 50000,
  duration: '2 horas',
  icon: <svg>...</svg>,
  description: 'Descripción',
  features: ['Feature 1', 'Feature 2'],
}
```

### Modificar Planes
Edita `SubscriptionPlans.tsx` y modifica los arrays `clientPlans` o `professionalPlans`.

## 📦 Dependencias Principales
- Next.js 14
- React 18
- TailwindCSS 3
- TypeScript

## 🔧 Próximas Mejoras
- Integración con backend real
- Autenticación de usuarios
- Dashboard de profesionales
- Chat en tiempo real
- Notificaciones push
- Sistema de reservas
- Calendario integrado

## 📞 Soporte
Para consultas o soporte, contacta a través de:
- Email: yfuelaluz@gmail.com
- WhatsApp: +56 9 9574 8162

---

**Desarrollado con ❤️ para ELIENAI SPA**
