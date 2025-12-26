"use client";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

function ResponderCotizacionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cotizacionId = searchParams.get('id');
  
  const [profesional, setProfesional] = useState<any>(null);
  const [cotizacion, setCotizacion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  
  const [formData, setFormData] = useState({
    monto: '',
    detalles: '',
    tiempoEstimado: '',
    validezOferta: '7 días'
  });

  useEffect(() => {
    // Verificar sesión
    const profesionalData = localStorage.getItem('profesional');
    if (!profesionalData) {
      router.push('/profesionales/login');
      return;
    }
    setProfesional(JSON.parse(profesionalData));

    // Cargar cotización
    if (cotizacionId) {
      fetch(`/api/cotizaciones`)
        .then(res => res.json())
        .then(data => {
          const cot = data.find((c: any) => c.id === cotizacionId);
          if (cot) {
            setCotizacion(cot);
            // Sugerir monto basado en estimado automático
            if (cot.presupuesto?.estimadoAutomatico) {
              setFormData(prev => ({
                ...prev,
                monto: cot.presupuesto.estimadoAutomatico.toString()
              }));
            }
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error:', err);
          setLoading(false);
        });
    }
  }, [cotizacionId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      // Verificar límite de leads antes de enviar
      const limitesPlan: Record<string, number> = {
        'starter': 5,
        'pro': 10,
        'elite': 999999
      };
      
      const limite = limitesPlan[profesional.plan] || 5;
      
      // Obtener leads usados este mes
      const cotizacionesRes = await fetch('/api/cotizaciones');
      const todasCotizaciones = await cotizacionesRes.json();
      
      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);
      
      const leadsEsteMes = todasCotizaciones.filter((c: any) => 
        c.respuestas && c.respuestas.some((r: any) => 
          r.profesionalId === profesional.id &&
          new Date(c.fecha) >= inicioMes
        )
      ).length;
      
      if (leadsEsteMes >= limite && limite !== 999999) {
        alert(`❌ Has alcanzado el límite de ${limite} leads mensuales de tu plan ${profesional.plan.toUpperCase()}.\n\n💡 Actualiza tu plan en /suscripciones para enviar más propuestas.`);
        setEnviando(false);
        return;
      }

      const respuesta = {
        cotizacionId,
        profesionalId: profesional.id,
        profesional: {
          nombre: profesional.nombreCompleto,
          email: profesional.email,
          telefono: profesional.telefono,
          especialidad: profesional.especialidad,
          valoracion: profesional.valoracion
        },
        presupuesto: {
          monto: parseFloat(formData.monto),
          detalles: formData.detalles,
          tiempoEstimado: formData.tiempoEstimado,
          validezOferta: formData.validezOferta
        }
      };

      const response = await fetch('/api/respuestas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(respuesta)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar respuesta');
      }

      // Abrir WhatsApp con notificación al cliente
      if (data.whatsappLink) {
        window.open(data.whatsappLink, '_blank');
      }

      setMensaje({ tipo: 'success', texto: '✅ Respuesta enviada exitosamente' });
      
      setTimeout(() => {
        router.push('/profesionales/dashboard');
      }, 2000);

    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error.message });
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '20px'
      }}>
        Cargando...
      </div>
    );
  }

  if (!cotizacion) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)',
        padding: '40px 20px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h2>Cotización no encontrada</h2>
        <Link href="/profesionales/dashboard">
          <button style={{
            marginTop: '20px',
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Volver al Dashboard
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <Link href="/profesionales/dashboard">
          <button style={{
            marginBottom: '24px',
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            ← Volver al Dashboard
          </button>
        </Link>

        <h1 style={{
          fontSize: 'clamp(28px, 6vw, 42px)',
          fontWeight: '900',
          background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '32px'
        }}>
          Responder Cotización
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Detalles de la Cotización */}
          <div style={{
            background: 'rgba(0,0,0,0.7)',
            borderRadius: '20px',
            padding: '24px',
            border: '2px solid rgba(34,211,238,0.3)'
          }}>
            <h2 style={{
              color: '#22d3ee',
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '20px'
            }}>
              📋 Detalles del Proyecto
            </h2>

            <div style={{ color: 'white', lineHeight: '1.8' }}>
              <p><strong style={{ color: '#94a3b8' }}>ID:</strong> {cotizacion.id}</p>
              <p><strong style={{ color: '#94a3b8' }}>Cliente:</strong> {cotizacion.cliente.nombre}</p>
              <p><strong style={{ color: '#94a3b8' }}>Teléfono:</strong> {cotizacion.cliente.telefono}</p>
              <p><strong style={{ color: '#94a3b8' }}>Dirección:</strong> {cotizacion.cliente.direccion}, {cotizacion.cliente.comuna}</p>
              <p><strong style={{ color: '#94a3b8' }}>Servicio:</strong> {cotizacion.servicio.tipo}</p>
              <p><strong style={{ color: '#94a3b8' }}>Urgencia:</strong> 
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '8px',
                  background: cotizacion.servicio.urgencia === 'emergencia' ? '#ef4444' :
                             cotizacion.servicio.urgencia === 'urgente' ? '#f59e0b' : '#10b981',
                  marginLeft: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {cotizacion.servicio.urgencia}
                </span>
              </p>
              {cotizacion.servicio.puntosDeLuz && (
                <p><strong style={{ color: '#94a3b8' }}>Puntos de luz:</strong> {cotizacion.servicio.puntosDeLuz}</p>
              )}
              <p><strong style={{ color: '#94a3b8' }}>Descripción:</strong></p>
              <p style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '12px',
                borderRadius: '8px',
                marginTop: '8px'
              }}>
                {cotizacion.servicio.descripcion}
              </p>
              {cotizacion.presupuesto?.estimadoAutomatico && (
                <p style={{ marginTop: '16px' }}>
                  <strong style={{ color: '#94a3b8' }}>Estimado automático:</strong>
                  <span style={{
                    color: '#10b981',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginLeft: '8px'
                  }}>
                    ${cotizacion.presupuesto.estimadoAutomatico.toLocaleString('es-CL')}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Formulario de Respuesta */}
          <div style={{
            background: 'rgba(0,0,0,0.7)',
            borderRadius: '20px',
            padding: '24px',
            border: '2px solid rgba(59,130,246,0.3)'
          }}>
            <h2 style={{
              color: '#3b82f6',
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '20px'
            }}>
              💼 Tu Propuesta
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  color: '#cbd5e1',
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}>
                  Monto del Presupuesto *
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#10b981',
                    fontSize: '20px',
                    fontWeight: 'bold'
                  }}>$</span>
                  <input
                    type="number"
                    required
                    value={formData.monto}
                    onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 14px 14px 36px',
                      borderRadius: '12px',
                      border: '2px solid rgba(148,163,184,0.3)',
                      background: 'rgba(30,41,59,0.5)',
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  color: '#cbd5e1',
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}>
                  Detalles del Trabajo *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.detalles}
                  onChange={(e) => setFormData({ ...formData, detalles: e.target.value })}
                  placeholder="Describe qué incluye tu presupuesto, materiales, garantía, etc."
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: '2px solid rgba(148,163,184,0.3)',
                    background: 'rgba(30,41,59,0.5)',
                    color: 'white',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  color: '#cbd5e1',
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}>
                  Tiempo Estimado *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tiempoEstimado}
                  onChange={(e) => setFormData({ ...formData, tiempoEstimado: e.target.value })}
                  placeholder="Ej: 2-3 días, 1 semana"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: '2px solid rgba(148,163,184,0.3)',
                    background: 'rgba(30,41,59,0.5)',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  color: '#cbd5e1',
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}>
                  Validez de la Oferta
                </label>
                <select
                  value={formData.validezOferta}
                  onChange={(e) => setFormData({ ...formData, validezOferta: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: '2px solid rgba(148,163,184,0.3)',
                    background: 'rgba(30,41,59,0.5)',
                    color: 'white',
                    fontSize: '16px'
                  }}
                >
                  <option value="3 días">3 días</option>
                  <option value="7 días">7 días</option>
                  <option value="15 días">15 días</option>
                  <option value="30 días">30 días</option>
                </select>
              </div>

              {mensaje.texto && (
                <div style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: mensaje.tipo === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  border: `2px solid ${mensaje.tipo === 'success' ? '#10b981' : '#ef4444'}`,
                  color: mensaje.tipo === 'success' ? '#10b981' : '#ef4444',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  {mensaje.texto}
                </div>
              )}

              <button
                type="submit"
                disabled={enviando}
                style={{
                  padding: '16px',
                  background: enviando ? 'rgba(148,163,184,0.3)' : 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: enviando ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {enviando ? '📤 Enviando...' : '📨 Enviar Propuesta'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResponderCotizacionPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResponderCotizacionContent />
    </Suspense>
  );
}
