# 🔧 Guía de Refactorización - page.tsx

## 📊 Análisis del Problema

**Archivo:** [src/app/page.tsx](src/app/page.tsx)
**Líneas:** 2,543 (demasiado grande)
**Problemas:**
- Difícil de mantener
- Difícil de testear
- Muchos estados locales
- Lógica mezclada con UI

---

## 🎯 Plan de Refactorización

### Fase 1: Extraer Componentes de UI (1-2 horas)

#### 1.1 Crear componente HeroSection
```typescript
// src/components/home/HeroSection.tsx
export default function HeroSection() {
  return (
    <div className="hero-container">
      <h1>¿QUÉ NECESITAS?</h1>
      <p>Conectamos profesionales con clientes en toda la V Región</p>
    </div>
  );
}
```

#### 1.2 Crear componente ServicesGrid
```typescript
// src/components/home/ServicesGrid.tsx
export default function ServicesGrid({ 
  servicios, 
  onSelectServicio 
}: Props) {
  return (
    <div className="services-grid">
      {servicios.map(servicio => (
        <ServiceCard key={servicio.categoria} {...servicio} />
      ))}
    </div>
  );
}
```

#### 1.3 Crear componente SubscriptionPlans
```typescript
// src/components/home/SubscriptionPlans.tsx
export default function SubscriptionPlans({ 
  planes, 
  tipoUsuario,
  onProcesarPago 
}: Props) {
  // Lógica de planes
}
```

### Fase 2: Extraer Lógica de Negocio (2-3 horas)

#### 2.1 Crear custom hooks

```typescript
// src/lib/hooks/useProfesionales.ts
export function useProfesionales() {
  const [profesionales, setProfesionales] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadProfesionales();
  }, []);
  
  async function loadProfesionales() {
    // Lógica de carga
  }
  
  return { profesionales, loading, refetch: loadProfesionales };
}
```

```typescript
// src/lib/hooks/useGaleria.ts
export function useGaleria() {
  const [galeria, setGaleria] = useState({});
  
  useEffect(() => {
    loadGaleria();
  }, []);
  
  return { galeria, categorias: Object.keys(galeria) };
}
```

```typescript
// src/lib/hooks/useWebpayPayment.ts
export function useWebpayPayment() {
  async function procesarPago(plan: string) {
    // Lógica de pago
  }
  
  return { procesarPago };
}
```

#### 2.2 Crear servicios

```typescript
// src/lib/services/profesionales.service.ts
export class ProfesionalesService {
  static async getAll() {
    const res = await fetch('/api/profesionales');
    return res.json();
  }
  
  static async getById(id: number) {
    const res = await fetch(`/api/profesionales/${id}`);
    return res.json();
  }
}
```

```typescript
// src/lib/services/galeria.service.ts
export class GaleriaService {
  static async getAll() {
    const res = await fetch('/api/galeria');
    return res.json();
  }
}
```

### Fase 3: Implementar Estado Global (2-3 horas)

```bash
npm install zustand
```

```typescript
// src/lib/store/useAppStore.ts
import { create } from 'zustand';

interface AppState {
  vistaActual: string;
  setVistaActual: (vista: string) => void;
  
  tipoUsuario: 'cliente' | 'profesional' | null;
  setTipoUsuario: (tipo: 'cliente' | 'profesional' | null) => void;
  
  profesionalSeleccionado: Profesional | null;
  setProfesionalSeleccionado: (prof: Profesional | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  vistaActual: 'home',
  setVistaActual: (vista) => set({ vistaActual: vista }),
  
  tipoUsuario: null,
  setTipoUsuario: (tipo) => set({ tipoUsuario: tipo }),
  
  profesionalSeleccionado: null,
  setProfesionalSeleccionado: (prof) => set({ profesionalSeleccionado: prof }),
}));
```

### Fase 4: Reorganizar Estructura (1-2 horas)

```
src/
  app/
    page.tsx (SIMPLIFICADO - ~150 líneas)
  
  components/
    home/
      HeroSection.tsx
      ServicesGrid.tsx
      ServiceCard.tsx
      ProfessionalList.tsx
      ProfessionalCard.tsx
      ProfessionalDetailModal.tsx
      GalleryView.tsx
      GalleryImageModal.tsx
      SubscriptionPlans.tsx
      PlanCard.tsx
      VisitRequestForm.tsx
      PaymentSuccessMessage.tsx
    
    forms/
      ContactForm.tsx
      VisitaForm.tsx
    
    layouts/
      Header.tsx
      Navigation.tsx
      Footer.tsx
  
  lib/
    hooks/
      useProfesionales.ts
      useGaleria.ts
      useWebpayPayment.ts
      useVisitas.ts
    
    services/
      profesionales.service.ts
      galeria.service.ts
      webpay.service.ts
      cotizaciones.service.ts
    
    store/
      useAppStore.ts
    
    utils/
      constants.ts
      whatsapp.ts
```

