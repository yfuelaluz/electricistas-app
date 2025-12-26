"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Cliente {
  id: number;
  nombreCompleto: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  region: string;
  plan: string;
  tipoPlan: string;
  fechaRegistro: string;
  estado: string;
}

export default function ClientesAdminPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const response = await fetch("/api/clientes");
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const planInfo: Record<string, { nombre: string; color: string }> = {
    "cliente-basico": { nombre: "Básico", color: "#8b5cf6" },
    "cliente-premium": { nombre: "Premium", color: "#3b82f6" },
    "cliente-empresa": { nombre: "Empresa", color: "#f59e0b" }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)",
      padding: "20px"
    }}>
      <div style={{
        maxWidth: "1400px",
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
          <h1 style={{
            fontSize: "clamp(28px, 6vw, 42px)",
            fontWeight: "900",
            background: "linear-gradient(90deg, #22d3ee, #3b82f6, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0
          }}>
            Clientes Registrados
          </h1>
          
          <Link href="/">
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
              ← Volver al Inicio
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "32px"
        }}>
          <div style={{
            background: "rgba(15, 23, 42, 0.8)",
            padding: "24px",
            borderRadius: "16px",
            border: "2px solid rgba(139, 92, 246, 0.3)"
          }}>
            <p style={{ color: "#a78bfa", fontSize: "14px", margin: 0 }}>Total Clientes</p>
            <p style={{ color: "white", fontSize: "32px", fontWeight: "bold", margin: "8px 0 0 0" }}>
              {clientes.length}
            </p>
          </div>
          
          <div style={{
            background: "rgba(15, 23, 42, 0.8)",
            padding: "24px",
            borderRadius: "16px",
            border: "2px solid rgba(59, 130, 246, 0.3)"
          }}>
            <p style={{ color: "#60a5fa", fontSize: "14px", margin: 0 }}>Premium</p>
            <p style={{ color: "white", fontSize: "32px", fontWeight: "bold", margin: "8px 0 0 0" }}>
              {clientes.filter(c => c.plan === "cliente-premium").length}
            </p>
          </div>
          
          <div style={{
            background: "rgba(15, 23, 42, 0.8)",
            padding: "24px",
            borderRadius: "16px",
            border: "2px solid rgba(245, 158, 11, 0.3)"
          }}>
            <p style={{ color: "#fbbf24", fontSize: "14px", margin: 0 }}>VIP</p>
            <p style={{ color: "white", fontSize: "32px", fontWeight: "bold", margin: "8px 0 0 0" }}>
              {clientes.filter(c => c.plan === "cliente-empresa").length}
            </p>
          </div>
        </div>

        {/* Lista de Clientes */}
        {loading ? (
          <div style={{
            textAlign: "center",
            padding: "60px",
            color: "#94a3b8",
            fontSize: "18px"
          }}>
            Cargando clientes...
          </div>
        ) : clientes.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px",
            background: "rgba(15, 23, 42, 0.8)",
            borderRadius: "16px",
            border: "2px solid rgba(59, 130, 246, 0.2)"
          }}>
            <p style={{ color: "#94a3b8", fontSize: "18px", margin: 0 }}>
              No hay clientes registrados aún
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gap: "20px"
          }}>
            {clientes.map((cliente) => {
              const plan = planInfo[cliente.plan] || { nombre: cliente.plan, color: "#6b7280" };
              
              return (
                <div
                  key={cliente.id}
                  style={{
                    background: "rgba(15, 23, 42, 0.9)",
                    borderRadius: "16px",
                    border: "2px solid rgba(59, 130, 246, 0.2)",
                    padding: "24px",
                    transition: "all 0.3s",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(59, 130, 246, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.2)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px"
                  }}>
                    <div>
                      <p style={{
                        color: "#94a3b8",
                        fontSize: "12px",
                        margin: "0 0 4px 0",
                        textTransform: "uppercase",
                        fontWeight: "600"
                      }}>
                        Cliente
                      </p>
                      <p style={{
                        color: "white",
                        fontSize: "20px",
                        fontWeight: "bold",
                        margin: 0
                      }}>
                        {cliente.nombreCompleto}
                      </p>
                    </div>

                    <div>
                      <p style={{
                        color: "#94a3b8",
                        fontSize: "12px",
                        margin: "0 0 4px 0",
                        textTransform: "uppercase",
                        fontWeight: "600"
                      }}>
                        Plan
                      </p>
                      <span style={{
                        display: "inline-block",
                        padding: "6px 16px",
                        borderRadius: "20px",
                        background: plan.color,
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "bold"
                      }}>
                        {plan.nombre}
                      </span>
                    </div>

                    <div>
                      <p style={{
                        color: "#94a3b8",
                        fontSize: "12px",
                        margin: "0 0 4px 0",
                        textTransform: "uppercase",
                        fontWeight: "600"
                      }}>
                        Contacto
                      </p>
                      <p style={{ color: "white", margin: "0 0 4px 0", fontSize: "14px" }}>
                        📧 {cliente.email}
                      </p>
                      <p style={{ color: "white", margin: 0, fontSize: "14px" }}>
                        📱 {cliente.telefono}
                      </p>
                    </div>

                    <div>
                      <p style={{
                        color: "#94a3b8",
                        fontSize: "12px",
                        margin: "0 0 4px 0",
                        textTransform: "uppercase",
                        fontWeight: "600"
                      }}>
                        Ubicación
                      </p>
                      <p style={{ color: "white", margin: "0 0 4px 0", fontSize: "14px" }}>
                        📍 {cliente.ciudad}, {cliente.region}
                      </p>
                      <p style={{ color: "#94a3b8", margin: 0, fontSize: "12px" }}>
                        {cliente.direccion}
                      </p>
                    </div>

                    <div>
                      <p style={{
                        color: "#94a3b8",
                        fontSize: "12px",
                        margin: "0 0 4px 0",
                        textTransform: "uppercase",
                        fontWeight: "600"
                      }}>
                        Registro
                      </p>
                      <p style={{ color: "white", margin: 0, fontSize: "14px" }}>
                        {new Date(cliente.fechaRegistro).toLocaleDateString("es-CL", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </p>
                    </div>

                    <div>
                      <p style={{
                        color: "#94a3b8",
                        fontSize: "12px",
                        margin: "0 0 4px 0",
                        textTransform: "uppercase",
                        fontWeight: "600"
                      }}>
                        Estado
                      </p>
                      <span style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        background: cliente.estado === "activo" ? "#10b981" : "#6b7280",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "bold"
                      }}>
                        {cliente.estado.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
