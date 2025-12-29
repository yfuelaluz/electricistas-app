# 🏦 Guía: Migrar Transbank a Producción

## 📋 Requisitos Previos

Antes de activar Transbank en producción, necesitas:

### 1️⃣ Obtener Credenciales de Producción de Transbank

Debes tener una cuenta activa en Transbank y solicitar tus credenciales de producción:

- **Código de Comercio (Commerce Code)**: Un número único de 12 dígitos
- **API Key**: Clave secreta para autenticación
- **Certificados**: Pueden ser necesarios dependiendo de tu contrato

📧 **Cómo obtenerlas:**
1. Contacta a tu ejecutivo comercial de Transbank
2. O ingresa al portal de comercios: https://www.transbank.cl/
3. Solicita activación de Webpay Plus para ambiente de producción
4. Espera aprobación (puede tomar 1-3 días hábiles)

---

## 🔧 Paso 1: Configurar Variables de Entorno en Vercel

### Variables Requeridas:

```env
WEBPAY_COMMERCE_CODE=tu_codigo_de_comercio_real
WEBPAY_API_KEY=tu_api_key_real
WEBPAY_AMBIENTE=produccion
```

### ⚙️ Cómo Configurarlas en Vercel:

1. **Ir al Dashboard de Vercel:**
   - https://vercel.com/alejandro-fernandezs-projects-9a4379b9

2. **Seleccionar el proyecto:**
   - Click en `electricistas-app`

3. **Ir a Settings:**
   - Tab `Settings` → `Environment Variables`

4. **Agregar las 3 variables:**

   **Variable 1:**
   - Name: `WEBPAY_COMMERCE_CODE`
   - Value: `[Tu código de comercio de 12 dígitos]`
   - Environments: ✅ Production

   **Variable 2:**
   - Name: `WEBPAY_API_KEY`
   - Value: `[Tu API Key secreta]`
   - Environments: ✅ Production

   **Variable 3:**
   - Name: `WEBPAY_AMBIENTE`
   - Value: `produccion`
   - Environments: ✅ Production

5. **Click en "Save"** para cada variable

---

## 🚀 Paso 2: Redeploy del Proyecto

Después de configurar las variables de entorno:

1. **Ir a "Deployments" en Vercel**
2. **Click en el deployment más reciente**
3. **Click en los 3 puntos (⋯) → "Redeploy"**
4. **Confirmar el redeploy**

Esto hará que Vercel reconstruya el proyecto con las nuevas variables de producción.

---

## ✅ Paso 3: Verificar la Integración

### Prueba de Pago Real:

1. **Ir a la página de suscripciones:**
   ```
   https://www.electricistaschile.com/suscripciones
   ```

2. **Seleccionar un plan de pago** (ej: Plan Premium $14.990)

3. **Click en "Suscribirse"**

4. **Serás redirigido al formulario de pago de Transbank**
   - ⚠️ **IMPORTANTE**: Ahora usarás una **tarjeta real**
   - Ya no funcionarán las tarjetas de prueba

5. **Completar el pago:**
   - Ingresar datos de tarjeta real
   - Confirmar el pago
   - Serás redirigido a la página de confirmación

6. **Verificar resultado:**
   - Si el pago es exitoso: Redirige a `/clientes/registro?plan=cliente-premium&pago=exitoso`
   - Si es rechazado: Redirige a `/?pago=rechazado`

---

## 🔐 Paso 4: Seguridad y Mejores Prácticas

### ✅ Checklist de Seguridad:

- ✅ **NUNCA** compartir las credenciales de producción
- ✅ **NUNCA** commitear las credenciales en Git
- ✅ Usar solo variables de entorno en Vercel
- ✅ Mantener backup de las credenciales en lugar seguro
- ✅ Rotar las API Keys periódicamente
- ✅ Monitorear transacciones sospechosas

### 📊 Monitoreo de Transacciones:

Puedes ver todas las transacciones en:
- **Portal de Transbank**: https://www.transbank.cl/
- Sección "Mis Transacciones" o "Reportes"

---

## 🧪 Paso 5: Mantener Ambiente de Pruebas (Opcional)

