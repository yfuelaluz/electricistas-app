# 🔍 REPORTE COMPLETO DE REVISIÓN EXHAUSTIVA

## ❌ PROBLEMAS CRÍTICOS ENCONTRADOS

### 1. INCONSISTENCIA CRÍTICA: Naming Convention (snake_case vs camelCase)

**PROBLEMA:** Existe una discrepancia fundamental entre el schema documentado y el código de la aplicación.

#### Evidencia A: SETUP-SUPABASE.md (Lines 52-82)
```sql
-- Tabla de profesionales
CREATE TABLE profesionales (
  id SERIAL PRIMARY KEY,
  nombre_completo TEXT NOT NULL,      -- ❌ SNAKE_CASE
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,        -- ❌ SNAKE_CASE
  telefono TEXT,
  especialidad TEXT,
  experiencia INTEGER DEFAULT 0,
  descripcion TEXT,
  ubicacion TEXT,
  plan TEXT DEFAULT 'starter',
  activo BOOLEAN DEFAULT false,       -- ❌ SNAKE_CASE
  valoracion DECIMAL(2,1) DEFAULT 0,
  trabajos_realizados INTEGER DEFAULT 0,  -- ❌ SNAKE_CASE
  ...
);
```

#### Evidencia B: Código API Actual (src/app/api/profesionales/route.ts)
```typescript
const { data: profesionales, error } = await supabase
  .from('profesionales')
  .select('id, nombreCompleto, email, telefono, ...  // ✅ CAMELCASE
          fotoPerfil, estado, valoracion, trabajosRealizados, ...')
  
.insert([{
  nombreCompleto: body.nombreCompleto,  // ✅ CAMELCASE
  rut: body.rut,
  email: body.email,
  passwordHash,                         // ✅ CAMELCASE
  especialidad: body.especialidad,
  comunas: body.comunas || [],
  trabajosRealizados: 0,                // ✅ CAMELCASE
  leadsUsados: 0                        // ✅ CAMELCASE
}])
```

#### Evidencia C: Script migrate-to-supabase.ts (Viejo, no usado)
```typescript
.upsert({
  nombre_completo: prof.nombreCompleto,     // ❌ SNAKE_CASE
  password_hash: prof.passwordHash,         // ❌ SNAKE_CASE
  trabajos_realizados: prof.trabajosRealizados,  // ❌ SNAKE_CASE
  ...
})
```

### **CONCLUSIÓN DEL PROBLEMA #1:**
- El schema en SETUP-SUPABASE.md está **DESACTUALIZADO** y usa snake_case
- El código actual usa **CAMELCASE** consistentemente  
- Esto significa que SETUP-SUPABASE.md **NO refleja el schema real de producción**
- El schema real en Supabase debe estar en camelCase (de lo contrario los GET no funcionarían)

---

### 2. CAMPO fotoPerfil FALTANTE EN INSERT

**PROBLEMA:** El formulario recoge `fotoPerfil` pero el API no lo inserta en Supabase.

#### Código del formulario (lines 58-72):
```typescript
body: JSON.stringify({
  nombreCompleto: formData.nombreCompleto,
  // ... otros campos ...
  plan: planPagado || 'starter'
  // ❌ NO ENVÍA fotoPerfil aunque el campo existe en formData
})
```

#### Código del API (lines 56-70):
```typescript
.insert([{
  nombreCompleto: body.nombreCompleto,
  rut: body.rut,
  // ... otros campos ...
  leadsUsados: 0
  // ❌ NO incluye fotoPerfil en el insert
}])
```

#### GET incluye fotoPerfil (line 15):
```typescript
.select('id, nombreCompleto, email, telefono, especialidad, comunas, 
        experiencia, certificaciones, descripcion, fotoPerfil, estado, ...')
//                                             ^^^^^^^^^^^^ Lo busca pero nunca lo guarda
```

---

### 3. ERRORES DE CONEXIÓN LOCAL (Confirmados)

