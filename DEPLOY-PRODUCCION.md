# 🚀 Guía Rápida: Deploy a Producción

## Checklist Pre-Deploy

### 1. ✅ Configurar Supabase (10 min)
Sigue la guía: [SETUP-SUPABASE.md](SETUP-SUPABASE.md)

**Resumen rápido:**
1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ejecutar script SQL para crear tablas
3. Copiar URL y API Key
4. Agregar a `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
   ```
5. Migrar datos: `npm run migrate:supabase`

### 2. ✅ Configurar Variables de Entorno

Tu `.env.local` debe tener:
```env
# Supabase (REQUERIDO)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# Webpay (PRODUCCIÓN)
WEBPAY_AMBIENTE=produccion
WEBPAY_API_KEY=tu_api_key_produccion
WEBPAY_COMMERCE_CODE=tu_commerce_code_produccion

# Resend (OPCIONAL)
RESEND_API_KEY=re_...
EMAIL_TO=admin@tudominio.cl

# Base URL (se configura automáticamente en Vercel)
NEXT_PUBLIC_BASE_URL=https://tudominio.cl
```

### 3. ✅ Deploy a Vercel (5 min)

#### Opción A: Desde GitHub (Recomendado)
1. Sube tu código a GitHub:
   ```bash
   git init
   git add .
   git commit -m "Ready for production"
   git branch -M main
   git remote add origin https://github.com/tuusuario/electricistas-app.git
   git push -u origin main
   ```

2. Ve a [vercel.com](https://vercel.com)
3. Click **"Import Project"**
4. Conecta tu repositorio de GitHub
5. Vercel detectará Next.js automáticamente
6. Click **"Deploy"**

#### Opción B: Desde CLI
```bash
npm install -g vercel
vercel login
vercel
```

### 4. ✅ Configurar Variables en Vercel

En tu proyecto de Vercel:
1. Ve a **Settings** → **Environment Variables**
2. Agrega TODAS las variables de `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `WEBPAY_AMBIENTE`
   - `WEBPAY_API_KEY`
   - `WEBPAY_COMMERCE_CODE`
   - `RESEND_API_KEY`
   - `EMAIL_TO`
3. Click **"Save"**
4. Redeploy: **Deployments** → **•••** → **"Redeploy"**

### 5. ✅ Configurar Dominio (Opcional)

En Vercel:
1. **Settings** → **Domains**
2. Agrega tu dominio (ej: `electricistas.cl`)
3. Sigue las instrucciones de DNS
4. Espera propagación (5-60 min)

## 🔧 Optimizaciones de Producción

### Actualizar Webpay a Producción
Una vez aprobado por Transbank, actualiza en Vercel:
```env
WEBPAY_AMBIENTE=produccion
WEBPAY_API_KEY=tu_key_real
WEBPAY_COMMERCE_CODE=tu_codigo_real
```

### Activar Compresión de Imágenes
Ya configurado en `next.config.ts` ✅

### Configurar Analytics (Opcional)
```bash
npm install @vercel/analytics
```

Agregar a `src/app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## 🎯 Verificaciones Post-Deploy

### Checklist de Funcionalidad
- [ ] Página principal carga correctamente
- [ ] Login de clientes funciona
- [ ] Login de profesionales funciona
- [ ] Crear cotización funciona
- [ ] Responder cotización funciona
- [ ] Sistema de pagos funciona (modo test primero)
- [ ] Emails se envían correctamente
- [ ] Búsqueda de profesionales funciona
- [ ] Portfolio funciona
- [ ] Admin panel funciona

### Performance
- [ ] Lighthouse score > 90
- [ ] Imágenes optimizadas (WebP/AVIF)
- [ ] Carga inicial < 3 segundos

### SEO
- [ ] Meta tags configurados
- [ ] Sitemap.xml generado
- [ ] Robots.txt configurado
- [ ] Google Search Console conectado

## 🐛 Troubleshooting Común

### Error: "Supabase not configured"
- Verifica que las variables estén en Vercel
- Redeploy después de agregar variables

### Error: "Webpay connection failed"
- Verifica WEBPAY_AMBIENTE (integracion/produccion)
- Verifica WEBPAY_API_KEY esté correcta

### Imágenes no cargan
- Verifica que estén en `public/`
- Usa rutas absolutas: `/galeria/imagen.avif`

### Emails no llegan
- Verifica RESEND_API_KEY
- Revisa logs en dashboard de Resend
- Verifica dominio verificado (producción)

## 📊 Monitoreo

### Logs en Tiempo Real
```bash
vercel logs --follow
```

### Ver Errores
Dashboard de Vercel → **Monitoring** → **Errors**

### Analytics
Dashboard de Vercel → **Analytics**

## 🔐 Seguridad Post-Deploy

1. **Cambiar contraseña admin:**
   - Actualizar en código
   - Usar variable de entorno

2. **Rate limiting:**
   - Considerar Vercel Edge Config
   - O middleware personalizado

3. **CORS:**
   - Configurar en `next.config.ts`

4. **HTTPS:**
   - Automático con Vercel ✅

## 📞 Soporte

- **Vercel:** [vercel.com/docs](https://vercel.com/docs)
- **Supabase:** [supabase.com/docs](https://supabase.com/docs)
- **Next.js:** [nextjs.org/docs](https://nextjs.org/docs)

---

## 🎉 ¡Todo Listo!

Tu app está en producción y lista para recibir usuarios reales.

**Próximos pasos:**
1. Compartir URL con primeros usuarios
2. Monitorear errores
3. Iterar según feedback
4. Escalar según necesidad

**URL de tu app:** https://tudominio.vercel.app
