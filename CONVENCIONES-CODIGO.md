# 📚 Convenciones de Código - Electricistas App

**Fecha:** 26 de diciembre de 2025  
**Versión:** 2.0  
**Autor:** Equipo de Desarrollo

---

## 🎯 FILOSOFÍA DE NOMENCLATURA

Este proyecto sigue un patrón **dual de nomenclatura** que separa claramente las responsabilidades de cada capa:

```
Base de Datos (Supabase)  →  Backend APIs  →  Frontend Components
   [snake_case]          →   [transformación] →    [camelCase]
```

---

## 🗄️ CAPA DE BASE DE DATOS (Supabase)

**Convención:** `snake_case`

### Tablas y Columnas

Todas las tablas y columnas en PostgreSQL/Supabase usan `snake_case`:

```sql
-- ✅ CORRECTO
CREATE TABLE profesionales (
  id SERIAL PRIMARY KEY,
  nombre_completo TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  foto_perfil TEXT,
  trabajos_realizados INTEGER DEFAULT 0,
  leads_usados INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ❌ INCORRECTO
CREATE TABLE profesionales (
  nombreCompleto TEXT,
  passwordHash TEXT,
  fotoPerfil TEXT
);
```

### Razones para snake_case en DB:

- ✅ Convención estándar de PostgreSQL
- ✅ Compatible con SQL sin comillas
- ✅ Consistente con nombres de funciones SQL
- ✅ Más legible en consultas largas

---

## 🔧 CAPA DE BACKEND (Next.js API Routes)

**Convención:** Recibe `snake_case` de DB, transforma a `camelCase` para frontend

### Patrón de Transformación

Todas las APIs implementan la función `toCamelCase()`:

```typescript
// src/app/api/profesionales/route.ts

function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result: any, key: string) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
}

// USO
export async function GET() {
  const { data } = await supabase
    .from('profesionales')
    .select('id, nombre_completo, foto_perfil, trabajos_realizados');
  
  // Transformar antes de enviar
  const profesionalesTransformados = toCamelCase(data);
  return NextResponse.json(profesionalesTransformados);
}
```

### Flujo de Datos

```
1. Query a Supabase (snake_case)
   ↓
   { nombre_completo: "Juan", trabajos_realizados: 5 }
   
2. Transformación con toCamelCase()
   ↓
   { nombreCompleto: "Juan", trabajosRealizados: 5 }
   
3. Respuesta JSON al frontend
```

### APIs que Implementan toCamelCase:

- ✅ `/api/profesionales`
- ✅ `/api/profesionales/login`
- ✅ `/api/profesionales/[id]`
- ✅ `/api/clientes`
- ✅ `/api/clientes/login`
- ✅ `/api/reviews`
- ✅ `/api/portfolio`
- ✅ `/api/cotizaciones`

---

## ⚛️ CAPA DE FRONTEND (React/Next.js)

**Convención:** `camelCase`

### Types y Interfaces

Todos los types TypeScript usan `camelCase`:

```typescript
// ✅ CORRECTO - src/types/profesional.ts
export interface Profesional {
  id: number;
  nombreCompleto: string;
  fotoPerfil?: string;
  trabajosRealizados?: number;
  leadsUsados?: number;
  createdAt?: string;
}

// ❌ INCORRECTO
export interface Profesional {
  nombre_completo: string;
  foto_perfil: string;
}
```

### Components y Variables

```typescript
// ✅ CORRECTO
const [profesionales, setProfesionales] = useState<Profesional[]>([]);

const nombreCompleto = profesional.nombreCompleto;
const trabajosRealizados = profesional.trabajosRealizados;

// ❌ INCORRECTO
const nombre_completo = profesional.nombre_completo;
```

### Razones para camelCase en Frontend:

- ✅ Convención estándar de JavaScript/TypeScript
- ✅ Consistente con React y Next.js
- ✅ Compatible con todas las librerías JS
- ✅ Mejor integración con ESLint y Prettier

---

## 📁 ESTRUCTURA DE TYPES CENTRALIZADOS

### Ubicación de Types

```
src/types/
├── profesional.ts    # Types para profesionales
├── cliente.ts        # Types para clientes
├── cotizacion.ts     # Types para cotizaciones
├── review.ts         # Types para reviews
└── portfolio.ts      # Types para portfolio
```

### Importación de Types

```typescript
// ✅ CORRECTO - Usar types centralizados
import { Profesional } from '@/types/profesional';
import { Cliente } from '@/types/cliente';

// ❌ INCORRECTO - Definir interfaces locales
interface Profesional {
  nombre: string;
}
```

---

## 🔄 FLUJO COMPLETO DE DATOS

### Ejemplo: Registro de Profesional

