"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PromoBanner from "@/components/ui/PromoBanner";

export const dynamic = 'force-dynamic';

function RegistroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [planPagado, setPlanPagado] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [cuposRestantes, setCuposRestantes] = useState(25);
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    rut: "",
    email: "",
    telefono: "",
    especialidad: "",
    comunas: "",
    experiencia: "",
    certificaciones: "",
    descripcion: "",
    password: "",
    fotoPerfil: ""
  });

  // Cargar estadísticas de promoción
  useEffect(() => {
    const fetchPromoStats = async () => {
      try {
        const response = await fetch('/api/promo/stats');
        if (response.ok) {
          const data = await response.json();
          setCuposRestantes(data.profesionales_restantes);
        }
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
      }
    };

    fetchPromoStats();
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchPromoStats, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Verificar si viene de un pago exitoso
    const plan = searchParams.get('plan');
    const pago = searchParams.get('pago');
    const promo = searchParams.get('promo');
    
    if (plan && pago === 'exitoso') {
      setPlanPagado(plan);
      setMensaje("✅ Pago procesado exitosamente. Completa tu registro:");
    }

    // Capturar código de promoción
    if (promo) {
      setPromoCode(promo);
    }
  }, [searchParams]);

  const especialidades = [
    "Electricista",
    "Carpintero",
    "Mueblista",
    "Gasfiter",
    "Pintor",
    "Soldador",
    "Constructor",
    "Dibujante de Planos",
    "Tramitador SEC",
    "Instalador Fotovoltaico"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      console.log('🚀 Enviando registro:', formData);
      
      const response = await fetch('/api/profesionales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreCompleto: formData.nombreCompleto,
          rut: formData.rut,
          email: formData.email,
          telefono: formData.telefono,
          password: formData.password,
          especialidad: formData.especialidad,
          comunas: formData.comunas ? formData.comunas.split(',').map(c => c.trim()) : [],
          experiencia: formData.experiencia ? parseInt(formData.experiencia) : 0,
          certificaciones: formData.certificaciones,
          descripcion: formData.descripcion,
          fotoPerfil: formData.fotoPerfil,
          plan: planPagado || 'starter',
          promoCode: promoCode // Incluir código de promoción
        })
      });

      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📦 Response data:', data);

      if (data.success) {
        setMensaje("✅ " + data.mensaje);
        setTimeout(() => {
          router.push('/profesionales/login');
        }, 2000);
      } else {
        // Mostrar error específico de la API
        const errorMsg = data.error || "Error al registrar. Intenta nuevamente.";
        console.error('Error de registro:', data);
        setMensaje("❌ " + errorMsg);
      }
    } catch (error: any) {
      console.error('❌ Error completo:', error);
      console.error('Error tipo:', error.constructor.name);
      console.error('Error mensaje:', error.message);
      setMensaje(`❌ Error al conectar: ${error.message || 'Intenta nuevamente'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)',
      padding: '40px 20px'
    }}>
      {/* Banner Promocional */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", paddingBottom: "20px" }}>
        <PromoBanner />
      </div>
      
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '40px',
        border: '2px solid rgba(34,211,238,0.3)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '900',
          background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px',
          textAlign: 'center'
        }}>Registro de Profesionales</h1>

        {promoCode && cuposRestantes > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            border: '3px solid #fbbf24',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(245,158,11,0.4)',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎁</div>
            <h3 style={{ 
              color: '#fff', 
              fontWeight: 'bold', 
              margin: 0, 
              fontSize: '24px',
              marginBottom: '8px'
            }}>
              ¡PROMOCIÓN ESPECIAL 2X1!
            </h3>
            <p style={{ 
              color: '#fff', 
              margin: 0,
              fontSize: '16px',
              marginBottom: '12px'
            }}>
              2 meses por el precio de 1 - Solo {cuposRestantes} cupos disponibles
            </p>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '8px',
              padding: '12px',
              display: 'inline-block'
            }}>
              <div style={{ 
                fontSize: '40px', 
                fontWeight: 'bold', 
                color: '#fff',
                lineHeight: '1'
              }}>
                {cuposRestantes}
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#fff',
                opacity: 0.9
              }}>
                cupos restantes
              </div>
            </div>
          </div>
        )}

        {planPagado && (
          <div style={{
            background: 'rgba(34,197,94,0.2)',
            border: '2px solid rgba(34,197,94,0.5)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#22c55e', fontWeight: 'bold', margin: 0, fontSize: '16px' }}>
              💳 Plan: {planPagado.includes('PRO-S') ? 'Starter' : planPagado.includes('PRO-P') ? 'Pro' : planPagado.includes('PRO-E') ? 'Elite' : 'Profesional'}
            </p>
          </div>
        )}

        <p style={{
          color: 'rgba(255,255,255,0.7)',
          textAlign: 'center',
          marginBottom: '32px',
          fontSize: '16px'
        }}>
          {planPagado ? 'Completa tus datos para activar tu cuenta' : 'Únete a nuestra red de profesionales verificados'}
        </p>

        {mensaje && (
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '24px',
            background: mensaje.includes('✅') 
              ? 'rgba(34,197,94,0.2)' 
              : 'rgba(239,68,68,0.2)',
            border: mensaje.includes('✅')
              ? '2px solid rgba(34,197,94,0.5)'
              : '2px solid rgba(239,68,68,0.5)',
            color: 'white',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '24px' }}>
            {/* Nombre Completo */}
            <div>
              <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Nombre Completo *
              </label>
              <input
                type="text"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid rgba(34,211,238,0.3)',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  fontSize: '16px'
                }}
              />
            </div>

            {/* Foto de Perfil */}
            <div>
              <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Foto de Perfil (opcional)
              </label>
              
              {/* Botón para seleccionar archivo */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setFormData({...formData, fotoPerfil: event.target?.result as string});
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '24px',
                  borderRadius: '8px',
                  border: '2px dashed rgba(34,211,238,0.5)',
                  background: 'rgba(34,211,238,0.05)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  marginBottom: '12px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = '2px dashed rgba(34,211,238,0.8)';
                  e.currentTarget.style.background = 'rgba(34,211,238,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = '2px dashed rgba(34,211,238,0.5)';
                  e.currentTarget.style.background = 'rgba(34,211,238,0.05)';
                }}
              >
                <p style={{color: '#22d3ee', fontWeight: 'bold', margin: '0 0 8px 0'}}>
                  📷 Haz clic para seleccionar tu foto
                </p>
                <p style={{color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: 0}}>
                  Selecciona una imagen desde tu dispositivo
                </p>
              </label>

              {/* O pegar URL */}
              <div style={{textAlign: 'center', color: 'rgba(255,255,255,0.5)', margin: '12px 0', fontSize: '14px'}}>
                — O pega una URL —
              </div>

              <input
                type="text"
                name="fotoPerfil"
                value={formData.fotoPerfil.startsWith('data:') ? '' : formData.fotoPerfil}
                onChange={handleChange}
                placeholder="https://ejemplo.com/mi-foto.jpg"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid rgba(34,211,238,0.3)',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  fontSize: '16px'
                }}
              />

              {/* Vista previa */}
              {formData.fotoPerfil && (
                <div style={{
                  marginTop: '16px',
                  textAlign: 'center',
                  padding: '16px',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid rgba(34,211,238,0.5)',
                    margin: '0 auto',
                    background: 'rgba(0,0,0,0.5)'
                  }}>
                    <img 
                      src={formData.fotoPerfil} 
                      alt="Vista previa"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <p style={{color: 'rgba(255,255,255,0.5)', marginTop: '12px', fontSize: '13px'}}>
                    ✓ Vista previa de tu foto
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, fotoPerfil: ''})}
                    style={{
                      marginTop: '8px',
                      padding: '8px 16px',
                      background: 'rgba(239,68,68,0.2)',
                      border: '1px solid rgba(239,68,68,0.5)',
                      borderRadius: '6px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    🗑️ Eliminar foto
                  </button>
                </div>
              )}
            </div>

            {/* RUT y Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  RUT *
                </label>
                <input
                  type="text"
                  name="rut"
                  value={formData.rut}
                  onChange={handleChange}
                  placeholder="12.345.678-9"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid rgba(34,211,238,0.3)',
                    background: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div>
                <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid rgba(34,211,238,0.3)',
                    background: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />
              </div>
            </div>

            {/* Teléfono y Especialidad */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+56 9 1234 5678"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid rgba(34,211,238,0.3)',
                    background: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div>
                <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Especialidad *
                </label>
                <select
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid rgba(34,211,238,0.3)',
                    background: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Selecciona...</option>
                  {especialidades.map(esp => (
                    <option key={esp} value={esp} style={{ background: '#1e1b4b' }}>
                      {esp}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comunas de atención */}
            <div>
              <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Comunas donde atiendes *
              </label>
              <input
                type="text"
                name="comunas"
                value={formData.comunas}
                onChange={handleChange}
                placeholder="Ej: Santiago, Providencia, Las Condes"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid rgba(34,211,238,0.3)',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  fontSize: '16px'
                }}
              />
            </div>

            {/* Años de experiencia */}
            <div>
              <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Años de experiencia *
              </label>
              <input
                type="number"
                name="experiencia"
                value={formData.experiencia}
                onChange={handleChange}
                min="0"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid rgba(34,211,238,0.3)',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  fontSize: '16px'
                }}
              />
            </div>

            {/* Certificaciones */}
            <div>
              <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Certificaciones (opcional)
              </label>
              <textarea
                name="certificaciones"
                value={formData.certificaciones}
                onChange={handleChange}
                placeholder="Ej: SEC Clase A, MINEDUC certificado..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid rgba(34,211,238,0.3)',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  fontSize: '16px',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Descripción */}
            <div>
              <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Descripción de tus servicios *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Cuéntanos sobre tu experiencia y servicios..."
                rows={4}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid rgba(34,211,238,0.3)',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  fontSize: '16px',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Contraseña *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid rgba(34,211,238,0.3)',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  fontSize: '16px'
                }}
              />
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '4px' }}>
                Mínimo 6 caracteres
              </p>
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => router.push('/')}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '12px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  background: 'transparent',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: loading 
                    ? 'rgba(100,100,100,0.5)' 
                    : 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 8px 32px rgba(34,211,238,0.5)'
                }}
              >
                {loading ? 'Registrando...' : 'Registrarme'}
              </button>
            </div>
          </div>
        </form>

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.7)'
        }}>
          ¿Ya tienes cuenta?{' '}
          <span
            onClick={() => router.push('/profesionales/login')}
            style={{
              color: '#22d3ee',
              cursor: 'pointer',
              fontWeight: 'bold',
              textDecoration: 'underline'
            }}
          >
            Inicia sesión aquí
          </span>
        </div>
      </div>
    </div>
  );
}

export default function RegistroProfesional() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)' }}>
        <p style={{ color: 'white', fontSize: '20px' }}>Cargando...</p>
      </div>
    }>
      <RegistroForm />
    </Suspense>
  );
}