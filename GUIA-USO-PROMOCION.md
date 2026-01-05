# 📋 GUÍA DE USO - SISTEMA DE PROMOCIÓN 2X1

## ✅ ¿Qué se ha creado?

Se han implementado 4 componentes principales para tu campaña de promoción:

### 1. 🌐 Landing Page de Promoción
- **URL:** `/promo`
- **Archivo:** `src/app/promo/page.tsx`
- **Funcionalidad:** Página especial con contador de cupos en tiempo real

### 2. 🔢 Sistema de Contador de Cupos
- **API:** `/api/promo/stats`
- **Archivo:** `src/app/api/promo/stats/route.ts`
- **Base de datos:** Script SQL para agregar campos promocionales

### 3. 👀 Preview de Posts
- **URL:** `/preview-posts`
- **Archivo:** `src/app/preview-posts/page.tsx`
- **Funcionalidad:** Visualización de todos los posts ANTES de publicar

### 4. 📄 Guía de Contenido
- **Archivo:** `PROMOCION-REDES-SOCIALES.md`
- **Contenido:** Todos los textos, estrategia y calendario

---

## 🚀 PASOS PARA ACTIVAR TODO

### Paso 1: Actualizar la Base de Datos

Ejecuta el script SQL en Supabase:

```bash
# Opción A: Desde la terminal
cd "C:\Users\ALEJANDRO FERNANDEZ\Desktop\APP\electricistas-app"
```

Luego ve a tu panel de Supabase:
1. Abre: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a "SQL Editor"
4. Copia y pega el contenido de: `scripts/add-promo-code.sql`
5. Click en "Run"

### Paso 2: Probar el Sistema Localmente

```bash
# Inicia el servidor de desarrollo
npm run dev
```

Luego abre en tu navegador:
- **Landing page:** http://localhost:3000/promo
- **Preview posts:** http://localhost:3000/preview-posts

### Paso 3: Revisar los Posts

1. Abre http://localhost:3000/preview-posts
2. Revisa CADA post cuidadosamente
3. Busca:
   - ❌ Errores ortográficos
   - ❌ Links rotos
   - ❌ Información incorrecta
   - ✅ Que todo se vea bien

### Paso 4: Crear las Imágenes

Necesitas crear imágenes para cada post. Aquí tienes las especificaciones:

#### Para Facebook Posts:
- **Tamaño:** 1200x630 px
- **Formato:** JPG o PNG
- **Contenido:** 
  - Logo ELIENAI SPA
  - Texto: "2 MESES X 1"
  - "SOLO 25 CUPOS"
  - Fondo azul eléctrico con detalles amarillos

#### Para Instagram Posts:
- **Tamaño:** 1080x1080 px (cuadrado)
- **Formato:** JPG o PNG
- **Carrusel:** 4 imágenes de 1080x1080 px

#### Para Instagram Stories:
- **Tamaño:** 1080x1920 px (9:16)
- **Formato:** JPG, PNG o MP4
- **Elementos:** Stickers interactivos, contador, etc.

#### Para Instagram Reels:
- **Tamaño:** 1080x1920 px (9:16)
- **Formato:** MP4
- **Duración:** 15-30 segundos

**Herramientas recomendadas para diseñar:**
- Canva (gratis): https://www.canva.com
- Figma (gratis): https://www.figma.com
- Adobe Express (gratis): https://www.adobe.com/express

### Paso 5: Exportar los Textos

Desde `/preview-posts`:
1. Selecciona cada post
2. Click en "Copiar Texto"
3. Click en "Copiar Hashtags"
4. Guárdalos en un documento

---

## 📱 CÓMO USAR EL PREVIEW

### Navegación en /preview-posts

1. **Seleccionar post:** Click en cualquier tarjeta de la parte superior
2. **Ver advertencias:** Si hay errores, aparecerán en amarillo
3. **Navegar slides:** Usa las flechas ← → (para carruseles/stories)
4. **Copiar contenido:** Usa los botones de "Copiar"

### Validaciones Automáticas

El sistema verifica:
- ✅ Longitud de texto (Facebook: 63,206 chars, Instagram: 2,200 chars)
- ✅ Número de hashtags (máx 30 en Instagram)
- ✅ Uso excesivo de emojis
- ✅ Longitud total de hashtags

---

## 🎨 PERSONALIZACIONES QUE PUEDES HACER

### Cambiar los colores de la landing page

Edita `src/app/promo/page.tsx`:

