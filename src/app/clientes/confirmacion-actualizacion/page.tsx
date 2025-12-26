"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ConfirmacionActualizacionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [segundos, setSegundos] = useState(5);

  useEffect(() => {
    const plan = searchParams.get("plan");
    
    // Actualizar el plan en la sesión
    const session = localStorage.getItem("clienteSession");
    if (session) {
      const clienteData = JSON.parse(session);
      clienteData.plan = plan;
      localStorage.setItem("clienteSession", JSON.stringify(clienteData));
    }

    // Contador regresivo
    const interval = setInterval(() => {
      setSegundos(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/clientes/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [searchParams, router]);

  const planNombres: Record<string, string> = {
    "cliente-basico": "Básico",
    "cliente-premium": "Premium",
    "cliente-empresa": "VIP"
  };

  const planActual = searchParams.get("plan") || "";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        maxWidth: "600px",
        width: "100%",
        background: "rgba(15, 23, 42, 0.95)",
        borderRadius: "24px",
        border: "3px solid #10b981",
        boxShadow: "0 20px 80px rgba(16, 185, 129, 0.5)",
        padding: "48px",
        textAlign: "center",
        backdropFilter: "blur(20px)"
      }}>
        {/* Icono de éxito animado */}
        <div style={{
          width: "100px",
          height: "100px",
          margin: "0 auto 32px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #10b981, #059669)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "60px",
          animation: "pulse 2s infinite"
        }}>
          ✓
        </div>

        <h1 style={{
          fontSize: "clamp(32px, 6vw, 42px)",
          fontWeight: "900",
          background: "linear-gradient(90deg, #10b981, #22d3ee)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "16px"
        }}>
          ¡Plan Actualizado!
        </h1>

        <p style={{
          color: "#cbd5e1",
          fontSize: "18px",
          marginBottom: "32px",
          lineHeight: "1.6"
        }}>
          Tu plan ha sido actualizado exitosamente a{" "}
          <span style={{
            color: "#10b981",
            fontWeight: "bold",
            fontSize: "22px"
          }}>
            {planNombres[planActual]}
          </span>
        </p>

        <div style={{
          background: "rgba(16, 185, 129, 0.1)",
          border: "2px solid rgba(16, 185, 129, 0.3)",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "32px"
        }}>
          <p style={{
            color: "#86efac",
            fontSize: "16px",
            margin: "0 0 12px 0",
            fontWeight: "600"
          }}>
            ✨ Beneficios activados inmediatamente
          </p>
          <p style={{
            color: "#94a3b8",
            fontSize: "14px",
            margin: 0
          }}>
            Ya puedes disfrutar de todas las ventajas de tu nuevo plan
          </p>
        </div>

        {/* Contador */}
        <div style={{
          background: "rgba(59, 130, 246, 0.1)",
          border: "2px solid rgba(59, 130, 246, 0.3)",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "24px"
        }}>
          <p style={{
            color: "#60a5fa",
            fontSize: "14px",
            margin: 0
          }}>
            Redirigiendo a tu dashboard en{" "}
            <span style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#3b82f6"
            }}>
              {segundos}
            </span>
            {" "}segundo{segundos !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          onClick={() => router.push("/clientes/dashboard")}
          style={{
            padding: "14px 32px",
            borderRadius: "12px",
            border: "2px solid rgba(59, 130, 246, 0.5)",
            background: "rgba(59, 130, 246, 0.2)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px",
            transition: "all 0.3s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(59, 130, 246, 0.3)";
            e.currentTarget.style.borderColor = "#3b82f6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)";
            e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)";
          }}
        >
          Ir al Dashboard ahora
        </button>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        `}</style>
      </div>
    </div>
  );
}
