'use client';
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import PromoBanner from '@/components/ui/PromoBanner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Profesional } from '@/types/profesional';

interface ProfesionalBusqueda extends Profesional {
  nombre?: string;
  ubicacion?: string;
  totalReviews?: number;
  activo?: boolean;
  tarifa?: {
    minima: number;
    maxima: number;
  };
}

export default function BuscarProfesionalesPage() {
  const [profesionales, setProfesionales] = useState<ProfesionalBusqueda[]>([]);
  const [filtrados, setFiltrados] = useState<ProfesionalBusqueda[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [especialidadFiltro, setEspecialidadFiltro] = useState('todas');
  const [ubicacionFiltro, setUbicacionFiltro] = useState('');
  const [valoracionMinima, setValoracionMinima] = useState(0);
  const [ordenarPor, setOrdenarPor] = useState<'valoracion' | 'experiencia' | 'nombre'>('valoracion');

  useEffect(() => {
    cargarProfesionales();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [profesionales, busqueda, especialidadFiltro, ubicacionFiltro, valoracionMinima, ordenarPor]);

  const cargarProfesionales = async () => {
    try {
      const response = await fetch('/api/profesionales');
      const data = await response.json();
      // Solo mostrar profesionales activos (estado === 'Activo' o 'activo')
      const activos = data.filter((p: any) => 
        p.estado === 'Activo' || p.estado === 'activo'
      );
      setProfesionales(activos);
      setFiltrados(activos);
    } catch (error) {
      console.error('Error al cargar profesionales:', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...profesionales];

    // Filtro por búsqueda de texto
    if (busqueda) {
      const termino = busqueda.toLowerCase();
      resultado = resultado.filter(p =>
        p.nombre?.toLowerCase().includes(termino) ||
        p.nombreCompleto?.toLowerCase().includes(termino) ||
        p.especialidad?.toLowerCase().includes(termino) ||
        p.descripcion?.toLowerCase().includes(termino) ||
        p.ubicacion?.toLowerCase().includes(termino)
      );
    }

    // Filtro por especialidad
    if (especialidadFiltro && especialidadFiltro !== 'todas') {
      resultado = resultado.filter(p =>
        p.especialidad?.toLowerCase().includes(especialidadFiltro.toLowerCase())
      );
    }

    // Filtro por ubicación
    if (ubicacionFiltro) {
      resultado = resultado.filter(p =>
        p.ubicacion?.toLowerCase().includes(ubicacionFiltro.toLowerCase())
      );
    }

    // Filtro por valoración mínima
    if (valoracionMinima > 0) {
      resultado = resultado.filter(p => (p.valoracion || 0) >= valoracionMinima);
    }

    // Ordenar resultados
    resultado.sort((a, b) => {
      switch (ordenarPor) {
        case 'valoracion':
          return (b.valoracion || 0) - (a.valoracion || 0);
        case 'experiencia':
          return (b.experiencia || 0) - (a.experiencia || 0);
        case 'nombre':
          const nombreA = a.nombre || a.nombreCompleto || '';
          const nombreB = b.nombre || b.nombreCompleto || '';
          return nombreA.localeCompare(nombreB);
        default:
          return 0;
      }
    });

    setFiltrados(resultado);
  };

  const especialidades = [
    'todas',
    'instalacion-electrica',
    'reparacion',
    'iluminacion',
    'panel-solar',
    'automatizacion',
    'certificacion',
  ];

  const especialidadLabels: Record<string, string> = {
    'todas': 'Todas',
    'instalacion-electrica': 'Instalación Eléctrica',
    'reparacion': 'Reparación',
    'iluminacion': 'Iluminación',
    'panel-solar': 'Paneles Solares',
    'automatizacion': 'Automatización',
    'certificacion': 'Certificación',
  };

  const renderEstrellas = (valoracion: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((estrella) => (
          <span
            key={estrella}
            className={estrella <= valoracion ? 'text-yellow-500' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0b1224 100%)', color: 'white' }}>
      <Navigation />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Banner Promocional */}
          <div className="mb-8">
            <PromoBanner />
          </div>
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: '#7dd3fc' }}>
              Encuentra tu Profesional Ideal
            </h1>
            <p className="text-lg" style={{ color: '#cbd5f5' }}>
              Filtra y encuentra al electricista perfecto para tu proyecto
            </p>
          </div>

          {/* Filtros */}
          <div className="mb-8 p-6" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Búsqueda general */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#a5f3fc' }}>
                  Buscar
                </label>
                <input
                  type="text"
                  placeholder="Nombre, especialidad, ubicación..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white'
                  }}
                />
              </div>

              {/* Especialidad */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#a5f3fc' }}>
                  Especialidad
                </label>
                <select
                  value={especialidadFiltro}
                  onChange={(e) => setEspecialidadFiltro(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white'
                  }}
                >
                  {especialidades.map(esp => (
                    <option key={esp} value={esp} style={{ background: '#1e293b' }}>
                      {especialidadLabels[esp]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ubicación */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#a5f3fc' }}>
                  Ubicación
                </label>
                <input
                  type="text"
                  placeholder="Comuna o región..."
                  value={ubicacionFiltro}
                  onChange={(e) => setUbicacionFiltro(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white'
                  }}
                />
              </div>

              {/* Ordenar por */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#a5f3fc' }}>
                  Ordenar por
                </label>
                <select
                  value={ordenarPor}
                  onChange={(e) => setOrdenarPor(e.target.value as any)}
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white'
                  }}
                >
                  <option value="valoracion" style={{ background: '#1e293b' }}>Mayor valoración</option>
                  <option value="experiencia" style={{ background: '#1e293b' }}>Más experiencia</option>
                  <option value="nombre" style={{ background: '#1e293b' }}>Nombre A-Z</option>
                </select>
              </div>
            </div>

            {/* Valoración mínima */}
            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#a5f3fc' }}>
                Valoración mínima: {valoracionMinima} {valoracionMinima > 0 && '⭐'}
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={valoracionMinima}
                onChange={(e) => setValoracionMinima(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="mt-4 text-sm" style={{ color: '#94a3b8' }}>
              Mostrando {filtrados.length} de {profesionales.length} profesionales
            </div>
          </div>

          {/* Resultados */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-cyan-400 border-b-cyan-400 border-l-transparent border-r-transparent"></div>
              <p className="mt-4" style={{ color: '#94a3b8' }}>Cargando profesionales...</p>
            </div>
          ) : filtrados.length === 0 ? (
            <div className="text-center py-20" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px' }}>
              <p className="text-xl font-semibold mb-2">No se encontraron profesionales</p>
              <p style={{ color: '#94a3b8' }}>Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtrados.map((profesional) => (
                <div
                  key={profesional.id}
                  className="p-6 hover:shadow-2xl transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(148,163,184,0.08))',
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: '12px'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{profesional.nombreCompleto || profesional.nombre || 'Profesional'}</h3>
                      <p className="text-sm" style={{ color: '#a5f3fc' }}>
                        {profesional.especialidad || 'Electricista'}
                      </p>
                    </div>
                    {profesional.plan === 'profesional-elite' && (
                      <Badge variant="primary" size="sm">⭐ Elite</Badge>
                    )}
                    {profesional.plan === 'profesional-pro' && (
                      <Badge variant="success" size="sm">Pro</Badge>
                    )}
                  </div>

                  {profesional.valoracion && profesional.valoracion > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      {renderEstrellas(Math.round(profesional.valoracion))}
                      <span className="text-sm" style={{ color: '#94a3b8' }}>
                        ({profesional.totalReviews || 0} reseñas)
                      </span>
                    </div>
                  )}

                  {profesional.descripcion && (
                    <p className="text-sm mb-4 line-clamp-3" style={{ color: '#cbd5e1' }}>
                      {profesional.descripcion}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    {(profesional.experiencia || 0) > 0 && (
                      <p className="text-sm flex items-center gap-2">
                        <span style={{ color: '#a5f3fc' }}>💼</span>
                        <span style={{ color: '#e2e8f0' }}>{profesional.experiencia} años de experiencia</span>
                      </p>
                    )}
                    {profesional.ubicacion && (
                      <p className="text-sm flex items-center gap-2">
                        <span style={{ color: '#a5f3fc' }}>📍</span>
                        <span style={{ color: '#e2e8f0' }}>{profesional.ubicacion}</span>
                      </p>
                    )}
                    {profesional.tarifa && (
                      <p className="text-sm flex items-center gap-2">
                        <span style={{ color: '#a5f3fc' }}>💰</span>
                        <span style={{ color: '#e2e8f0' }}>
                          ${profesional.tarifa.minima.toLocaleString()} - ${profesional.tarifa.maxima.toLocaleString()}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      className="flex-1 text-sm py-2"
                      onClick={() => window.location.href = `/cotizacion?profesional=${profesional.id}`}
                    >
                      Solicitar Cotización
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-sm py-2"
                      onClick={() => window.location.href = `/profesionales/${profesional.id}`}
                    >
                      Ver Perfil
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
