'use client';

import { useState, useEffect } from 'react';
import { Cotizacion } from '@/types/cotizacion';
import { formatearPrecio } from '@/lib/calculadora-precios';

const ESTADOS_LABELS = {
  pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  respondida: { label: 'Respondida', color: 'bg-cyan-100 text-cyan-800' },
  revisada: { label: 'Revisada', color: 'bg-blue-100 text-blue-800' },
  cotizada: { label: 'Cotizada', color: 'bg-purple-100 text-purple-800' },
  aprobada: { label: 'Aprobada', color: 'bg-green-100 text-green-800' },
  rechazada: { label: 'Rechazada', color: 'bg-red-100 text-red-800' },
};

export default function AdminCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<string>('');

  useEffect(() => {
    cargarCotizaciones();
  }, [filtroEstado]);

  const cargarCotizaciones = async () => {
    try {
      const url = filtroEstado 
        ? `/api/cotizaciones?estado=${filtroEstado}`
        : '/api/cotizaciones';
      
      const response = await fetch(url);
      const data = await response.json();
      setCotizaciones(data);
    } catch (error) {
      console.error('Error al cargar cotizaciones:', error);
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Cotizaciones</h1>
          <p className="text-gray-600">Gestiona las solicitudes de cotización de tus clientes</p>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{cotizaciones.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-600">
              {cotizaciones.filter(c => c.estado === 'pendiente').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Aprobadas</p>
            <p className="text-2xl font-bold text-green-600">
              {cotizaciones.filter(c => c.estado === 'aprobada').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Valor Estimado</p>
            <p className="text-xl font-bold text-blue-600">
              {formatearPrecio(
                cotizaciones.reduce((sum, c) => sum + c.presupuesto.estimadoAutomatico, 0)
              )}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFiltroEstado('')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filtroEstado === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            {Object.entries(ESTADOS_LABELS).map(([estado, config]) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filtroEstado === estado
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Cotizaciones */}
        {cotizaciones.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-lg">No hay cotizaciones {filtroEstado && `con estado "${ESTADOS_LABELS[filtroEstado as keyof typeof ESTADOS_LABELS]?.label}"`}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cotizaciones.map((cotizacion) => (
              <div key={cotizacion.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{cotizacion.cliente.nombre}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${ESTADOS_LABELS[cotizacion.estado].color}`}>
                          {ESTADOS_LABELS[cotizacion.estado].label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{cotizacion.id} • {formatearFecha(cotizacion.fecha)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Presupuesto Estimado</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatearPrecio(cotizacion.presupuesto.estimadoAutomatico)}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Contacto</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>📧 {cotizacion.cliente.email}</p>
                        <p>📱 {cotizacion.cliente.telefono}</p>
                        <p>📍 {cotizacion.cliente.comuna}</p>
                        {cotizacion.cliente.direccion && <p className="text-xs">{cotizacion.cliente.direccion}</p>}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Servicio Solicitado</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="font-medium capitalize">{cotizacion.servicio.tipo.replace('-', ' ')}</p>
                        <p className="text-xs">
                          Urgencia: <span className="font-medium capitalize">{cotizacion.servicio.urgencia}</span>
                        </p>
                        {cotizacion.servicio.puntosDeLuz && (
                          <p className="text-xs">Puntos de luz: {cotizacion.servicio.puntosDeLuz}</p>
                        )}
                        {cotizacion.servicio.metrosCuadrados && (
                          <p className="text-xs">Metros cuadrados: {cotizacion.servicio.metrosCuadrados} m²</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Descripción</h4>
                    <p className="text-sm text-gray-600">{cotizacion.servicio.descripcion}</p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <a 
                      href={`mailto:${cotizacion.cliente.email}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Enviar Email
                    </a>
                    <a 
                      href={`https://wa.me/${cotizacion.cliente.telefono.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
