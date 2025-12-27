'use client';
import { useEffect } from 'react';

export default function AdminDataInitializer() {
  useEffect(() => {
    // Solo ejecutar en producción y una vez
    if (typeof window !== 'undefined' && !sessionStorage.getItem('admin_initialized')) {
      fetch('/api/admin/ensure-data', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            console.log('✅ Datos de administrador verificados');
            sessionStorage.setItem('admin_initialized', 'true');
          }
        })
        .catch(err => console.error('Error al inicializar admin:', err));
    }
  }, []);

  return null; // No renderiza nada
}
