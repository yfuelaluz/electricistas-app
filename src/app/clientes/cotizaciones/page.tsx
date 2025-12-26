"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MisCotizacionesPage() {
  const router = useRouter();
  const [cliente, setCliente] = useState<any>(null);
  const [cotizaciones, setCotizaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState<string | null>(null);
  const [mostrarReviewModal, setMostrarReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState<any>(null);
  const [valoracion, setValoracion] = useState(5);
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    const session = localStorage.getItem("clienteSession");
    if (!session) {
      router.push("/clientes/login");
      return;
    }

    const clienteData = JSON.parse(session);
    setCliente(clienteData);

    // Cargar cotizaciones del cliente
    fetch('/api/cotizaciones')
      .then(res => res.json())
      .then(data => {
        const misCotizaciones = data.filter((c: any) => 
          c.cliente.email === clienteData.email
        );
        setCotizaciones(misCotizaciones);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, [router]);

  const aceptarRespuesta = async (cotizacionId: string, respuestaId: string) => {
    if (!confirm('¿Confirmas que deseas aceptar esta propuesta?')) return;

    try {
      const response = await fetch('/api/aceptar-respuesta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cotizacionId, respuestaId })
      });

      const data = await response.json();

      if (!response.ok) {
        alert('Error al aceptar la propuesta. Intenta nuevamente.');
        return;
      }

      alert(`✅ ¡Propuesta aceptada!\n\nEl profesional ${data.profesional.nombre} será notificado por WhatsApp.\n\n💡 Se abrirá WhatsApp para que también puedas contactarlo directamente.`);

      // Abrir WhatsApp para notificar al profesional
      window.open(data.whatsappUrl, '_blank');

      // Recargar cotizaciones
      const cotizacionesResponse = await fetch('/api/cotizaciones');
      const cotizacionesData = await cotizacionesResponse.json();
      const misCotizaciones = cotizacionesData.filter((c: any) => 
        c.cliente.email === cliente.email
      );
      setCotizaciones(misCotizaciones);

    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la solicitud.');
    }
  };

  const abrirModalReview = (cotizacion: any, respuesta: any) => {
    setReviewData({ cotizacion, respuesta });
    setValoracion(5);
    setComentario("");
    setMostrarReviewModal(true);
  };

  const enviarReview = async () => {
    if (!reviewData) return;

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profesionalId: reviewData.respuesta.profesionalId,
          clienteId: cliente.id,
          cotizacionId: reviewData.cotizacion.id,
          clienteNombre: cliente.nombreCompleto,
          valoracion,
          comentario
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ ¡Gracias por tu valoración!');
        setMostrarReviewModal(false);
        
        // Recargar cotizaciones
        const cotizacionesResponse = await fetch('/api/cotizaciones');
        const cotizacionesData = await cotizacionesResponse.json();
        const misCotizaciones = cotizacionesData.filter((c: any) => 
          c.cliente.email === cliente.email
        );
        setCotizaciones(misCotizaciones);
      } else {
        alert(data.error || 'Error al enviar valoración');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar valoración');
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "20px"
      }}>
        Cargando...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <Link href="/clientes/dashboard">
          <button style={{
            marginBottom: "24px",
            padding: "12px 24px",
            background: "rgba(255,255,255,0.1)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontWeight: "bold",
            cursor: "pointer"
          }}>
            ← Volver al Dashboard
          </button>
        </Link>

        <h1 style={{
          fontSize: "clamp(32px, 6vw, 48px)",
          fontWeight: "900",
          background: "linear-gradient(90deg, #22d3ee, #3b82f6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "32px"
        }}>
          Mis Cotizaciones
        </h1>

        {cotizaciones.length === 0 ? (
          <div style={{
            background: "rgba(0,0,0,0.7)",
            borderRadius: "20px",
            padding: "48px",
            textAlign: "center",
            border: "2px solid rgba(148,163,184,0.2)"
          }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>📋</div>
            <p style={{ color: "#94a3b8", fontSize: "18px", margin: 0 }}>
              No tienes cotizaciones todavía
            </p>
            <Link href="/cotizacion">
              <button style={{
                marginTop: "24px",
                padding: "14px 28px",
                background: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer"
              }}>
                Solicitar Cotización
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "24px" }}>
            {cotizaciones.map((cot) => (
              <div
                key={cot.id}
                style={{
                  background: "rgba(0,0,0,0.7)",
                  borderRadius: "20px",
                  padding: "32px",
                  border: `3px solid ${cot.respuestas && cot.respuestas.length > 0 ? '#10b981' : 'rgba(148,163,184,0.2)'}`,
                  boxShadow: cot.respuestas && cot.respuestas.length > 0 ? '0 0 30px rgba(16,185,129,0.3)' : 'none'
                }}
              >
                {/* Header de la cotización */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "24px",
                  flexWrap: "wrap",
                  gap: "16px"
                }}>
                  <div>
                    <h2 style={{
                      color: "#22d3ee",
                      fontSize: "24px",
                      fontWeight: "bold",
                      margin: "0 0 8px 0"
                    }}>
                      {cot.servicio.tipo.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </h2>
                    <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
                      Solicitado: {new Date(cot.fecha).toLocaleDateString('es-CL', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center"
                  }}>
                    {cot.respuestas && cot.respuestas.length > 0 && (
                      <div style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        background: "rgba(16,185,129,0.2)",
                        border: "2px solid #10b981",
                        color: "#10b981",
                        fontWeight: "bold",
                        fontSize: "14px"
                      }}>
                        🎉 {cot.respuestas.length} Respuesta{cot.respuestas.length > 1 ? 's' : ''}
                      </div>
                    )}
                    <div style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      background: cot.estado === 'respondida' ? 'rgba(59,130,246,0.2)' : 'rgba(245,158,11,0.2)',
                      color: cot.estado === 'respondida' ? '#3b82f6' : '#f59e0b',
                      fontWeight: "bold",
                      fontSize: "14px"
                    }}>
                      {cot.estado === 'respondida' ? '✅ Respondida' : '⏳ Pendiente'}
                    </div>
                  </div>
                </div>

                {/* Detalles de la cotización */}
                <div style={{
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "24px"
                }}>
                  <div style={{ color: "white", lineHeight: "1.8" }}>
                    <p style={{ margin: "0 0 8px 0" }}>
                      <strong style={{ color: "#94a3b8" }}>Descripción:</strong> {cot.servicio.descripcion}
                    </p>
                    {cot.servicio.puntosDeLuz && (
                      <p style={{ margin: "0 0 8px 0" }}>
                        <strong style={{ color: "#94a3b8" }}>Puntos de luz:</strong> {cot.servicio.puntosDeLuz}
                      </p>
                    )}
                    <p style={{ margin: "0 0 8px 0" }}>
                      <strong style={{ color: "#94a3b8" }}>Urgencia:</strong>{" "}
                      <span style={{
                        padding: "4px 12px",
                        borderRadius: "6px",
                        background: cot.servicio.urgencia === 'emergencia' ? '#ef4444' :
                                   cot.servicio.urgencia === 'urgente' ? '#f59e0b' : '#10b981',
                        fontSize: "13px",
                        fontWeight: "bold"
                      }}>
                        {cot.servicio.urgencia}
                      </span>
                    </p>
                    {cot.presupuesto?.estimadoAutomatico && (
                      <p style={{ margin: "8px 0 0 0", fontSize: "18px" }}>
                        <strong style={{ color: "#94a3b8" }}>Estimado automático:</strong>{" "}
                        <span style={{ color: "#22d3ee", fontWeight: "bold" }}>
                          ${cot.presupuesto.estimadoAutomatico.toLocaleString('es-CL')}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Respuestas de profesionales */}
                {cot.respuestas && cot.respuestas.length > 0 && (
                  <div>
                    <h3 style={{
                      color: "#10b981",
                      fontSize: "20px",
                      fontWeight: "bold",
                      marginBottom: "16px"
                    }}>
                      💼 Propuestas Recibidas ({cot.respuestas.length})
                    </h3>
                    <div style={{ display: "grid", gap: "16px" }}>
                      {cot.respuestas.map((resp: any) => (
                        <div
                          key={resp.id}
                          style={{
                            background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.1))",
                            border: "2px solid rgba(16,185,129,0.3)",
                            borderRadius: "16px",
                            padding: "24px"
                          }}
                        >
                          <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                            marginBottom: "16px",
                            flexWrap: "wrap",
                            gap: "16px"
                          }}>
                            <div>
                              <h4 style={{
                                color: "white",
                                fontSize: "20px",
                                fontWeight: "bold",
                                margin: "0 0 8px 0"
                              }}>
                                {resp.profesional.nombre}
                              </h4>
                              <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 4px 0" }}>
                                ⚡ {resp.profesional.especialidad}
                              </p>
                              {resp.profesional.valoracion && (
                                <p style={{ color: "#f59e0b", fontSize: "14px", margin: 0 }}>
                                  ⭐ {resp.profesional.valoracion.toFixed(1)} / 5.0
                                </p>
                              )}
                            </div>
                            <div style={{
                              padding: "16px 24px",
                              background: "linear-gradient(135deg, #10b981, #059669)",
                              borderRadius: "12px",
                              textAlign: "center"
                            }}>
                              <div style={{ color: "white", fontSize: "14px", opacity: 0.9 }}>
                                Presupuesto
                              </div>
                              <div style={{
                                color: "white",
                                fontSize: "32px",
                                fontWeight: "900",
                                margin: "4px 0"
                              }}>
                                ${resp.presupuesto.monto.toLocaleString('es-CL')}
                              </div>
                            </div>
                          </div>

                          <div style={{
                            background: "rgba(0,0,0,0.3)",
                            borderRadius: "12px",
                            padding: "16px",
                            marginBottom: "16px"
                          }}>
                            <p style={{ color: "#cbd5e1", fontSize: "15px", lineHeight: "1.6", margin: 0 }}>
                              {resp.presupuesto.detalles}
                            </p>
                          </div>

                          <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: "12px",
                            marginBottom: "16px"
                          }}>
                            <div style={{
                              background: "rgba(59,130,246,0.1)",
                              border: "1px solid rgba(59,130,246,0.3)",
                              borderRadius: "8px",
                              padding: "12px",
                              textAlign: "center"
                            }}>
                              <div style={{ color: "#60a5fa", fontSize: "12px", marginBottom: "4px" }}>
                                ⏱ Tiempo estimado
                              </div>
                              <div style={{ color: "white", fontWeight: "bold" }}>
                                {resp.presupuesto.tiempoEstimado}
                              </div>
                            </div>
                            <div style={{
                              background: "rgba(245,158,11,0.1)",
                              border: "1px solid rgba(245,158,11,0.3)",
                              borderRadius: "8px",
                              padding: "12px",
                              textAlign: "center"
                            }}>
                              <div style={{ color: "#fbbf24", fontSize: "12px", marginBottom: "4px" }}>
                                📅 Validez
                              </div>
                              <div style={{ color: "white", fontWeight: "bold" }}>
                                {resp.presupuesto.validezOferta}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                            <button
                              onClick={() => aceptarRespuesta(cot.id, resp.id)}
                              style={{
                                flex: "1 1 200px",
                                padding: "14px",
                                background: "linear-gradient(90deg, #10b981, #059669)",
                                border: "none",
                                borderRadius: "12px",
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "16px",
                                cursor: "pointer",
                                boxShadow: "0 4px 12px rgba(16,185,129,0.4)"
                              }}
                            >
                              ✅ Aceptar Propuesta
                            </button>
                            <a
                              href={`https://wa.me/${resp.profesional.telefono.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                flex: "1 1 150px",
                                padding: "14px",
                                background: "rgba(34,197,94,0.2)",
                                border: "2px solid #22c55e",
                                borderRadius: "12px",
                                color: "#22c55e",
                                fontWeight: "bold",
                                fontSize: "16px",
                                textAlign: "center",
                                textDecoration: "none"
                              }}
                            >
                              💬 Contactar
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!cot.respuestas || cot.respuestas.length === 0) && (
                  <div style={{
                    background: "rgba(245,158,11,0.1)",
                    border: "2px dashed rgba(245,158,11,0.3)",
                    borderRadius: "12px",
                    padding: "24px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "48px", marginBottom: "12px" }}>⏳</div>
                    <p style={{ color: "#fbbf24", fontSize: "16px", fontWeight: "bold", margin: 0 }}>
                      Esperando respuestas de profesionales
                    </p>
                    <p style={{ color: "#94a3b8", fontSize: "14px", margin: "8px 0 0 0" }}>
                      Te notificaremos por WhatsApp cuando recibas propuestas
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Review */}
      {mostrarReviewModal && reviewData && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}
        onClick={() => setMostrarReviewModal(false)}>
          <div style={{
            background: "linear-gradient(135deg, #0f172a, #1e1b4b)",
            borderRadius: "24px",
            padding: "32px",
            maxWidth: "500px",
            width: "100%",
            border: "2px solid rgba(245,158,11,0.5)",
            boxShadow: "0 20px 60px rgba(245,158,11,0.3)"
          }}
          onClick={(e) => e.stopPropagation()}>
            <h2 style={{
              color: "white",
              fontSize: "28px",
              fontWeight: "bold",
              marginBottom: "24px",
              textAlign: "center"
            }}>
              ⭐ Valora el Servicio
            </h2>

            <div style={{ marginBottom: "24px" }}>
              <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "8px" }}>
                Profesional: <strong style={{ color: "white" }}>{reviewData.respuesta.profesional.nombre}</strong>
              </p>
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>
                Servicio: <strong style={{ color: "white" }}>{reviewData.cotizacion.servicio.tipo}</strong>
              </p>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ color: "#cbd5e1", fontSize: "14px", fontWeight: "600", display: "block", marginBottom: "12px" }}>
                Calificación *
              </label>
              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setValoracion(star)}
                    style={{
                      fontSize: "40px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: star <= valoracion ? "#f59e0b" : "#94a3b8",
                      transition: "all 0.2s"
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ color: "#cbd5e1", fontSize: "14px", fontWeight: "600", display: "block", marginBottom: "8px" }}>
                Comentario (opcional)
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Cuéntanos sobre tu experiencia..."
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "14px",
                  minHeight: "100px",
                  resize: "vertical",
                  outline: "none"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setMostrarReviewModal(false)}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Cancelar
              </button>
              <button
                onClick={enviarReview}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: "linear-gradient(90deg, #f59e0b, #d97706)",
                  border: "none",
                  borderRadius: "12px",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(245,158,11,0.4)"
                }}
              >
                Enviar Valoración
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
