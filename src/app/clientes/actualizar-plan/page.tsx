"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const procesarPago = async (plan: string) => {
  try {
    const response = await fetch('/api/webpay/crear-pago', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      alert('Error al procesar el pago. Intenta nuevamente.');
      return;
    }

    if (data.free) {
      window.location.href = '/clientes/registro?plan=cliente-basico&pago=exitoso';
      return;
    }
    
    if (data.success && data.url && data.token) {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.url;
      
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'token_ws';
      input.value = data.token;
      
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    } else {
      alert('Error al procesar el pago. Intenta nuevamente.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al conectar con el servidor de pagos.');
  }
};

export default function ActualizarPlanPage() {
  const router = useRouter();
  const [clienteActual, setClienteActual] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem("clienteSession");
    if (!session) {
      router.push("/clientes/login");
      return;
    }
    setClienteActual(JSON.parse(session));
  }, [router]);

  const planes = [
    {
      id: "cliente-basico",
      nombre: "Básico",
      precio: "Gratis",
      precioNumerico: 0,
      color: "#8b5cf6",
      features: ["2 cotizaciones mensuales", "Hasta 2 profesionales", "Chat básico", "Soporte por email"]
    },
    {
      id: "cliente-premium",
      nombre: "Premium",
      precio: "$14.990/mes",
      precioNumerico: 14990,
      color: "#3b82f6",
      destacado: true,
      features: ["6 cotizaciones mensuales", "Hasta 6 profesionales", "Chat prioritario", "Soporte 24/7", "Descuentos exclusivos"]
    },
    {
      id: "cliente-empresa",
      nombre: "VIP",
      precio: "$29.990/mes",
      precioNumerico: 29990,
      color: "#f59e0b",
      features: ["Cotizaciones ilimitadas", "Acceso a todos los pro", "Gestor dedicado", "Prioridad máxima", "Descuentos VIP"]
    }
  ];

  const planActual = clienteActual?.plan;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)",
      padding: "20px"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {/* Header */}
        <div style={{
          marginBottom: "40px",
          textAlign: "center"
        }}>
          <h1 style={{
            fontSize: "clamp(32px, 7vw, 48px)",
            fontWeight: "900",
            background: "linear-gradient(90deg, #22d3ee, #3b82f6, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "16px"
          }}>
            Actualizar Plan de Suscripción
          </h1>
          <p style={{
            color: "#94a3b8",
            fontSize: "18px",
            marginBottom: "32px"
          }}>
            Mejora tu plan y obtén más beneficios
          </p>
          
          <Link href="/clientes/dashboard">
            <button style={{
              padding: "12px 24px",
              borderRadius: "12px",
              border: "2px solid rgba(59, 130, 246, 0.5)",
              background: "rgba(59, 130, 246, 0.1)",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s"
            }}>
              ← Volver al Dashboard
            </button>
          </Link>
        </div>

        {/* Planes */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px"
        }}>
          {planes.map((plan) => {
            const esPlanActual = planActual === plan.id;
            const esMejora = planes.findIndex(p => p.id === planActual) < planes.findIndex(p => p.id === plan.id);

            return (
              <div
                key={plan.id}
                style={{
                  background: esPlanActual 
                    ? "linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(59, 130, 246, 0.1))"
                    : "rgba(15, 23, 42, 0.8)",
                  borderRadius: "24px",
                  border: esPlanActual 
                    ? `3px solid ${plan.color}`
                    : plan.destacado 
                    ? `2px solid ${plan.color}`
                    : "2px solid rgba(148, 163, 184, 0.2)",
                  padding: "32px",
                  position: "relative",
                  transition: "all 0.3s",
                  transform: plan.destacado ? "scale(1.05)" : "scale(1)"
                }}
              >
                {/* Badge Plan Actual */}
                {esPlanActual && (
                  <div style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: plan.color,
                    color: "white",
                    padding: "6px 20px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textTransform: "uppercase"
                  }}>
                    Plan Actual
                  </div>
                )}

                {/* Badge Recomendado */}
                {plan.destacado && (
                  <div style={{
                    background: "linear-gradient(90deg, #22d3ee, #3b82f6)",
                    color: "white",
                    padding: "6px 16px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: "16px",
                    textTransform: "uppercase"
                  }}>
                    Recomendado
                  </div>
                )}

                <h3 style={{
                  fontSize: "28px",
                  fontWeight: "900",
                  color: "white",
                  marginBottom: "12px"
                }}>
                  {plan.nombre}
                </h3>

                <div style={{
                  fontSize: "42px",
                  fontWeight: "900",
                  color: plan.color,
                  marginBottom: "24px"
                }}>
                  {plan.precio}
                </div>

                <ul style={{
                  listStyle: "none",
                  padding: 0,
                  marginBottom: "24px"
                }}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={{
                      display: "flex",
                      gap: "12px",
                      color: "#cbd5e1",
                      marginBottom: "12px",
                      fontSize: "15px",
                      alignItems: "flex-start"
                    }}>
                      <span style={{ color: plan.color, fontSize: "20px", flexShrink: 0 }}>✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Botón */}
                {esPlanActual ? (
                  <button
                    disabled
                    style={{
                      width: "100%",
                      padding: "16px",
                      background: "rgba(107, 114, 128, 0.3)",
                      color: "#94a3b8",
                      border: "2px solid rgba(148, 163, 184, 0.3)",
                      borderRadius: "12px",
                      fontWeight: "bold",
                      fontSize: "16px",
                      cursor: "not-allowed"
                    }}
                  >
                    Plan Actual
                  </button>
                ) : esMejora ? (
                  <button
                    onClick={() => procesarPago(plan.id)}
                    style={{
                      width: "100%",
                      padding: "16px",
                      background: `linear-gradient(90deg, ${plan.color}, ${plan.color}dd)`,
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      fontWeight: "bold",
                      fontSize: "16px",
                      cursor: "pointer",
                      boxShadow: `0 10px 30px ${plan.color}60`,
                      transition: "all 0.3s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = `0 15px 40px ${plan.color}80`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = `0 10px 30px ${plan.color}60`;
                    }}
                  >
                    Actualizar a {plan.nombre}
                  </button>
                ) : (
                  <button
                    disabled
                    style={{
                      width: "100%",
                      padding: "16px",
                      background: "rgba(107, 114, 128, 0.2)",
                      color: "#6b7280",
                      border: "2px solid rgba(107, 114, 128, 0.3)",
                      borderRadius: "12px",
                      fontWeight: "bold",
                      fontSize: "16px",
                      cursor: "not-allowed"
                    }}
                  >
                    Plan Inferior
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Nota informativa */}
        <div style={{
          marginTop: "40px",
          background: "rgba(59, 130, 246, 0.1)",
          border: "2px solid rgba(59, 130, 246, 0.3)",
          borderRadius: "16px",
          padding: "20px",
          textAlign: "center"
        }}>
          <p style={{
            color: "#93c5fd",
            margin: 0,
            fontSize: "14px"
          }}>
            ℹ️ Al actualizar tu plan, los cambios serán efectivos inmediatamente y se aplicarán los nuevos beneficios.
          </p>
        </div>
      </div>
    </div>
  );
}
