"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import PromoBanner from "@/components/ui/PromoBanner";

export default function LoginClientesPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error } = await signIn(email, password);

      if (error) {
        setError("Email o contraseña incorrectos");
      } else {
        router.push("/clientes/dashboard");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)",
      padding: "20px"
    }}>
      {/* Banner Promocional */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", paddingTop: "20px", paddingBottom: "20px" }}>
        <PromoBanner />
      </div>
      
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 200px)"
      }}>
      <div style={{
        maxWidth: "480px",
        width: "100%",
        background: "rgba(15, 23, 42, 0.95)",
        borderRadius: "24px",
        border: "2px solid rgba(59, 130, 246, 0.3)",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
        padding: "clamp(32px, 5vw, 48px)",
        backdropFilter: "blur(20px)"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 20px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px"
          }}>
            👤
          </div>
          
          <h1 style={{
            fontSize: "clamp(28px, 6vw, 36px)",
            fontWeight: "900",
            background: "linear-gradient(90deg, #22d3ee, #3b82f6, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px"
          }}>
            Acceso Clientes
          </h1>
          
          <p style={{ color: "#94a3b8", margin: 0 }}>
            Ingresa a tu cuenta
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "2px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "12px",
            padding: "12px 16px",
            marginBottom: "20px",
            color: "#fca5a5",
            fontSize: "14px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

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
              Email
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
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
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
                : "linear-gradient(90deg, #8b5cf6, #6366f1)",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 10px 30px rgba(139, 92, 246, 0.4)",
              transition: "all 0.3s",
              marginTop: "8px"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 15px 40px rgba(139, 92, 246, 0.6)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(139, 92, 246, 0.4)";
            }}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {/* Links */}
        <div style={{
          marginTop: "24px",
          textAlign: "center",
          fontSize: "14px",
          color: "#94a3b8"
        }}>
          <p style={{ margin: "0 0 12px 0" }}>
            ¿No tienes cuenta?{" "}
            <Link href="/suscripciones" style={{ color: "#3b82f6", fontWeight: "600", textDecoration: "none" }}>
              Suscríbete aquí
            </Link>
          </p>
          <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
