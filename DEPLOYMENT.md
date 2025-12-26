# 🚀 Guía Completa de Deployment a Vercel

Esta guía te llevará paso a paso para desplegar la aplicación en Vercel y dejarla 100% operativa en producción.

---

## 📋 Pre-requisitos

Antes de empezar, asegúrate de tener:

- ✅ Cuenta en Vercel (gratuita): https://vercel.com/signup
- ✅ Cuenta en Resend para emails: https://resend.com/signup
- ✅ Credenciales de Transbank Webpay Plus
- ✅ Código fuente en Git (GitHub, GitLab, o Bitbucket)

---

## 🔐 Variables de Entorno Requeridas

Cuando despliegues a Vercel, debes configurar estas variables de entorno en el dashboard:

### 1. Webpay Plus (Transbank)

**Para ambiente de integración (pruebas):**
```
WEBPAY_AMBIENTE=integracion
WEBPAY_COMMERCE_CODE=597055555532
WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
```

**Para producción (cuando tengas credenciales reales):**
```
WEBPAY_AMBIENTE=produccion
WEBPAY_COMMERCE_CODE=<tu_codigo_de_comercio>
WEBPAY_API_KEY=<tu_api_key_real>
```

### 2. URL Base
```
NEXT_PUBLIC_BASE_URL=https://tu-dominio.vercel.app
```
**⚠️ IMPORTANTE:** Después del primer deployment, actualiza esta variable con la URL real que te dé Vercel.

### 3. Resend (Email Notifications)
```
RESEND_API_KEY=<tu_api_key_de_resend>
EMAIL_TO=yfuelaluz@gmail.com
```

---

## 🚀 Pasos para Desplegar

### Paso 1: Preparar el Repositorio

1. **Asegúrate de que el código esté en Git:**
```bash
git add .
git commit -m "Preparar para deployment"
git push origin main
```

2. **Verifica que .env.local NO esté en el repositorio:**
```bash
# Debe estar en .gitignore
cat .gitignore | grep .env.local
```

### Paso 2: Conectar Vercel con tu Repositorio

1. Ve a https://vercel.com/dashboard
2. Click en **"Add New Project"**
3. Selecciona **"Import Git Repository"**
4. Autoriza acceso a tu GitHub/GitLab/Bitbucket
5. Selecciona el repositorio `electricistas-app`

### Paso 3: Configurar el Proyecto en Vercel

1. **Framework Preset:** Next.js (detectado automáticamente)
2. **Root Directory:** `./electricistas-app` (si está en subcarpeta) o `./` (si está en raíz)
3. **Build Command:** `npm run build` (automático)
4. **Output Directory:** `.next` (automático)

### Paso 4: Agregar Variables de Entorno

1. En la página de configuración del proyecto, ve a **"Environment Variables"**
2. Agrega TODAS las variables mencionadas arriba:

| Name | Value | Environment |
|------|-------|-------------|
| `WEBPAY_AMBIENTE` | `integracion` | Production, Preview, Development |
| `WEBPAY_COMMERCE_CODE` | `597055555532` | Production, Preview, Development |
| `WEBPAY_API_KEY` | `579B532A...` | Production, Preview, Development |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | Production, Preview, Development |
| `RESEND_API_KEY` | `re_...` | Production, Preview, Development |
| `EMAIL_TO` | `yfuelaluz@gmail.com` | Production, Preview, Development |

3. Click en **"Deploy"**

### Paso 5: Actualizar NEXT_PUBLIC_BASE_URL

1. Espera a que termine el primer deployment
2. Copia la URL de producción (ej: `https://electricistas-app-abc123.vercel.app`)
3. Ve a **Settings → Environment Variables**
4. Edita `NEXT_PUBLIC_BASE_URL` y reemplaza con la URL real
5. Ve a **Deployments → … (menú) → Redeploy**

### Paso 6: Registrar URL en Transbank

Para que Webpay funcione correctamente:

1. **URL de retorno:** `https://tu-dominio.vercel.app/api/webpay/confirmar`
2. Contacta a Transbank o usa su portal para registrar esta URL
3. Si estás en modo integración, esto generalmente no es necesario

---

## ✅ Verificar que Todo Funciona

### Checklist Post-Deployment

Marca cada item después de verificarlo:

