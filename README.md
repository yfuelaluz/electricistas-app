# 🏗️ ELIENAI SPA - Plataforma de Servicios Profesionales

> Plataforma web profesional para conectar clientes con profesionales certificados de construcción y servicios. Sistema completo de cotizaciones, pagos, portfolio y gestión de proyectos para múltiples especialidades: Electricidad, Carpintería, Gasfitería, Pintura, Soldadura, Construcción, Energía Solar, Planos y Trámites SEC.

## ✨ Características Principales

### Para Clientes
- 🔍 **Búsqueda avanzada** de profesionales por especialidad, ubicación y valoración
- 📋 **Solicitud de cotizaciones** con sistema inteligente de presupuestos
- 💳 **Pagos seguros** con Webpay Plus (Transbank)
- ⭐ **Sistema de reviews** y valoraciones
- 📊 **Dashboard** para seguimiento de proyectos

### Para Profesionales
- 💼 **Portfolio digital** para mostrar trabajos
- 📈 **Estadísticas** de conversión e ingresos
- 🎯 **Gestión de leads** con límites según plan
- 📧 **Notificaciones automáticas** por email
- 🏆 **Sistema de planes** (Starter, Pro, Elite)

### Para Administradores
- 👥 **Panel de control** completo
- 📊 **Métricas** de negocio en tiempo real
- ✅ **Activación** de profesionales
- 📝 **Gestión** de cotizaciones

## 🎯 Stack Tecnológico

- **Frontend:** Next.js 16 + React 19 + TypeScript
- **Estilos:** Tailwind CSS + CSS Modules
- **Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** bcrypt + Supabase Auth
- **Pagos:** Transbank Webpay Plus
- **Emails:** Resend
- **Deploy:** Vercel
- **Storage:** Supabase Storage (imágenes)

## 📋 Requisitos

- Node.js 18+
- npm o yarn
- Cuenta Supabase (gratis)
- Cuenta Resend (gratis, 3000 emails/mes)
- Credenciales Transbank

## 🚀 Inicio Rápido

### 1. Instalación

```bash
# Clonar repositorio
git clone https://github.com/tuusuario/electricistas-app.git
cd electricistas-app

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Iniciar desarrollo
npm run dev
```

### 2. Configurar Supabase

📘 **Guía completa:** [SETUP-SUPABASE.md](SETUP-SUPABASE.md)

```bash
# Crear proyecto en supabase.com
# Ejecutar SQL para crear tablas
# Copiar credenciales a .env.local
# Migrar datos existentes (opcional)
npm run migrate:supabase
```

### 3. Deploy a Producción

📘 **Guía completa:** [DEPLOY-PRODUCCION.md](DEPLOY-PRODUCCION.md)

```bash
# Opción 1: Deploy con Vercel CLI
npm install -g vercel
vercel

# Opción 2: Conectar GitHub a Vercel
# (Recomendado - deploy automático)
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
