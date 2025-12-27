"use client";
import { useState, useEffect } from "react";
import OptimizedImage from '../components/ui/OptimizedImage';
import AsistenteVirtual from '../components/ui/AsistenteVirtual';
import ProfessionalIcon from '../components/ui/ProfessionalIcon';

const whatsappNumber = "56995748162";

// URL endpoint para iniciar pago con Webpay Plus
const urlPagos = "/api/webpay/crear-pago";

// Estado para estadísticas reales
interface Stats {
  profesionales: number;
  proyectos: number;
  satisfaccion: number;
}

// Función para procesar pago con WebPay
const procesarPago = async (plan: string) => {
  try {
    const response = await fetch(urlPagos, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      alert('Error al procesar el pago. Intenta nuevamente.');
      return;
    }

    // Plan gratuito: redirige directamente al registro
    if (data.free) {
      window.location.href = '/clientes/registro?plan=cliente-basico&pago=exitoso';
      return;
    }
    
    if (data.success && data.url && data.token) {
      // Crear formulario para enviar a WebPay
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

export default function HomePage() {
  const [vistaActual, setVistaActual] = useState("home");
  const [tipoUsuario, setTipoUsuario] = useState<"cliente" | "profesional" | null>(null);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string | null>(null);
  const [imagenAmpliada, setImagenAmpliada] = useState<{src: string, titulo: string} | null>(null);
  const [mostrarFormularioVisita, setMostrarFormularioVisita] = useState(false);
  const [visitasSolicitadas, setVisitasSolicitadas] = useState<Array<{id: number, nombre: string, telefono: string, direccion: string, servicio: string, fecha: string, estado: string}>>([]);
  
  // Estado para estadísticas reales
  const [stats, setStats] = useState<Stats>({
    profesionales: 0,
    proyectos: 0,
    satisfaccion: 0
  });
  
  const [profesionalesRegistrados, setProfesionalesRegistrados] = useState<Array<{
    id: number;
    nombreCompleto: string;
    especialidad: string;
    comunas: string;
    experiencia: string;
    valoracion: number;
    trabajosRealizados: number;
    descripcion: string;
    estado: string;
    telefono: string;
    email: string;
    fotoPerfil?: string;
  }>>([]);
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState<{
    id: number;
    nombreCompleto: string;
    email: string;
    telefono: string;
    especialidad: string;
    comunas: string;
    experiencia: string;
    valoracion: number;
    trabajosRealizados: number;
    descripcion: string;
    estado: string;
    fotoPerfil?: string;
  } | null>(null);
  
  // Estado para profesionales filtrados por servicio
  const [profesionalesPorServicio, setProfesionalesPorServicio] = useState<Array<{
    id: number;
    nombreCompleto: string;
    valoracion: number;
    trabajosRealizados: number;
    totalReviews: number;
  }>>([]);
  const [galeriaPorCategoria, setGaleriaPorCategoria] = useState<Record<string, Array<{src: string, titulo: string}>>>({
    electricidad: [],
    carpinteria: [],
    planos: [],
    mueblistas: [],
    otros: []
  });
  const [categoriaProyecto, setCategoriaProyecto] = useState<string | null>(null);
  const [mostrarMensajePago, setMostrarMensajePago] = useState(false);

  // Verificar si hay parámetro de pago exitoso; si existe, redirigir a /suscripciones para UI nueva
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pagoExitoso = params.get('pago') === 'exitoso';
    if (pagoExitoso) {
      const plan = params.get('plan');
      const target = `/suscripciones?pago=exitoso${plan ? `&plan=${plan}` : ''}`;
      window.location.replace(target);
      return;
    }
    
    // Detectar vista desde URL
    const vista = params.get('vista');
    if (vista === 'profesionales') {
      setVistaActual('lista-profesionales');
    } else if (vista === 'galeria') {
      setVistaActual('galeria');
    } else if (vista === 'servicios') {
      setVistaActual('servicios');
    }
  }, []);

  // Cargar galería automáticamente al iniciar
  useEffect(() => {
    fetch('/api/galeria')
      .then(res => res.json())
      .then(data => setGaleriaPorCategoria(data))
      .catch(err => console.error('Error al cargar galería:', err));
    
    // Cargar profesionales
    fetch('/api/profesionales')
      .then(res => res.json())
      .then(data => setProfesionalesRegistrados(data.filter((p: any) => p.estado === 'activo' || p.estado === 'pendiente')))
      .catch(err => console.error('Error al cargar profesionales:', err));
  }, []);

  // Cargar estadísticas reales desde la base de datos
  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const [profRes, cotizRes, reviewsRes] = await Promise.all([
          fetch('/api/profesionales'),
          fetch('/api/cotizaciones'),
          fetch('/api/reviews')
        ]);

        const profesionales = await profRes.json();
        const cotizaciones = await cotizRes.json();
        const reviews = await reviewsRes.json();

        // Calcular estadísticas reales
        const totalProfesionales = Array.isArray(profesionales) ? profesionales.length : 0;
        const totalProyectos = Array.isArray(cotizaciones) ? cotizaciones.filter((c: any) => c.estado === 'completado').length : 0;
        
        // Calcular satisfacción real basada en reviews
        let satisfaccionPromedio = 0;
        if (Array.isArray(reviews) && reviews.length > 0) {
          const sumaValoraciones = reviews.reduce((sum: number, r: any) => sum + (r.valoracion || 0), 0);
          satisfaccionPromedio = Math.round((sumaValoraciones / reviews.length / 5) * 100);
        }

        setStats({
          profesionales: totalProfesionales,
          proyectos: totalProyectos,
          satisfaccion: satisfaccionPromedio
        });
      } catch (error) {
        // Si hay error, mantener valores en 0 (más honesto que números falsos)
        setStats({ profesionales: 0, proyectos: 0, satisfaccion: 0 });
      }
    };

    cargarEstadisticas();
  }, []);

  // Cargar conteo real de profesionales por servicio
  useEffect(() => {
    const cargarConteosServicios = async () => {
      try {
        const response = await fetch('/api/profesionales');
        const profesionales = await response.json();

        if (Array.isArray(profesionales)) {
          // Contar profesionales por especialidad
          const contarPorEspecialidad = (keywords: string[]) => {
            return profesionales.filter((p: any) => {
              const especialidad = (p.especialidad || '').toLowerCase();
              return keywords.some(keyword => especialidad.includes(keyword));
            }).length;
          };

          setServiciosDestacados([
            { nombre: "Electricistas", icono: "⚡", profesionales: contarPorEspecialidad(['electric', 'electricista']), categoria: "electricidad" },
            { nombre: "Carpinteros", icono: "🪚", profesionales: contarPorEspecialidad(['carpint', 'carpintero']), categoria: "carpinteria" },
            { nombre: "Mueblistas", icono: "🛋️", profesionales: contarPorEspecialidad(['muebl', 'mueblista']), categoria: "mueblistas" },
            { nombre: "Gasfitería", icono: "🔧", profesionales: contarPorEspecialidad(['gasfit', 'gasfiter', 'plomero']), categoria: "gasfiteria" },
            { nombre: "Pintores", icono: "🎨", profesionales: contarPorEspecialidad(['pint', 'pintor']), categoria: "pintura" },
            { nombre: "Soldadores", icono: "🔥", profesionales: contarPorEspecialidad(['sold', 'soldador']), categoria: "soldadura" },
            { nombre: "Construcciones nuevas", icono: "🏗️", profesionales: contarPorEspecialidad(['construc', 'constructor', 'obra']), categoria: "construcciones" },
            { nombre: "Planos", icono: "📐", profesionales: contarPorEspecialidad(['plano', 'arquitecto', 'diseño']), categoria: "planos" },
            { nombre: "Tramites SEC", icono: "📋", profesionales: contarPorEspecialidad(['sec', 'tramite', 'trámite']), categoria: "tramites-sec" },
            { nombre: "Proyectos Fotovoltaicos", icono: "☀️", profesionales: contarPorEspecialidad(['fotovolta', 'solar', 'panel']), categoria: "fotovoltaico" }
          ]);
        }
      } catch (error) {
        // Si hay error, mantener valores en 0
        console.error('Error al cargar conteos de servicios:', error);
      }
    };

    cargarConteosServicios();
  }, []);

  // Cargar profesionales filtrados cuando cambia el servicio seleccionado
  useEffect(() => {
    const cargarProfesionalesPorServicio = async () => {
      if (!servicioSeleccionado) {
        setProfesionalesPorServicio([]);
        return;
      }

      try {
        const response = await fetch('/api/profesionales');
        const profesionales = await response.json();

        if (Array.isArray(profesionales)) {
          // Palabras clave por servicio
          const keywordsPorServicio: Record<string, string[]> = {
            electricidad: ['electric', 'electricista'],
            carpinteria: ['carpint', 'carpintero'],
            mueblistas: ['muebl', 'mueblista'],
            gasfiteria: ['gasfit', 'gasfiter', 'plomero'],
            pintura: ['pintor'],
            soldadura: ['sold', 'soldador'],
            construcciones: ['construc', 'constructor', 'obra'],
            planos: ['plano', 'arquitect', 'diseño'],
            'tramites-sec': ['sec', 'tramite', 'trámite'],
            fotovoltaico: ['fotovolta', 'solar', 'panel']
          };

          const keywords = keywordsPorServicio[servicioSeleccionado] || [];
          const profesionalesFiltrados = profesionales
            .filter((p: any) => {
              const especialidad = (p.especialidad || '').toLowerCase();
              return keywords.some(keyword => especialidad.includes(keyword));
            })
            .map((p: any) => ({
              id: p.id,
              nombreCompleto: p.nombreCompleto || 'Profesional',
              especialidad: p.especialidad || '',
              valoracion: p.valoracion || 0,
              trabajosRealizados: p.trabajosRealizados || 0,
              totalReviews: p.totalReviews || 0,
              fotoPerfil: p.fotoPerfil || '',
              comunas: p.comunas || [],
              experiencia: p.experiencia || 0
            }))
            .slice(0, 6); // Máximo 6 profesionales

          setProfesionalesPorServicio(profesionalesFiltrados);
        }
      } catch (error) {
        console.error('Error al cargar profesionales por servicio:', error);
        setProfesionalesPorServicio([]);
      }
    };

    cargarProfesionalesPorServicio();
  }, [servicioSeleccionado]);

  const planesCliente = [
    { nombre: "Básico", precio: "Gratis", precioNumerico: 0, features: ["2 cotizaciones mensuales", "Hasta 2 profesionales", "Chat básico", "Soporte por email"], destacado: false },
    { nombre: "Premium", precio: "$14.990/mes", precioNumerico: 14990, features: ["6 cotizaciones mensuales", "Hasta 6 profesionales", "Chat prioritario", "Soporte 24/7", "Descuentos exclusivos"], destacado: true },
    { nombre: "VIP", precio: "$29.990/mes", precioNumerico: 29990, features: ["Cotizaciones ilimitadas", "Acceso a todos los pro", "Gestor dedicado", "Prioridad máxima", "Descuentos VIP"], destacado: false }
  ];

  const planesProfesional = [
    { nombre: "Starter", precio: "$14.990/mes", precioNumerico: 14990, features: ["Perfil verificado", "Hasta 5 leads/mes", "Comisión 15%", "Dashboard básico"], destacado: false },
    { nombre: "Pro", precio: "$29.990/mes", precioNumerico: 29990, features: ["Todo Starter +", "Hasta 10 leads/mes", "Comisión 10%", "Análisis avanzado", "Badge destacado"], destacado: true },
    { nombre: "Elite", precio: "$59.990/mes", precioNumerico: 59990, features: ["Todo Pro +", "Leads ilimitados", "Comisión 5%", "Prioridad máxima", "Marketing incluido", "Soporte premium"], destacado: false }
  ];

  // Estado para servicios con conteo dinámico
  const [serviciosDestacados, setServiciosDestacados] = useState([
    { nombre: "Electricistas", icono: "⚡", profesionales: 0, categoria: "electricidad" },
    { nombre: "Carpinteros", icono: "🪚", profesionales: 0, categoria: "carpinteria" },
    { nombre: "Mueblistas", icono: "🛋️", profesionales: 0, categoria: "mueblistas" },
    { nombre: "Gasfitería", icono: "🔧", profesionales: 0, categoria: "gasfiteria" },
    { nombre: "Pintores", icono: "🎨", profesionales: 0, categoria: "pintura" },
    { nombre: "Soldadores", icono: "🔥", profesionales: 0, categoria: "soldadura" },
    { nombre: "Construcciones nuevas", icono: "🏗️", profesionales: 0, categoria: "construcciones" },
    { nombre: "Planos", icono: "📐", profesionales: 0, categoria: "planos" },
    { nombre: "Tramites SEC", icono: "📋", profesionales: 0, categoria: "tramites-sec" },
    { nombre: "Proyectos Fotovoltaicos", icono: "☀️", profesionales: 0, categoria: "fotovoltaico" }
  ]);

  const imagenesElectricidad = ["/galeria/Tablero-Electrico-1600.avif", "/galeria/Iluminacion-Pared-tipo-Rack-1600.avif"];

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
        padding: 'clamp(8px, 2vw, 12px)',
        textAlign: 'center',
        background: 'rgba(0,0,0,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: 'none',
        boxShadow: '0 1px 5px rgba(0,0,0,0.3)'
      }}>
        <h1 onClick={() => setVistaActual("home")} style={{
          fontSize: 'clamp(16px, 5vw, 24px)',
          fontWeight: '900',
          background: 'linear-gradient(90deg, #22d3ee, #3b82f6, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
          lineHeight: '1.3',
          cursor: 'pointer'
        }}>Portal de Construcciones y Reparaciones Profesionales</h1>
      </div>

      {/* NAVBAR - SCROLL NORMAL */}
      <nav style={{
        marginTop: 'clamp(55px, 6vw, 70px)',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(15,23,42,0.95) 50%, rgba(30,27,75,0.9) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        padding: 'clamp(16px, 3vw, 22px) 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 clamp(16px, 3vw, 20px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'clamp(26px, 6vw, 36px)'
        }}>
          {/* Botones Servicios y Proyectos - MÁS VISIBLES */}
          <div style={{
            display: 'flex', 
            gap: 'clamp(20px, 5vw, 40px)', 
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
          }}>
            <button onClick={() => setVistaActual("servicios")} style={{
              padding: 'clamp(12px, 3vw, 16px) clamp(24px, 6vw, 32px)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: 'clamp(16px, 4vw, 20px)',
              background: 'rgba(59, 130, 246, 0.2)',
              border: '2px solid rgba(59, 130, 246, 0.5)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: 'clamp(100px, 25vw, 140px)'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.4)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
            }}>Servicios</button>
            
            <button onClick={() => setVistaActual("galeria")} style={{
              padding: 'clamp(12px, 3vw, 16px) clamp(24px, 6vw, 32px)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: 'clamp(16px, 4vw, 20px)',
              background: 'rgba(245, 158, 11, 0.2)',
              border: '2px solid rgba(245, 158, 11, 0.5)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: 'clamp(100px, 25vw, 140px)'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.background = 'rgba(245, 158, 11, 0.4)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)';
            }}>Proyectos</button>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <a href="/clientes/login">
              <button style={{
                padding: '16px 32px',
                background: 'linear-gradient(90deg, #8b5cf6, #6366f1)',
                color: 'white',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(99,102,241,0.45)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                fontSize: '16px'
              }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                👤 Acceso Clientes
              </button>
            </a>

            <a href="/profesionales/login">
              <button style={{
                padding: '16px 32px',
                background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                color: 'white',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(34,211,238,0.5)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                fontSize: '16px'
              }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <ProfessionalIcon size={20} /> Acceso Profesionales
                </span>
              </button>
            </a>

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
            }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
               onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>🔧 Visita Técnica</button>

            <div style={{ flexBasis: '100%', height: '0' }} />

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
              }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>💬 WhatsApp</button>
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
              }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>📧 Email</button>
            </a>
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
            padding: '20px 20px 40px'
          }}>
            <div style={{maxWidth: '1400px', width: '100%'}}>
              <div style={{textAlign: 'center', marginBottom: 'clamp(30px, 6vw, 60px)', padding: '0 20px'}}>
                <h1 style={{
                  fontSize: 'clamp(28px, 7vw, 80px)',
                  fontWeight: '900',
                  marginBottom: 'clamp(20px, 5vw, 40px)',
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
                gap: 'clamp(20px, 4vw, 24px)',
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
                }} onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 30px 80px rgba(6,182,212,0.6)';
                }} onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(6,182,212,0.3)';
                }}>
                  <div style={{fontSize: 'clamp(40px, 10vw, 70px)', marginBottom: '16px', filter: 'drop-shadow(0 0 20px rgba(6,182,212,0.8))', textAlign: 'center'}}>🏠</div>
                  <h2 style={{
                    fontSize: 'clamp(20px, 4.5vw, 32px)',
                    fontWeight: '900',
                    color: 'white',
                    marginBottom: '12px',
                    textAlign: 'center',
                    lineHeight: '1.2'
                  }}>BUSCO SERVICIO</h2>
                  <p style={{
                    fontSize: 'clamp(13px, 3vw, 16px)',
                    color: '#cbd5e1',
                    marginBottom: '24px',
                    textAlign: 'center'
                  }}>Encuentra profesionales verificados para tu proyecto</p>
                  
                  <div onClick={() => setVistaActual("lista-profesionales")} style={{
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
                </div>

                {/* VER PLANES DE SUSCRIPCIÓN */}
                <div style={{
                  position: 'relative',
                  background: 'linear-gradient(135deg, #1e293b 0%, #000 100%)',
                  border: '4px solid rgba(168,85,247,0.5)',
                  borderRadius: '24px',
                  padding: 'clamp(24px, 5vw, 48px)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 20px 60px rgba(168,85,247,0.3)'
                }} onClick={() => { setTipoUsuario("cliente"); setVistaActual("cliente"); }} onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 30px 80px rgba(168,85,247,0.6)';
                }} onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(168,85,247,0.3)';
                }}>
                  <div style={{fontSize: 'clamp(40px, 10vw, 70px)', marginBottom: '16px', filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.8))', textAlign: 'center'}}>💎</div>
                  <h2 style={{
                    fontSize: 'clamp(18px, 4vw, 28px)',
                    fontWeight: '900',
                    color: 'white',
                    marginBottom: '12px',
                    textAlign: 'center',
                    lineHeight: '1.2'
                  }}>PLANES CLIENTES</h2>
                  <p style={{
                    fontSize: 'clamp(13px, 3vw, 16px)',
                    color: '#cbd5e1',
                    marginBottom: '24px',
                    textAlign: 'center'
                  }}>Accede a beneficios exclusivos y descuentos</p>
                  
                  <div style={{
                    padding: 'clamp(16px, 4vw, 20px) clamp(24px, 6vw, 32px)',
                    background: 'linear-gradient(90deg, #a855f7, #8b5cf6)',
                    borderRadius: '16px',
                    color: 'white',
                    fontWeight: '900',
                    fontSize: 'clamp(16px, 4vw, 20px)',
                    textAlign: 'center',
                    boxShadow: '0 10px 40px rgba(168,85,247,0.5)',
                    transition: 'all 0.3s'
                  }} onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 15px 50px rgba(168,85,247,0.7)';
                  }} onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(168,85,247,0.5)';
                  }}>
                    VER PLANES →
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
                  <div style={{fontSize: 'clamp(40px, 10vw, 70px)', marginBottom: '16px', filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.8))', textAlign: 'center'}}>🔧</div>
                  <h2 style={{
                    fontSize: 'clamp(20px, 4.5vw, 32px)',
                    fontWeight: '900',
                    color: 'white',
                    marginBottom: '12px',
                    textAlign: 'center',
                    lineHeight: '1.2'
                  }}>VISITA TÉCNICA</h2>
                  <p style={{
                    fontSize: 'clamp(13px, 3vw, 16px)',
                    color: '#cbd5e1',
                    marginBottom: '24px',
                    textAlign: 'center'
                  }}>Agenda una evaluación profesional</p>
                  
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
                  <div style={{fontSize: 'clamp(40px, 10vw, 70px)', marginBottom: '16px', filter: 'drop-shadow(0 0 20px rgba(217,70,239,0.8))'}}>⚡</div>
                  <h2 style={{
                    fontSize: 'clamp(18px, 4vw, 28px)',
                    fontWeight: '900',
                    color: 'white',
                    marginBottom: '12px',
                    lineHeight: '1.2',
                    textAlign: 'center'
                  }}>SOY PROFESIONAL</h2>
                  <p style={{
                    fontSize: 'clamp(13px, 3vw, 16px)',
                    color: '#cbd5e1',
                    marginBottom: '24px',
                    textAlign: 'center'
                  }}>Consigue clientes y haz crecer tu negocio</p>
                  <div style={{
                    padding: 'clamp(16px, 4vw, 20px) clamp(24px, 6vw, 32px)',
                    background: 'linear-gradient(90deg, #d946ef, #ec4899)',
                    borderRadius: '16px',
                    color: 'white',
                    fontWeight: '900',
                    fontSize: 'clamp(16px, 4vw, 20px)',
                    textAlign: 'center',
                    boxShadow: '0 10px 40px rgba(217,70,239,0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }} onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 15px 50px rgba(217,70,239,0.7)';
                  }} onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(217,70,239,0.5)';
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
                  { 
                    numero: stats.profesionales > 0 ? `${stats.profesionales}` : "Nuevo", 
                    label: stats.profesionales === 1 ? "Profesional" : "Profesionales", 
                    icono: "professional" 
                  },
                  { 
                    numero: stats.proyectos > 0 ? `${stats.proyectos}` : "0", 
                    label: "Proyectos", 
                    icono: "🏗️" 
                  },
                  { 
                    numero: stats.satisfaccion > 0 ? `${stats.satisfaccion}%` : "Nueva", 
                    label: stats.satisfaccion > 0 ? "Satisfacción" : "Plataforma", 
                    icono: "⭐" 
                  }
                ].map((stat, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(0,0,0,0.8)',
                    border: '2px solid rgba(6,182,212,0.3)',
                    borderRadius: '16px',
                    padding: '20px 12px',
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(6,182,212,0.2)'
                  }}>
                    <div style={{fontSize: '32px', marginBottom: '8px', display: 'flex', justifyContent: 'center'}}>
                      {stat.icono === 'professional' ? <ProfessionalIcon size={32} /> : stat.icono}
                    </div>
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
          <div style={{paddingTop: '80px', padding: '80px 20px 80px 20px'}}>
            <div style={{maxWidth: '1200px', margin: '0 auto'}}>
              <button onClick={() => setVistaActual("home")} style={{
                marginBottom: '24px',
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
                      <button 
                        onClick={() => procesarPago('cliente-basico')}
                        style={{
                        width: '100%',
                        padding: '16px',
                        background: 'linear-gradient(90deg, #8b5cf6, #6366f1)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        fontWeight: '900',
                        fontSize: '18px',
                        cursor: 'pointer',
                        boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(139, 92, 246, 0.6)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.4)';
                      }}
                      >COMENZAR GRATIS</button>
                    ) : (
                      <button 
                        onClick={() => procesarPago(
                          `cliente-${plan.nombre.toLowerCase()}`
                        )}
                        style={{
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
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        💳 CONTRATAR {plan.precio}
                      </button>
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
          <div style={{paddingTop: '80px', padding: '80px 20px 80px 20px'}}>
            <div style={{maxWidth: '1200px', margin: '0 auto'}}>
              <button onClick={() => setVistaActual("home")} style={{
                marginBottom: '24px',
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
                    <button 
                      onClick={() => procesarPago(
                        `profesional-${plan.nombre.toLowerCase()}`
                      )}
                      style={{
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
                      }} 
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }} 
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      💳 PAGAR {plan.precio}
                    </button>
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
          <div style={{paddingTop: '80px', padding: '80px 20px 80px 20px'}}>
            <div style={{maxWidth: '1200px', margin: '0 auto'}}>
              <button onClick={() => setVistaActual("home")} style={{
                marginBottom: '24px',
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
          <div style={{paddingTop: '80px', padding: '80px 20px 80px 20px'}}>
            <div style={{maxWidth: '1200px', margin: '0 auto'}}>
              <button onClick={() => setVistaActual("home")} style={{
                marginBottom: '24px',
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
        {/* LISTA DE PROFESIONALES */}
        {vistaActual === "lista-profesionales" && (
          <div style={{paddingTop: '80px', padding: '80px 20px 80px 20px'}}>
            <div style={{maxWidth: '1400px', margin: '0 auto'}}>
              <button onClick={() => setVistaActual("home")} style={{
                marginBottom: '24px',
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>← Volver</button>

              <div style={{textAlign: 'center', marginBottom: '64px'}}>
                <h2 style={{
                  fontSize: 'clamp(32px, 6vw, 56px)',
                  fontWeight: '900',
                  background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '16px'
                }}>⚡ Profesionales Electricistas</h2>
                <p style={{
                  fontSize: 'clamp(16px, 3vw, 20px)',
                  color: 'rgba(255,255,255,0.7)',
                  maxWidth: '800px',
                  margin: '0 auto'
                }}>Conecta con profesionales certificados y verificados</p>
              </div>

              {profesionalesRegistrados.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '80px 20px',
                  background: 'rgba(0,0,0,0.5)',
                  borderRadius: '24px',
                  border: '2px solid rgba(34,211,238,0.2)'
                }}>
                  <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '18px'}}>
                    No hay profesionales registrados aún
                  </p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 320px))',
                  gap: '24px',
                  justifyContent: 'center',
                  padding: '0 10px'
                }}>
                  {profesionalesRegistrados.map((prof) => (
                    <div key={prof.id} style={{
                      background: 'rgba(0,0,0,0.6)',
                      borderRadius: '20px',
                      padding: '24px',
                      border: '2px solid rgba(34,211,238,0.3)',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                      maxWidth: '320px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.border = '2px solid rgba(34,211,238,0.6)';
                      e.currentTarget.style.boxShadow = '0 20px 60px rgba(34,211,238,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.border = '2px solid rgba(34,211,238,0.3)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <div style={{textAlign: 'center', marginBottom: '24px'}}>
                        <div style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          background: prof.fotoPerfil ? 'transparent' : 'linear-gradient(135deg, #22d3ee, #3b82f6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 16px',
                          fontSize: '36px',
                          overflow: 'hidden',
                          border: '3px solid rgba(34,211,238,0.5)'
                        }}>
                          {prof.fotoPerfil ? (
                            <img 
                              src={prof.fotoPerfil} 
                              alt={prof.nombreCompleto}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement!;
                                parent.innerHTML = '';
                                const iconContainer = document.createElement('div');
                                parent.appendChild(iconContainer);
                              }}
                            />
                          ) : <ProfessionalIcon size={80} />}
                        </div>
                        <h3 style={{
                          fontSize: '22px',
                          fontWeight: 'bold',
                          color: 'white',
                          marginBottom: '8px'
                        }}>{prof.nombreCompleto}</h3>
                        <p style={{
                          color: '#22d3ee',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          marginBottom: '12px'
                        }}>⚡ {prof.especialidad}</p>
                        <div style={{
                          display: 'flex',
                          gap: '8px',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: '16px'
                        }}>
                          <div style={{
                            background: 'rgba(251,191,36,0.2)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <span style={{color: '#fbbf24'}}>⭐</span>
                            <span style={{color: 'white', fontWeight: 'bold'}}>
                              {prof.valoracion.toFixed(1)}
                            </span>
                          </div>
                          <div style={{
                            background: 'rgba(34,211,238,0.2)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            color: '#22d3ee',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}>
                            {prof.experiencia} años exp.
                          </div>
                        </div>
                      </div>

                      <div style={{marginBottom: '20px'}}>
                        <p style={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '15px',
                          lineHeight: '1.6',
                          marginBottom: '12px'
                        }}>{prof.descripcion}</p>
                        <p style={{
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '14px'
                        }}>
                          📍 {prof.comunas}
                        </p>
                      </div>

                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        paddingTop: '20px',
                        borderTop: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <button 
                          onClick={() => {
                            const tel = prof.telefono.replace(/[^0-9]/g, '')
                            window.open(`https://wa.me/${tel}?text=Hola,%20vi%20tu%20perfil%20en%20ElectricistasPro%20y%20me%20interesa%20contactarte`, '_blank')
                          }}
                          style={{
                          flex: 1,
                          padding: '12px',
                          background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                          border: 'none',
                          borderRadius: '12px',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}>
                          💬 Contactar
                        </button>
                        <button 
                          onClick={() => {
                            setProfesionalSeleccionado(prof)
                            setVistaActual("perfil-profesional")
                          }}
                          style={{
                          flex: 1,
                          padding: '12px',
                          background: 'rgba(255,255,255,0.1)',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderRadius: '12px',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}>
                          👁️ Ver Perfil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {vistaActual === "perfil-profesional" && profesionalSeleccionado && (
          <div style={{paddingTop: '80px', padding: '80px 20px 80px 20px'}}>
            <div style={{maxWidth: '900px', margin: '0 auto'}}>
              <button onClick={() => setVistaActual("lista-profesionales")} style={{
                marginBottom: '24px',
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>← Volver a Lista</button>

              {/* Tarjeta de Perfil Completo */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.15), rgba(59, 130, 246, 0.15))',
                borderRadius: '24px',
                padding: '40px',
                border: '2px solid rgba(255,255,255,0.2)',
                marginBottom: '30px'
              }}>
                {/* Header del Perfil */}
                <div style={{display: 'flex', gap: '24px', alignItems: 'start', marginBottom: '32px', flexWrap: 'wrap'}}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    flexShrink: 0
                  }}>
                    <ProfessionalIcon size={60} />
                  </div>
                  <div style={{flex: 1, minWidth: '250px'}}>
                    <h2 style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>{profesionalSeleccionado.nombreCompleto}</h2>
                    <p style={{
                      fontSize: '20px',
                      color: 'rgba(255,255,255,0.9)',
                      marginBottom: '16px',
                      fontWeight: '500'
                    }}>{profesionalSeleccionado.especialidad}</p>
                    <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(234, 179, 8, 0.2)',
                        padding: '8px 16px',
                        borderRadius: '12px',
                        border: '2px solid rgba(234, 179, 8, 0.5)'
                      }}>
                        <span style={{fontSize: '20px'}}>⭐</span>
                        <span style={{fontWeight: 'bold', fontSize: '16px'}}>{profesionalSeleccionado.valoracion}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(34, 211, 238, 0.2)',
                        padding: '8px 16px',
                        borderRadius: '12px',
                        border: '2px solid rgba(34, 211, 238, 0.5)'
                      }}>
                        <span style={{fontSize: '18px'}}>✅</span>
                        <span style={{fontWeight: 'bold', fontSize: '16px'}}>{profesionalSeleccionado.trabajosRealizados} trabajos</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(168, 85, 247, 0.2)',
                        padding: '8px 16px',
                        borderRadius: '12px',
                        border: '2px solid rgba(168, 85, 247, 0.5)'
                      }}>
                        <span style={{fontSize: '18px'}}>📅</span>
                        <span style={{fontWeight: 'bold', fontSize: '16px'}}>{profesionalSeleccionado.experiencia} años</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '24px',
                  borderRadius: '16px',
                  marginBottom: '24px'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    color: '#22d3ee'
                  }}>Sobre mí</h3>
                  <p style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '16px',
                    lineHeight: '1.7'
                  }}>{profesionalSeleccionado.descripcion}</p>
                </div>

                {/* Zonas de Cobertura */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '24px',
                  borderRadius: '16px',
                  marginBottom: '24px'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    color: '#22d3ee'
                  }}>Zonas de Cobertura</h3>
                  <p style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '16px'
                  }}>📍 {profesionalSeleccionado.comunas}</p>
                </div>

                {/* Información de Contacto */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '24px',
                  borderRadius: '16px',
                  marginBottom: '24px'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                    color: '#22d3ee'
                  }}>Información de Contacto</h3>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <span style={{fontSize: '24px'}}>📧</span>
                      <span style={{color: 'rgba(255,255,255,0.9)', fontSize: '16px'}}>{profesionalSeleccionado.email}</span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <span style={{fontSize: '24px'}}>📱</span>
                      <span style={{color: 'rgba(255,255,255,0.9)', fontSize: '16px'}}>+56 {profesionalSeleccionado.telefono}</span>
                    </div>
                  </div>
                </div>

                {/* Botón de Contacto Principal */}
                <button 
                  onClick={() => {
                    const tel = profesionalSeleccionado.telefono.replace(/[^0-9]/g, '')
                    window.open(`https://wa.me/${tel}?text=Hola%20${profesionalSeleccionado.nombreCompleto},%20vi%20tu%20perfil%20en%20ElectricistasPro%20y%20me%20interesa%20contactarte%20para%20un%20trabajo`, '_blank')
                  }}
                  style={{
                  width: '100%',
                  padding: '18px',
                  background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                  border: 'none',
                  borderRadius: '16px',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px'
                }}>
                  <span style={{fontSize: '24px'}}>💬</span>
                  Contactar por WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}

        {vistaActual === "galeria" && (
          <div style={{paddingTop: '80px', padding: '80px 20px 80px 20px'}}>
            <div style={{maxWidth: '1400px', margin: '0 auto'}}>
              <button onClick={() => setVistaActual("home")} style={{
                marginBottom: '24px',
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
                
                {/* BOTONES DE FILTRADO */}
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginTop: '32px'
                }}>
                  <button onClick={() => setCategoriaProyecto(null)} style={{
                    padding: '16px 32px',
                    background: categoriaProyecto === null ? 'linear-gradient(90deg, #22d3ee, #14b8a6)' : 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: categoriaProyecto === null ? 'none' : '2px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: categoriaProyecto === null ? '0 8px 32px rgba(34,211,238,0.5)' : 'none'
                  }} onMouseEnter={e => {
                    if (categoriaProyecto !== null) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                    }
                  }} onMouseLeave={e => {
                    if (categoriaProyecto !== null) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    }
                  }}>
                    🌟 Todos
                  </button>
                  <button onClick={() => setCategoriaProyecto('electricidad')} style={{
                    padding: '16px 32px',
                    background: categoriaProyecto === 'electricidad' ? 'linear-gradient(90deg, #22d3ee, #14b8a6)' : 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: categoriaProyecto === 'electricidad' ? 'none' : '2px solid rgba(34,211,238,0.3)',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: categoriaProyecto === 'electricidad' ? '0 8px 32px rgba(34,211,238,0.5)' : 'none'
                  }} onMouseEnter={e => {
                    if (categoriaProyecto !== 'electricidad') {
                      e.currentTarget.style.background = 'rgba(34,211,238,0.2)';
                    }
                  }} onMouseLeave={e => {
                    if (categoriaProyecto !== 'electricidad') {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    }
                  }}>
                    ⚡ Electricidad
                  </button>
                  <button onClick={() => setCategoriaProyecto('carpinteria')} style={{
                    padding: '16px 32px',
                    background: categoriaProyecto === 'carpinteria' ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: categoriaProyecto === 'carpinteria' ? 'none' : '2px solid rgba(245,158,11,0.3)',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: categoriaProyecto === 'carpinteria' ? '0 8px 32px rgba(245,158,11,0.5)' : 'none'
                  }} onMouseEnter={e => {
                    if (categoriaProyecto !== 'carpinteria') {
                      e.currentTarget.style.background = 'rgba(245,158,11,0.2)';
                    }
                  }} onMouseLeave={e => {
                    if (categoriaProyecto !== 'carpinteria') {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    }
                  }}>
                    🪚 Carpintería
                  </button>
                  <button onClick={() => setCategoriaProyecto('planos')} style={{
                    padding: '16px 32px',
                    background: categoriaProyecto === 'planos' ? 'linear-gradient(90deg, #8b5cf6, #6366f1)' : 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: categoriaProyecto === 'planos' ? 'none' : '2px solid rgba(139,92,246,0.3)',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: categoriaProyecto === 'planos' ? '0 8px 32px rgba(139,92,246,0.5)' : 'none'
                  }} onMouseEnter={e => {
                    if (categoriaProyecto !== 'planos') {
                      e.currentTarget.style.background = 'rgba(139,92,246,0.2)';
                    }
                  }} onMouseLeave={e => {
                    if (categoriaProyecto !== 'planos') {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    }
                  }}>
                    📐 Planos
                  </button>
                </div>
              </div>

              {/* ELECTRICIDAD */}
              {(categoriaProyecto === null || categoriaProyecto === 'electricidad') && galeriaPorCategoria.electricidad.length > 0 && (
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
              )}

              {/* CARPINTERÍA */}
              {(categoriaProyecto === null || categoriaProyecto === 'carpinteria') && galeriaPorCategoria.carpinteria.length > 0 && (
              <div style={{marginBottom: '60px'}}>
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
              )}

              {/* PLANOS */}
              {(categoriaProyecto === null || categoriaProyecto === 'planos') && galeriaPorCategoria.planos.length > 0 && (
              <div style={{marginBottom: '60px'}}>
                <h3 style={{
                  fontSize: '40px',
                  fontWeight: '900',
                  color: '#8b5cf6',
                  marginBottom: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <span style={{fontSize: '48px'}}>📐</span>
                  Planos
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '32px'
                }}>
                  {galeriaPorCategoria.planos.map((item, idx) => (
                    <div key={idx} style={{
                      borderRadius: '24px',
                      overflow: 'hidden',
                      border: '4px solid rgba(139,92,246,0.3)',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                      transition: 'all 0.3s',
                      background: 'rgba(0,0,0,0.7)',
                      cursor: 'pointer'
                    }} onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.05) rotate(1deg)';
                      e.currentTarget.style.boxShadow = '0 20px 60px rgba(139,92,246,0.6)';
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
                          color: '#8b5cf6'
                        }}>{item.titulo}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}
            </div>
          </div>
        )}

        {/* PROFESIONALES POR SERVICIO */}
        {vistaActual === "profesionales" && servicioSeleccionado && (
          <div style={{paddingTop: '80px', padding: '80px 20px 80px 20px'}}>
            <div style={{maxWidth: '1200px', margin: '0 auto'}}>
              <button onClick={() => setVistaActual("servicios")} style={{
                marginBottom: '24px',
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
                {profesionalesPorServicio.length > 0 ? (
                  profesionalesPorServicio.map((prof) => (
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
                    }}><ProfessionalIcon size={28} /></div>
                    <h3 style={{
                      fontSize: '24px',
                      fontWeight: '900',
                      color: 'white',
                      marginBottom: '12px',
                      textAlign: 'center'
                    }}>{prof.nombreCompleto}</h3>
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
                        }}>{prof.valoracion.toFixed(1)}</span>
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
                            color: star <= Math.round(prof.valoracion) ? '#fbbf24' : '#4b5563'
                          }}>★</span>
                        ))}
                      </div>
                      <p style={{
                        color: '#9ca3af',
                        fontSize: '14px',
                        textAlign: 'center',
                        marginBottom: '8px'
                      }}>{prof.totalReviews} {prof.totalReviews === 1 ? 'valoración' : 'valoraciones'} de clientes</p>
                      <p style={{
                        color: '#22d3ee',
                        fontSize: '14px',
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}>{prof.trabajosRealizados} {prof.trabajosRealizados === 1 ? 'trabajo completado' : 'trabajos completados'}</p>
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
                ))
                ) : (
                  <div style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '64px 32px',
                    background: 'rgba(0,0,0,0.6)',
                    border: '2px dashed rgba(34,211,238,0.3)',
                    borderRadius: '24px'
                  }}>
                    <div style={{fontSize: '64px', marginBottom: '16px'}}>👷</div>
                    <h3 style={{
                      fontSize: '24px',
                      fontWeight: '900',
                      color: 'white',
                      marginBottom: '12px'
                    }}>No hay profesionales disponibles</h3>
                    <p style={{
                      fontSize: '16px',
                      color: '#94a3b8',
                      marginBottom: '24px'
                    }}>Aún no tenemos profesionales registrados en esta categoría.</p>
                    <button onClick={() => setVistaActual("profesional")} style={{
                      padding: '12px 32px',
                      background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}>¿Eres profesional? Regístrate aquí</button>
                  </div>
                )}
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
          <div style={{minHeight: '100vh', paddingTop: '80px', padding: '80px 20px 80px 20px'}}>
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
                  Agenda una visita profesional
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
                  <h3 style={{fontSize: '32px', color: 'white', marginBottom: '16px', fontWeight: '900'}}>
                    Datos de la Visita
                  </h3>
                  
                  <p style={{fontSize: 'clamp(14px, 3.5vw, 18px)', color: '#f59e0b', marginBottom: '32px', fontWeight: 'bold'}}>
                    💰 Valor de la visita: $60.000
                  </p>
                  
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
                      }}>Solicitar Visita</button>
                      
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

      {/* Asistente Virtual */}
      <AsistenteVirtual />

      {/* Botón Volver Arriba (visible en todas las vistas) */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          position: 'fixed',
          bottom: '110px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          border: '3px solid white',
          boxShadow: '0 8px 30px rgba(245, 158, 11, 0.6)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          zIndex: 9998,
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(245, 158, 11, 0.8)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(245, 158, 11, 0.6)';
        }}
      >
        ↑
      </button>
    </div>
  );
}
