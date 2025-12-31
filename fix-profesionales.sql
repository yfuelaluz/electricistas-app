-- Eliminar profesional Juan Perez (datos de prueba)
DELETE FROM profesionales WHERE nombre_completo ILIKE '%juan%perez%';

-- Actualizar TODOS los registros de Alejandro Fernández con la foto correcta
UPDATE profesionales
SET foto_perfil = '/galeria/Profesional-icon.jpg'
WHERE nombre_completo ILIKE '%alejandro%fernandez%'
  OR nombre_completo ILIKE '%alejandro%fernández%';

-- Verificar resultado
SELECT id, nombre_completo, especialidad, foto_perfil 
FROM profesionales 
ORDER BY created_at DESC;
