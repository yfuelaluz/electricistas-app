# 📧 Configuración de Notificaciones por Email con Resend

## ¿Qué es Resend?
Resend es un servicio moderno para envío de emails transaccionales. Lo usamos para enviar notificaciones automáticas a los profesionales cuando reciben nuevas cotizaciones.

## 🚀 Pasos para Configurar

### 1. Crear cuenta en Resend

1. Ve a [resend.com](https://resend.com)
2. Haz clic en **"Sign Up"** (Registrarse)
3. Puedes registrarte con tu email o con GitHub
4. Verifica tu email

### 2. Obtener tu API Key

1. Una vez dentro, ve a **"API Keys"** en el menú lateral
2. Haz clic en **"Create API Key"**
3. Dale un nombre (ej: "Electricistas App")
4. Selecciona permisos: **"Sending access"**
5. Haz clic en **"Create"**
6. **¡IMPORTANTE!** Copia la API Key inmediatamente (solo se muestra una vez)
   - Se verá algo así: `re_123abc456def789ghi`

### 3. Configurar en tu proyecto

1. Abre tu proyecto en VS Code
2. En la carpeta raíz (`electricistas-app/`), crea un archivo llamado `.env.local`
3. Agrega esta línea (reemplaza con tu API key real):

```env
RESEND_API_KEY=re_TU_API_KEY_AQUI
```

**Ejemplo:**
```env
RESEND_API_KEY=re_abc123def456ghi789jkl
```

### 4. Reiniciar el servidor

Después de agregar la variable de entorno, reinicia tu servidor de desarrollo:

```bash
# Detén el servidor (Ctrl + C)
# Luego vuelve a iniciarlo
npm run dev
```

### 5. Verificar dominio (Opcional - Para producción)

Para enviar desde tu propio dominio en lugar de `onboarding@resend.dev`:

1. En Resend, ve a **"Domains"**
2. Haz clic en **"Add Domain"**
3. Ingresa tu dominio (ej: `elienai.cl`)
4. Sigue las instrucciones para agregar los registros DNS
5. Una vez verificado, actualiza el archivo `src/lib/email.ts`:

```typescript
// Cambia esta línea:
from: 'Electricistas App <onboarding@resend.dev>',
// Por tu dominio verificado:
from: 'Electricistas App <noreply@tudominio.cl>',
```

## 📊 Plan Gratis de Resend

El plan gratuito incluye:
- ✅ **3,000 emails/mes** gratis
- ✅ 1 dominio verificado
- ✅ API completa
- ✅ Webhooks
- ✅ Analytics básico

Perfecto para comenzar y escalar después.

## 🧪 Probar el Sistema

Una vez configurado, las notificaciones se enviarán automáticamente cuando:

1. **Nueva cotización:** Un cliente solicita un servicio
   - Se envía email al profesional con los detalles
   - Incluye botón para ver la cotización

2. **Cotización aceptada:** Un cliente acepta una propuesta
   - Se notifica al profesional del éxito
   - Muestra el monto aceptado

## ❓ Troubleshooting

### Error: "RESEND_API_KEY no configurada"
- Verifica que el archivo `.env.local` exista en la raíz
- Asegúrate de reiniciar el servidor después de crear el archivo
- Revisa que no haya espacios extra en la API key

### Emails no llegan
- Revisa la consola del servidor - debe decir "✅ Email enviado"
- Verifica en tu panel de Resend si el email fue enviado
- Revisa la carpeta de spam del destinatario
- Si usas dominio personalizado, verifica que esté verificado en Resend

### Para desarrollo sin Resend
El sistema funcionará sin problemas sin Resend. Simplemente verás un warning en la consola:
```
⚠️  RESEND_API_KEY no configurada. Email no enviado.
```

Los emails solo no se enviarán, pero todo lo demás seguirá funcionando normalmente.

## 📧 Emails que se Envían

### 1. Nueva Cotización
- **Para:** Email del profesional
- **Cuándo:** Cliente solicita una cotización
- **Contenido:** Detalles del servicio, cliente, botón para responder

### 2. Cotización Aceptada
- **Para:** Email del profesional
- **Cuándo:** Cliente acepta una propuesta
- **Contenido:** Confirmación, monto, datos de contacto

## 🎨 Personalizar Templates

Los templates de email están en `src/lib/email.ts`. Puedes personalizarlos editando el HTML y CSS inline.

---

**¿Necesitas ayuda?** Revisa la [documentación oficial de Resend](https://resend.com/docs)
