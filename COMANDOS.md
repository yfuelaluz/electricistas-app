# 🛠️ Comandos Útiles - Electricistas App

Referencia rápida de comandos para desarrollo y deployment.

---

## 📦 Instalación y Setup

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Instalar Vercel CLI globalmente
npm i -g vercel
```

---

## 💻 Desarrollo Local

```bash
# Iniciar servidor de desarrollo
npm run dev

# Iniciar en puerto específico
PORT=3001 npm run dev

# Limpiar caché y reiniciar
rm -rf .next && npm run dev
```

---

## 🏗️ Build y Producción

```bash
# Compilar para producción
npm run build

# Ver build de producción localmente
npm run start

# Build y start
npm run build && npm run start

# Analizar bundle size
npm run build -- --debug
```

---

## 🔍 Calidad de Código

```bash
# Ejecutar ESLint
npm run lint

# Arreglar problemas de lint automáticamente
npm run lint -- --fix

# Verificar TypeScript
npx tsc --noEmit
```

---

## 🖼️ Optimización de Imágenes

```bash
# Optimizar todas las imágenes de galería
npm run images:optimize

# Optimizar manualmente con Sharp
node scripts/optimize-images.js
```

---

## 🚀 Deployment con Vercel

### Primera vez

```bash
# Login en Vercel
vercel login

# Deploy a preview (staging)
vercel

# Deploy a producción
vercel --prod

# Deploy específico de una rama
vercel --prod --branch=main
```

### Deployments posteriores

```bash
# Deploy automático
git add .
git commit -m "Mensaje"
git push origin main

# Deploy manual
vercel --prod
```

---

## 📊 Monitoreo y Logs

```bash
# Ver logs en tiempo real
vercel logs --follow

# Ver logs de producción
vercel logs --prod

# Ver logs de una función específica
vercel logs --function=/api/cotizaciones

# Ver últimos 100 logs
vercel logs --limit=100

# Ver logs de errores solamente
vercel logs --level=error
```

---

## 🔧 Gestión de Proyecto en Vercel

```bash
# Ver información del proyecto
vercel inspect

# Listar todos los deployments
vercel ls

# Ver detalles de un deployment
vercel inspect <deployment-url>

# Remover un deployment
vercel rm <deployment-url>

# Ver dominios configurados
vercel domains ls

# Agregar dominio
vercel domains add <dominio>
```

---

## 🌍 Variables de Entorno

```bash
# Ver variables de entorno locales
cat .env.local

# Agregar variable en Vercel (CLI)
vercel env add VARIABLE_NAME

# Listar variables de Vercel
vercel env ls

# Descargar variables de Vercel
vercel env pull .env.local

# Remover variable
vercel env rm VARIABLE_NAME
```

---

## 🗂️ Git y Control de Versiones

```bash
# Ver estado
git status

# Agregar todos los cambios
git add .

# Commit
git commit -m "Descripción del cambio"

# Push a main (auto-deploy)
git push origin main

# Ver historial
git log --oneline -10

# Crear rama nueva
git checkout -b feature/nueva-funcionalidad

# Volver a main
git checkout main

# Ver diferencias
git diff
```

---

## 🧪 Testing y Debugging

```bash
# Ver errores de build
npm run build 2>&1 | grep error

# Limpiar todo y reinstalar
rm -rf node_modules .next
npm install
npm run build

# Ver información del sistema
node -v
npm -v
npx next info

# Verificar puertos en uso (Windows)
netstat -ano | findstr :3000

# Verificar puertos en uso (Linux/Mac)
lsof -i :3000
```

---

## 📱 Pruebas de Webpay (Integración)

**Tarjeta de prueba:**
```
Número: 4051 8856 0044 6623
CVV: 123
Fecha: Cualquier futura (ej: 12/25)
RUT: 11.111.111-1
Contraseña: 123
```

**URL de prueba local:**
```bash
# Crear transacción
curl http://localhost:3000/api/webpay/crear-pago?monto=1000&plan=basico