- [ ] ✅ La página principal carga correctamente
- [ ] ✅ El formulario de cotización está accesible en `/cotizacion`
- [ ] ✅ Se puede enviar una cotización de prueba
- [ ] ✅ Llega el email de notificación a yfuelaluz@gmail.com
- [ ] ✅ El admin dashboard funciona en `/admin/cotizaciones`
- [ ] ✅ Los botones de WhatsApp funcionan
- [ ] ✅ Las imágenes de la galería cargan correctamente
- [ ] ✅ El sistema de pagos con Webpay está operativo
- [ ] ✅ Los servicios de electricidad y carpintería se muestran bien
- [ ] ✅ Todas las rutas funcionan sin errores 404

### 🧪 Prueba de Cotización Completa

1. Ve a `https://tu-dominio.vercel.app/cotizacion`
2. Llena el formulario con datos de prueba:
   - Nombre: Test Usuario
   - Email: test@example.com
   - Teléfono: +56912345678
   - Servicio: Instalación eléctrica
   - Descripción: Prueba de sistema
3. Envía la cotización
4. Verifica que llegue el email a yfuelaluz@gmail.com
5. Revisa el admin dashboard en `/admin/cotizaciones`

### 🧪 Prueba de Pago con Webpay

1. Ve a la sección de suscripciones
2. Selecciona un plan
3. Click en "Pagar con Webpay"
4. Usa las credenciales de prueba de Transbank:
   - **Tarjeta:** 4051 8856 0044 6623
   - **CVV:** 123
   - **Fecha:** Cualquier fecha futura
   - **RUT:** 11.111.111-1
   - **Clave:** 123
5. Completa el flujo de pago
6. Verifica que redirija correctamente

---

## 🔧 Troubleshooting

### ❌ No llegan los emails

**Problema:** Las cotizaciones no generan emails.

**Solución:**
1. Verifica que `RESEND_API_KEY` esté configurada correctamente
2. Revisa los logs en Vercel Dashboard → Deployments → Functions
3. Confirma que el email `EMAIL_TO` sea válido
4. Verifica que tu dominio esté verificado en Resend

```bash
# Ver logs en tiempo real
vercel logs --follow
```

### ❌ Error en Webpay

**Problema:** Los pagos fallan o dan error.

**Solución:**
1. Confirma que las credenciales sean correctas (copia/pega directo)
2. Verifica que `NEXT_PUBLIC_BASE_URL` esté actualizada con la URL real
3. Asegúrate de estar usando las credenciales correctas según el ambiente
4. Revisa los logs de la función `/api/webpay/crear-pago`
5. Contacta a soporte de Transbank si persiste el error

### ❌ Imágenes no cargan

**Problema:** La galería aparece vacía o con imágenes rotas.

**Solución:**
1. Verifica que la carpeta `public/galeria/optimized` esté en el repo
2. Confirma que el API endpoint `/api/galeria` funcione
3. Revisa los logs para ver si hay errores de lectura de archivos
4. Asegúrate de que las imágenes estén optimizadas

### ❌ Error 500 en build

**Problema:** El deployment falla con error 500.

**Solución:**
1. Revisa el log de build en Vercel
2. Ejecuta localmente: `npm run build`
3. Corrige los errores de TypeScript o ESLint
4. Vuelve a hacer push

### ❌ Variables de entorno no se cargan

**Problema:** La app no detecta las variables de entorno.

**Solución:**
1. Verifica que las variables estén en Settings → Environment Variables
2. Asegúrate de marcar "Production", "Preview", y "Development"
3. Después de agregar variables, haz un Redeploy
4. Las variables con `NEXT_PUBLIC_` deben estar disponibles en el cliente

---

## 📊 Monitoreo y Logs

### Ver logs en tiempo real:
```bash
vercel logs --follow
```

### Ver logs de una función específica:
```bash
vercel logs --function=/api/cotizaciones
```

### Dashboard de Vercel:
- **Analytics:** Ver tráfico y rendimiento
- **Logs:** Depurar errores en producción
- **Speed Insights:** Métricas de velocidad
- **Deployments:** Historial de deployments

---

## 🔄 Deployments Automáticos

Vercel hace deploy automático cuando haces push a las ramas configuradas:

- **main/master:** Deploy a producción
- **otras ramas:** Preview deployments

```bash
# Hacer cambios
git add .
git commit -m "Descripción del cambio"
git push origin main

# Vercel detecta el push y despliega automáticamente
```

---

## 🌐 Configurar Dominio Personalizado

