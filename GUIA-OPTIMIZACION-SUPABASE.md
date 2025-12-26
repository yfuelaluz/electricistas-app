# 🔧 Guía de Optimización y Seguridad - Supabase

## 📋 Checklist de Pasos a Seguir

Esta guía te ayudará a configurar **índices de rendimiento** y **Row Level Security (RLS)** en tu base de datos Supabase.

---

## ✅ PASO 1: Verificar Datos en Supabase

### Opción A: Desde la aplicación en producción
Visita: `https://electricistas-app.vercel.app/api/admin/migrate-data`

Verás un JSON con el conteo de registros en cada tabla.

### Opción B: Desde Supabase Dashboard
1. Ir a: https://supabase.com/dashboard/project/pxcuelbud1xaqzvkcggo
2. Click en "Table Editor" (menú izquierdo)
3. Verificar cuántas filas hay en cada tabla:
   - `profesionales`
   - `clientes`
   - `cotizaciones`
   - `reviews`
   - `portfolio`

---

## ✅ PASO 2: Aplicar Índices y Seguridad

### 2.1. Abrir SQL Editor en Supabase
1. Ir a: https://supabase.com/dashboard/project/pxcuelbud1xaqzvkcggo
2. Click en "SQL Editor" en el menú izquierdo
3. Click en "New query"

### 2.2. Copiar el script SQL
Abre el archivo: `scripts/supabase-security-optimization.sql`

O copia este contenido:

```sql
-- ÍNDICES PARA PROFESIONALES
CREATE INDEX IF NOT EXISTS idx_profesionales_email ON profesionales(email);
CREATE INDEX IF NOT EXISTS idx_profesionales_especialidad ON profesionales(especialidad);
CREATE INDEX IF NOT EXISTS idx_profesionales_plan ON profesionales(plan);
CREATE INDEX IF NOT EXISTS idx_profesionales_valoracion ON profesionales(valoracion DESC);

-- ÍNDICES PARA CLIENTES
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_plan ON clientes(plan);

-- ÍNDICES PARA COTIZACIONES
CREATE INDEX IF NOT EXISTS idx_cotizaciones_estado ON cotizaciones(estado);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_fecha ON cotizaciones(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_cliente_id ON cotizaciones((cliente->>'id'));
CREATE INDEX IF NOT EXISTS idx_cotizaciones_servicio_tipo ON cotizaciones((servicio->>'tipo'));
CREATE INDEX IF NOT EXISTS idx_cotizaciones_respuestas_gin ON cotizaciones USING GIN (respuestas);

-- ÍNDICES PARA REVIEWS
CREATE INDEX IF NOT EXISTS idx_reviews_profesional_id ON reviews(profesionalId);
CREATE INDEX IF NOT EXISTS idx_reviews_cliente_id ON reviews(clienteId);
CREATE INDEX IF NOT EXISTS idx_reviews_cotizacion_id ON reviews(cotizacionId);
CREATE INDEX IF NOT EXISTS idx_reviews_valoracion ON reviews(valoracion);
CREATE INDEX IF NOT EXISTS idx_reviews_fecha ON reviews(fecha DESC);

-- ÍNDICES PARA PORTFOLIO
CREATE INDEX IF NOT EXISTS idx_portfolio_profesional_id ON portfolio(profesionalId);
CREATE INDEX IF NOT EXISTS idx_portfolio_categoria ON portfolio(categoria);
CREATE INDEX IF NOT EXISTS idx_portfolio_destacado ON portfolio(destacado);
CREATE INDEX IF NOT EXISTS idx_portfolio_fecha ON portfolio(fecha DESC);

-- ACTIVAR ROW LEVEL SECURITY (puedes hacerlo después si prefieres)
-- ALTER TABLE profesionales ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE cotizaciones ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
```

### 2.3. Ejecutar el script
1. Pega el contenido en el editor SQL
2. Click en "RUN" (botón verde abajo a la derecha)
3. Verifica que aparezca "Success. No rows returned"

---

## ✅ PASO 3: Verificar Índices Creados

Ejecuta esta query en SQL Editor:

