# Guía de Deployment a Vercel

## Variables de Entorno Requeridas

Cuando despliegues a Vercel, debes configurar estas variables de entorno en el dashboard:

### 1. Webpay Plus (Transbank)
```
WEBPAY_AMBIENTE=integracion
WEBPAY_COMMERCE_CODE=597055555532
WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
```

### 2. URL Base
```
NEXT_PUBLIC_BASE_URL=https://tu-dominio.vercel.app
```
**IMPORTANTE:** Después del primer deployment, actualiza esta variable con la URL real que te dé Vercel.

### 3. Resend (Email Notifications)
```
RESEND_API_KEY=re_Z6EJ8AEg_8cjyoJ9PuVzqvH73jZPRzMK9
EMAIL_TO=yfuelaluz@gmail.com
```

---

## Pasos para Desplegar

### 1. Desplegar a Vercel
```bash
vercel --prod
```

### 2. Configurar Variables de Entorno
1. Ve al dashboard de Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Ve a Settings → Environment Variables
4. Agrega todas las variables de arriba
5. Redeploy: Settings → Deployments → Redeploy

### 3. Actualizar NEXT_PUBLIC_BASE_URL
1. Copia la URL de producción (ej: https://electricistas-app-xyz.vercel.app)
2. Actualiza la variable `NEXT_PUBLIC_BASE_URL` con esa URL
3. Redeploy nuevamente

### 4. Registrar URL en Transbank
1. URL de retorno: `https://tu-dominio.vercel.app/api/webpay/confirmar`
2. Enviar a Transbank para registro en ambiente de integración

---

## Verificar que Todo Funciona

### ✅ Checklist Post-Deployment

- [ ] La página principal carga correctamente
- [ ] El formulario de cotización está accesible en `/cotizacion`
- [ ] Se puede enviar una cotización de prueba
- [ ] Llega el email de notificación a yfuelaluz@gmail.com
- [ ] El admin dashboard funciona en `/admin/cotizaciones`
- [ ] Los botones de WhatsApp y Email funcionan
- [ ] Las imágenes de la galería cargan correctamente

### 🧪 Prueba de Cotización

1. Ve a https://tu-dominio.vercel.app/cotizacion
2. Llena el formulario con datos de prueba
3. Envía la cotización
4. Verifica que llegue el email
5. Revisa el admin dashboard para ver la cotización

---

## Troubleshooting

### No llegan los emails
- Verifica que `RESEND_API_KEY` esté configurada
- Revisa los logs en Vercel Dashboard → Deployments → Functions
- Verifica que el email `EMAIL_TO` sea correcto

### Error en Webpay
- Confirma que las credenciales sean correctas
- Verifica que `NEXT_PUBLIC_BASE_URL` esté actualizada
- Registra la URL de callback en Transbank

### Imágenes no cargan
- Verifica que la carpeta `public/galeria/optimized` esté en el repo
- Confirma que el API endpoint `/api/galeria` funcione

---

## Contacto y Soporte

- **Email:** yfuelaluz@gmail.com
- **WhatsApp:** +56 9 95748162

---

## Próximos Pasos (Después del Deployment)

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
