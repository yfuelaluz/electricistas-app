# 🔍 AUDITORÍA COMPLETA - SNAKE_CASE vs CAMELCASE

## RESUMEN EJECUTIVO

**Problema detectado:** Inconsistencia masiva entre código (camelCase) y schema Supabase (snake_case)

**Tablas afectadas:** 
- ✅ profesionales (YA CORREGIDO)
- ❌ clientes (PENDIENTE)
- ❌ cotizaciones (VERIFICAR)
- ❌ reviews (PENDIENTE)
- ❌ portfolio (VERIFICAR)

---

## TABLA: CLIENTES

### Schema Supabase (snake_case esperado):
```
- nombre_completo
- password_hash
- created_at
```

### Código actual (camelCase):
```typescript
// src/app/api/clientes/route.ts
.select('id, nombreCompleto, email, telefono, direccion, comuna, plan, createdAt')
.insert({ nombreCompleto, passwordHash })
```

### ACCIÓN REQUERIDA:
- Cambiar `nombreCompleto` → `nombre_completo`
- Cambiar `passwordHash` → `password_hash`
- Cambiar `createdAt` → `created_at`

---

## TABLA: REVIEWS

### Schema Supabase (snake_case esperado):
```
- profesional_id
- cliente_id
- cotizacion_id
- cliente_nombre
- total_reviews
- created_at
```

### Código actual (camelCase):
```typescript
// src/app/api/reviews/route.ts
.eq('profesionalId', profesionalId)
.eq('clienteId', body.clienteId)
.eq('cotizacionId', body.cotizacionId)
{ totalReviews: reviews.length }
```

### ACCIÓN REQUERIDA:
- Cambiar `profesionalId` → `profesional_id`
- Cambiar `clienteId` → `cliente_id`
- Cambiar `cotizacionId` → `cotizacion_id`
- Cambiar `clienteNombre` → `cliente_nombre`
- Cambiar `totalReviews` → `total_reviews`
- Cambiar `createdAt` → `created_at`

---

## TABLA: PORTFOLIO

### Schema Supabase (snake_case esperado):
```
- profesional_id
- created_at
```

### Código actual (camelCase):
```typescript
// src/app/api/portfolio/route.ts
.eq('profesionalId', profesionalId)
{ profesionalId, titulo, descripcion, ... }
```

### ACCIÓN REQUERIDA:
- Cambiar `profesionalId` → `profesional_id`
- Cambiar `createdAt` → `created_at`

---

## TABLA: COTIZACIONES

### Schema Supabase (VERIFICAR):
Probablemente:
```
- cliente_id
- profesional_id
- created_at
```

### Código actual:
```typescript
// src/app/api/cotizaciones/route.ts
.order('createdAt', { ascending: false })
```

### ACCIÓN REQUERIDA:
- Verificar schema completo
- Cambiar `createdAt` → `created_at`
- Verificar campos JSONB (cliente, servicio, presupuesto, respuestas)

---

## ARCHIVOS QUE NECESITAN ACTUALIZACIÓN:

### CRÍTICOS (Bloquean funcionalidad):
1. ❌ `src/app/api/clientes/route.ts` - GET, POST, PUT
2. ❌ `src/app/api/clientes/login/route.ts` - POST  
3. ❌ `src/app/api/reviews/route.ts` - GET, POST
4. ❌ `src/app/api/portfolio/route.ts` - GET, POST, PUT, DELETE

### IMPORTANTES (Pueden causar errores):
5. ⚠️ `src/app/api/cotizaciones/route.ts` - Verificar
6. ⚠️ `src/app/api/respuestas/route.ts` - Verificar
7. ⚠️ `src/app/api/aceptar-respuesta/route.ts` - Verificar

### COMPONENTES FRONTEND:
8. ⚠️ `src/app/clientes/dashboard/page.tsx` - Maneja datos clientes
9. ⚠️ `src/app/profesionales/dashboard/page.tsx` - Maneja reviews
10. ⚠️ Todos los componentes que lean datos de Supabase

---

## ESTRATEGIA DE CORRECCIÓN:

### Fase 1: APIs Backend (CRÍTICO)
1. Actualizar clientes API ✅
2. Actualizar reviews API ✅
3. Actualizar portfolio API ✅
4. Verificar cotizaciones API ✅

### Fase 2: Verificar Schema (ANTES DE CORREGIR)
Ejecutar: `scripts/verificar-schema-completo-todas-tablas.sql`
Para confirmar nombres exactos de columnas en cada tabla

### Fase 3: Frontend (SI ES NECESARIO)
- Si backend devuelve snake_case, frontend debe manejar conversión
- O crear función helper para transformar snake_case ↔ camelCase

---

## ⚠️ RIESGO IMPORTANTE:

Si corrijo los APIs sin verificar schema primero, puedo:
- ❌ Romper funcionalidades que estén funcionando
- ❌ Crear más inconsistencias
- ❌ Causar errores en producción

## ✅ RECOMENDACIÓN:

**PRIMERO:** Ejecutar verificar-schema-completo-todas-tablas.sql en Supabase
**SEGUNDO:** Documentar schema real de cada tabla
**TERCERO:** Hacer correcciones masivas con multi_replace
**CUARTO:** Build + Test + Deploy

---

**Estado actual:** EN ESPERA de verificación de schema completo
**Próxima acción:** Ejecutar SQL de verificación en Supabase