```sql
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('profesionales', 'clientes', 'cotizaciones', 'reviews', 'portfolio')
ORDER BY tablename, indexname;
```

Deberías ver aproximadamente **18-20 índices** creados.

---

## ✅ PASO 4: (OPCIONAL) Activar Row Level Security

⚠️ **ADVERTENCIA:** Activar RLS sin configurar políticas correctamente puede bloquear el acceso a los datos.

### Opción 1: Activar RLS con políticas permisivas (RECOMENDADO para empezar)

```sql
-- Activar RLS
ALTER TABLE profesionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cotizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas (todos pueden leer/escribir)
-- PROFESIONALES
CREATE POLICY "Allow all access to profesionales" ON profesionales FOR ALL USING (true) WITH CHECK (true);

-- CLIENTES
CREATE POLICY "Allow all access to clientes" ON clientes FOR ALL USING (true) WITH CHECK (true);

-- COTIZACIONES
CREATE POLICY "Allow all access to cotizaciones" ON cotizaciones FOR ALL USING (true) WITH CHECK (true);

-- REVIEWS
CREATE POLICY "Allow all access to reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);

-- PORTFOLIO
CREATE POLICY "Allow all access to portfolio" ON portfolio FOR ALL USING (true) WITH CHECK (true);
```

### Opción 2: RLS Avanzado (para después)
Puedes usar el script completo `supabase-security-optimization.sql` que incluye políticas más restrictivas.

---

## ✅ PASO 5: Verificar que todo funcione

### 5.1. Probar APIs en producción
1. Ir a: https://electricistas-app.vercel.app
2. Intentar registrarse como profesional o cliente
3. Crear una cotización de prueba
4. Verificar que todo funcione correctamente

### 5.2. Revisar logs de Supabase
1. Ir a: https://supabase.com/dashboard/project/pxcuelbud1xaqzvkcggo/logs/explorer
2. Verificar que no haya errores de RLS o queries

---

## 📊 Beneficios de estas Optimizaciones

### Índices:
- ✅ **Búsquedas más rápidas** - Queries por email, especialidad, estado
- ✅ **Ordenamiento eficiente** - Listados por valoración, fecha
- ✅ **Mejor rendimiento JSONB** - Búsquedas en campos anidados

### Row Level Security (RLS):
- ✅ **Seguridad a nivel de fila** - Control fino de acceso
- ✅ **Prevención de acceso no autorizado** - Solo datos relevantes por usuario
- ✅ **Auditoría automática** - Supabase registra todos los accesos

---

## 🚨 Troubleshooting

### Problema: "Error al crear índice"
**Solución:** Es posible que el índice ya exista. Usa `IF NOT EXISTS` en las queries.

### Problema: "Queries bloqueadas después de activar RLS"
**Solución:** 
1. Desactivar RLS temporalmente:
   ```sql
   ALTER TABLE nombre_tabla DISABLE ROW LEVEL SECURITY;
   ```
2. Revisar políticas creadas
3. Usar políticas permisivas primero

### Problema: "No puedo acceder a los datos desde la app"
**Solución:**
1. Verificar que las políticas permitan acceso público si es necesario
2. Revisar que `NEXT_PUBLIC_SUPABASE_ANON_KEY` sea correcta
3. Comprobar logs en Supabase Dashboard

---

## 📞 Próximos Pasos

Una vez aplicadas estas optimizaciones:

1. ✅ **Monitorear rendimiento** - Revisar tiempos de respuesta en Vercel
2. ✅ **Configurar backups** - Activar en Supabase Dashboard
3. ✅ **Implementar caché** - Considerar Redis o CDN para datos estáticos
4. ✅ **Revisar límites** - Verificar plan de Supabase (Free tier: 500MB)

---

## 📝 Notas Finales

- Los índices ocupan espacio en disco pero mejoran significativamente el rendimiento
- RLS es esencial para aplicaciones en producción con datos sensibles
- Siempre prueba en un entorno de desarrollo antes de aplicar cambios en producción
- Supabase ofrece rollback automático en caso de errores

---

**¿Necesitas ayuda?**
- Supabase Docs: https://supabase.com/docs
- Supabase Support: https://supabase.com/dashboard/support
