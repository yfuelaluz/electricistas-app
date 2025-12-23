"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Profesional {
  id: number;
  nombreCompleto: string;
  especialidad: string;
  email: string;
  telefono: string;
  estado: string;
  valoracion: number;
  trabajosRealizados: number;
}

interface Cotizacion {
  id: number | string;
  fecha: string;
  cliente: {
    nombre: string;
    email: string;
    telefono: string;
    direccion?: string;
    comuna?: string;
  };
  servicio: {
    tipo: string;
    descripcion: string;
    urgencia: string;
    puntosDeLuz?: number;
  };
  presupuesto?: {
    estimadoAutomatico?: number;
  };
  estado: string;
}

export default function DashboardProfesional() {
  const router = useRouter();
  const [profesional, setProfesional] = useState<Profesional | null>(null);
  const [todosLosPerfiles, setTodosLosPerfiles] = useState<Profesional[]>([]);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [loading, setLoading] = useState(true);

  const recargarPerfiles = async () => {
    const profesionalData = localStorage.getItem('profesional');
    if (!profesionalData) return;

    const profActual = JSON.parse(profesionalData);
    
    // Recargar TODOS los perfiles desde el servidor
    try {
      const res = await fetch('/api/profesionales');
      const todosProfesionales = await res.json();
      
      // Filtrar solo los perfiles del usuario actual (mismo email)
      const perfilesUsuario = todosProfesionales.filter(
        (p: Profesional) => p.email === profActual.email
      );
      
      // Actualizar localStorage y estado
      localStorage.setItem('todosLosPerfiles', JSON.stringify(perfilesUsuario));
      setTodosLosPerfiles(perfilesUsuario);
      
      // Actualizar también el perfil activo
      const perfilActualizado = perfilesUsuario.find((p: Profesional) => p.id === profActual.id);
      if (perfilActualizado) {
        localStorage.setItem('profesional', JSON.stringify(perfilActualizado));
        setProfesional(perfilActualizado);
      }
    } catch (err) {
      console.error('Error al recargar perfiles:', err);
    }
  };

  useEffect(() => {
    // Verificar sesión
    const profesionalData = localStorage.getItem('profesional');
    if (!profesionalData) {
      router.push('/profesionales/login');
      return;
    }

    setProfesional(JSON.parse(profesionalData));
    
    // Recargar perfiles desde el servidor
    recargarPerfiles();

    // Cargar cotizaciones
    fetch('/api/cotizaciones')
      .then(res => res.json())
      .then(data => {
        setCotizaciones(data.filter((c: Cotizacion) => c.estado === 'pendiente'));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar cotizaciones:', err);
        setLoading(false);
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('profesional');
    router.push('/');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ color: 'white', fontSize: '24px' }}>Cargando...</p>
      </div>
    );
  }

  if (!profesional) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto 40px',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '24px',
        border: '2px solid rgba(34,211,238,0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '900',
            background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 8px 0'
          }}>Hola, {profesional.nombreCompleto}</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>
            {profesional.especialidad} • {profesional.estado === 'activo' ? '✅ Activo' : '⏳ Pendiente de activación'}
          </p>
        </div>
        <div style={{display: 'flex', gap: '12px'}}>
          <button
            onClick={() => router.push('/profesionales/editar')}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: '2px solid rgba(34,211,238,0.5)',
              background: 'rgba(34,211,238,0.2)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ✏️ Editar Perfil
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: '2px solid rgba(239,68,68,0.5)',
              background: 'rgba(239,68,68,0.2)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        <div style={{
          background: 'rgba(34,211,238,0.2)',
          border: '2px solid rgba(34,211,238,0.5)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>⭐</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#22d3ee', marginBottom: '4px' }}>
            {profesional.valoracion.toFixed(1)}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Valoración</div>
        </div>

        <div style={{
          background: 'rgba(59,130,246,0.2)',
          border: '2px solid rgba(59,130,246,0.5)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔧</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>
            {profesional.trabajosRealizados}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Trabajos Realizados</div>
        </div>

        <div style={{
          background: 'rgba(168,85,247,0.2)',
          border: '2px solid rgba(168,85,247,0.5)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>📋</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#a855f7', marginBottom: '4px' }}>
            {cotizaciones.length}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Cotizaciones Disponibles</div>
        </div>
      </div>

      {/* Todos Mis Perfiles */}
      {todosLosPerfiles.length > 1 && (
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto 40px',
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '32px',
          border: '2px solid rgba(245,158,11,0.3)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '900',
            color: 'white',
            marginBottom: '24px'
          }}>👤 Mis Perfiles ({todosLosPerfiles.length})</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 320px))',
            gap: '16px',
            justifyContent: 'center'
          }}>
            {todosLosPerfiles.map((perfil) => (
              <div key={perfil.id} style={{
                background: 'linear-gradient(135deg, rgba(34,211,238,0.1), rgba(59,130,246,0.1))',
                border: '2px solid rgba(34,211,238,0.3)',
                borderRadius: '16px',
                padding: '20px',
                transition: 'transform 0.2s, border-color 0.2s',
                cursor: 'pointer',
                maxWidth: '320px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(34,211,238,0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(34,211,238,0.3)';
              }}>
                <div style={{marginBottom: '16px'}}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#22d3ee',
                    marginBottom: '8px'
                  }}>{perfil.especialidad}</h3>
                  <p style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '14px'
                  }}>ID: {perfil.id}</p>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '16px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    background: 'rgba(234,179,8,0.2)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(234,179,8,0.5)',
                    fontSize: '14px'
                  }}>⭐ {perfil.valoracion}</div>
                  <div style={{
                    background: 'rgba(59,130,246,0.2)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(59,130,246,0.5)',
                    fontSize: '14px'
                  }}>🔧 {perfil.trabajosRealizados}</div>
                  <div style={{
                    background: perfil.estado === 'activo' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${perfil.estado === 'activo' ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)'}`,
                    fontSize: '14px'
                  }}>{perfil.estado === 'activo' ? '✅' : '⏸️'} {perfil.estado}</div>
                </div>

                <button
                  onClick={() => {
                    localStorage.setItem('profesional', JSON.stringify(perfil));
                    router.push('/profesionales/editar');
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  ✏️ Editar Perfil
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cotizaciones Disponibles */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '32px',
        border: '2px solid rgba(34,211,238,0.3)'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '900',
          color: 'white',
          marginBottom: '24px'
        }}>📬 Cotizaciones Disponibles</h2>

        {cotizaciones.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', padding: '40px' }}>
            No hay cotizaciones disponibles en este momento
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {cotizaciones.map((cot) => (
              <div
                key={cot.id}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '2px solid rgba(34,211,238,0.2)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(34,211,238,0.5)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(34,211,238,0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#22d3ee', margin: '0 0 8px 0' }}>
                      {cot.servicio.tipo.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '14px' }}>
                      Solicitado: {new Date(cot.fecha).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                  <div style={{
                    background: cot.servicio.urgencia === 'emergencia' 
                      ? 'rgba(239,68,68,0.2)' 
                      : 'rgba(34,211,238,0.2)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: cot.servicio.urgencia === 'emergencia' ? '#ef4444' : '#22d3ee'
                  }}>
                    {cot.servicio.urgencia === 'emergencia' ? '🚨 URGENTE' : '📋 NUEVO'}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ color: 'white', margin: '0 0 12px 0' }}>
                    <strong>Cliente:</strong> {cot.cliente.nombre}
                  </p>
                  <p style={{ color: 'white', margin: '0 0 12px 0' }}>
                    <strong>Descripción:</strong> {cot.servicio.descripcion}
                  </p>
                  {cot.servicio.puntosDeLuz && (
                    <p style={{ color: 'white', margin: '0 0 12px 0' }}>
                      <strong>Puntos de luz:</strong> {cot.servicio.puntosDeLuz}
                    </p>
                  )}
                  {cot.presupuesto?.estimadoAutomatico && (
                    <p style={{ color: '#22d3ee', margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>
                      💰 Presupuesto estimado: ${cot.presupuesto.estimadoAutomatico.toLocaleString('es-CL')}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <a
                    href={`mailto:${cot.cliente.email}`}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(34,211,238,0.2)',
                      border: '2px solid rgba(34,211,238,0.5)',
                      color: '#22d3ee',
                      textAlign: 'center',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    📧 Email
                  </a>
                  <a
                    href={`https://wa.me/${cot.cliente.telefono ? cot.cliente.telefono.replace(/\D/g, '') : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(34,197,94,0.2)',
                      border: '2px solid rgba(34,197,94,0.5)',
                      color: '#22c55e',
                      textAlign: 'center',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
