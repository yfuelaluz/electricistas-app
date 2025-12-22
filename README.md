# 🔌 App de Electricistas - Servicios Eléctricos y Carpintería

Aplicación web profesional para servicios de electricidad, carpintería y construcción con sistema de cotizaciones, galería de trabajos y pagos integrados con Webpay Plus.

## 🚀 Características Principales

- ✅ Sistema de cotizaciones online con notificaciones por email
- ✅ Galería de trabajos optimizada con imágenes en formato AVIF
- ✅ Integración con Webpay Plus (Transbank) para pagos
- ✅ Panel de administración para gestionar cotizaciones
- ✅ Diseño responsive y moderno con Tailwind CSS
- ✅ Formularios de contacto con WhatsApp integrado
- ✅ Sistema de suscripciones para clientes y profesionales

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Cuenta en Vercel (para deployment)
- Cuenta en Resend (para emails)
- Credenciales de Transbank (para pagos)

## 🛠️ Instalación Local

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd electricistas-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar el archivo de ejemplo
cp .env.example .env.local

# Editar .env.local con tus credenciales
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## 🔐 Variables de Entorno

Consulta el archivo `.env.example` para ver todas las variables necesarias:

- `WEBPAY_AMBIENTE`: integracion o produccion
- `WEBPAY_COMMERCE_CODE`: Código de comercio Transbank
- `WEBPAY_API_KEY`: API Key de Transbank
- `NEXT_PUBLIC_BASE_URL`: URL base de la aplicación
- `RESEND_API_KEY`: API Key de Resend para emails
- `EMAIL_TO`: Email donde llegarán las cotizaciones

## 📦 Scripts Disponibles

```bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Compilar para producción
npm run start        # Ejecutar versión de producción
npm run lint         # Verificar código con ESLint
npm run images:optimize  # Optimizar imágenes de galería
```

## 🚀 Deployment a Vercel

Consulta la [Guía de Deployment](DEPLOYMENT.md) para instrucciones detalladas.

**Pasos rápidos:**

1. Conectar repositorio a Vercel
2. Configurar variables de entorno en Vercel Dashboard
3. Deploy automático desde la rama main

## 📁 Estructura del Proyecto

```
electricistas-app/
├── src/
│   ├── app/              # Rutas y páginas (Next.js App Router)
│   │   ├── api/          # Endpoints de API
│   │   ├── cotizacion/   # Página de cotizaciones
│   │   ├── admin/        # Panel de administración
│   │   └── page.tsx      # Página principal
│   ├── components/       # Componentes reutilizables
│   │   ├── ui/          # Componentes de UI
│   │   └── services/    # Componentes de servicios
│   ├── lib/             # Utilidades y helpers
│   └── types/           # Tipos de TypeScript
├── public/
│   └── galeria/         # Imágenes de trabajos
├── data/
│   └── cotizaciones.json # Almacenamiento de cotizaciones
├── .env.local           # Variables de entorno (no subir a git)
├── .env.example         # Ejemplo de variables de entorno
└── vercel.json          # Configuración de Vercel
```

## 🎨 Tecnologías Utilizadas

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS 4
- **Pagos:** Transbank SDK (Webpay Plus)
- **Emails:** Resend
- **Iconos:** Lucide React
- **Imágenes:** Sharp (optimización)

## 📞 Contacto y Soporte

- **Email:** yfuelaluz@gmail.com
- **WhatsApp:** +56 9 95748162

## 📄 Licencia

Este proyecto es privado y confidencial.

## 🔄 Próximas Mejoras

- [ ] Base de datos persistente (PostgreSQL/Supabase)
- [ ] Sistema de autenticación para clientes
- [ ] Chat en vivo
- [ ] App móvil nativa
- [ ] Sistema de seguimiento de proyectos