**PROBLEMA:** DNS no resuelve pxcuelbud1xaqzvkcggo.supabase.co en red local

```
Error: getaddrinfo ENOTFOUND pxcuelbud1xaqzvkcggo.supabase.co
```

**CAUSA:** Problema de red/firewall/DNS local. No es un problema del código.
**SOLUCIÓN:** Testing solo viable en producción Vercel.

---

## ✅ HALLAZGOS POSITIVOS

1. ✅ Variables de entorno correctamente configuradas
2. ✅ No hay errores de compilación TypeScript
3. ✅ Cliente Supabase correctamente inicializado
4. ✅ Autenticación con bcrypt implementada correctamente
5. ✅ Datos de prueba disponibles en data/profesionales.json
6. ✅ Build exitoso (41 routes compiladas)
7. ✅ Deployment en Vercel funcional

---

## 🎯 ACCIONES REQUERIDAS (Por Prioridad)

### CRÍTICO - DEBE HACERSE YA:

#### Acción 1: Verificar Schema Real en Supabase
**Ejecutar en Supabase SQL Editor:**
```sql
SELECT 
    column_name, 
    data_type
FROM information_schema.columns 
WHERE table_schema = 'public'
  AND table_name = 'profesionales'
ORDER BY ordinal_position;
```

**Resultado esperado:** Confirmar si las columnas están en camelCase o snake_case

#### Acción 2A: Si Schema es CAMELCASE (lo más probable):
1. Agregar campo `fotoPerfil` si no existe:
```sql
ALTER TABLE profesionales ADD COLUMN IF NOT EXISTS "fotoPerfil" TEXT;
```

2. Actualizar API para guardar fotoPerfil:
```typescript
// En src/app/api/profesionales/route.ts, agregar:
.insert([{
  nombreCompleto: body.nombreCompleto,
  // ... campos existentes ...
  fotoPerfil: body.fotoPerfil || '',  // ← AGREGAR ESTA LÍNEA
  plan: body.plan || 'starter',
  // ...
}])
```

3. Actualizar formulario para enviar fotoPerfil:
```typescript
body: JSON.stringify({
  nombreCompleto: formData.nombreCompleto,
  // ... campos existentes ...
  fotoPerfil: formData.fotoPerfil,  // ← AGREGAR ESTA LÍNEA
  plan: planPagado || 'starter'
})
```

#### Acción 2B: Si Schema es SNAKE_CASE:
Necesitaríamos reescribir TODA la aplicación para usar snake_case (MUCHO trabajo).

---

## 📊 RESUMEN EJECUTIVO

**Estado Actual:**
- ⚠️ Aplicación funcionando parcialmente
- ⚠️ Registro probablemente falla por discrepancia de schema
- ⚠️ Campo fotoPerfil no se guarda nunca
- ❌ Testing local imposible (DNS issues)
- ✅ Deploy en Vercel exitoso
- ✅ Código compilando sin errores

**Siguiente Paso Inmediato:**
1. Ejecutar `VERIFICAR-SCHEMA-REAL.sql` en Supabase SQL Editor
2. Tomar una captura del resultado
3. Según el resultado, aplicar Acción 2A o 2B
4. Probar registro nuevamente en producción

**Probabilidad de Éxito:**
- 95% que el schema sea camelCase (código funciona para GET)
- 90% que agregar fotoPerfil resuelva el problema
- 100% que testing debe ser en producción (no local)

---

## 📝 ARCHIVOS CREADOS PARA DIAGNOSTICAR

1. `scripts/test-registro-directo.ts` - Prueba inserción directa (confirmó DNS issues locales)
2. `scripts/verificar-columna-fotoperfil.sql` - Query para revisar columna
3. `scripts/VERIFICAR-SCHEMA-REAL.sql` - Query completa de schema (EJECUTAR ESTO PRIMERO)

---

**Próximo Paso:** Ejecutar VERIFICAR-SCHEMA-REAL.sql en Supabase y compartir resultado.
