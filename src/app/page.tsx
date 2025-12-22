"use client";
import { useState, useEffect } from "react";
import OptimizedImage from '../components/ui/OptimizedImage';

const whatsappNumber = "56995748162";

// URL endpoint para iniciar pago con Webpay Plus
const urlPagos = "/api/webpay/crear-pago";

export default function HomePage() {
  const [vistaActual, setVistaActual] = useState("home");
  const [tipoUsuario, setTipoUsuario] = useState<"cliente" | "profesional" | null>(null);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string | null>(null);
  const [imagenAmpliada, setImagenAmpliada] = useState<{src: string, titulo: string} | null>(null);
  const [mostrarFormularioVisita, setMostrarFormularioVisita] = useState(false);
  const [visitasSolicitadas, setVisitasSolicitadas] = useState<Array<{id: number, nombre: string, telefono: string, direccion: string, servicio: string, fecha: string, estado: string}>>([]);
  const [galeriaPorCategoria, setGaleriaPorCategoria] = useState<Record<string, Array<{src: string, titulo: string}>>>({
    electricidad: [],
    carpinteria: [],
    otros: []
  });
  const [mostrarMensajePago, setMostrarMensajePago] = useState(false);

  // Verificar si hay parámetro de pago exitoso
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pagoExitoso = params.get('pago') === 'exitoso';
    
    if (pagoExitoso) {
      setMostrarMensajePago(true);
      // Limpiar la URL después de 1 segundo
      setTimeout(() => {
        window.history.replaceState({}, '', '/');
      }, 1000);
      // Ocultar mensaje después de 8 segundos
      setTimeout(() => {
        setMostrarMensajePago(false);
      }, 8000);
    }
  }, []);

  // Cargar galería automáticamente al iniciar
  useEffect(() => {
    fetch('/api/galeria')
      .then(res => res.json())
      .then(data => setGaleriaPorCategoria(data))
      .catch(err => console.error('Error al cargar galería:', err));
  }, []);

  const planesCliente = [
    { nombre: "Básico", precio: "Gratis", precioNumerico: 0, features: ["Solicitud de cotizaciones", "Hasta 3 profesionales", "Chat básico", "Soporte por email"], destacado: false },
    { nombre: "Premium", precio: "$14.990/mes", precioNumerico: 14990, features: ["Cotizaciones ilimitadas", "Acceso a todos los pro", "Chat prioritario", "Soporte 24/7", "Descuentos exclusivos"], destacado: true },
    { nombre: "Empresa", precio: "$29.990/mes", precioNumerico: 29990, features: ["Todo Premium +", "Múltiples proyectos", "Gestor dedicado", "Facturación mensual", "Descuentos corporativos"], destacado: false }
  ];

  const planesProfesional = [
    { nombre: "Starter", precio: "$14.990/mes", precioNumerico: 14990, features: ["Perfil verificado", "Hasta 10 leads/mes", "Comisión 15%", "Dashboard básico"], destacado: false },
    { nombre: "Pro", precio: "$29.990/mes", precioNumerico: 29990, features: ["Todo Starter +", "Leads ilimitados", "Comisión 10%", "Análisis avanzado", "Badge destacado"], destacado: true },
    { nombre: "Elite", precio: "$59.990/mes", precioNumerico: 59990, features: ["Todo Pro +", "Comisión 5%", "Prioridad máxima", "Marketing incluido", "Soporte premium"], destacado: false }
  ];

  const serviciosDestacados = [
    { nombre: "Electricidad", icono: "⚡", profesionales: 124, categoria: "electricidad" },
    { nombre: "Carpintería", icono: "🪚", profesionales: 89, categoria: "carpinteria" },
    { nombre: "Gasfitería", icono: "🔧", profesionales: 156, categoria: "gasfiteria" },
    { nombre: "Pintura", icono: "🎨", profesionales: 203, categoria: "pintura" },
    { nombre: "Soldadura", icono: "🔥", profesionales: 78, categoria: "soldadura" },
    { nombre: "Construcciones nuevas", icono: "🏗️", profesionales: 95, categoria: "construcciones" },
    { nombre: "Planos", icono: "📐", profesionales: 42, categoria: "planos" },
    { nombre: "Tramites SEC", icono: "📋", profesionales: 67, categoria: "tramites-sec" },
    { nombre: "Proyecto Fotovoltaico", icono: "☀️", profesionales: 53, categoria: "fotovoltaico" }
  ];

  const imagenesElectricidad = ["/galeria/Tablero Electrico.jpg", "/galeria/Iluminacion Pared tipo Rack.jpg"];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)',
      margin: 0,
      padding: 0
    }}>
      {/* NOTIFICACIÓN DE PAGO EXITOSO */}
      {mostrarMensajePago && (
        <div style={{
          position: 'fixed',
          top: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2000,
          maxWidth: '500px',
          width: '90%',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 20px 60px rgba(16,185,129,0.6)',
          animation: 'slideDown 0.5s ease-out',
          border: '2px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              flexShrink: 0
            }}>
              ✓
            </div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'white',
                margin: 0,
                marginBottom: '4px'
              }}>
                ¡Pago Exitoso!
              </p>
              <p style={{
                fontSize: '14px',
                color: '#d1fae5',
                margin: 0
              }}>
                Tu transacción se ha procesado correctamente
              </p>
            </div>
            <button
              onClick={() => setMostrarMensajePago(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>

      {/* TÍTULO PRINCIPAL - FIJO */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1001,
        padding: '20px',
        textAlign: 'center',
        background: 'rgba(0,0,0,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '3px solid rgba(6,182,212,0.5)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.7)'
      }}>
        <h1 onClick={() => setVistaActual("home")} style={{
          fontSize: '24px',
          fontWeight: '900',
          background: 'linear-gradient(90deg, #22d3ee, #3b82f6, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
          lineHeight: '1.3',
          cursor: 'pointer'
        }}>Ingenieria y Construcciones ELIENI spa</h1>
      </div>

      {/* NAVBAR - SCROLL NORMAL */}
      <nav style={{
        marginTop: '70px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(15,23,42,0.95) 50%, rgba(30,27,75,0.9) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
            <button onClick={() => setVistaActual("servicios")} style={{
              padding: '12px 24px',
              color: 'white',
              fontWeight: 'bold',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}>Servicios</button>
            <button onClick={() => setVistaActual("galeria")} style={{
              padding: '12px 24px',
              color: 'white',
              fontWeight: 'bold',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}>Proyectos</button>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <a href="/cotizacion">
              <button style={{
                padding: '16px 32px',
                background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                color: 'white',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(245,158,11,0.5)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                fontSize: '16px'
              }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                ⚡ Cotización Gratis
              </button>
            </a>

            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
              <button style={{
                padding: '14px 28px',
                background: 'linear-gradient(90deg, #10b981, #059669)',
                color: 'white',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(16,185,129,0.4)',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}>💬 WhatsApp</button>
            </a>

            <a href="mailto:yfuelaluz@gmail.com" target="_blank" rel="noopener noreferrer">
              <button style={{
                padding: '14px 28px',
                background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
                color: 'white',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(59,130,246,0.4)',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}>📧 Email</button>
            </a>

            <button onClick={() => setVistaActual("visitas")} style={{
              padding: '14px 28px',
              background: 'linear-gradient(90deg, #f59e0b, #d97706)',
              color: 'white',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(245,158,11,0.4)',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}>🔧 Visita Técnica</button>
          </div>
        </div>
      </nav>

      <main style={{paddingTop: '20px'}}>
        {/* HOME */}
        {vistaActual === "home" && (
          <div style={{
            minHeight: 'calc(100vh - 280px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px'
          }}>
            <div style={{maxWidth: '1400px', width: '100%'}}>
              <div style={{textAlign: 'center', marginBottom: 'clamp(60px, 12vw, 100px)', padding: '0 20px'}}>
                <h1 style={{
                  fontSize: 'clamp(28px, 7vw, 80px)',
                  fontWeight: '900',
                  marginBottom: 'clamp(30px, 8vw, 50px)',
                  lineHeight: '1.1'
                }}>
                  <div style={{color: 'white'}}>¿QUÉ</div>
                  <div style={{
                    background: 'linear-gradient(90deg, #22d3ee, #14b8a6, #3b82f6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>NECESITAS?</div>
                </h1>
                <p style={{
                  fontSize: 'clamp(13px, 3.5vw, 20px)',
                  color: '#cbd5e1',
                  fontWeight: '500',
                  padding: '0 16px'
                }}>Conectamos profesionales con clientes en toda la V Región</p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 16px'
              }}>
                {/* CLIENTE */}
                <div style={{
                  position: 'relative',
                  background: 'linear-gradient(135deg, #1e293b 0%, #000 100%)',
                  border: '4px solid rgba(6,182,212,0.5)',
                  borderRadius: '24px',
                  padding: 'clamp(24px, 5vw, 48px)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 20px 60px rgba(6,182,212,0.3)'
                }}>
                  <div style={{fontSize: 'clamp(60px, 15vw, 100px)', marginBottom: '16px', filter: 'drop-shadow(0 0 20px rgba(6,182,212,0.8))', textAlign: 'center'}}>🏠</div>
                  <h2 style={{
                    fontSize: 'clamp(24px, 6vw, 40px)',
                    fontWeight: '900',
                    color: 'white',
                    marginBottom: '12px',
                    textAlign: 'center',
                    lineHeight: '1.2'
                  }}>BUSCO SERVICIO</h2>
                  <p style={{
                    fontSize: 'clamp(14px, 3.5vw, 18px)',
                    color: '#cbd5e1',
                    marginBottom: '24px',
                    textAlign: 'center'
                  }}>Encuentra profesionales verificados para tu proyecto</p>
                  
                  <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                    <div onClick={() => { setTipoUsuario("cliente"); setVistaActual("servicios"); }} style={{
                      padding: '20px 32px',
                      background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                      borderRadius: '16px',
                      color: 'white',
                      fontWeight: '900',
                      fontSize: '20px',
                      textAlign: 'center',
                      boxShadow: '0 10px 40px rgba(6,182,212,0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }} onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 15px 50px rgba(6,182,212,0.7)';
                    }} onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(6,182,212,0.5)';
                    }}>
                      VER PROFESIONALES →
                    </div>
                    
                    <div onClick={() => { setTipoUsuario("cliente"); setVistaActual("cliente"); }} style={{
                      padding: '20px 32px',
                      background: 'rgba(6,182,212,0.1)',
                      border: '2px solid #06b6d4',
                      borderRadius: '16px',
                      color: '#06b6d4',
                      fontWeight: '900',
                      fontSize: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }} onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(6,182,212,0.2)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }} onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(6,182,212,0.1)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}>
                      VER PLANES DE SUSCRIPCIÓN
                    </div>
                  </div>
                </div>

                {/* VISITA TÉCNICA */}
                <div style={{
                  position: 'relative',
                  background: 'linear-gradient(135deg, #1e293b 0%, #000 100%)',
                  border: '4px solid rgba(245,158,11,0.5)',
                  borderRadius: '24px',
                  padding: 'clamp(24px, 5vw, 48px)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 20px 60px rgba(245,158,11,0.3)'
                }} onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 30px 80px rgba(245,158,11,0.6)';
                }} onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(245,158,11,0.3)';
                }}>
                  <div style={{fontSize: 'clamp(60px, 15vw, 100px)', marginBottom: '16px', filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.8))', textAlign: 'center'}}>🔧</div>
                  <h2 style={{
                    fontSize: 'clamp(24px, 6vw, 40px)',
                    fontWeight: '900',
                    color: 'white',
                    marginBottom: '12px',
                    textAlign: 'center',
                    lineHeight: '1.2'
                  }}>VISITA TÉCNICA</h2>
                  <p style={{
                    fontSize: 'clamp(14px, 3.5vw, 18px)',
                    color: '#cbd5e1',
                    marginBottom: '24px',
                    textAlign: 'center'
                  }}>Agenda una evaluación profesional - $60.000</p>
                  
                  <div onClick={() => { setVistaActual("servicios-visita"); }} style={{
                    padding: 'clamp(16px, 4vw, 20px) clamp(24px, 6vw, 32px)',
                    background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                    borderRadius: '16px',
                    color: 'white',
                    fontWeight: '900',
                    fontSize: 'clamp(16px, 4vw, 20px)',
                    textAlign: 'center',
                    boxShadow: '0 10px 40px rgba(245,158,11,0.5)',
                    transition: 'all 0.3s'
                  }} onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 15px 50px rgba(245,158,11,0.7)';
                  }} onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(245,158,11,0.5)';
                  }}>
                    SOLICITAR VISITA →
                  </div>
                </div>

                {/* PROFESIONAL */}
                <div onClick={() => { setTipoUsuario("profesional"); setVistaActual("profesional"); }} style={{
                  position: 'relative',
                  background: 'linear-gradient(135deg, #1e293b 0%, #000 100%)',
                  border: '4px solid rgba(217,70,239,0.5)',
                  borderRadius: '24px',
                  padding: 'clamp(24px, 5vw, 48px)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 20px 60px rgba(217,70,239,0.3)'
                }} onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.05) rotate(1deg)';
                  e.currentTarget.style.boxShadow = '0 30px 80px rgba(217,70,239,0.6)';
                }} onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(217,70,239,0.3)';
                }}>
                  <div style={{fontSize: 'clamp(60px, 15vw, 100px)', marginBottom: '16px', filter: 'drop-shadow(0 0 20px rgba(217,70,239,0.8))'}}>⚡</div>
                  <h2 style={{
                    fontSize: 'clamp(24px, 6vw, 40px)',
                    fontWeight: '900',
                    color: 'white',
                    marginBottom: '12px',
                    lineHeight: '1.2'
                  }}>SOY PROFESIONAL</h2>
                  <p style={{
                    fontSize: 'clamp(14px, 3.5vw, 18px)',
                    color: '#cbd5e1',
                    marginBottom: '24px'
                  }}>Consigue clientes y haz crecer tu negocio</p>
                  <div style={{
                    padding: 'clamp(16px, 4vw, 20px) clamp(24px, 6vw, 32px)',
                    background: 'linear-gradient(90deg, #d946ef, #ec4899)',
                    borderRadius: '16px',
                    color: 'white',
                    fontWeight: '900',
                    fontSize: 'clamp(16px, 4vw, 20px)',
                    textAlign: 'center',
                    boxShadow: '0 10px 40px rgba(217,70,239,0.5)'
                  }}>
                    REGISTRARME →
                  </div>
                </div>
              </div>

              {/* STATS */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '16px',
                maxWidth: '800px',
                margin: '60px auto 0',
                padding: '0 16px'
              }}>
                {[
                  { numero: "500+", label: "Profesionales", icono: "👷" },
                  { numero: "2.5K+", label: "Proyectos", icono: "🏗️" },
                  { numero: "98%", label: "Satisfacción", icono: "⭐" }
                ].map((stat, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(0,0,0,0.8)',
                    border: '2px solid rgba(6,182,212,0.3)',
                    borderRadius: '16px',
                    padding: '20px 12px',
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(6,182,212,0.2)'
                  }}>
                    <div style={{fontSize: '32px', marginBottom: '8px'}}>{stat.icono}</div>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '900',
                      background: 'linear-gradient(90deg, #22d3ee, #14b8a6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      marginBottom: '4px'
                    }}>{stat.numero}</div>
                    <div style={{color: '#cbd5e1', fontWeight: 'bold', fontSize: '13px'}}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* WHATSAPP Y EMAIL DEBAJO DE STATS */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
                marginTop: '40px',
                flexWrap: 'wrap',
                padding: '0 16px'
              }}>
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                  <button style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'linear-gradient(90deg, #10b981, #059669)',
                    padding: '14px 28px',
                    borderRadius: '50px',
                    border: '3px solid rgba(16,185,129,0.5)',
                    color: 'white',
                    fontWeight: '900',
                    fontSize: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 40px rgba(16,185,129,0.5)',
                    transition: 'all 0.3s'
                  }} onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 15px 50px rgba(16,185,129,0.7)';
                  }} onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(16,185,129,0.5)';
                  }}>
                    <span style={{fontSize: '24px'}}>💬</span>
                    <span>CHAT</span>
                  </button>
                </a>

                <a href="mailto:yfuelaluz@gmail.com" target="_blank" rel="noopener noreferrer">
                  <button style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
                    padding: '14px 28px',
                    borderRadius: '50px',
                    border: '3px solid rgba(59,130,246,0.5)',
                    color: 'white',
                    fontWeight: '900',
                    fontSize: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 40px rgba(59,130,246,0.5)',
                    transition: 'all 0.3s'
                  }} onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 15px 50px rgba(59,130,246,0.7)';
                  }} onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(59,130,246,0.5)';
                  }}>
                    <span style={{fontSize: '24px'}}>📧</span>
                    <span>EMAIL</span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* PLANES CLIENTE */}
        {vistaActual === "cliente" && (
          <div style={{paddingTop: '220px', padding: '220px 20px 80px 20px'}}>
            <div style={{maxWidth: '1200px', margin: '0 auto'}}>
              <button onClick={() => setVistaActual("home")} style={{
                marginBottom: '40px',
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>← Volver</button>

              <div style={{textAlign: 'center', marginBottom: '64px', padding: '0 16px'}}>
                <h2 style={{
                  fontSize: 'clamp(20px, 5vw, 64px)',
                  fontWeight: '900',
                  color: 'white',
                  marginBottom: '16px',
                  lineHeight: '1.2'
                }}>PLANES DE SUSCRIPCIÓN PARA <span style={{
                  background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>CLIENTES</span></h2>
                <p style={{fontSize: 'clamp(14px, 4vw, 24px)', color: '#cbd5e1'}}>Elige el plan perfecto para tus proyectos</p>
                <p style={{fontSize: 'clamp(12px, 3.5vw, 18px)', color: '#22d3ee', marginTop: '12px', fontWeight: 'bold'}}>
                  Accede a nuestra red de profesionales verificados
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '32px'
              }}>
                {planesCliente.map((plan, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(0,0,0,0.9)',
                    border: plan.destacado ? '4px solid #22d3ee' : '2px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px',
                    padding: '32px',
                    transform: plan.destacado ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: plan.destacado ? '0 20px 60px rgba(34,211,238,0.4)' : '0 10px 30px rgba(0,0,0,0.5)'
                  }}>
                    {plan.destacado && (
                      <div style={{
                        background: 'linear-gradient(90deg, #22d3ee, #14b8a6)',
                        color: 'black',
                        fontWeight: 'bold',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        textAlign: 'center',
                        marginBottom: '16px'
                      }}>MÁS POPULAR</div>
                    )}
                    <h3 style={{fontSize: '32px', fontWeight: '900', color: 'white', marginBottom: '8px'}}>{plan.nombre}</h3>
                    <div style={{
                      fontSize: '48px',
                      fontWeight: '900',
                      background: 'linear-gradient(90deg, #22d3ee, #14b8a6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      marginBottom: '24px'
                    }}>{plan.precio}</div>
                    <ul style={{listStyle: 'none', padding: 0, marginBottom: '32px'}}>
                      {plan.features.map((feature, i) => (
                        <li key={i} style={{
                          display: 'flex',
                          gap: '12px',
                          color: '#cbd5e1',
                          marginBottom: '12px',
                          fontSize: '16px'
                        }}>
                          <span style={{color: '#22d3ee', fontSize: '20px'}}>✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {plan.precioNumerico === 0 ? (
                      <button style={{
                        width: '100%',
                        padding: '16px',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        fontWeight: '900',
                        fontSize: '18px',
                        cursor: 'pointer'
                      }}>COMENZAR GRATIS</button>
                    ) : (
                      <a href={`${urlPagos}?plan=cliente-${plan.nombre.toLowerCase()}&monto=${plan.precioNumerico}&descripcion=Plan ${plan.nombre} Cliente`} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                        <button style={{
                          width: '100%',
                          padding: '16px',
                          background: plan.destacado ? 'linear-gradient(90deg, #22d3ee, #14b8a6)' : 'rgba(255,255,255,0.1)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '16px',
                          fontWeight: '900',
                          fontSize: '18px',
                          cursor: 'pointer',
                          boxShadow: plan.destacado ? '0 10px 30px rgba(34,211,238,0.4)' : 'none',
                          transition: 'all 0.3s'
                        }} onMouseEnter={e => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }} onMouseLeave={e => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}>💳 PAGAR {plan.precio}</button>
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {/* TESTIMONIOS DE CLIENTES */}
              <div style={{marginTop: '80px', padding: '0 16px'}}>
                <h3 style={{
                  fontSize: 'clamp(20px, 5vw, 48px)',
                  fontWeight: '900',
                  color: 'white',
                  marginBottom: '48px',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>LO QUE DICEN NUESTROS <span style={{
                  background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>CLIENTES</span></h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px'
                }}>
                  {[
                    { nombre: "Roberto Jiménez", plan: "Premium", rating: 5, testimonio: "Excelente plataforma. Encontré electricistas certificados en menos de 24 horas. Todo transparente y profesional." },
                    { nombre: "Patricia Valdés", plan: "Empresa", rating: 5, testimonio: "Gestiono varios proyectos simultáneamente. El plan empresa me ha ahorrado tiempo y dinero. Muy recomendado." },
                    { nombre: "Diego Morales", plan: "Básico", rating: 4, testimonio: "Como cliente nuevo, el plan básico me permitió probar el servicio. Ya estoy considerando el upgrade a Premium." }
                  ].map((test, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(0,0,0,0.6)',
                      border: '2px solid rgba(34,211,238,0.2)',
                      borderRadius: '16px',
                      padding: '24px'
                    }}>
                      <div style={{
                        display: 'flex',
                        gap: '4px',
                        marginBottom: '12px'
                      }}>
                        {[1,2,3,4,5].map(star => (
                          <span key={star} style={{
                            fontSize: '20px',
                            color: star <= test.rating ? '#fbbf24' : '#4b5563'
                          }}>★</span>
                        ))}
                      </div>
                      <p style={{
                        color: '#cbd5e1',
                        fontSize: '16px',
                        marginBottom: '16px',
                        lineHeight: '1.6'
                      }}>"{test.testimonio}"</p>
                      <div>
                        <p style={{
                          color: 'white',
                          fontWeight: 'bold',
                          marginBottom: '4px'
                        }}>{test.nombre}</p>
                        <p style={{
                          color: '#22d3ee',
                          fontSize: '14px'
                        }}>Plan {test.plan}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PLANES PROFESIONAL */}
        {vistaActual === "profesional" && (
          <div style={{paddingTop: '220px', padding: '220px 20px 80px 20px'}}>
            <div style={{maxWidth: '1200px', margin: '0 auto'}}>
              <button onClick={() => setVistaActual("home")} style={{
                marginBottom: '40px',
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>← Volver</button>

              <div style={{textAlign: 'center', marginBottom: '64px', padding: '0 16px'}}>
                <h2 style={{
                  fontSize: 'clamp(20px, 5vw, 64px)',
                  fontWeight: '900',
                  color: 'white',
                  marginBottom: '16px',
                  lineHeight: '1.2'
                }}>PLANES DE SUSCRIPCIÓN PARA <span style={{
                  background: 'linear-gradient(90deg, #14b8a6, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>PROFESIONALES</span></h2>
                <p style={{fontSize: 'clamp(14px, 4vw, 24px)', color: '#cbd5e1'}}>Haz crecer tu negocio con más clientes</p>
                <p style={{fontSize: 'clamp(12px, 3.5vw, 18px)', color: '#14b8a6', marginTop: '12px', fontWeight: 'bold'}}>
                  Recibe solicitudes directas de clientes en tu área
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '32px'
              }}>
                {planesProfesional.map((plan, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(0,0,0,0.9)',
                    border: plan.destacado ? '4px solid #14b8a6' : '2px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px',
                    padding: '32px',
                    transform: plan.destacado ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: plan.destacado ? '0 20px 60px rgba(20,184,166,0.4)' : '0 10px 30px rgba(0,0,0,0.5)'
                  }}>
                    {plan.destacado && (
                      <div style={{
                        background: 'linear-gradient(90deg, #14b8a6, #22d3ee)',
                        color: 'black',
                        fontWeight: 'bold',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        textAlign: 'center',
                        marginBottom: '16px'
                      }}>RECOMENDADO</div>
                    )}
                    <h3 style={{fontSize: '32px', fontWeight: '900', color: 'white', marginBottom: '8px'}}>{plan.nombre}</h3>
                    <div style={{
                      fontSize: '48px',
                      fontWeight: '900',
                      background: 'linear-gradient(90deg, #14b8a6, #22d3ee)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      marginBottom: '24px'
                    }}>{plan.precio}</div>
                    <ul style={{listStyle: 'none', padding: 0, marginBottom: '32px'}}>
                      {plan.features.map((feature, i) => (
                        <li key={i} style={{
                          display: 'flex',
                          gap: '12px',
                          color: '#cbd5e1',
                          marginBottom: '12px',
                          fontSize: '16px'
                        }}>
                          <span style={{color: '#14b8a6', fontSize: '20px'}}>✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <a href={`${urlPagos}?plan=profesional-${plan.nombre.toLowerCase()}&monto=${plan.precioNumerico}&descripcion=Plan ${plan.nombre} Profesional`} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                      <button style={{
                        width: '100%',
                        padding: '16px',
                        background: plan.destacado ? 'linear-gradient(90deg, #14b8a6, #22d3ee)' : 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        fontWeight: '900',
                        fontSize: '18px',
                        cursor: 'pointer',
                        boxShadow: plan.destacado ? '0 10px 30px rgba(20,184,166,0.4)' : 'none',
                        transition: 'all 0.3s'
                      }} onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }} onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}>💳 PAGAR {plan.precio}</button>
                    </a>
                  </div>
                ))}
              </div>

              {/* TESTIMONIOS DE PROFESIONALES */}
              <div style={{marginTop: '80px', padding: '0 16px'}}>
                <h3 style={{
                  fontSize: 'clamp(20px, 5vw, 48px)',
                  fontWeight: '900',
                  color: 'white',
                  marginBottom: '48px',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>LO QUE DICEN NUESTROS <span style={{
                  background: 'linear-gradient(90deg, #14b8a6, #22d3ee)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>PROFESIONALES</span></h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px'
                }}>
                  {[
                    { nombre: "Felipe Castro", profesion: "Electricista", plan: "Pro", rating: 5, testimonio: "Desde que me suscribí al plan Pro, mis ingresos aumentaron un 60%. Los clientes llegan directamente, sin intermediarios." },
                    { nombre: "Carmen Soto", profesion: "Carpintera", plan: "Elite", rating: 5, testimonio: "El plan Elite vale cada peso. Las herramientas de marketing y la prioridad en las búsquedas me dan ventaja competitiva." },
                    { nombre: "Andrés Bravo", profesion: "Gasfiter", plan: "Starter", rating: 4, testimonio: "Comencé con Starter hace 3 meses. Ya conseguí 15 clientes nuevos. Próximo mes subo a Pro sin dudarlo." }
                  ].map((test, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(0,0,0,0.6)',
                      border: '2px solid rgba(20,184,166,0.2)',
                      borderRadius: '16px',
                      padding: '24px'
                    }}>
                      <div style={{
                        display: 'flex',
                        gap: '4px',
                        marginBottom: '12px'
                      }}>
                        {[1,2,3,4,5].map(star => (
                          <span key={star} style={{
                            fontSize: '20px',
                            color: star <= test.rating ? '#fbbf24' : '#4b5563'
                          }}>★</span>
                        ))}
                      </div>
                      <p style={{
                        color: '#cbd5e1',
                        fontSize: '16px',
                        marginBottom: '16px',
                        lineHeight: '1.6'
                      }}>"{test.testimonio}"</p>
                      <div>
                        <p style={{
                          color: 'white',
                          fontWeight: 'bold',
                          marginBottom: '4px'
                        }}>{test.nombre}</p>
                        <p style={{
                          color: '#14b8a6',
                          fontSize: '14px'
                        }}>{test.profesion} - Plan {test.plan}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SERVICIOS PARA VISITA TÉCNICA */}
        {vistaActual === "servicios-visita" && (
          <div style={{paddingTop: '220px', padding: '220px 20px 80px 20px'}}>
            <div style={{maxWidth: '1200px', margin: '0 auto'}}>
              <button onClick={() => setVistaActual("home")} style={{
                marginBottom: '40px',
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>← Volver</button>

              <div style={{textAlign: 'center', marginBottom: '64px', padding: '0 16px'}}>
                <h2 style={{
                  fontSize: 'clamp(18px, 5vw, 64px)',
                  fontWeight: '900',
                  color: 'white',
                  marginBottom: '16px',
                  lineHeight: '1.1'
                }}>ELIGE LA <span style={{
                  background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>ESPECIALIDAD</span></h2>
                <p style={{fontSize: 'clamp(14px, 4vw, 24px)', color: '#cbd5e1'}}>Selecciona el tipo de visita técnica que necesitas</p>
                <p style={{fontSize: 'clamp(12px, 3.5vw, 18px)', color: '#f59e0b', marginTop: '12px', fontWeight: 'bold'}}>
                  Valor de la visita: $60.000
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px'
              }}>
                {serviciosDestacados.map((servicio, idx) => (
                  <div key={idx} onClick={() => {
                    setServicioSeleccionado(servicio.categoria);
                    setVistaActual("visitas");
                    setMostrarFormularioVisita(true);
                  }} style={{
                    background: 'rgba(0,0,0,0.8)',
                    border: '2px solid rgba(245,158,11,0.3)',
                    borderRadius: '24px',
                    padding: '32px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }} onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.1) rotate(-2deg)';
                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(245,158,11,0.5)';
                    e.currentTarget.style.borderColor = '#f59e0b';
                  }} onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
                    e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)';
                  }}>
                    <div style={{fontSize: '80px', marginBottom: '16px'}}>{servicio.icono}</div>
                    <h3 style={{fontSize: '28px', fontWeight: '900', color: 'white', marginBottom: '8px'}}>{servicio.nombre}</h3>
                    <p style={{color: '#f59e0b', fontWeight: 'bold'}}>Visita Técnica</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SERVICIOS */}
        {vistaActual === "servicios" && (
          <div style={{paddingTop: '220px', padding: '220px 20px 80px 20px'}}>
            <div style={{maxWidth: '1200px', margin: '0 auto'}}>
              <button onClick={() => setVistaActual("home")} style={{
                marginBottom: '40px',
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>← Volver</button>

              <div style={{textAlign: 'center', marginBottom: '64px', padding: '0 16px'}}>
                <h2 style={{
                  fontSize: 'clamp(18px, 5vw, 64px)',
                  fontWeight: '900',
                  color: 'white',
                  marginBottom: '16px',
                  lineHeight: '1.1'
                }}>SERVICIOS <span style={{
                  background: 'linear-gradient(90deg, #22d3ee, #14b8a6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>DISPONIBLES</span></h2>
                <p style={{fontSize: 'clamp(14px, 4vw, 24px)', color: '#cbd5e1'}}>Encuentra al profesional perfecto</p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px'
              }}>
                {serviciosDestacados.map((servicio, idx) => (
                  <div key={idx} onClick={() => {
                    setServicioSeleccionado(servicio.categoria);
                    setVistaActual("profesionales");
                  }} style={{
                    background: 'rgba(0,0,0,0.8)',
                    border: '2px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px',
                    padding: '32px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }} onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.1) rotate(-2deg)';
                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(34,211,238,0.5)';
                    e.currentTarget.style.borderColor = '#22d3ee';
                  }} onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  }}>
                    <div style={{fontSize: '80px', marginBottom: '16px'}}>{servicio.icono}</div>
                    <h3 style={{fontSize: '28px', fontWeight: '900', color: 'white', marginBottom: '8px'}}>{servicio.nombre}</h3>
                    <p style={{color: '#22d3ee', fontWeight: 'bold'}}>{servicio.profesionales} profesionales</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GALERÍA */}
        {vistaActual === "galeria" && (
          <div style={{paddingTop: '220px', padding: '220px 20px 80px 20px'}}>
            <div style={{maxWidth: '1400px', margin: '0 auto'}}>
              <button onClick={() => setVistaActual("home")} style={{
                marginBottom: '40px',
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>← Volver</button>

              <div style={{textAlign: 'center', marginBottom: '64px', padding: '0 16px'}}>
                <h2 style={{
                  fontSize: 'clamp(24px, 6vw, 64px)',
                  fontWeight: '900',
                  color: 'white',
                  lineHeight: '1.2'
                }}>PROYECTOS <span style={{
                  background: 'linear-gradient(90deg, #22d3ee, #14b8a6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>REALIZADOS</span></h2>
              </div>

              {/* ELECTRICIDAD */}
              <div style={{marginBottom: '60px'}}>
                <h3 style={{
                  fontSize: '40px',
                  fontWeight: '900',
                  color: '#22d3ee',
                  marginBottom: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <span style={{fontSize: '48px'}}>⚡</span>
                  Electricidad
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '32px'
                }}>
                  {galeriaPorCategoria.electricidad.map((item, idx) => (
                    <div key={idx} style={{
                      borderRadius: '24px',
                      overflow: 'hidden',
                      border: '4px solid rgba(34,211,238,0.3)',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                      transition: 'all 0.3s',
                      background: 'rgba(0,0,0,0.7)',
                      cursor: 'pointer'
                    }} onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.05) rotate(1deg)';
                      e.currentTarget.style.boxShadow = '0 20px 60px rgba(34,211,238,0.6)';
                    }} onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';
                    }} onClick={() => setImagenAmpliada(item)}>
                      <div style={{position: 'relative', width: '100%', height: '400px'}}>
                        <OptimizedImage original={item.src} alt={item.titulo} className="object-cover" sizes="33vw" />
                      </div>
                      <div style={{
                        padding: '16px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.5))',
                        color: 'white'
                      }}>
                        <h4 style={{
                          margin: 0,
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#22d3ee'
                        }}>{item.titulo}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARPINTERÍA */}
              <div>
                <h3 style={{
                  fontSize: '40px',
                  fontWeight: '900',
                  color: '#f59e0b',
                  marginBottom: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <span style={{fontSize: '48px'}}>🪚</span>
                  Carpintería
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '32px'
                }}>
                  {galeriaPorCategoria.carpinteria.map((item, idx) => (
                    <div key={idx} style={{
                      borderRadius: '24px',
                      overflow: 'hidden',
                      border: '4px solid rgba(245,158,11,0.3)',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                      transition: 'all 0.3s',
                      background: 'rgba(0,0,0,0.7)',
                      cursor: 'pointer'
                    }} onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.05) rotate(-1deg)';
                      e.currentTarget.style.boxShadow = '0 20px 60px rgba(245,158,11,0.6)';
                    }} onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';
                    }} onClick={() => setImagenAmpliada(item)}>
                      <div style={{position: 'relative', width: '100%', height: '400px'}}>
                        <OptimizedImage original={item.src} alt={item.titulo} className="object-cover" sizes="33vw" />
                      </div>
                      <div style={{
                        padding: '16px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.5))',
                        color: 'white'
                      }}>
                        <h4 style={{
                          margin: 0,
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#f59e0b'
                        }}>{item.titulo}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROFESIONALES POR SERVICIO */}
        {vistaActual === "profesionales" && servicioSeleccionado && (
          <div style={{paddingTop: '220px', padding: '220px 20px 80px 20px'}}>
            <div style={{maxWidth: '1200px', margin: '0 auto'}}>
              <button onClick={() => setVistaActual("servicios")} style={{
                marginBottom: '40px',
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>← Volver a Servicios</button>

              <div style={{textAlign: 'center', marginBottom: '64px', padding: '0 16px'}}>
                <h2 style={{
                  fontSize: 'clamp(24px, 6vw, 64px)',
                  fontWeight: '900',
                  color: 'white',
                  marginBottom: '16px',
                  lineHeight: '1.2'
                }}>PROFESIONALES DE <span style={{
                  background: 'linear-gradient(90deg, #22d3ee, #14b8a6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textTransform: 'uppercase'
                }}>{serviciosDestacados.find(s => s.categoria === servicioSeleccionado)?.nombre}</span></h2>
                <p style={{fontSize: 'clamp(14px, 4vw, 24px)', color: '#cbd5e1'}}>
                  {serviciosDestacados.find(s => s.categoria === servicioSeleccionado)?.profesionales} profesionales disponibles
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '32px'
              }}>
                {/* EJEMPLO DE PROFESIONALES - Aquí se cargarán desde la base de datos */}
                {[
                  { id: 1, nombre: "Juan Pérez", rating: 4.8, reviews: 42, trabajos: 156 },
                  { id: 2, nombre: "María González", rating: 4.9, reviews: 38, trabajos: 128 },
                  { id: 3, nombre: "Carlos Silva", rating: 4.7, reviews: 29, trabajos: 94 },
                  { id: 4, nombre: "Ana Torres", rating: 4.6, reviews: 24, trabajos: 87 },
                  { id: 5, nombre: "Pedro Ramírez", rating: 4.9, reviews: 51, trabajos: 203 },
                  { id: 6, nombre: "Laura Fernández", rating: 4.8, reviews: 33, trabajos: 112 }
                ].map((prof) => (
                  <div key={prof.id} style={{
                    background: 'rgba(0,0,0,0.8)',
                    border: '2px solid rgba(34,211,238,0.3)',
                    borderRadius: '24px',
                    padding: '32px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }} onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(34,211,238,0.5)';
                    e.currentTarget.style.borderColor = '#22d3ee';
                  }} onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
                    e.currentTarget.style.borderColor = 'rgba(34,211,238,0.3)';
                  }}>
                    <div style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
                      margin: '0 auto 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px'
                    }}>👷</div>
                    <h3 style={{
                      fontSize: '24px',
                      fontWeight: '900',
                      color: 'white',
                      marginBottom: '12px',
                      textAlign: 'center'
                    }}>{prof.nombre}</h3>
                    <p style={{
                      color: '#cbd5e1',
                      marginBottom: '16px',
                      textAlign: 'center',
                      fontSize: '14px'
                    }}>Especialista verificado en {serviciosDestacados.find(s => s.categoria === servicioSeleccionado)?.nombre}</p>
                    
                    {/* VALORACIÓN */}
                    <div style={{
                      background: 'rgba(34,211,238,0.1)',
                      border: '1px solid rgba(34,211,238,0.3)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        marginBottom: '12px'
                      }}>
                        <span style={{fontSize: '32px'}}>⭐</span>
                        <span style={{
                          color: 'white',
                          fontWeight: '900',
                          fontSize: '28px'
                        }}>{prof.rating}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '4px',
                        justifyContent: 'center',
                        marginBottom: '8px'
                      }}>
                        {[1,2,3,4,5].map(star => (
                          <span key={star} style={{
                            fontSize: '20px',
                            color: star <= Math.round(prof.rating) ? '#fbbf24' : '#4b5563'
                          }}>★</span>
                        ))}
                      </div>
                      <p style={{
                        color: '#9ca3af',
                        fontSize: '14px',
                        textAlign: 'center',
                        marginBottom: '8px'
                      }}>{prof.reviews} valoraciones de clientes</p>
                      <p style={{
                        color: '#22d3ee',
                        fontSize: '14px',
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}>{prof.trabajos} trabajos completados</p>
                    </div>

                    <button style={{
                      width: '100%',
                      padding: '14px',
                      background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '900',
                      fontSize: '16px',
                      cursor: 'pointer',
                      boxShadow: '0 8px 20px rgba(34,211,238,0.4)'
                    }}>VER PERFIL Y VALORACIONES</button>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '64px',
                textAlign: 'center',
                padding: '48px',
                background: 'rgba(34,211,238,0.1)',
                border: '2px solid rgba(34,211,238,0.3)',
                borderRadius: '24px'
              }}>
                <h3 style={{
                  fontSize: '32px',
                  fontWeight: '900',
                  color: 'white',
                  marginBottom: '16px'
                }}>¿Eres profesional de {serviciosDestacados.find(s => s.categoria === servicioSeleccionado)?.nombre}?</h3>
                <p style={{
                  fontSize: '18px',
                  color: '#cbd5e1',
                  marginBottom: '24px'
                }}>Únete a nuestra plataforma y consigue más clientes</p>
                <button onClick={() => setVistaActual("profesional")} style={{
                  padding: '16px 48px',
                  background: 'linear-gradient(90deg, #d946ef, #ec4899)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  fontWeight: '900',
                  fontSize: '20px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 40px rgba(217,70,239,0.5)'
                }}>REGISTRARME COMO PROFESIONAL</button>
              </div>
            </div>
          </div>
        )}

        {/* VISITAS TÉCNICAS */}
        {vistaActual === "visitas" && (
          <div style={{minHeight: '100vh', paddingTop: '220px', padding: '220px 20px 80px 20px'}}>
            <div style={{maxWidth: '1200px', margin: '0 auto'}}>
              <button onClick={() => setVistaActual("home")} style={{
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.1)',
                border: '2px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '40px'
              }}>← Volver</button>

              <div style={{textAlign: 'center', marginBottom: '64px'}}>
                <h2 style={{
                  fontSize: 'clamp(24px, 6vw, 64px)',
                  fontWeight: '900',
                  color: 'white',
                  marginBottom: '16px',
                  lineHeight: '1.1'
                }}>SOLICITAR <span style={{
                  background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>VISITA TÉCNICA</span></h2>
                <p style={{fontSize: 'clamp(14px, 4vw, 20px)', color: '#cbd5e1'}}>
                  Agenda una visita profesional - Valor: $60.000
                </p>
              </div>

              {!mostrarFormularioVisita ? (
                <div style={{textAlign: 'center', marginBottom: '80px'}}>
                  <button onClick={() => setMostrarFormularioVisita(true)} style={{
                    padding: '20px 40px',
                    background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '20px',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(245,158,11,0.4)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                     onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                    🔧 Nueva Solicitud de Visita
                  </button>
                </div>
              ) : (
                <div style={{
                  background: 'rgba(0,0,0,0.8)',
                  border: '2px solid rgba(245,158,11,0.3)',
                  borderRadius: '24px',
                  padding: 'clamp(24px, 5vw, 48px)',
                  marginBottom: '60px'
                }}>
                  <h3 style={{fontSize: '32px', color: 'white', marginBottom: '32px', fontWeight: '900'}}>
                    Datos de la Visita
                  </h3>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const nuevaVisita = {
                      id: Date.now(),
                      nombre: formData.get('nombre') as string,
                      telefono: formData.get('telefono') as string,
                      direccion: formData.get('direccion') as string,
                      servicio: formData.get('servicio') as string,
                      fecha: formData.get('fecha') as string,
                      estado: 'Pendiente'
                    };
                    setVisitasSolicitadas([...visitasSolicitadas, nuevaVisita]);
                    setMostrarFormularioVisita(false);
                    
                    // Enviar notificación por WhatsApp
                    const mensaje = `🔧 *NUEVA VISITA TÉCNICA SOLICITADA*%0A%0A` +
                      `👤 *Nombre:* ${nuevaVisita.nombre}%0A` +
                      `📱 *Teléfono:* ${nuevaVisita.telefono}%0A` +
                      `📍 *Dirección:* ${nuevaVisita.direccion}%0A` +
                      `⚡ *Servicio:* ${nuevaVisita.servicio}%0A` +
                      `📅 *Fecha Preferida:* ${new Date(nuevaVisita.fecha).toLocaleDateString('es-ES')}%0A` +
                      `💰 *Valor:* $60.000`;
                    
                    const whatsappUrl = `https://wa.me/56995748162?text=${mensaje}`;
                    window.open(whatsappUrl, '_blank');
                    
                    // Enviar email
                    fetch('/api/enviar-notificacion', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(nuevaVisita)
                    }).catch(err => console.log('Email notification failed:', err));
                    
                    alert('Visita técnica solicitada exitosamente. Se ha enviado la notificación.');
                  }} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                    
                    <div>
                      <label style={{color: '#22d3ee', fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>
                        Nombre Completo *
                      </label>
                      <input required name="nombre" type="text" style={{
                        width: '100%',
                        padding: '16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '2px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '16px'
                      }} />
                    </div>

                    <div>
                      <label style={{color: '#22d3ee', fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>
                        Teléfono *
                      </label>
                      <input required name="telefono" type="tel" style={{
                        width: '100%',
                        padding: '16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '2px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '16px'
                      }} />
                    </div>

                    <div>
                      <label style={{color: '#22d3ee', fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>
                        Dirección *
                      </label>
                      <input required name="direccion" type="text" style={{
                        width: '100%',
                        padding: '16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '2px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '16px'
                      }} />
                    </div>

                    <div>
                      <label style={{color: '#22d3ee', fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>
                        Tipo de Servicio *
                      </label>
                      <select required name="servicio" defaultValue={servicioSeleccionado ? serviciosDestacados.find(s => s.categoria === servicioSeleccionado)?.nombre : ""} style={{
                        width: '100%',
                        padding: '16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '2px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '16px'
                      }}>
                        <option value="">Seleccione...</option>
                        <option value="Electricidad">Electricidad</option>
                        <option value="Carpintería">Carpintería</option>
                        <option value="Gasfitería">Gasfitería</option>
                        <option value="Construcciones nuevas">Construcciones nuevas</option>
                        <option value="Proyecto Fotovoltaico">Proyecto Fotovoltaico</option>
                        <option value="Pintura">Pintura</option>
                        <option value="Soldadura">Soldadura</option>
                        <option value="Planos">Planos</option>
                        <option value="Tramites SEC">Tramites SEC</option>
                      </select>
                    </div>

                    <div>
                      <label style={{color: '#22d3ee', fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>
                        Fecha Preferida *
                      </label>
                      <input required name="fecha" type="date" min={new Date().toISOString().split('T')[0]} style={{
                        width: '100%',
                        padding: '16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '2px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '16px'
                      }} />
                    </div>

                    <div style={{display: 'flex', gap: '16px', marginTop: '16px'}}>
                      <button type="submit" style={{
                        flex: 1,
                        padding: '18px',
                        background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer'
                      }}>Solicitar Visita - $60.000</button>
                      
                      <button type="button" onClick={() => setMostrarFormularioVisita(false)} style={{
                        padding: '18px 32px',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        border: '2px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        cursor: 'pointer'
                      }}>Cancelar</button>
                    </div>
                  </form>
                </div>
              )}

              {visitasSolicitadas.length > 0 && (
                <div>
                  <h3 style={{
                    fontSize: '40px',
                    fontWeight: '900',
                    color: 'white',
                    marginBottom: '32px',
                    textAlign: 'center'
                  }}>Mis Visitas Solicitadas</h3>
                  
                  <div style={{display: 'grid', gap: '24px'}}>
                    {visitasSolicitadas.map((visita) => (
                      <div key={visita.id} style={{
                        background: 'rgba(0,0,0,0.8)',
                        border: '2px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        padding: '32px'
                      }}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px'}}>
                          <div>
                            <h4 style={{color: '#f59e0b', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px'}}>
                              {visita.servicio}
                            </h4>
                            <p style={{color: '#cbd5e1', fontSize: '16px'}}>
                              <strong>Nombre:</strong> {visita.nombre}
                            </p>
                            <p style={{color: '#cbd5e1', fontSize: '16px'}}>
                              <strong>Teléfono:</strong> {visita.telefono}
                            </p>
                            <p style={{color: '#cbd5e1', fontSize: '16px'}}>
                              <strong>Dirección:</strong> {visita.direccion}
                            </p>
                            <p style={{color: '#cbd5e1', fontSize: '16px'}}>
                              <strong>Fecha:</strong> {new Date(visita.fecha).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                          <div style={{textAlign: 'right'}}>
                            <span style={{
                              display: 'inline-block',
                              padding: '8px 16px',
                              background: visita.estado === 'Pendiente' ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.2)',
                              color: visita.estado === 'Pendiente' ? '#f59e0b' : '#22c55e',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              marginBottom: '12px'
                            }}>{visita.estado}</span>
                            
                            {visita.estado === 'Pendiente' && (
                              <button onClick={() => {
                                if(confirm('¿Estás seguro de cancelar esta visita?')) {
                                  setVisitasSolicitadas(visitasSolicitadas.filter(v => v.id !== visita.id));
                                }
                              }} style={{
                                display: 'block',
                                width: '100%',
                                padding: '10px 20px',
                                background: 'rgba(239,68,68,0.2)',
                                border: '2px solid #ef4444',
                                borderRadius: '8px',
                                color: '#ef4444',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                marginTop: '8px'
                              }}>Cancelar Visita</button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* MODAL IMAGEN AMPLIADA */}
      {imagenAmpliada && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.95)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          cursor: 'pointer'
        }} onClick={() => setImagenAmpliada(null)}>
          <button onClick={() => setImagenAmpliada(null)} style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.1)',
            border: '2px solid white',
            color: 'white',
            fontSize: '32px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontWeight: 'bold',
            zIndex: 10000,
            transition: 'all 0.3s'
          }} onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }} onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}>✕</button>
          
          <div style={{
            maxWidth: '90vw',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }} onClick={e => e.stopPropagation()}>
            <img 
              src={imagenAmpliada.src} 
              alt={imagenAmpliada.titulo}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 20px 80px rgba(0,0,0,0.8)'
              }}
            />
            <h3 style={{
              color: 'white',
              fontSize: '28px',
              fontWeight: '900',
              textAlign: 'center',
              background: 'linear-gradient(90deg, #22d3ee, #14b8a6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>{imagenAmpliada.titulo}</h3>
          </div>
        </div>
      )}
    </div>
  );
}
