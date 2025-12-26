"use client";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export const dynamic = 'force-dynamic';

function RegistroClienteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("");
  const [pagoExitoso, setPagoExitoso] = useState(false);

  useEffect(() => {
    const planParam = searchParams.get("plan") || "";
    const pagoParam = searchParams.get("pago") === "exitoso";
    setPlan(planParam);
    setPagoExitoso(pagoParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const datos = {
      nombreCompleto: formData.get("nombreCompleto"),
      email: formData.get("email"),
      telefono: formData.get("telefono"),
      password: formData.get("password"),
      direccion: formData.get("direccion"),
      ciudad: formData.get("ciudad"),
      region: formData.get("region"),
      plan: plan,
      tipoPlan: "cliente"
    };

    try {
      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const result = await response.json();

      if (result.success) {
        alert("✅ " + result.mensaje);
        router.push("/?registro=exitoso");
      } else {
        alert("❌ Error al registrar. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const planInfo: Record<string, { nombre: string; precio: string; color: string }> = {
    "cliente-basico": { nombre: "Básico", precio: "Gratis", color: "#8b5cf6" },
    "cliente-premium": { nombre: "Premium", precio: "$14.990/mes", color: "#3b82f6" },
    "cliente-empresa": { nombre: "VIP", precio: "$29.990/mes", color: "#f59e0b" }
  };

  const planActual = planInfo[plan] || { nombre: "Suscripción", precio: "", color: "#3b82f6" };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)",
      padding: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        maxWidth: "600px",
        width: "100%",
        background: "rgba(15, 23, 42, 0.95)",
        borderRadius: "24px",
        border: "2px solid rgba(59, 130, 246, 0.3)",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
        padding: "clamp(24px, 5vw, 48px)",
        backdropFilter: "blur(20px)"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{
            fontSize: "clamp(24px, 6vw, 36px)",
            fontWeight: "900",
            background: "linear-gradient(90deg, #22d3ee, #3b82f6, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "12px"
          }}>
            Completar Registro
          </h1>
          
          {pagoExitoso && (
            <div style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              justifyContent: "center"
            }}>
              <span style={{ fontSize: "24px" }}>✓</span>
              <span style={{ color: "white", fontWeight: "bold" }}>
                ¡Pago procesado exitosamente!
              </span>
            </div>
          )}

          <div style={{
            background: `linear-gradient(135deg, ${planActual.color}, ${planActual.color}dd)`,
            padding: "16px",
            borderRadius: "12px",
            marginTop: "16px"
          }}>
            <p style={{ color: "white", margin: 0, fontSize: "14px", opacity: 0.9 }}>
              Plan Seleccionado
            </p>
            <p style={{ color: "white", margin: "4px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>
              {planActual.nombre}
            </p>
            {planActual.precio && (
              <p style={{ color: "white", margin: "4px 0 0 0", fontSize: "16px", opacity: 0.9 }}>
                {planActual.precio}
              </p>
            )}
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{
              display: "block",
              color: "#cbd5e1",
              fontWeight: "600",
              marginBottom: "8px",
              fontSize: "14px"
            }}>
              Nombre Completo *
            </label>
            <input
              type="text"
              name="nombreCompleto"
              required
              placeholder="Juan Pérez González"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "2px solid rgba(59, 130, 246, 0.3)",
                background: "rgba(0, 0, 0, 0.4)",
                color: "white",
                fontSize: "16px",
                outline: "none",
                transition: "all 0.3s"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)"}
            />
          </div>

          <div>
            <label style={{
              display: "block",
              color: "#cbd5e1",
              fontWeight: "600",
              marginBottom: "8px",
              fontSize: "14px"
            }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="correo@ejemplo.com"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "2px solid rgba(59, 130, 246, 0.3)",
                background: "rgba(0, 0, 0, 0.4)",
                color: "white",
                fontSize: "16px",
                outline: "none",
                transition: "all 0.3s"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)"}
            />
          </div>

          <div>
            <label style={{
              display: "block",
              color: "#cbd5e1",
              fontWeight: "600",
              marginBottom: "8px",
              fontSize: "14px"
            }}>
              Teléfono *
            </label>
            <input
              type="tel"
              name="telefono"
              required
              placeholder="+56 9 1234 5678"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "2px solid rgba(59, 130, 246, 0.3)",
                background: "rgba(0, 0, 0, 0.4)",
                color: "white",
                fontSize: "16px",
                outline: "none",
                transition: "all 0.3s"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)"}
            />
          </div>

          <div>
            <label style={{
              display: "block",
              color: "#cbd5e1",
              fontWeight: "600",
              marginBottom: "8px",
              fontSize: "14px"
            }}>
              Contraseña *
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "2px solid rgba(59, 130, 246, 0.3)",
                background: "rgba(0, 0, 0, 0.4)",
                color: "white",
                fontSize: "16px",
                outline: "none",
                transition: "all 0.3s"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)"}
            />
          </div>

          <div>
            <label style={{
              display: "block",
              color: "#cbd5e1",
              fontWeight: "600",
              marginBottom: "8px",
              fontSize: "14px"
            }}>
              Dirección *
            </label>
            <input
              type="text"
              name="direccion"
              required
              placeholder="Av. Principal 123"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "2px solid rgba(59, 130, 246, 0.3)",
                background: "rgba(0, 0, 0, 0.4)",
                color: "white",
                fontSize: "16px",
                outline: "none",
                transition: "all 0.3s"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)"}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{
                display: "block",
                color: "#cbd5e1",
                fontWeight: "600",
                marginBottom: "8px",
                fontSize: "14px"
              }}>
                Ciudad *
              </label>
              <input
                type="text"
                name="ciudad"
                required
                placeholder="Valparaíso"
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "2px solid rgba(59, 130, 246, 0.3)",
                  background: "rgba(0, 0, 0, 0.4)",
                  color: "white",
                  fontSize: "16px",
                  outline: "none",
                  transition: "all 0.3s"
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
                onBlur={(e) => e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)"}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                color: "#cbd5e1",
                fontWeight: "600",
                marginBottom: "8px",
                fontSize: "14px"
              }}>
                Región *
              </label>
              <select
                name="region"
                required
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "2px solid rgba(59, 130, 246, 0.3)",
                  background: "rgba(0, 0, 0, 0.4)",
                  color: "white",
                  fontSize: "16px",
                  outline: "none",
                  transition: "all 0.3s"
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
                onBlur={(e) => e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)"}
              >
                <option value="">Seleccionar</option>
                <option value="V Región">V Región - Valparaíso</option>
                <option value="RM">Región Metropolitana</option>
                <option value="VI Región">VI Región - O'Higgins</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "12px",
              border: "none",
              background: loading 
                ? "rgba(107, 114, 128, 0.5)"
                : "linear-gradient(90deg, #3b82f6, #2563eb)",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)",
              transition: "all 0.3s",
              marginTop: "12px"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 15px 40px rgba(59, 130, 246, 0.6)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(59, 130, 246, 0.4)";
            }}
          >
            {loading ? "Procesando..." : "Completar Registro"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "2px solid rgba(148, 163, 184, 0.3)",
              background: "transparent",
              color: "#94a3b8",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#94a3b8";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.3)";
              e.currentTarget.style.color = "#94a3b8";
            }}
          >
            Volver al Inicio
          </button>
        </form>
      </div>
    </div>
  );
}

export default function RegistroClientePage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <RegistroClienteContent />
    </Suspense>
  );
}
