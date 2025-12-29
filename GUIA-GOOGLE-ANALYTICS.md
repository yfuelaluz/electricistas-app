# 📊 CONFIGURAR GOOGLE ANALYTICS 4 - PASO A PASO

## ¿Por qué es importante?

Google Analytics 4 te permitirá:
- 📈 Medir el tráfico de tu sitio
- 🎯 Ver qué páginas visitan más los usuarios
- 💰 Medir conversiones (registros, cotizaciones)
- 📱 Analizar usuarios móvil vs desktop
- 🌎 Ver de dónde viene tu tráfico (Google, redes sociales, etc.)

---

## ✅ PASO 1: Crear Cuenta en Google Analytics

1. Ve a [https://analytics.google.com](https://analytics.google.com)
2. Haz clic en **"Empezar a medir"** o **"Start measuring"**
3. Si ya tienes cuenta de Google, inicia sesión
4. Si es tu primera vez, acepta los términos de servicio

---

## ✅ PASO 2: Crear Propiedad GA4

1. **Nombre de la cuenta:**
   - Escribe: `ELIENAI SPA` o `Electricistas Chile`
   - Haz clic en **Siguiente**

2. **Nombre de la propiedad:**
   - Escribe: `electricistaschile.com`
   - Zona horaria: **Chile**
   - Moneda: **Peso chileno (CLP)**
   - Haz clic en **Siguiente**

3. **Detalles del negocio:**
   - Sector: **Professional Services** o **Construcción**
   - Tamaño: **Pequeña (1-10 empleados)**
   - Objetivos: Selecciona las opciones que apliquen:
     - ✅ Generar clientes potenciales
     - ✅ Medir conversiones
     - ✅ Obtener información de clientes
   - Haz clic en **Crear**

4. **Aceptar términos:**
   - Lee y acepta los términos de servicio
   - Marca las casillas necesarias
   - Haz clic en **Acepto**

---

## ✅ PASO 3: Configurar Flujo de Datos Web

1. Selecciona la plataforma: **Web**

2. **Configurar flujo de datos web:**
   - URL del sitio web: `https://www.electricistaschile.com`
   - Nombre del flujo: `Sitio Web Principal`
   - Haz clic en **Crear flujo**

---

## ✅ PASO 4: Obtener el Measurement ID

¡Listo! Ahora verás tu **Measurement ID** en la pantalla:

```
G-XXXXXXXXXX
```

**Este es el ID que necesitas.** Cópialo completo (incluyendo la G-)

Ejemplo: `G-1A2B3C4D5E`

---

## ✅ PASO 5: Configurar en Vercel

### Opción A: Desde la Web de Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión
3. Selecciona tu proyecto: **electricistas-app**
4. Ve a **Settings** (Configuración)
5. En el menú lateral, haz clic en **Environment Variables**
6. Haz clic en **Add New**
7. Completa:
   - **Key:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value:** Tu Measurement ID (ej: `G-1A2B3C4D5E`)
   - **Environment:** Marca las 3 opciones:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
8. Haz clic en **Save**

### Opción B: Desde la Terminal (si tienes Vercel CLI)

```bash
vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID
# Pega tu Measurement ID cuando te lo pida
# Selecciona: Production, Preview, Development
```

---

## ✅ PASO 6: Redeploy del Sitio

Para que los cambios surtan efecto:

### Desde Vercel Web:
1. Ve a la pestaña **Deployments**
2. Haz clic en los 3 puntos (...) del último deployment
3. Selecciona **Redeploy**
4. Confirma haciendo clic en **Redeploy**

### Desde Terminal:
```bash
cd "C:\Users\ALEJANDRO FERNANDEZ\Desktop\APP\electricistas-app"
vercel --prod
```

---

## ✅ PASO 7: Verificar que Funciona

1. Espera 2-3 minutos después del deploy
2. Visita tu sitio: [https://www.electricistaschile.com](https://www.electricistaschile.com)
3. Ve a Google Analytics → **Informes** → **Tiempo real**
4. Deberías ver **1 usuario activo** (tú mismo)

**Si ves el usuario activo = ✅ ¡Funciona!**

---

## ✅ PASO 8: Configurar Eventos Personalizados (Opcional)

Ya tienes tracking básico funcionando. Si quieres medir eventos específicos:

### Eventos que ya están configurados en el código:

- **Cotización enviada:** Se registra automáticamente cuando alguien solicita una cotización
- **Registro de profesional:** Se registra cuando un profesional se registra
- **Click en WhatsApp:** Se registra cuando alguien hace click en contactar por WhatsApp

Para ver estos eventos:
1. Google Analytics → **Informes** → **Participación** → **Eventos**
2. Después de unos días verás los eventos listados

---

## 🎯 Métricas Clave para Monitorear

Una vez configurado, enfócate en:

1. **Usuarios y sesiones:**
   - ¿Cuánta gente visita el sitio?
   - ¿Cuánto tiempo pasan?

2. **Páginas más vistas:**
   - ¿Qué servicios son más populares?
   - ¿La gente llega a la página de cotización?

3. **Conversiones:**
   - ¿Cuántas cotizaciones se envían?
   - ¿Cuántos profesionales se registran?

4. **Fuentes de tráfico:**
   - ¿De dónde viene la gente? (Google, directo, redes sociales)

5. **Dispositivos:**
   - ¿Móvil o desktop?
   - ¿Qué navegador usan?

---

## ❓ Problemas Comunes

### No veo usuarios en Tiempo Real:
- Espera 2-3 minutos después de visitar el sitio
- Verifica que el Measurement ID esté correcto
- Asegúrate de haber hecho redeploy en Vercel
- Desactiva bloqueadores de anuncios en tu navegador

### No se registran eventos:
- Los eventos pueden tardar hasta 24 horas en aparecer
- Verifica en la consola del navegador (F12) que no haya errores

### Duplicate tracking:
- Si ves el mismo usuario dos veces, revisa que solo tengas un `GoogleAnalytics` component en el layout

---

## 📚 Recursos Adicionales

- [Documentación oficial GA4](https://support.google.com/analytics/answer/9304153)
- [Guía de eventos personalizados](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GA4 vs Universal Analytics](https://support.google.com/analytics/answer/11583528)

---

## ✅ CHECKLIST FINAL

- [ ] Cuenta de Google Analytics creada
- [ ] Propiedad GA4 configurada
- [ ] Measurement ID copiado
- [ ] Variable `NEXT_PUBLIC_GA_MEASUREMENT_ID` agregada en Vercel
- [ ] Sitio redeployado
- [ ] Verificado en "Tiempo real" que aparece tu visita
- [ ] Eventos configurados (opcional)

**¡Listo! Ahora tienes analytics funcionando al 100%** 🎉
