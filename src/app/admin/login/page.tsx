"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Contraseña de administrador (en producción debe estar en variables de entorno)
  const ADMIN_PASSWORD = "admin2025"; // Cambiar esto en producción

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password === ADMIN_PASSWORD) {
      // Guardar sesión de admin
      localStorage.setItem("adminSession", JSON.stringify({
        role: "admin",
        timestamp: Date.now()
      }));
      router.push("/admin/dashboard");
    } else {
      setError("Contraseña incorrecta");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #7c2d12 0%, #1e1b4b 50%, #000000 100%)",
      padding: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        maxWidth: "480px",
        width: "100%",
        background: "rgba(15, 23, 42, 0.95)",
        borderRadius: "24px",
        border: "2px solid rgba(239, 68, 68, 0.5)",
        boxShadow: "0 20px 60px rgba(239, 68, 68, 0.3)",
        padding: "48px",
        backdropFilter: "blur(20px)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 20px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px"
          }}>
            🔐
          </div>
          
          <h1 style={{
            fontSize: "36px",
            fontWeight: "900",
            background: "linear-gradient(90deg, #ef4444, #f59e0b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px"
          }}>
            Acceso Admin
          </h1>
          
          <p style={{ color: "#94a3b8", margin: 0 }}>
            Panel de Administración
          </p>
        </div>

        {error && (
          <div style={{
            padding: "16px",
            background: "rgba(239, 68, 68, 0.2)",
            border: "2px solid rgba(239, 68, 68, 0.5)",
            borderRadius: "12px",
            color: "#fca5a5",
            marginBottom: "24px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <label style={{
              display: "block",
              color: "#cbd5e1",
              fontWeight: "600",
              marginBottom: "8px",
              fontSize: "14px"
            }}>
              Contraseña de Administrador
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 18px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "12px",
                color: "white",
                fontSize: "16px",
                outline: "none"
              }}
              placeholder="Ingresa la contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "16px",
              background: "linear-gradient(90deg, #ef4444, #dc2626)",
              border: "none",
              borderRadius: "12px",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 4px 20px rgba(239, 68, 68, 0.4)"
            }}
          >
            {loading ? "Verificando..." : "Acceder al Panel"}
          </button>
        </form>

        <div style={{
          marginTop: "24px",
          padding: "16px",
          background: "rgba(245, 158, 11, 0.1)",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          borderRadius: "12px",
          color: "#fbbf24",
          fontSize: "13px",
          textAlign: "center"
        }}>
          ⚠️ Solo para personal autorizado
        </div>
      </div>
    </div>
  );
}
