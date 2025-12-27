# ✅ CHECKLIST DE VERIFICACIÓN POST-DEPLOY

**Fecha:** 26 de diciembre de 2025  
**Objetivo:** Verificar que todo funcione correctamente después del deploy

---

## 🎯 PASO 1: VERIFICAR DEPLOY EN VERCEL

### Acciones:
1. Ir a [Vercel Dashboard](https://vercel.com/dashboard)
2. Verificar que el deploy del commit `49bd8eb` esté completado
3. Estado esperado: ✅ **Ready**

### Verificar:
- [ ] Deploy exitoso
- [ ] Sin errores en build
- [ ] URL de producción activa

**URL:** https://electricistas-app.vercel.app

---

## 🗄️ PASO 2: VERIFICAR Y CORREGIR SCHEMA DE SUPABASE

### ⚠️ CRÍTICO - Ejecutar SQL

1. Ir a [Supabase Dashboard](https://app.supabase.com)
2. Seleccionar proyecto: `electricistas-app`
3. Ir a: **SQL Editor**
4. Ejecutar: `scripts/VERIFICACION-Y-CORRECCION-COMPLETA.sql`

### Columnas que deben existir en `profesionales`:

```sql
✅ id
✅ nombre_completo
✅ rut               ← VERIFICAR
✅ email
✅ telefono
✅ password_hash
✅ especialidad
✅ comunas           ← VERIFICAR (ARRAY)
✅ experiencia
✅ certificaciones
✅ descripcion
✅ foto_perfil       ← VERIFICAR
✅ estado            ← VERIFICAR (pendiente/activo)
✅ valoracion
✅ trabajos_realizados
✅ plan
✅ leads_usados      ← VERIFICAR
✅ created_at
```

### Verificación rápida:
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'profesionales' 
  AND column_name IN ('rut', 'comunas', 'estado', 'foto_perfil', 'leads_usados');
```

Debes ver **5 filas**.

---

## 🧪 PASO 3: PROBAR APIs EN PRODUCCIÓN

### Método 1: Usando el script automatizado

```bash
cd "c:\Users\ALEJANDRO FERNANDEZ\Desktop\APP\electricistas-app"
npx tsx scripts/test-apis-completo.ts
```

### Método 2: Prueba manual con navegador

Abrir cada URL en el navegador (deben retornar JSON):

1. **Profesionales**
   ```
   https://electricistas-app.vercel.app/api/profesionales
   ```
   - Esperado: Array de profesionales (puede estar vacío `[]`)

2. **Clientes**
   ```
   https://electricistas-app.vercel.app/api/clientes
   ```
   - Esperado: Array de clientes (puede estar vacío `[]`)

3. **Cotizaciones**
   ```
   https://electricistas-app.vercel.app/api/cotizaciones
   ```
   - Esperado: Array de cotizaciones (puede estar vacío `[]`)

4. **Galería**
   ```
   https://electricistas-app.vercel.app/api/galeria
   ```
   - Esperado: Array de imágenes

### Checklist:
- [ ] /api/profesionales responde
- [ ] /api/clientes responde
- [ ] /api/cotizaciones responde
- [ ] /api/galeria responde
- [ ] Todos retornan JSON válido
- [ ] No hay errores 500

---

## 👤 PASO 4: PROBAR REGISTRO DE PROFESIONAL

### URL de prueba:
```
https://electricistas-app.vercel.app/profesionales/registro
```

### Datos de prueba:
```
Nombre Completo: Juan Pérez Test
RUT: 11111111-1
Email: test-profesional@test.com
Teléfono: +56912345678
Especialidad: Electricista Residencial
Comunas: Santiago, Providencia
Experiencia: 5
Descripción: Profesional de prueba para verificación
Contraseña: Test123456
```

### Verificar:
- [ ] Formulario carga correctamente
- [ ] Validaciones funcionan
- [ ] Registro exitoso
- [ ] Mensaje de confirmación aparece
- [ ] Redirección a login

### Verificar en Supabase:
```sql
SELECT * FROM profesionales 
WHERE email = 'test-profesional@test.com'
ORDER BY created_at DESC 
LIMIT 1;
```

Debe mostrar:
- ✅ `nombre_completo`: "Juan Pérez Test"
- ✅ `rut`: "11111111-1"
- ✅ `comunas`: ["Santiago", "Providencia"]
- ✅ `estado`: "pendiente"
- ✅ `leads_usados`: 0

---

## 👥 PASO 5: PROBAR REGISTRO DE CLIENTE

### URL de prueba:
```
https://electricistas-app.vercel.app/clientes/registro
```

### Datos de prueba:
```
Nombre Completo: María González Test
Email: test-cliente@test.com
Teléfono: +56987654321
Dirección: Av. Libertador 123
Comuna: Las Condes
Contraseña: Test123456
```

### Verificar:
- [ ] Formulario carga correctamente
- [ ] Validaciones funcionan
- [ ] Registro exitoso
- [ ] Mensaje de confirmación aparece
- [ ] Redirección a login

### Verificar en Supabase:
```sql
SELECT * FROM clientes 
WHERE email = 'test-cliente@test.com'
ORDER BY created_at DESC 
LIMIT 1;
```

---

## 🔐 PASO 6: PROBAR LOGIN

### Login Profesional:
```
URL: https://electricistas-app.vercel.app/profesionales/login
Email: test-profesional@test.com
Password: Test123456
```

Verificar:
- [ ] Login exitoso
- [ ] Redirección a dashboard
- [ ] Datos del profesional se muestran correctamente

### Login Cliente:
```
URL: https://electricistas-app.vercel.app/clientes/login
Email: test-cliente@test.com
Password: Test123456
```

Verificar:
- [ ] Login exitoso
- [ ] Redirección a dashboard
- [ ] Datos del cliente se muestran correctamente

---

## 📝 PASO 7: PROBAR COTIZACIÓN

### URL:
```
https://electricistas-app.vercel.app/cotizacion
```

### Datos de prueba:
```
Nombre: Test Cotización
Email: cotizacion@test.com
Teléfono: +56912345678
Comuna: Santiago
Tipo de Servicio: Instalación Eléctrica
Descripción: Prueba de cotización
Urgencia: Normal
```

### Verificar:
- [ ] Formulario funciona
- [ ] Cotización se guarda
- [ ] Email de notificación enviado
- [ ] Aparece en admin panel

---

## 🎨 PASO 8: VERIFICAR PÁGINAS PRINCIPALES

### Páginas a verificar:

1. **Home** - https://electricistas-app.vercel.app
   - [ ] Carga sin errores
   - [ ] Todos los elementos visibles
   - [ ] Sin errores en consola

2. **Buscar** - https://electricistas-app.vercel.app/buscar
   - [ ] Lista de profesionales carga
   - [ ] Filtros funcionan
   - [ ] Sin errores TypeScript en consola

3. **Servicios** - https://electricistas-app.vercel.app/servicios
   - [ ] Página carga correctamente
   - [ ] Contenido visible

4. **Admin Dashboard** - https://electricistas-app.vercel.app/admin/dashboard
   - [ ] Login admin funciona
   - [ ] Dashboard carga
   - [ ] Datos se muestran

---

## 🐛 PASO 9: VERIFICAR CONSOLA DEL NAVEGADOR

### Abrir DevTools (F12) y verificar:

- [ ] No hay errores en Console
- [ ] No hay warnings críticos
- [ ] No hay errores 404
- [ ] No hay errores de CORS
- [ ] No hay errores de TypeScript

---

## 📊 PASO 10: RESUMEN FINAL

### Completar checklist general:

```
✅ INFRAESTRUCTURA
- [ ] Deploy en Vercel exitoso
- [ ] Base de datos Supabase configurada
- [ ] Columnas agregadas correctamente
- [ ] Variables de entorno configuradas

✅ APIS
- [ ] /api/profesionales funciona
- [ ] /api/clientes funciona
- [ ] /api/cotizaciones funciona
- [ ] /api/reviews funciona
- [ ] /api/portfolio funciona

✅ FUNCIONALIDADES
- [ ] Registro de profesional funciona
- [ ] Registro de cliente funciona
- [ ] Login funciona para ambos
- [ ] Cotizaciones funcionan
- [ ] Búsqueda de profesionales funciona

✅ CALIDAD
- [ ] No hay errores TypeScript
- [ ] No hay errores en consola
- [ ] Build exitoso
- [ ] Types centralizados funcionan
```

---

## 🚨 SI ALGO FALLA

### Problema: Deploy falló
**Solución:**
1. Ver logs en Vercel
2. Verificar errores de build
3. Ejecutar `npm run build` localmente

### Problema: Columnas no existen en Supabase
**Solución:**
1. Ejecutar `scripts/VERIFICACION-Y-CORRECCION-COMPLETA.sql`
2. Verificar permisos en Supabase

### Problema: Registro no funciona
**Solución:**
1. Verificar consola del navegador
2. Verificar Network tab (F12)
3. Verificar logs de Supabase

### Problema: APIs retornan error 500
**Solución:**
1. Verificar variables de entorno en Vercel
2. Verificar logs de la función en Vercel
3. Verificar conexión a Supabase

---

## 📞 CONTACTO Y SOPORTE

Si todo falla:
1. Revisar [CONVENCIONES-CODIGO.md](../CONVENCIONES-CODIGO.md)
2. Revisar logs en Vercel Dashboard
3. Revisar logs en Supabase Dashboard

---

## ✅ ESTADO FINAL ESPERADO

Al completar todos los pasos:

```
🎯 INFRAESTRUCTURA: ✅
🎯 APIS: ✅
🎯 REGISTRO: ✅
🎯 LOGIN: ✅
🎯 FUNCIONALIDADES: ✅
🎯 CALIDAD: ✅
```

**🎉 ¡APLICACIÓN LISTA PARA PRODUCCIÓN!**