# Ver respuesta
# Copiar token y URL, abrir en navegador
```

---

## 📧 Pruebas de Email (Resend)

```bash
# Enviar cotización de prueba
curl -X POST http://localhost:3000/api/cotizaciones \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "email": "test@example.com",
    "telefono": "56912345678",
    "servicio": "electricidad",
    "mensaje": "Prueba"
  }'
```

---

## 🔍 Búsqueda y Navegación

```bash
# Buscar en archivos
grep -r "texto" src/

# Buscar archivos por nombre
find . -name "*.tsx"

# Contar líneas de código
find src -name "*.tsx" -o -name "*.ts" | xargs wc -l

# Ver estructura de directorios
tree -L 3 -I "node_modules"
```

---

## 🧹 Limpieza y Mantenimiento

```bash
# Limpiar caché de Next.js
rm -rf .next

# Limpiar node_modules
rm -rf node_modules

# Limpiar todo (¡cuidado!)
rm -rf .next node_modules .vercel

# Reinstalar dependencias
npm ci

# Actualizar dependencias
npm update

# Ver dependencias desactualizadas
npm outdated

# Auditar seguridad
npm audit

# Arreglar vulnerabilidades
npm audit fix
```

---

## 📦 Gestión de Dependencias

```bash
# Instalar nueva dependencia
npm install <paquete>

# Instalar como dev dependency
npm install -D <paquete>

# Desinstalar paquete
npm uninstall <paquete>

# Ver árbol de dependencias
npm list

# Ver versión de un paquete
npm list <paquete>

# Limpiar cache de npm
npm cache clean --force
```

---

## 🔒 Backups y Exportación

```bash
# Exportar cotizaciones
cp data/cotizaciones.json backups/cotizaciones-$(date +%Y%m%d).json

# Backup completo del proyecto
tar -czf backup-$(date +%Y%m%d).tar.gz --exclude=node_modules --exclude=.next .

# Exportar variables de entorno
cp .env.local backups/.env.backup
```

---

## 🌐 Pruebas de Producción

```bash
# Probar build localmente
npm run build && npm start

# Probar en modo producción con puerto específico
PORT=3001 npm start

# Simular environment de producción
NODE_ENV=production npm run build
```

---

## 🚨 Troubleshooting Común

```bash
# Puerto ya en uso
npx kill-port 3000

# Limpiar y reinstalar todo
rm -rf .next node_modules package-lock.json
npm install
npm run dev

# Verificar versiones
node -v    # Debe ser 18+
npm -v     # Debe ser 9+

# Ver logs detallados
npm run dev -- --inspect

# Verificar Next.js
npx next -v
```

---

## 📊 Analytics y Performance

```bash
# Analizar bundle
npm run build -- --profile

# Ver tamaño de build
du -sh .next

# Lighthouse desde CLI
npx lighthouse https://tu-dominio.vercel.app --view

# Performance test
npx lighthouse https://tu-dominio.vercel.app --only-categories=performance
```

---

## 🔑 Accesos Rápidos

```bash
# Abrir dashboard de Vercel
open https://vercel.com/dashboard

# Abrir Resend dashboard
open https://resend.com/dashboard

# Abrir repositorio (si está en GitHub)
open $(git config --get remote.origin.url)

# Abrir app en navegador
open http://localhost:3000
```

---

## 📞 Contactos de Soporte

- **Email:** yfuelaluz@gmail.com
- **WhatsApp:** +56 9 95748162

---

## 📚 Recursos

- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Docs:** https://vercel.com/docs
- **Transbank SDK:** https://github.com/TransbankDevelopers/transbank-sdk-nodejs
- **Resend Docs:** https://resend.com/docs

---

**💡 Tip:** Guarda este archivo en tus favoritos para acceso rápido a comandos comunes.