```tsx
// Busca estas líneas y cambia los colores:
className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900"
// Cambia a tus colores corporativos

className="bg-yellow-400"
// Cambia el color de los botones
```

### Modificar los textos de los posts

Edita `src/app/preview-posts/page.tsx`:

```tsx
// Busca el array POSTS_DATA (línea ~20)
const POSTS_DATA: SocialPost[] = [
  {
    id: 'fb-profesionales',
    content: `TU NUEVO TEXTO AQUÍ`,
    // ...
  }
]
```

### Cambiar el límite de cupos

Edita `src/app/api/promo/stats/route.ts`:

```tsx
const PROMO_LIMIT = 25; // Cambia a 50, 100, etc.
```

---

## 📊 MONITOREAR LA PROMOCIÓN EN TIEMPO REAL

### Ver estadísticas en la landing page

La página `/promo` muestra automáticamente:
- Cupos restantes de profesionales
- Cupos restantes de clientes
- Barra de progreso visual
- Actualización cada 30 segundos

### Ver estadísticas en Supabase

1. Ve al SQL Editor
2. Ejecuta:

```sql
-- Ver todos los registros con promoción
SELECT * FROM promo_stats;

-- Contar profesionales con promo
SELECT COUNT(*) as total 
FROM profesionales 
WHERE promo_code = '2x1';

-- Contar clientes con promo
SELECT COUNT(*) as total 
FROM clientes 
WHERE promo_code = '2x1';

-- Ver últimos registros
SELECT email, created_at, promo_code 
FROM profesionales 
WHERE promo_code = '2x1' 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## ✏️ MODIFICAR FORMULARIOS DE REGISTRO

Para que los registros cuenten para la promoción, necesitas:

### 1. Agregar parámetro promo a la URL

Los links de la promoción ya tienen `?promo=2x1`:
- `/profesionales/registro?promo=2x1`
- `/clientes/registro?promo=2x1`

### 2. Capturar el parámetro en el formulario

Edita los archivos de registro:
- `src/app/profesionales/registro/page.tsx`
- `src/app/clientes/registro/page.tsx`

Agrega al inicio del componente:

```tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function RegistroPage() {
  const searchParams = useSearchParams();
  const promoCode = searchParams.get('promo'); // Obtiene "2x1"
  
  // ... resto del código
}
```

### 3. Guardar en la base de datos

Cuando crees el registro, incluye:

```tsx
const newUser = await supabase
  .from('profesionales') // o 'clientes'
  .insert({
    // ... otros campos
    promo_code: promoCode || null,
    promo_registered_at: promoCode ? new Date().toISOString() : null
  });
