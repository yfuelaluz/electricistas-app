"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ClienteData {
  id: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  region: string;
  plan: string;
  password?: string;
}

export default function EditarPerfilPage() {
  const router = useRouter();
  const [cliente, setCliente] = useState<ClienteData | null>(null);
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    region: "",
    passwordActual: "",
    passwordNueva: "",
    passwordConfirmar: ""
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    const session = localStorage.getItem("clienteSession");
    if (!session) {
      router.push("/clientes/login");
      return;
    }

    const clienteData = JSON.parse(session);
    setCliente(clienteData);
    setFormData({
      nombreCompleto: clienteData.nombreCompleto || "",
      telefono: clienteData.telefono || "",
      direccion: clienteData.direccion || "",
      ciudad: clienteData.ciudad || "",
      region: clienteData.region || "",
      passwordActual: "",
      passwordNueva: "",
      passwordConfirmar: ""
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ tipo: "", texto: "" });

    // Validar contraseñas si se están cambiando
    if (formData.passwordNueva || formData.passwordConfirmar) {
      if (formData.passwordNueva !== formData.passwordConfirmar) {
        setMensaje({ tipo: "error", texto: "Las contraseñas nuevas no coinciden" });
        setLoading(false);
        return;
      }
      if (!formData.passwordActual) {
        setMensaje({ tipo: "error", texto: "Debes ingresar tu contraseña actual para cambiarla" });
        setLoading(false);
        return;
      }
    }

    try {
      // Preparar datos sin passwordConfirmar
      const { passwordConfirmar, ...datosEnviar } = formData;
      
      console.log('Datos a enviar:', {
        email: cliente?.email,
        ...datosEnviar
      });
      
      // Actualizar datos del cliente
      const response = await fetch("/api/clientes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cliente?.email,
          ...datosEnviar
        })
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar perfil");
      }

      // Actualizar sesión local con los datos actualizados del servidor
      if (data.success && data.cliente) {
        const updatedCliente = {
          ...cliente,
          ...data.cliente
        };
        localStorage.setItem("clienteSession", JSON.stringify(updatedCliente));
        setCliente(updatedCliente);
      }

      setMensaje({ tipo: "success", texto: "✓ Perfil actualizado exitosamente" });
      
      // Limpiar campos de contraseña
      setFormData(prev => ({
        ...prev,
        passwordActual: "",
        passwordNueva: "",
        passwordConfirmar: ""
      }));

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("/clientes/dashboard");
      }, 2000);

    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al actualizar perfil. Intenta nuevamente." });
    } finally {
      setLoading(false);
    }
  };

  if (!cliente) return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)",
      padding: "clamp(80px, 10vw, 120px) 20px 60px"
    }}>
      <div style={{
        maxWidth: "800px",
        margin: "0 auto"
      }}>
        {/* Header */}
        <div style={{
          marginBottom: "40px",
          textAlign: "center"
        }}>
          <Link
            href="/clientes/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "#60a5fa",
              fontSize: "14px",
              marginBottom: "24px",
              textDecoration: "none"
            }}
          >
            ← Volver al Dashboard
          </Link>
          <h1 style={{
            fontSize: "clamp(32px, 6vw, 48px)",
            fontWeight: "900",
            background: "linear-gradient(90deg, #60a5fa, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "12px"
          }}>
            Editar Perfil
          </h1>
          <p style={{
            color: "#94a3b8",
            fontSize: "16px"
          }}>
            Actualiza tu información personal
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{
          background: "rgba(15, 23, 42, 0.9)",
          borderRadius: "24px",
          border: "2px solid rgba(148, 163, 184, 0.1)",
          padding: "clamp(24px, 5vw, 48px)",
          backdropFilter: "blur(20px)"
        }}>
          {/* Información Personal */}
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{
              color: "white",
              fontSize: "20px",
              fontWeight: "700",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <span style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px"
              }}>
                👤
              </span>
              Información Personal
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px"
            }}>
              <div>
                <label style={{
                  display: "block",
                  color: "#cbd5e1",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600"
                }}>
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={formData.nombreCompleto}
                  onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "2px solid rgba(148, 163, 184, 0.2)",
                    background: "rgba(30, 41, 59, 0.5)",
                    color: "white",
                    fontSize: "16px"
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  color: "#cbd5e1",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600"
                }}>
                  Email (no editable)
                </label>
                <input
                  type="email"
                  value={cliente.email}
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "2px solid rgba(148, 163, 184, 0.1)",
                    background: "rgba(30, 41, 59, 0.3)",
                    color: "#64748b",
                    fontSize: "16px",
                    cursor: "not-allowed"
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  color: "#cbd5e1",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600"
                }}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "2px solid rgba(148, 163, 184, 0.2)",
                    background: "rgba(30, 41, 59, 0.5)",
                    color: "white",
                    fontSize: "16px"
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  color: "#cbd5e1",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600"
                }}>
                  Ciudad
                </label>
                <input
                  type="text"
                  value={formData.ciudad}
                  onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "2px solid rgba(148, 163, 184, 0.2)",
                    background: "rgba(30, 41, 59, 0.5)",
                    color: "white",
                    fontSize: "16px"
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <label style={{
                display: "block",
                color: "#cbd5e1",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "600"
              }}>
                Dirección
              </label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "2px solid rgba(148, 163, 184, 0.2)",
                  background: "rgba(30, 41, 59, 0.5)",
                  color: "white",
                  fontSize: "16px"
                }}
              />
            </div>

            <div style={{ marginTop: "20px" }}>
              <label style={{
                display: "block",
                color: "#cbd5e1",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "600"
              }}>
                Región
              </label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "2px solid rgba(148, 163, 184, 0.2)",
                  background: "rgba(30, 41, 59, 0.5)",
                  color: "white",
                  fontSize: "16px"
                }}
              >
                <option value="Región Metropolitana">Región Metropolitana</option>
                <option value="Región de Valparaíso">Región de Valparaíso</option>
                <option value="Región del Biobío">Región del Biobío</option>
                <option value="Región de la Araucanía">Región de la Araucanía</option>
                <option value="Región de Los Lagos">Región de Los Lagos</option>
                <option value="Otra">Otra</option>
              </select>
            </div>
          </div>

          {/* Cambiar Contraseña */}
          <div style={{
            marginBottom: "32px",
            paddingTop: "32px",
            borderTop: "2px solid rgba(148, 163, 184, 0.1)"
          }}>
            <h2 style={{
              color: "white",
              fontSize: "20px",
              fontWeight: "700",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <span style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px"
              }}>
                🔒
              </span>
              Cambiar Contraseña (Opcional)
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px"
            }}>
              <div>
                <label style={{
                  display: "block",
                  color: "#cbd5e1",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600"
                }}>
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  value={formData.passwordActual}
                  onChange={(e) => setFormData({ ...formData, passwordActual: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "2px solid rgba(148, 163, 184, 0.2)",
                    background: "rgba(30, 41, 59, 0.5)",
                    color: "white",
                    fontSize: "16px"
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  color: "#cbd5e1",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600"
                }}>
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={formData.passwordNueva}
                  onChange={(e) => setFormData({ ...formData, passwordNueva: e.target.value })}
                  minLength={6}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "2px solid rgba(148, 163, 184, 0.2)",
                    background: "rgba(30, 41, 59, 0.5)",
                    color: "white",
                    fontSize: "16px"
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  color: "#cbd5e1",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600"
                }}>
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={formData.passwordConfirmar}
                  onChange={(e) => setFormData({ ...formData, passwordConfirmar: e.target.value })}
                  minLength={6}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "2px solid rgba(148, 163, 184, 0.2)",
                    background: "rgba(30, 41, 59, 0.5)",
                    color: "white",
                    fontSize: "16px"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Mensaje */}
          {mensaje.texto && (
            <div style={{
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "24px",
              background: mensaje.tipo === "success" 
                ? "rgba(16, 185, 129, 0.1)" 
                : "rgba(239, 68, 68, 0.1)",
              border: `2px solid ${mensaje.tipo === "success" ? "#10b981" : "#ef4444"}`,
              color: mensaje.tipo === "success" ? "#10b981" : "#ef4444",
              fontSize: "16px",
              fontWeight: "600",
              textAlign: "center"
            }}>
              {mensaje.texto}
            </div>
          )}

          {/* Botones */}
          <div style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap"
          }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: "1",
                minWidth: "200px",
                padding: "16px 32px",
                borderRadius: "12px",
                border: "none",
                background: loading 
                  ? "rgba(148, 163, 184, 0.3)"
                  : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                boxShadow: loading ? "none" : "0 4px 20px rgba(59, 130, 246, 0.4)"
              }}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>

            <Link
              href="/clientes/dashboard"
              style={{
                flex: "1",
                minWidth: "200px",
                padding: "16px 32px",
                borderRadius: "12px",
                border: "2px solid rgba(148, 163, 184, 0.3)",
                background: "transparent",
                color: "#94a3b8",
                fontSize: "18px",
                fontWeight: "bold",
                textAlign: "center",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s"
              }}
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
