"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProfessionalIcon from "@/components/ui/ProfessionalIcon";

export default function DashboardClientesPage() {
  const router = useRouter();
  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarSesion = () => {
      const session = localStorage.getItem("clienteSession");
      if (!session) {
        router.push("/clientes/login");
        return;
      }
      setCliente(JSON.parse(session));
      setLoading(false);
    };
    
    cargarSesion();
    
    // Recargar cuando la ventana vuelve a estar en foco
    window.addEventListener('focus', cargarSesion);
    return () => window.removeEventListener('focus', cargarSesion);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("clienteSession");
    router.push("/");
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

  const planInfo: Record<string, { nombre: string; precio: string; color: string; features: string[] }> = {
    "cliente-basico": {
      nombre: "Básico",
      precio: "Gratis",
      color: "#8b5cf6",
      features: ["2 cotizaciones mensuales", "Hasta 2 profesionales", "Chat básico", "Soporte por email"]
    },
    "cliente-premium": {
      nombre: "Premium",
      precio: "$14.990/mes",
      color: "#3b82f6",
      features: ["6 cotizaciones mensuales", "Hasta 6 profesionales", "Chat prioritario", "Soporte 24/7", "Descuentos exclusivos"]
    },
    "cliente-empresa": {
      nombre: "VIP",
      precio: "$29.990/mes",
      color: "#f59e0b",
      features: ["Cotizaciones ilimitadas", "Acceso a todos los pro", "Gestor dedicado", "Prioridad máxima", "Descuentos VIP"]
    }
  };

  const planActual = planInfo[cliente?.plan] || planInfo["cliente-basico"];

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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div>
            <h1 style={{
              fontSize: "clamp(28px, 6vw, 42px)",
              fontWeight: "900",
              background: "linear-gradient(90deg, #22d3ee, #3b82f6, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0
            }}>
              Panel de Cliente
            </h1>
            <p style={{ color: "#94a3b8", margin: "8px 0 0 0", fontSize: "18px" }}>
              Bienvenido, {cliente?.nombreCompleto}
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/clientes/cotizaciones">
              <button
                style={{
                  padding: "12px 24px",
                  borderRadius: "12px",
                  border: "2px solid rgba(16, 185, 129, 0.5)",
                  background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))",
                  color: "#10b981",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "16px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(6, 182, 212, 0.3))";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                📋 Mis Cotizaciones
              </button>
            </Link>
            <Link href="/clientes/editar-perfil">
              <button
                style={{
                  padding: "12px 24px",
                  borderRadius: "12px",
                  border: "2px solid rgba(59, 130, 246, 0.5)",
                  background: "rgba(59, 130, 246, 0.1)",
                  color: "#60a5fa",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)";
                }}
              >
                ✏️ Editar Perfil
              </button>
            </Link>
            <button
            onClick={handleLogout}
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              border: "2px solid rgba(239, 68, 68, 0.5)",
              background: "rgba(239, 68, 68, 0.1)",
              color: "#f87171",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
            }}
          >
            Cerrar Sesión
          </button>
          </div>
        </div>

        {/* Plan Actual */}
        <div style={{
          background: "rgba(15, 23, 42, 0.8)",
          borderRadius: "24px",
          border: `2px solid ${planActual.color}`,
          padding: "32px",
          marginBottom: "32px",
          boxShadow: `0 20px 60px ${planActual.color}40`
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px"
          }}>
            <div>
              <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 8px 0", textTransform: "uppercase", fontWeight: "600" }}>
                Plan Actual
              </p>
              <p style={{ color: "white", fontSize: "32px", fontWeight: "bold", margin: "0 0 4px 0" }}>
                {planActual.nombre}
              </p>
              <p style={{ color: planActual.color, fontSize: "18px", margin: 0, fontWeight: "600" }}>
                {planActual.precio}
              </p>
            </div>

            <div>
              <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 8px 0", textTransform: "uppercase", fontWeight: "600" }}>
                Beneficios Incluidos
              </p>
              <ul style={{ margin: 0, padding: "0 0 0 20px", color: "white" }}>
                {planActual.features.slice(0, 3).map((feature, index) => (
                  <li key={index} style={{ marginBottom: "4px" }}>{feature}</li>
                ))}
              </ul>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Link href="/clientes/actualizar-plan">
                <button style={{
                  padding: "14px 28px",
                  borderRadius: "12px",
                  border: "none",
                  background: `linear-gradient(90deg, ${planActual.color}, ${planActual.color}dd)`,
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: `0 10px 30px ${planActual.color}60`,
                  transition: "all 0.3s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  Actualizar Plan
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Opciones Rápidas */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "32px"
        }}>
          <Link href="/cotizacion" style={{ textDecoration: "none" }}>
            <div style={{
              background: "rgba(15, 23, 42, 0.8)",
              borderRadius: "16px",
              border: "2px solid rgba(245, 158, 11, 0.3)",
              padding: "24px",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#f59e0b";
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(245, 158, 11, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(245, 158, 11, 0.3)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
            >
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚡</div>
              <h3 style={{ color: "white", fontSize: "20px", fontWeight: "bold", margin: "0 0 8px 0" }}>
                Nueva Cotización
              </h3>
              <p style={{ color: "#94a3b8", margin: 0, fontSize: "14px" }}>
                Solicita cotización de servicios
              </p>
            </div>
          </Link>

          <Link href="/?vista=profesionales" style={{ textDecoration: "none" }}>
            <div style={{
              background: "rgba(15, 23, 42, 0.8)",
              borderRadius: "16px",
              border: "2px solid rgba(34, 211, 238, 0.3)",
              padding: "24px",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#22d3ee";
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(34, 211, 238, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(34, 211, 238, 0.3)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
            >
              <div style={{ fontSize: "40px", marginBottom: "12px", display: "flex", justifyContent: "center" }}>
                <ProfessionalIcon size={40} />
              </div>
              <h3 style={{ color: "white", fontSize: "20px", fontWeight: "bold", margin: "0 0 8px 0" }}>
                Ver Profesionales
              </h3>
              <p style={{ color: "#94a3b8", margin: 0, fontSize: "14px" }}>
                Encuentra expertos en tu zona
              </p>
            </div>
          </Link>

          <Link href="/?vista=galeria" style={{ textDecoration: "none" }}>
            <div style={{
              background: "rgba(15, 23, 42, 0.8)",
              borderRadius: "16px",
              border: "2px solid rgba(168, 85, 247, 0.3)",
              padding: "24px",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#a855f7";
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(168, 85, 247, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.3)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
            >
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📸</div>
              <h3 style={{ color: "white", fontSize: "20px", fontWeight: "bold", margin: "0 0 8px 0" }}>
                Ver Proyectos
              </h3>
              <p style={{ color: "#94a3b8", margin: 0, fontSize: "14px" }}>
                Galería de trabajos realizados
              </p>
            </div>
          </Link>
        </div>

        {/* Información de Cuenta */}
        <div style={{
          background: "rgba(15, 23, 42, 0.8)",
          borderRadius: "16px",
          border: "2px solid rgba(59, 130, 246, 0.2)",
          padding: "24px"
        }}>
          <h2 style={{
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px"
          }}>
            Información de Cuenta
          </h2>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px"
          }}>
            <div>
              <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 4px 0", textTransform: "uppercase" }}>
                Email
              </p>
              <p style={{ color: "white", fontSize: "16px", margin: 0 }}>
                {cliente?.email}
              </p>
            </div>

            <div>
              <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 4px 0", textTransform: "uppercase" }}>
                Estado
              </p>
              <span style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "12px",
                background: "#10b981",
                color: "white",
                fontSize: "12px",
                fontWeight: "bold"
              }}>
                ACTIVO
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