Si quieres mantener un ambiente de pruebas separado:

### Opción A: Usar Variables de Entorno Condicionales

Agregar en Vercel:
- `WEBPAY_AMBIENTE=integracion` para **Preview** deployments
- `WEBPAY_AMBIENTE=produccion` para **Production** deployment

### Opción B: Crear Branch de Testing

1. Crear branch `staging` en Git
2. Configurar Vercel para deployar `staging` con credenciales de integración
3. Configurar `main` con credenciales de producción

---

## 📝 Diferencias Entre Ambientes

| Característica | Integración (Pruebas) | Producción (Real) |
|----------------|----------------------|-------------------|
| **Tarjetas** | Tarjetas de prueba | Tarjetas reales |
| **Cobros** | No se cobra realmente | Cobros reales |
| **Commerce Code** | `597055555532` | Tu código asignado |
| **API URL** | `webpay3gint.transbank.cl` | `webpay3g.transbank.cl` |
| **Validación** | Menos estricta | Estricta |

---

## 🛠️ Solución de Problemas

### Error: "Código de comercio inválido"
- ✅ Verifica que el commerce code sea correcto
- ✅ Confirma que esté activo en Transbank
- ✅ Verifica que la variable de entorno esté configurada

### Error: "API Key incorrecta"
- ✅ Copia la API Key exactamente como la proporciona Transbank
- ✅ No debe tener espacios al inicio o final
- ✅ Verifica en Settings → Environment Variables de Vercel

### Pago rechazado siempre
- ✅ Verifica saldo de la tarjeta
- ✅ Verifica que la tarjeta no esté bloqueada
- ✅ Contacta a Transbank para verificar configuración

### Redirección incorrecta después del pago
- ✅ Verifica que `NEXT_PUBLIC_BASE_URL` esté configurado
- ✅ Debe ser `https://www.electricistaschile.com`
- ✅ Sin barra final (/)

---

## 📞 Soporte Transbank

**Mesa de Ayuda Transbank:**
- 📞 Teléfono: 600 638 6380
- 📧 Email: soporte@transbank.cl
- 🌐 Portal: https://www.transbank.cl/web/soporte

**Documentación Oficial:**
- https://www.transbankdevelopers.cl/

---

## ✨ Estado Actual de la Implementación

### ✅ Implementado:

- ✅ Integración con Webpay Plus SDK v6.1.1
- ✅ Creación de transacciones (`/api/webpay/crear-pago`)
- ✅ Confirmación de pagos (`/api/webpay/confirmar`)
- ✅ Soporte para 6 planes de pago diferentes
- ✅ Redirección automática según resultado
- ✅ Manejo de errores y timeouts
- ✅ Soporte para GET y POST en confirmación

### 🎯 Planes Soportados:

| Plan | Monto | Código |
|------|-------|--------|
| Cliente Básico | $0 | CLI-B |
| Cliente Premium | $14.990 | CLI-P |
| Cliente Empresa | $29.990 | CLI-E |
| Profesional Starter | $14.990 | PRO-S |
| Profesional Pro | $29.990 | PRO-P |
| Profesional Elite | $59.990 | PRO-E |

---

## 🚀 ¡Listo para Producción!

Una vez configuradas las variables de entorno en Vercel y redeployado el proyecto, **Transbank estará en producción** y procesando pagos reales.

⚠️ **IMPORTANTE**: Asegúrate de tener las credenciales correctas antes de activar producción.

---

## 📋 Checklist Final

Antes de activar producción, verifica:

- [ ] Credenciales de producción recibidas de Transbank
- [ ] Commerce Code configurado en Vercel
- [ ] API Key configurada en Vercel
- [ ] `WEBPAY_AMBIENTE=produccion` configurado en Vercel
- [ ] Redeploy del proyecto completado
- [ ] Prueba con tarjeta real exitosa
- [ ] Confirmación de pago funciona correctamente
- [ ] Redirección post-pago funciona
- [ ] Monitoreo configurado en portal de Transbank

**Fecha de activación:** _________________

**Responsable:** _________________

---

**Última actualización:** 29 de diciembre de 2025
