# 📸 Cómo Agregar Imágenes a la Galería

## 🚀 Proceso Automático

Simplemente agrega tus imágenes a esta carpeta (`public/galeria/`) y se mostrarán automáticamente en la página.

---

## 📋 Categorización Automática

Las imágenes se categorizan automáticamente según su nombre:

### ⚡ Electricidad
Incluye palabras: `tablero`, `electr`, `iluminacion`, `fotovoltaic`, `plano`, `montaje`, `epc`, `panel`

**Ejemplos:**
- `Tablero-Electrico.jpg`
- `Iluminacion-LED.png`
- `Panel-Fotovoltaico.jpg`

### 🪚 Carpintería
Incluye palabras: `casa`, `ampliacion`, `cabaña`, `techumbre`, `dorm`, `baño`, `soltero`, `pisos`, `madera`

**Ejemplos:**
- `Casa-2-pisos.jpg`
- `Ampliacion-Cabaña.png`
- `Techumbre-Nueva.jpg`

### 🛋️ Mueblistas
Incluye palabras: `mueble`, `closet`, `cocina`, `estante`

**Ejemplos:**
- `Mueble-Cocina.jpg`
- `Closet-Madera.png`
- `Estante-Living.jpg`

### 📦 Otros
Todo lo que no coincida con las categorías anteriores.

---

## ✨ Formato de Nombres

### Recomendado:
```
Categoria-Descripcion-Detalle.jpg
```

**Ejemplos:**
- `Tablero-Industrial-3-Fases.jpg`
- `Casa-Soltero-Vista-Frontal.jpg`
- `Mueble-Closet-Empotrado.jpg`

### El sistema automáticamente:
- ✅ Convierte guiones en espacios
- ✅ Capitaliza cada palabra
- ✅ Genera títulos bonitos
- ✅ Agrupa versiones optimizadas (ej: `-1024.avif`, `-640.avif`)

---

## 🖼️ Formatos Soportados

- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`
- `.avif` (optimizado)

---

## 📂 Carpetas Soportadas

### Opción 1: Directa
Agregar imágenes directamente a `/public/galeria/`

### Opción 2: Optimizadas (Recomendado)
Agregar imágenes a `/public/galeria/optimized/`

El sistema detecta automáticamente qué carpeta usar.

---

## 🔄 Optimización de Imágenes (Opcional)

Para optimizar tus imágenes antes de subirlas:

```bash
npm run images:optimize
```

Este comando:
- Convierte imágenes a formato AVIF (más liviano)
- Genera múltiples tamaños (320px, 640px, 1024px, 1600px)
- Las guarda en `/public/galeria/optimized/`

---

## 💡 Consejos

1. **Nombres descriptivos:** Usa nombres que describan claramente el proyecto
2. **Sin espacios:** Usa guiones `-` en lugar de espacios
3. **Alta calidad:** Sube imágenes de buena calidad (se optimizan automáticamente)
4. **Categorización:** Incluye palabras clave para que se categorice correctamente

---

## 🧪 Ejemplo Completo

### Paso 1: Agregar imagen
Copia tu imagen a `/public/galeria/`:
```
public/galeria/Panel-Solar-Casa-Moderna.jpg
```

### Paso 2: Nombrar correctamente
El nombre debe incluir palabras clave:
- `Panel` → Se categoriza como **Electricidad** ⚡

### Paso 3: ¡Listo!
Refresca la página y verás tu imagen en la galería de **Electricidad**

**Título generado automáticamente:**
"Panel Solar Casa Moderna"

---

## 🔍 Verificar Categorización

Si una imagen no aparece en la categoría correcta, renómbrala incluyendo palabras clave:

**Mal:** `IMG_1234.jpg` → Categoría: Otros  
**Bien:** `Tablero-Residencial-IMG_1234.jpg` → Categoría: Electricidad

---

## 📞 Soporte

Si tienes dudas, contacta a:
- **Email:** yfuelaluz@gmail.com
- **WhatsApp:** +56 9 95748162
