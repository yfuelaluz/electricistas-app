"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PortfolioManager from "@/components/profesionales/PortfolioManager";

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
  const [leadsUsados, setLeadsUsados] = useState(0);
  const [limiteLeads, setLimiteLeads] = useState(5);
  const [vistaActiva, setVistaActiva] = useState<'cotizaciones' | 'portfolio' | 'estadisticas'>('cotizaciones');
  const [todasCotizaciones, setTodasCotizaciones] = useState<any[]>([]);
  const [estadisticas, setEstadisticas] = useState({
    totalPropuestas: 0,
    propuestasAceptadas: 0,
    tasaConversion: 0,
    ingresosEstimados: 0,
    promedioRespuesta: 0,
  });

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

    const prof = JSON.parse(profesionalData);
    setProfesional(prof);
    
    // Calcular límites según plan
    const limitesPlan: Record<string, number> = {
      'starter': 5,
      'pro': 10,
      'elite': 999999
    };
    const limite = limitesPlan[prof.plan] || 5;
    setLimiteLeads(limite);
    
    // Recargar perfiles desde el servidor
    recargarPerfiles();

    // Cargar cotizaciones y respuestas
    fetch('/api/cotizaciones')
      .then(res => res.json())
      .then(data => {
        setTodasCotizaciones(data);
        setCotizaciones(data.filter((c: Cotizacion) => c.estado === 'pendiente'));
        
        // Calcular leads usados este mes
        const inicioMes = new Date();
        inicioMes.setDate(1);
        inicioMes.setHours(0, 0, 0, 0);
        
        const respuestasEsteMes = data.filter((c: any) => 
          c.respuestas && c.respuestas.some((r: any) => 
            r.profesionalId === prof.id &&
            new Date(c.fecha) >= inicioMes
          )
        ).length;
        
        setLeadsUsados(respuestasEsteMes);

        // Calcular estadísticas
        const misPropuestas = data.filter((c: any) =>
          c.respuestas && c.respuestas.some((r: any) => r.profesionalId === prof.id)
        );

        const propuestasAceptadas = misPropuestas.filter((c: any) =>
          c.respuestas?.some((r: any) => r.profesionalId === prof.id && r.estado === 'aceptada')
        );

        const ingresosTotal = propuestasAceptadas.reduce((sum: number, c: any) => {
          const miRespuesta = c.respuestas?.find((r: any) => r.profesionalId === prof.id);
          return sum + (miRespuesta?.presupuesto || 0);
        }, 0);

        setEstadisticas({
          totalPropuestas: misPropuestas.length,
          propuestasAceptadas: propuestasAceptadas.length,
          tasaConversion: misPropuestas.length > 0 
            ? Math.round((propuestasAceptadas.length / misPropuestas.length) * 100)
            : 0,
          ingresosEstimados: ingresosTotal,
          promedioRespuesta: misPropuestas.length > 0
            ? Math.round(ingresosTotal / misPropuestas.length)
            : 0,
        });
        
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
        margin: '0 auto 24px',
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
              color: '#f87171',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Contador de Leads */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto 40px',
        background: limiteLeads === 999999 ? 
          'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(251,191,36,0.15))' :
          leadsUsados >= limiteLeads ?
            'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(220,38,38,0.15))' :
            'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.15))',
        border: limiteLeads === 999999 ?
          '2px solid rgba(245,158,11,0.5)' :
          leadsUsados >= limiteLeads ?
            '2px solid rgba(239,68,68,0.5)' :
            '2px solid rgba(16,185,129,0.5)',
        borderRadius: '20px',
        padding: '32px',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
          {limiteLeads === 999999 ? '👑' : leadsUsados >= limiteLeads ? '⚠️' : '📊'}
        </div>
        <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>
          {limiteLeads === 999999 ? 
            '¡Leads ILIMITADOS! 🎉' :
            `${leadsUsados} / ${limiteLeads} Leads Usados Este Mes`
          }
        </div>
        {limiteLeads !== 999999 && leadsUsados >= limiteLeads && (
          <div style={{ color: '#fca5a5', fontSize: '16px', marginTop: '12px' }}>
            ⚠️ Límite alcanzado. <a href="/suscripciones" style={{ color: '#60a5fa', textDecoration: 'underline' }}>Actualiza tu plan</a> para más leads.
          </div>
        )}
        {limiteLeads !== 999999 && leadsUsados < limiteLeads && (
          <div style={{ color: '#94e2d5', fontSize: '16px', marginTop: '12px' }}>
            ✅ Te quedan {limiteLeads - leadsUsados} leads disponibles
          </div>
        )}
        <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '12px' }}>
          Plan: <strong style={{ color: 'white' }}>{profesional.plan?.toUpperCase() || 'STARTER'}</strong>
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

      {/* Contenido principal con pestañas */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '32px',
        border: '2px solid rgba(34,211,238,0.3)'
      }}>
        {/* Pestañas */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '32px',
          borderBottom: '2px solid rgba(255,255,255,0.1)',
          paddingBottom: '8px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setVistaActiva('cotizaciones')}
            style={{
              padding: '12px 24px',
              borderRadius: '12px 12px 0 0',
              border: 'none',
              background: vistaActiva === 'cotizaciones' 
                ? 'linear-gradient(135deg, rgba(34,211,238,0.3), rgba(59,130,246,0.3))'
                : 'transparent',
              color: vistaActiva === 'cotizaciones' ? '#22d3ee' : 'rgba(255,255,255,0.5)',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              borderBottom: vistaActiva === 'cotizaciones' ? '3px solid #22d3ee' : 'none',
              transition: 'all 0.3s'
            }}
          >
            📋 Cotizaciones ({cotizaciones.length})
          </button>
          <button
            onClick={() => setVistaActiva('estadisticas')}
            style={{
              padding: '12px 24px',
              borderRadius: '12px 12px 0 0',
              border: 'none',
              background: vistaActiva === 'estadisticas' 
                ? 'linear-gradient(135deg, rgba(34,211,238,0.3), rgba(59,130,246,0.3))'
                : 'transparent',
              color: vistaActiva === 'estadisticas' ? '#22d3ee' : 'rgba(255,255,255,0.5)',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              borderBottom: vistaActiva === 'estadisticas' ? '3px solid #22d3ee' : 'none',
              transition: 'all 0.3s'
            }}
          >
            📊 Estadísticas
          </button>
          <button
            onClick={() => setVistaActiva('portfolio')}
            style={{
              padding: '12px 24px',
              borderRadius: '12px 12px 0 0',
              border: 'none',
              background: vistaActiva === 'portfolio' 
                ? 'linear-gradient(135deg, rgba(34,211,238,0.3), rgba(59,130,246,0.3))'
                : 'transparent',
              color: vistaActiva === 'portfolio' ? '#22d3ee' : 'rgba(255,255,255,0.5)',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              borderBottom: vistaActiva === 'portfolio' ? '3px solid #22d3ee' : 'none',
              transition: 'all 0.3s'
            }}
          >
            💼 Mi Portfolio
          </button>
        </div>

        {/* Contenido de Cotizaciones */}
        {vistaActiva === 'cotizaciones' && (
          <>
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

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link
                    href={`/profesionales/responder?id=${cot.id}`}
                    style={{
                      flex: '1 1 200px',
                      padding: '14px',
                      borderRadius: '8px',
                      background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                      color: 'white',
                      textAlign: 'center',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: '15px',
                      boxShadow: '0 4px 12px rgba(59,130,246,0.4)'
                    }}
                  >
                    💼 Enviar Propuesta
                  </Link>
                  <a
                    href={`mailto:${cot.cliente.email}`}
                    style={{
                      flex: '1 1 120px',
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
                      flex: '1 1 120px',
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
          </>
        )}

        {/* Contenido de Estadísticas */}
        {vistaActiva === 'estadisticas' && (
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '900',
              color: 'white',
              marginBottom: '24px'
            }}>📊 Tus Estadísticas y Rendimiento</h2>

            {/* Métricas principales */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '40px'
            }}>
              {/* Total Propuestas */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(37,99,235,0.15))',
                border: '2px solid rgba(59,130,246,0.5)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>📝</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>
                  {estadisticas.totalPropuestas}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Propuestas Enviadas</div>
              </div>

              {/* Propuestas Aceptadas */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(22,163,74,0.15))',
                border: '2px solid rgba(34,197,94,0.5)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>✅</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#22c55e', marginBottom: '4px' }}>
                  {estadisticas.propuestasAceptadas}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Propuestas Aceptadas</div>
              </div>

              {/* Tasa de Conversión */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(147,51,234,0.15))',
                border: '2px solid rgba(168,85,247,0.5)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>📈</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#a855f7', marginBottom: '4px' }}>
                  {estadisticas.tasaConversion}%
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Tasa de Conversión</div>
              </div>

              {/* Ingresos Estimados */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(234,179,8,0.2), rgba(202,138,4,0.15))',
                border: '2px solid rgba(234,179,8,0.5)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>💰</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#eab308', marginBottom: '4px' }}>
                  ${estadisticas.ingresosEstimados.toLocaleString('es-CL')}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Ingresos Estimados</div>
              </div>
            </div>

            {/* Gráfico de barras simple */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '30px'
            }}>
              <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>
                📊 Rendimiento Visual
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '40px', height: '200px', marginBottom: '16px' }}>
                {/* Barra: Propuestas Enviadas */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    height: `${Math.min((estadisticas.totalPropuestas / Math.max(estadisticas.totalPropuestas, 10)) * 100, 100)}%`,
                    background: 'linear-gradient(180deg, #3b82f6, #1e40af)',
                    borderRadius: '8px 8px 0 0',
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingTop: '12px',
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '18px'
                  }}>
                    {estadisticas.totalPropuestas}
                  </div>
                  <div style={{ marginTop: '12px', color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>
                    Enviadas
                  </div>
                </div>

                {/* Barra: Propuestas Aceptadas */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    height: `${Math.min((estadisticas.propuestasAceptadas / Math.max(estadisticas.totalPropuestas, 1)) * 100, 100)}%`,
                    background: 'linear-gradient(180deg, #22c55e, #15803d)',
                    borderRadius: '8px 8px 0 0',
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingTop: '12px',
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '18px'
                  }}>
                    {estadisticas.propuestasAceptadas}
                  </div>
                  <div style={{ marginTop: '12px', color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>
                    Aceptadas
                  </div>
                </div>

                {/* Barra: Tasa de Conversión */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    height: `${estadisticas.tasaConversion}%`,
                    background: 'linear-gradient(180deg, #a855f7, #7e22ce)',
                    borderRadius: '8px 8px 0 0',
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingTop: '12px',
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '18px'
                  }}>
                    {estadisticas.tasaConversion}%
                  </div>
                  <div style={{ marginTop: '12px', color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>
                    Conversión
                  </div>
                </div>
              </div>
            </div>

            {/* Insights y recomendaciones */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(59,130,246,0.1))',
              border: '1px solid rgba(34,211,238,0.3)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{ color: '#22d3ee', fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                💡 Insights y Recomendaciones
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {estadisticas.tasaConversion >= 50 && (
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(34,197,94,0.1)',
                    border: '1px solid rgba(34,197,94,0.3)',
                    borderRadius: '8px',
                    color: '#86efac'
                  }}>
                    ✅ <strong>¡Excelente!</strong> Tu tasa de conversión del {estadisticas.tasaConversion}% está por encima del promedio.
                  </div>
                )}
                
                {estadisticas.tasaConversion < 30 && estadisticas.totalPropuestas > 0 && (
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(251,191,36,0.1)',
                    border: '1px solid rgba(251,191,36,0.3)',
                    borderRadius: '8px',
                    color: '#fcd34d'
                  }}>
                    ⚠️ <strong>Mejora disponible:</strong> Intenta personalizar más tus propuestas y responder más rápido.
                  </div>
                )}

                {estadisticas.totalPropuestas === 0 && (
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(59,130,246,0.1)',
                    border: '1px solid rgba(59,130,246,0.3)',
                    borderRadius: '8px',
                    color: '#93c5fd'
                  }}>
                    💼 <strong>Comienza ahora:</strong> ¡Envía tu primera propuesta! Revisa las cotizaciones disponibles.
                  </div>
                )}

                {estadisticas.promedioRespuesta > 0 && (
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(168,85,247,0.1)',
                    border: '1px solid rgba(168,85,247,0.3)',
                    borderRadius: '8px',
                    color: '#d8b4fe'
                  }}>
                    💰 <strong>Promedio por proyecto:</strong> ${estadisticas.promedioRespuesta.toLocaleString('es-CL')}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contenido de Portfolio */}
        {vistaActiva === 'portfolio' && profesional && (
          <PortfolioManager profesionalId={profesional.id.toString()} />
        )}
      </div>
    </div>
  );
}