```typescript
// 1. FRONTEND - Formulario envía datos (camelCase)
const handleSubmit = async () => {
  await fetch('/api/profesionales', {
    method: 'POST',
    body: JSON.stringify({
      nombreCompleto: "Juan Pérez",
      fotoPerfil: "url.jpg"
    })
  });
};

// 2. BACKEND - API recibe y convierte a snake_case
export async function POST(req: NextRequest) {
  const body = await req.json();
  
  const { data } = await supabase
    .from('profesionales')
    .insert({
      nombre_completo: body.nombreCompleto,  // Conversión manual
      foto_perfil: body.fotoPerfil
    });
  
  // 3. BACKEND - Respuesta transformada a camelCase
  return NextResponse.json(toCamelCase(data));
}

// 4. FRONTEND - Recibe datos en camelCase
const profesional: Profesional = await response.json();
console.log(profesional.nombreCompleto); // ✅
```

---

## ✅ CHECKLIST DE DESARROLLO

### Al Crear una Nueva Tabla

- [ ] Usar `snake_case` para nombres de columnas
- [ ] Documentar esquema en SQL
- [ ] Crear migrations si es necesario

### Al Crear una Nueva API

- [ ] Implementar función `toCamelCase()`
- [ ] Transformar datos antes de enviar al frontend
- [ ] Convertir manualmente en operaciones de escritura

### Al Crear un Componente

- [ ] Importar types desde `@/types/`
- [ ] Usar `camelCase` para variables y props
- [ ] NO definir interfaces locales si existe el type

### Al Actualizar Types

- [ ] Actualizar archivo en `src/types/`
- [ ] Verificar que no existan interfaces duplicadas
- [ ] Ejecutar `npm run build` para validar

---

## 🎨 CONVENCIONES ADICIONALES

### Nombres de Archivos

```
✅ CORRECTO
- kebab-case.tsx
- profesionales-dashboard.tsx
- editar-perfil.tsx

❌ INCORRECTO
- ProfesionalesDashboard.tsx
- EditarPerfil.tsx
```

### Nombres de Componentes

```typescript
✅ CORRECTO
export default function EditarPerfilPage() {}
export function PortfolioManager() {}

❌ INCORRECTO
export default function editar_perfil_page() {}
```

### Constantes

```typescript
✅ CORRECTO
const MAX_LEADS = 50;
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

❌ INCORRECTO
const max_leads = 50;
```

---

## 🚨 ERRORES COMUNES Y SOLUCIONES

### Error 1: Acceder a campo snake_case en frontend

```typescript
// ❌ ERROR
console.log(profesional.nombre_completo);
// TypeError: Cannot read property of undefined

// ✅ SOLUCIÓN
console.log(profesional.nombreCompleto);
```

### Error 2: Enviar datos en formato incorrecto a DB

```typescript
// ❌ ERROR
await supabase.from('profesionales').insert({
  nombreCompleto: "Juan"
});
// Error: column "nombreCompleto" does not exist

// ✅ SOLUCIÓN
await supabase.from('profesionales').insert({
  nombre_completo: "Juan"
});
```

### Error 3: Definir interfaces duplicadas

```typescript
// ❌ ERROR
// En cada componente:
interface Profesional {
  nombre: string;
}

// ✅ SOLUCIÓN
// Una sola vez en src/types/profesional.ts
import { Profesional } from '@/types/profesional';
```

---

## 📖 REFERENCIAS

### Documentación Oficial

- [PostgreSQL Naming Conventions](https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS)
- [TypeScript Naming Conventions](https://basarat.gitbook.io/typescript/styleguide)
- [React Best Practices](https://react.dev/learn)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

### Librerías Útiles (Opcionales)

- `humps` - Conversión automática de nomenclaturas
- `lodash` - Utilidades para transformación de objetos
- `ts-case-convert` - Conversión de cases en TypeScript

---

## 🎓 ONBOARDING PARA NUEVOS DESARROLLADORES

### Regla de Oro

> **"En la base de datos usamos snake_case, en JavaScript usamos camelCase.  
> Las APIs se encargan de la transformación automáticamente."**

### Quick Start

1. ✅ Lee este documento completo
2. ✅ Revisa los types en `src/types/`
3. ✅ Examina una API completa (ej: `/api/profesionales/route.ts`)
4. ✅ Examina un componente completo (ej: `profesionales/dashboard/page.tsx`)
5. ✅ Ejecuta `npm run build` antes de cada commit

---

## 📊 ESTADO DEL PROYECTO

**Última actualización:** 26 de diciembre de 2025

### Migración Completada ✅

- [x] Base de datos migrada a snake_case
- [x] APIs implementan transformación automática
- [x] Types centralizados creados
- [x] Componentes actualizados
- [x] Build exitoso sin errores TypeScript
- [x] Documentación completa

### Mantenimiento Continuo

- Revisar este documento al agregar nuevas features
- Mantener types centralizados actualizados
- Validar nomenclatura en code reviews
- Ejecutar `npm run build` regularmente

---

**¿Preguntas? Consulta este documento o contacta al equipo de desarrollo.**
