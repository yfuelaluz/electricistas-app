"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("clientes");
  const [clientes, setClientes] = useState<any[]>([]);
  const [profesionales, setProfesionales] = useState<any[]>([]);
  const [cotizaciones, setCotizaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión de admin
    const session = localStorage.getItem("adminSession");
    if (!session) {
      router.push("/admin/login");
      return;
    }

    // Cargar datos
    Promise.all([
      fetch('/api/clientes').then(r => r.json()),
      fetch('/api/profesionales').then(r => r.json()),
      fetch('/api/cotizaciones').then(r => r.json())
    ]).then(([clientesData, profesionalesData, cotizacionesData]) => {
      setClientes(clientesData);
      setProfesionales(profesionalesData);
      setCotizaciones(cotizacionesData);
      setLoading(false);
    }).catch(err => {
      console.error('Error cargando datos:', err);
      setLoading(false);
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    router.push("/admin/login");
  };

  const activarProfesional = async (id: number) => {
    if (!confirm('¿Activar este profesional?')) return;
    
    // Actualizar estado (implementar API)
    alert('Funcionalidad de activación en desarrollo');
  };

  const eliminarUsuario = async (tipo: 'cliente' | 'profesional', id: number) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    alert('Funcionalidad de eliminación en desarrollo');
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
        fontSize: "24px"
      }}>
        Cargando panel...
      </div>
    );
  }

  const stats = {
    totalClientes: clientes.length,
    totalProfesionales: profesionales.length,
    profesionalesActivos: profesionales.filter(p => p.estado === 'activo').length,
    profesionalesPendientes: profesionales.filter(p => p.estado === 'pendiente').length,
    totalCotizaciones: cotizaciones.length,
    cotizacionesPendientes: cotizaciones.filter(c => c.estado === 'pendiente').length,
    cotizacionesRespondidas: cotizaciones.filter(c => c.estado === 'respondida').length
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)",
      padding: "20px"
    }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          background: "rgba(0,0,0,0.7)",
          borderRadius: "24px",
          padding: "24px",
          marginBottom: "32px",
          border: "2px solid rgba(239,68,68,0.3)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div>
            <h1 style={{
              fontSize: "32px",
              fontWeight: "900",
              background: "linear-gradient(90deg, #ef4444, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: "0 0 8px 0"
            }}>
              Panel de Administración
            </h1>
            <p style={{ color: "#94a3b8", margin: 0 }}>
              Gestión completa de la plataforma
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <Link href="/">
              <button style={{
                padding: "12px 24px",
                borderRadius: "12px",
                border: "2px solid rgba(59,130,246,0.5)",
                background: "rgba(59,130,246,0.2)",
                color: "#60a5fa",
                fontWeight: "bold",
                cursor: "pointer"
              }}>
                🏠 Ir a Inicio
              </button>
            </Link>
            <button
              onClick={handleLogout}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                border: "2px solid rgba(239,68,68,0.5)",
                background: "rgba(239,68,68,0.2)",
                color: "#f87171",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "32px"
        }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(37,99,235,0.2))",
            border: "2px solid rgba(59,130,246,0.5)",
            borderRadius: "20px",
            padding: "24px"
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>👥</div>
            <div style={{ color: "white", fontSize: "32px", fontWeight: "900", marginBottom: "4px" }}>
              {stats.totalClientes}
            </div>
            <div style={{ color: "#94a3b8" }}>Total Clientes</div>
          </div>

          <div style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.2))",
            border: "2px solid rgba(16,185,129,0.5)",
            borderRadius: "20px",
            padding: "24px"
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚡</div>
            <div style={{ color: "white", fontSize: "32px", fontWeight: "900", marginBottom: "4px" }}>
              {stats.profesionalesActivos}
            </div>
            <div style={{ color: "#94a3b8" }}>Profesionales Activos</div>
          </div>

          <div style={{
            background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.2))",
            border: "2px solid rgba(245,158,11,0.5)",
            borderRadius: "20px",
            padding: "24px"
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>⏳</div>
            <div style={{ color: "white", fontSize: "32px", fontWeight: "900", marginBottom: "4px" }}>
              {stats.profesionalesPendientes}
            </div>
            <div style={{ color: "#94a3b8" }}>Pendientes Aprobación</div>
          </div>

          <div style={{
            background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(147,51,234,0.2))",
            border: "2px solid rgba(168,85,247,0.5)",
            borderRadius: "20px",
            padding: "24px"
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
            <div style={{ color: "white", fontSize: "32px", fontWeight: "900", marginBottom: "4px" }}>
              {stats.totalCotizaciones}
            </div>
            <div style={{ color: "#94a3b8" }}>Total Cotizaciones</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px",
          flexWrap: "wrap"
        }}>
          {['clientes', 'profesionales', 'cotizaciones'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                border: activeTab === tab ? "2px solid #3b82f6" : "2px solid rgba(148,163,184,0.3)",
                background: activeTab === tab ? "rgba(59,130,246,0.2)" : "rgba(0,0,0,0.5)",
                color: activeTab === tab ? "#60a5fa" : "#94a3b8",
                fontWeight: "bold",
                cursor: "pointer",
                textTransform: "capitalize"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div style={{
          background: "rgba(0,0,0,0.7)",
          borderRadius: "20px",
          padding: "32px",
          border: "2px solid rgba(148,163,184,0.2)"
        }}>
          {activeTab === 'clientes' && (
            <div>
              <h2 style={{ color: "white", fontSize: "24px", marginBottom: "24px" }}>
                Lista de Clientes ({stats.totalClientes})
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                {clientes.map(cliente => (
                  <div key={cliente.id} style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px"
                  }}>
                    <div>
                      <div style={{ color: "white", fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>
                        {cliente.nombreCompleto}
                      </div>
                      <div style={{ color: "#94a3b8", fontSize: "14px" }}>
                        {cliente.email} • {cliente.telefono}
                      </div>
                      <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>
                        Plan: <strong style={{ color: "#60a5fa" }}>{cliente.plan}</strong>
                      </div>
                    </div>
                    <div style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      background: "rgba(16,185,129,0.2)",
                      color: "#10b981",
                      fontSize: "13px",
                      fontWeight: "bold"
                    }}>
                      ✅ {cliente.estado}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profesionales' && (
            <div>
              <h2 style={{ color: "white", fontSize: "24px", marginBottom: "24px" }}>
                Lista de Profesionales ({stats.totalProfesionales})
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                {profesionales.map(prof => (
                  <div key={prof.id} style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px"
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "white", fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>
                        {prof.nombreCompleto}
                      </div>
                      <div style={{ color: "#94a3b8", fontSize: "14px" }}>
                        {prof.email} • {prof.telefono}
                      </div>
                      <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>
                        Especialidad: <strong>{prof.especialidad}</strong> • Plan: <strong style={{ color: "#60a5fa" }}>{prof.plan}</strong>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <div style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        background: prof.estado === 'activo' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                        color: prof.estado === 'activo' ? '#10b981' : '#f59e0b',
                        fontSize: "13px",
                        fontWeight: "bold"
                      }}>
                        {prof.estado === 'activo' ? '✅' : '⏳'} {prof.estado}
                      </div>
                      {prof.estado === 'pendiente' && (
                        <button
                          onClick={() => activarProfesional(prof.id)}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            background: "linear-gradient(90deg, #10b981, #059669)",
                            border: "none",
                            color: "white",
                            fontSize: "13px",
                            fontWeight: "bold",
                            cursor: "pointer"
                          }}
                        >
                          Activar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cotizaciones' && (
            <div>
              <h2 style={{ color: "white", fontSize: "24px", marginBottom: "24px" }}>
                Cotizaciones Recientes ({stats.totalCotizaciones})
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                {cotizaciones.slice(0, 20).map(cot => (
                  <div key={cot.id} style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "12px",
                    padding: "20px"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                      <div>
                        <div style={{ color: "#60a5fa", fontSize: "16px", fontWeight: "bold" }}>
                          {cot.id}
                        </div>
                        <div style={{ color: "white", fontSize: "14px", marginTop: "4px" }}>
                          Cliente: {cot.cliente.nombre}
                        </div>
                      </div>
                      <div style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        background: cot.estado === 'respondida' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                        color: cot.estado === 'respondida' ? '#10b981' : '#f59e0b',
                        fontSize: "13px",
                        fontWeight: "bold",
                        height: "fit-content"
                      }}>
                        {cot.estado}
                      </div>
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: "13px" }}>
                      Servicio: {cot.servicio.tipo} • {cot.servicio.descripcion.substring(0, 60)}...
                    </div>
                    {cot.respuestas && cot.respuestas.length > 0 && (
                      <div style={{ color: "#10b981", fontSize: "13px", marginTop: "8px" }}>
                        📨 {cot.respuestas.length} respuesta(s) recibida(s)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
