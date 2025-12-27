-- Script para crear/actualizar datos del administrador
-- Se ejecuta automáticamente para mantener datos permanentes

-- PROFESIONAL ADMINISTRADOR
INSERT INTO profesionales (
  id,
  nombre_completo,
  rut,
  email,
  telefono,
  password_hash,
  especialidad,
  comunas,
  experiencia,
  certificaciones,
  descripcion,
  foto_perfil,
  plan,
  estado,
  valoracion,
  trabajos_realizados,
  leads_usados,
  rol
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Alejandro Fernández',
  '12345678-9',
  'yfuelaluz@gmail.com',
  '+56995748162',
  '$2b$10$dummy_hash_replace_with_real_hash',
  'Electricidad Integral',
  ARRAY['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'Concón'],
  15,
  'Certificado SEC Clase A, Instalador Autorizado Paneles Solares, Electricista Industrial',
  '/images/admin-profile.jpg',
  'elite',
  'activo',
  5.0,
  0,
  0,
  'admin'
)
ON CONFLICT (id) 
DO UPDATE SET
  nombre_completo = EXCLUDED.nombre_completo,
  telefono = EXCLUDED.telefono,
  especialidad = EXCLUDED.especialidad,
  comunas = EXCLUDED.comunas,
  experiencia = EXCLUDED.experiencia,
  certificaciones = EXCLUDED.certificaciones,
  plan = EXCLUDED.plan,
  estado = EXCLUDED.estado,
  rol = EXCLUDED.rol;

-- CLIENTE ADMINISTRADOR
INSERT INTO clientes (
  id,
  nombre_completo,
  rut,
  email,
  telefono,
  direccion,
  comuna,
  password_hash,
  plan,
  estado,
  rol
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Alejandro Fernández',
  '12345678-9',
  'yfuelaluz@gmail.com',
  '+56995748162',
  'Valparaíso, V Región',
  'Valparaíso',
  '$2b$10$dummy_hash_replace_with_real_hash',
  'empresa',
  'activo',
  'admin'
)
ON CONFLICT (id)
DO UPDATE SET
  nombre_completo = EXCLUDED.nombre_completo,
  telefono = EXCLUDED.telefono,
  direccion = EXCLUDED.direccion,
  comuna = EXCLUDED.comuna,
  plan = EXCLUDED.plan,
  estado = EXCLUDED.estado,
  rol = EXCLUDED.rol;

-- Agregar columna 'rol' a las tablas si no existe
ALTER TABLE profesionales ADD COLUMN IF NOT EXISTS rol VARCHAR(20) DEFAULT 'user';
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS rol VARCHAR(20) DEFAULT 'user';

-- Crear índice para búsqueda rápida de admins
CREATE INDEX IF NOT EXISTS idx_profesionales_rol ON profesionales(rol);
CREATE INDEX IF NOT EXISTS idx_clientes_rol ON clientes(rol);

-- Asegurar que el admin siempre tenga estado activo
CREATE OR REPLACE FUNCTION ensure_admin_active()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.rol = 'admin' THEN
    NEW.estado = 'activo';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para profesionales
DROP TRIGGER IF EXISTS trigger_admin_profesionales ON profesionales;
CREATE TRIGGER trigger_admin_profesionales
  BEFORE UPDATE ON profesionales
  FOR EACH ROW
  EXECUTE FUNCTION ensure_admin_active();

-- Trigger para clientes
DROP TRIGGER IF EXISTS trigger_admin_clientes ON clientes;
CREATE TRIGGER trigger_admin_clientes
  BEFORE UPDATE ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION ensure_admin_active();