```

---

## 📅 CALENDARIO DE PUBLICACIÓN

### Semana 1 (LANZAMIENTO)

#### Lunes
- ⏰ 12:00 - Facebook post para profesionales
- 📸 19:00 - Story de Instagram (teaser)

#### Martes
- ⏰ 11:00 - Story de Instagram (profesionales)
- 📸 20:00 - Story de Instagram (clientes)

#### Miércoles
- ⏰ 12:00 - Instagram carrusel (profesionales)
- 📸 19:00 - Actualizar contador de cupos

#### Jueves
- ⏰ 12:00 - Facebook post para clientes
- 📸 19:00 - Story con FAQ

#### Viernes
- ⏰ 11:00 - Instagram Reel (clientes)
- 📸 18:00 - Actualizar contador de cupos

#### Sábado
- ⏰ 10:00 - Story recordatorio
- 📸 15:00 - Post con cupos restantes

#### Domingo
- ⏰ 11:00 - Story final de la semana
- 📸 18:00 - Preparar contenido para semana 2

### Semanas 2-4 (SEGUIMIENTO)

**Cada 2 días:**
- Actualizar contador de cupos en Stories
- Compartir testimonios de nuevos registros

**Cada 3 días:**
- Recordatorio de la promoción
- Destacar beneficios específicos

**Semanalmente:**
- Post de recap semanal
- Anuncio de cupos restantes

---

## 🎯 CHECKLIST ANTES DE PUBLICAR

### Antes de cada publicación

- [ ] Texto revisado sin errores
- [ ] Hashtags correctos (#Chile #Electricista etc)
- [ ] Imagen/video de alta calidad
- [ ] Link de registro probado
- [ ] Horario óptimo (12-14h o 19-21h)
- [ ] CTA claro y visible

### Configuración de Facebook

- [ ] Post programado
- [ ] Ubicación: Feed + Stories
- [ ] Botón de CTA agregado ("Registrarse")
- [ ] Link correcto en el botón

### Configuración de Instagram

- [ ] Primera línea llamativa
- [ ] Hashtags al final del caption
- [ ] Ubicación agregada (Chile/tu ciudad)
- [ ] Colaboradores etiquetados (si aplica)
- [ ] Stickers en Stories (encuestas, links, etc)

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### El contador no se actualiza

1. Verifica que el script SQL se ejecutó correctamente
2. Revisa la consola del navegador (F12)
3. Prueba la API directamente: http://localhost:3000/api/promo/stats

### Los posts se ven mal

1. Limpia el caché del navegador (Ctrl + Shift + R)
2. Verifica que no hay errores en la consola
3. Prueba en otro navegador

### No puedo copiar los textos

1. Verifica permisos del navegador para clipboard
2. Usa Ctrl+C manualmente
3. Abre en modo incógnito

---

## 📈 MÉTRICAS A SEGUIR

### Engagement (cada post)

- 👍 Likes/Reacciones
- 💬 Comentarios
- 🔄 Compartidos
- 💾 Guardados (Instagram)
- 👁️ Alcance total

### Conversión

- 🔗 Clicks en el link
- 📝 Registros completados
- 📊 Tasa de conversión (clicks → registros)
- ⚡ Profesionales: X/25
- 👥 Clientes: X/25

### Horarios óptimos

Registra qué posts tienen mejor rendimiento y ajusta:
- Mejores días: _______
- Mejores horas: _______
- Mejor tipo de contenido: _______

---

## 💡 TIPS FINALES

### Para maximizar el engagement

1. **Responde RÁPIDO** a los primeros comentarios (primeros 30 min)
2. **Haz preguntas** en los posts para generar conversación
3. **Usa stickers interactivos** en Stories (encuestas, preguntas)
4. **Publica consistentemente** según el calendario
5. **Comparte contenido generado por usuarios** (testimonios)

### Para acelerar las conversiones

1. **Urgencia:** Actualiza cupos restantes constantemente
2. **Prueba social:** Comparte "¡Juan acaba de registrarse!"
3. **Testimonios:** Pide a los primeros registros que compartan
4. **Responde dudas:** Ten las FAQs a mano
5. **Ofertas flash:** "Hoy 5 cupos extra"

### Para mantener la calidad

1. **No spam:** Respeta los límites de publicaciones
2. **Contenido valioso:** Mezcla promoción con contenido útil
3. **Interacción genuina:** Conversaciones reales
4. **Mejora continua:** Ajusta según resultados

---

## 🚀 SIGUIENTES PASOS

1. [ ] Ejecutar script SQL en Supabase
2. [ ] Probar landing page `/promo`
3. [ ] Revisar todos los posts en `/preview-posts`
4. [ ] Corregir cualquier error encontrado
5. [ ] Diseñar las imágenes en Canva
6. [ ] Programar posts en Facebook Business Suite
7. [ ] Preparar Stories de Instagram
8. [ ] Configurar notificaciones para responder rápido
9. [ ] Establecer sistema de seguimiento de métricas
10. [ ] ¡LANZAR LA CAMPAÑA!

---

## 📞 RECURSOS ÚTILES

### Herramientas de diseño
- **Canva:** https://www.canva.com
- **Figma:** https://www.figma.com
- **Adobe Express:** https://www.adobe.com/express
- **Remove.bg:** https://remove.bg (quitar fondos)

### Programación de posts
- **Facebook Business Suite:** https://business.facebook.com
- **Later:** https://later.com (Instagram)
- **Buffer:** https://buffer.com

### Analytics
- **Facebook Insights:** En tu página de Facebook
- **Instagram Insights:** En tu perfil de Instagram
- **Google Analytics:** Para el sitio web

### Bancos de imágenes gratis
- **Unsplash:** https://unsplash.com
- **Pexels:** https://pexels.com
- **Pixabay:** https://pixabay.com

---

## ✅ TODO LISTO

Ahora tienes:

✅ Landing page con contador en tiempo real (`/promo`)
✅ Sistema de tracking de cupos (API + SQL)
✅ Preview de TODOS los posts (`/preview-posts`)
✅ Guía completa de contenido (este archivo)
✅ Calendario de publicaciones
✅ Checklist de validación
✅ Instrucciones paso a paso

**¡Solo falta que revises todo, diseñes las imágenes y lances la campaña!** 🎉

¿Alguna duda? Revisa este documento o pregunta lo que necesites.
