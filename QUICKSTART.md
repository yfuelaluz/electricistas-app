# 🚀 Quick Start - Deployment Rápido

## Para Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local si necesitas cambiar algo

# 3. Ejecutar en desarrollo
npm run dev

# 4. Abrir en navegador
http://localhost:3000
```

---

## Para Deployment a Vercel (Primera Vez)

### Opción 1: Desde la UI de Vercel (MÁS FÁCIL)

1. **Conectar Repo:**
   - Ve a https://vercel.com/new
   - Click en "Import Git Repository"
   - Selecciona tu repo

2. **Configurar Variables:**
   - En "Environment Variables", agrega:
     ```
     WEBPAY_AMBIENTE=integracion
     WEBPAY_COMMERCE_CODE=597055555532
     WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
     NEXT_PUBLIC_BASE_URL=http://localhost:3000
     RESEND_API_KEY=re_Z6EJ8AEg_8cjyoJ9PuVzqvH73jZPRzMK9
     EMAIL_TO=yfuelaluz@gmail.com
     ```

3. **Deploy:**
   - Click "Deploy"
   - Espera 2-3 minutos

4. **Actualizar URL:**
   - Copia la URL que te da Vercel
   - Ve a Settings → Environment Variables
   - Edita `NEXT_PUBLIC_BASE_URL` con la URL real
   - Redeploy

### Opción 2: Desde la CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Configurar variables en dashboard.vercel.com
```

---

## Para Deployments Posteriores

```bash
# Simplemente haz push
git add .
git commit -m "Cambios realizados"
git push origin main

# Vercel despliega automáticamente
```

---

## Verificación Rápida

Después del deployment, verifica:

✅ https://tu-dominio.vercel.app → Página principal carga  
✅ https://tu-dominio.vercel.app/cotizacion → Formulario funciona  
✅ https://tu-dominio.vercel.app/admin/cotizaciones → Admin panel  
✅ Envía una cotización de prueba → Debe llegar email  

---

## Comandos Útiles

```bash
# Ver logs en tiempo real
vercel logs --follow

# Ver deployments
vercel ls

# Ver información del proyecto
vercel inspect

# Ejecutar build local
npm run build

# Ver versión de producción local
npm run start
```

---

## URLs Importantes

- **Dashboard Vercel:** https://vercel.com/dashboard
- **Resend Dashboard:** https://resend.com/dashboard
- **Documentación Transbank:** https://www.transbankdevelopers.cl/

---

## Soporte

**Email:** yfuelaluz@gmail.com  
**WhatsApp:** +56 9 95748162

**Documentación completa:** Ver [DEPLOYMENT.md](DEPLOYMENT.md)