---

## 📝 Ejemplo: page.tsx Refactorizado

```typescript
// src/app/page.tsx (DESPUÉS DE REFACTORIZAR)
"use client";
import { Header } from '@/components/layouts/Header';
import { Navigation } from '@/components/layouts/Navigation';
import { Footer } from '@/components/layouts/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { ServicesGrid } from '@/components/home/ServicesGrid';
import { ProfessionalList } from '@/components/home/ProfessionalList';
import { GalleryView } from '@/components/home/GalleryView';
import { SubscriptionPlans } from '@/components/home/SubscriptionPlans';
import { useAppStore } from '@/lib/store/useAppStore';
import { useEffect } from 'react';

export default function HomePage() {
  const { vistaActual } = useAppStore();
  
  // Redirigir si hay pago exitoso
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('pago') === 'exitoso') {
      window.location.replace(`/suscripciones?${params.toString()}`);
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black">
      <Header />
      <Navigation />
      
      <main className="pt-5">
        {vistaActual === 'home' && <HeroSection />}
        {vistaActual === 'servicios' && <ServicesGrid />}
        {vistaActual === 'profesionales' && <ProfessionalList />}
        {vistaActual === 'galeria' && <GalleryView />}
        {vistaActual === 'suscripciones' && <SubscriptionPlans />}
      </main>
      
      <Footer />
    </div>
  );
}
```

**Resultado:** De 2,543 líneas → ~150 líneas ✅

---

## 🚀 Comandos para Implementar

```bash
# Crear estructura de carpetas
mkdir -p src/components/home
mkdir -p src/components/forms
mkdir -p src/components/layouts
mkdir -p src/lib/hooks
mkdir -p src/lib/services
mkdir -p src/lib/store

# Instalar Zustand para estado global
npm install zustand

# Instalar Zod para validación
npm install zod @hookform/resolvers react-hook-form
```

---

## ✅ Checklist de Refactorización

### Componentes a Crear
- [ ] `HeroSection.tsx`
- [ ] `ServicesGrid.tsx`
- [ ] `ServiceCard.tsx`
- [ ] `ProfessionalList.tsx`
- [ ] `ProfessionalCard.tsx`
- [ ] `ProfessionalDetailModal.tsx`
- [ ] `GalleryView.tsx`
- [ ] `GalleryImageModal.tsx`
- [ ] `SubscriptionPlans.tsx`
- [ ] `PlanCard.tsx`
- [ ] `VisitRequestForm.tsx`
- [ ] `PaymentSuccessMessage.tsx`
- [ ] `Header.tsx`
- [ ] `Navigation.tsx`
- [ ] `Footer.tsx`

### Custom Hooks
- [ ] `useProfesionales.ts`
- [ ] `useGaleria.ts`
- [ ] `useWebpayPayment.ts`
- [ ] `useVisitas.ts`

### Services
- [ ] `profesionales.service.ts`
- [ ] `galeria.service.ts`
- [ ] `webpay.service.ts`
- [ ] `cotizaciones.service.ts`

### Store
- [ ] `useAppStore.ts`

### Constantes
- [ ] Mover `serviciosDestacados` a `constants.ts`
- [ ] Mover `planesCliente` y `planesProfesional` a `constants.ts`

---

## 📦 Beneficios Esperados

1. **Mantenibilidad:** Código organizado y fácil de entender
2. **Reusabilidad:** Componentes pueden reutilizarse
3. **Testing:** Componentes pequeños son más fáciles de testear
4. **Performance:** Mejor optimización con React.memo
5. **Colaboración:** Múltiples desarrolladores pueden trabajar sin conflictos
6. **Escalabilidad:** Fácil agregar nuevas features

---

## ⚠️ Recomendaciones

1. **Hacer un commit antes de empezar**
   ```bash
   git add .
   git commit -m "Backup antes de refactorización"
   ```

2. **Refactorizar de forma incremental**
   - No intentar hacer todo de una vez
   - Hacer un componente a la vez
   - Testear después de cada cambio

3. **Mantener funcionalidad**
   - No cambiar lógica, solo reorganizar
   - Verificar que todo siga funcionando

4. **Documentar cambios**
   - Agregar comentarios JSDoc
   - Actualizar README si es necesario

---

¿Quieres que comience con la refactorización ahora o prefieres hacerlo más adelante?
