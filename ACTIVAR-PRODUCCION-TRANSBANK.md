# 🚀 ACTIVAR PRODUCCIÓN TRANSBANK - Paso a Paso

## ✅ CREDENCIALES RECIBIDAS (30 Diciembre 2024)

```
API Key Secret: fa573383-8c18-4dd6-be81-b5ef23d7330b
Código de Comercio: 597053036650
```

---

## 📋 PASO 1: Archivos Locales Actualizados ✓

Ya se actualizaron automáticamente:
- ✅ `.env.local` → Ambiente producción
- ✅ `.env.production` → Credenciales reales
- ✅ `.env.example` → Documentado

---

## 🔧 PASO 2: Configurar Variables en Vercel

### 2.1 Ingresar a Vercel

1. Abrir: https://vercel.com/alejandro-fernandezs-projects-9a4379b9
2. Hacer login con tu cuenta

### 2.2 Ir a Settings del Proyecto

1. Click en proyecto: **electricistas-app**
2. Click en tab: **Settings**
3. Click en: **Environment Variables**

### 2.3 Actualizar 3 Variables

#### Variable 1: WEBPAY_AMBIENTE
```
Name: WEBPAY_AMBIENTE
Value: produccion
Environment: ✅ Production ✅ Preview ✅ Development
```

#### Variable 2: WEBPAY_COMMERCE_CODE
```
Name: WEBPAY_COMMERCE_CODE
Value: 597053036650
Environment: ✅ Production ✅ Preview ✅ Development
```

#### Variable 3: WEBPAY_API_KEY
```
Name: WEBPAY_API_KEY
Value: fa573383-8c18-4dd6-be81-b5ef23d7330b
Environment: ✅ Production ✅ Preview ✅ Development
```

**IMPORTANTE:** Si las variables ya existen, debes:
1. Click en los 3 puntos `...` de cada variable
2. Click en `Edit`
3. Cambiar el valor
4. Click en `Save`

### 2.4 Verificar Otras Variables

Confirmar que estas variables también estén configuradas:

```
NEXT_PUBLIC_SUPABASE_URL = https://dqgiquwspkxeqbztatff.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RESEND_API_KEY = re_Z6EJ8AEg_8cjyoJ9PuVzqvH73jZPRzMK9
EMAIL_TO = yfuelaluz@gmail.com
```

---

## 🚀 PASO 3: Redeploy

### 3.1 Ir a Deployments

1. En Vercel, click en tab: **Deployments**
2. Click en el deployment más reciente (el primero de la lista)

### 3.2 Hacer Redeploy

1. Click en los 3 puntos `⋯` (esquina superior derecha)
2. Click en: **Redeploy**
3. **NO** marcar "Use existing Build Cache"
4. Click en: **Redeploy**

### 3.3 Esperar Build

- Tarda aproximadamente 1-2 minutos
- Verás una barra de progreso
- Cuando termine dirá: "Deployment Ready"

---

## ✅ PASO 4: Verificar Producción

### 4.1 Acceder al Sitio

```
URL: https://www.electricistaschile.com
```

### 4.2 Probar Pago de $50 (Obligatorio)

**Según Transbank, DEBES:**

1. Ir a: https://www.electricistaschile.com/test-webpay
2. Ingresar monto: **50** (pesos)
3. Click en "Crear Pago"
4. Completar pago con **TARJETA REAL** (crédito o débito)
5. Verificar que se apruebe correctamente

**⚠️ IMPORTANTE:**
- Ya NO uses tarjetas de prueba (4051885600446623)
- Usa tu tarjeta real de crédito o débito
- El pago será real (se cobrará)
- Si todo funciona, puedes anular después

---

## 🔍 PASO 5: Verificar Transacción

### 5.1 Revisar en Consola

1. Presiona F12 en el navegador
2. Ve a tab "Console"
3. Busca logs con el token de transacción

### 5.2 Consultar Estado

Si guardaste el token de la transacción:

```
https://www.electricistaschile.com/api/webpay/estado?token=TU_TOKEN_AQUI
```

Deberías ver:
```json
{
  "success": true,
  "status": "AUTHORIZED",
  "amount": 50,
  "payment_type_code": "VN" o "VD"
}
```

---

## 🎯 PASO 6: Reportar a Transbank

Después de hacer la transacción de prueba:

### Si Sale TODO OK:
✅ Enviar email a Transbank confirmando que funcionó
- Incluir captura de pantalla de la transacción exitosa
- Incluir buy_order y token
- Ya puedes generar ventas reales

### Si Hay Algún Error:
⚠️ Contactar a Transbank ANTES de generar ventas:
- Email: soporte@transbank.cl
- Teléfono: 600 638 6380 / +562 2661 2700

---

## 📊 CHECKLIST COMPLETO

- [ ] Variables actualizadas en Vercel (PASO 2)
- [ ] Redeploy completado exitosamente (PASO 3)
- [ ] Sitio accesible en www.electricistaschile.com (PASO 4.1)
- [ ] Transacción de $50 con tarjeta real exitosa (PASO 4.2)
- [ ] Estado de transacción verificado (PASO 5)
- [ ] Reporte enviado a Transbank (PASO 6)

---

## 🔒 SEGURIDAD

**NUNCA compartas públicamente:**
- ❌ API Key: fa573383-8c18-4dd6-be81-b5ef23d7330b
- ❌ Commerce Code: 597053036650

**Estas credenciales son secretas y personales**

---

## 📞 SOPORTE

Si necesitas ayuda:

- **Transbank:** https://www.transbank.cl/
- **Portal Clientes:** https://www.transbank.cl/
- **Centro de Ayuda:** https://ayuda.transbank.cl/
- **Teléfono:** 600 638 6380 / +562 2661 2700

---

**Última actualización:** 30 Diciembre 2024  
**Estado:** ✅ LISTO PARA ACTIVAR PRODUCCIÓN
