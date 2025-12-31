'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Professional {
  id: string;
  nombre?: string;
  nombre_completo?: string;
  email: string;
  telefono: string;
  especialidad: string;
  comuna: string;
  region: string;
  experiencia: string;
  verificado: boolean;
  activo: boolean;
  created_at: string;
}

export default function AdminProfessionalsPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClient();

  useEffect(() => {
    loadProfessionals();
  }, []);

  async function loadProfessionals() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profesionales')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error) {
      console.error('Error cargando profesionales:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleVerified(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('profesionales')
        .update({ verificado: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Actualizar localmente
      setProfessionals(professionals.map(p => 
        p.id === id ? { ...p, verificado: !currentStatus } : p
      ));
    } catch (error) {
      console.error('Error actualizando verificación:', error);
      alert('Error al actualizar el estado de verificación');
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('profesionales')
        .update({ activo: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Actualizar localmente
      setProfessionals(professionals.map(p => 
        p.id === id ? { ...p, activo: !currentStatus } : p
      ));
    } catch (error) {
      console.error('Error actualizando estado activo:', error);
      alert('Error al actualizar el estado');
    }
  }

  async function deleteProfessional(id: string, nombre_completo: string) {
    const confirmMessage = `¿Estás seguro de eliminar permanentemente a "${nombre_completo}"?\\n\\nEsta acción NO se puede deshacer y eliminará:\\n- Su perfil completo\\n- Sus respuestas a cotizaciones\\n- Su portafolio\\n- Sus reseñas\\n\\n¿Confirmar eliminación?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    // Segunda confirmación
    if (!confirm('⚠️ ÚLTIMA ADVERTENCIA: Esta acción es IRREVERSIBLE. ¿Continuar?')) {
      return;
    }

    try {
      // Eliminar respuestas a cotizaciones
      await supabase
        .from('respuestas_cotizacion')
        .delete()
        .eq('profesional_id', id);

      // Eliminar portafolio
      await supabase
        .from('portfolio')
        .delete()
        .eq('profesional_id', id);

      // Eliminar reseñas
      await supabase
        .from('reviews')
        .delete()
        .eq('profesional_id', id);

      // Eliminar profesional
      const { error } = await supabase
        .from('profesionales')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Actualizar localmente
      setProfessionals(professionals.filter(p => p.id !== id));
      alert('✅ Profesional eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando profesional:', error);
      alert('❌ Error al eliminar el profesional. Revisa la consola.');
    }
  }

  const filteredProfessionals = professionals.filter(p => {
    // Filtro por estado
    if (filter === 'verified' && !p.verificado) return false;
    if (filter === 'pending' && p.verificado) return false;

    // Búsqueda
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        p.nombre_completo?.toLowerCase().includes(search) ||
        p.nombre?.toLowerCase().includes(search) ||
        p.email?.toLowerCase().includes(search) ||
        p.telefono?.includes(search) ||
        p.especialidad?.toLowerCase().includes(search) ||
        p.comuna?.toLowerCase().includes(search)
      );
    }

    return true;
  });

  const stats = {
    total: professionals.length,
    verified: professionals.filter(p => p.verificado).length,
    pending: professionals.filter(p => !p.verificado).length,
    active: professionals.filter(p => p.activo).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Cargando profesionales...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Volver al Panel Admin
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Profesionales</h1>
          <p className="text-gray-600 mt-2">Administra electricistas y carpinteros registrados</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Verificados</div>
            <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Pendientes</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Activos</div>
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por estado
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="verified">Verificados</option>
                <option value="pending">Pendientes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre, email, teléfono..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Lista de profesionales */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profesional
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Especialidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProfessionals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No se encontraron profesionales
                    </td>
                  </tr>
                ) : (
                  filteredProfessionals.map((professional) => (
                    <tr key={professional.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {professional.nombre_completo || professional.nombre || professional.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(professional.created_at).toLocaleDateString('es-CL')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{professional.email}</div>
                        <div className="text-xs text-gray-500">{professional.telefono}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{professional.especialidad}</div>
                        <div className="text-xs text-gray-500">{professional.experiencia} años exp.</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{professional.comuna}</div>
                        <div className="text-xs text-gray-500">{professional.region}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1 ${
                              professional.verificado
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {professional.verificado ? '✓ Verificado' : '⏳ Pendiente'}
                          </span>
                          <span
                            className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1 ${
                              professional.activo
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {professional.activo ? '🟢 Activo' : '⚪ Inactivo'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => toggleVerified(professional.id, professional.verificado)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                              professional.verificado
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            {professional.verificado ? 'Quitar verificación' : 'Verificar'}
                          </button>
                          <button
                            onClick={() => toggleActive(professional.id, professional.activo)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                              professional.activo
                                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            }`}
                          >
                            {professional.activo ? 'Desactivar' : 'Activar'}
                          </button>
                          <button
                            onClick={() => deleteProfessional(professional.id, professional.nombre_completo || professional.nombre || professional.email)}
                            className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
                            title="Eliminar permanentemente"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen */}
        <div className="mt-6 text-sm text-gray-600">
          Mostrando {filteredProfessionals.length} de {professionals.length} profesionales
        </div>
      </div>
    </div>
  );
}