### Paso 1: Agregar dominio en Vercel

1. Ve a Settings → Domains
2. Click en "Add Domain"
3. Ingresa tu dominio (ej: `electricistas.cl`)
4. Sigue las instrucciones para configurar DNS

### Paso 2: Configurar DNS

En tu proveedor de dominios (NIC Chile, GoDaddy, etc.):

**Para dominio raíz (electricistas.cl):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Para www (www.electricistas.cl):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Paso 3: Actualizar variables de entorno

1. Actualiza `NEXT_PUBLIC_BASE_URL` con tu dominio personalizado
2. Redeploy la aplicación

---

## 🔒 Consideraciones de Seguridad

- ✅ SSL/TLS activado automáticamente por Vercel
- ✅ Headers de seguridad configurados en `vercel.json`
- ✅ Variables de entorno nunca se exponen al cliente
- ✅ Credenciales de Webpay protegidas en servidor
- ⚠️ **NUNCA** subas archivos `.env.local` al repositorio
- ⚠️ Cambia las credenciales si se exponen accidentalmente

---

## 📞 Contacto y Soporte

**Email:** yfuelaluz@gmail.com  
**WhatsApp:** +56 9 95748162

---

## 🎯 Próximos Pasos (Post-Deployment)

Una vez que la app esté en producción:

1. **Monitoreo:**
   - Configura alertas en Vercel
   - Revisa logs diariamente los primeros días

2. **Optimizaciones:**
   - Analiza métricas de rendimiento
   - Optimiza imágenes adicionales si es necesario

3. **Backup:**
   - Configura backups automáticos de cotizaciones
   - Exporta datos importantes regularmente

4. **Marketing:**
   - Comparte la URL en redes sociales
   - Agrega a tarjetas de presentación
   - Registra en Google My Business

5. **Migración a Producción de Webpay:**
   - Solicita credenciales de producción a Transbank
   - Actualiza las variables de entorno
   - Prueba exhaustivamente antes de activar

---

## 📚 Recursos Adicionales

- **Documentación de Vercel:** https://vercel.com/docs
- **Documentación de Next.js:** https://nextjs.org/docs
- **SDK de Transbank:** https://github.com/TransbankDevelopers
- **API de Resend:** https://resend.com/docs

---

**✨ ¡Tu aplicación está lista para producción!**

1. **Migrar a Producción de Webpay:**
   - Obtener credenciales reales de Transbank
   - Cambiar `WEBPAY_AMBIENTE=produccion`
   - Actualizar `WEBPAY_COMMERCE_CODE` y `WEBPAY_API_KEY`

2. **Configurar Dominio Personalizado:**
   - Comprar dominio (ej: elieni.cl)
   - Configurar DNS en Vercel
   - Actualizar `NEXT_PUBLIC_BASE_URL`

3. **Configurar Email Personalizado en Resend:**
   - Agregar dominio verificado en Resend
   - Cambiar `from: 'contacto@elieni.cl'` en el código

4. **Optimizaciones:**
   - Configurar Google Analytics
   - Agregar más tipos de servicios
   - Implementar base de datos real (PostgreSQL/MongoDB)


---

##  ESTADO ACTUAL - DICIEMBRE 2025

**La aplicaci�n est� 100% OPERATIVA EN PRODUCCI�N**

### URLs Activas
- **Producci�n:** https://electricistas-app.vercel.app
- **Dashboard Vercel:** https://vercel.com/alejandro-fernandezs-projects-9a4379b9/electricistas-app

### APIs Migrados a Supabase 
-  /api/profesionales (GET, POST)
-  /api/profesionales/login
-  /api/profesionales/[id] (PUT)
-  /api/clientes (GET, POST, PUT)
-  /api/clientes/login
-  /api/cotizaciones (GET, POST)

### Variables de Entorno Configuradas 
-  NEXT_PUBLIC_SUPABASE_URL
-  NEXT_PUBLIC_SUPABASE_ANON_KEY
-  WEBPAY_AMBIENTE, WEBPAY_API_KEY, WEBPAY_COMMERCE_CODE
-  RESEND_API_KEY, EMAIL_TO

### Sistema Completamente Funcional
-  No depende de archivos JSON
-  Todo persiste en Supabase PostgreSQL
-  Listo para escalar
-  Build exitoso sin errores

**Contacto:** yfuelaluz@gmail.com  
**�ltima actualizaci�n:** Diciembre 26, 2025
