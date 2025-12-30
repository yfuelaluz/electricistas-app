'use client';

import { useState, useEffect } from 'react';
import FormularioCotizacion from '@/components/services/FormularioCotizacion';
import AsistenteVirtual from '@/components/ui/AsistenteVirtual';

export default function CotizacionPage() {
  const [mostrarBotonTop, setMostrarBotonTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setMostrarBotonTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Efectos de fondo animados */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 8s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-5%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'float 10s ease-in-out infinite reverse'
      }}></div>

      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(90px)',
        animation: 'pulse 6s ease-in-out infinite'
      }}></div>

      {/* Grid pattern overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px',
        opacity: 0.3
      }}></div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1400px', margin: '0 auto', padding: 'clamp(40px, 10vw, 80px) clamp(16px, 4vw, 20px)' }}>
        {/* Botón volver */}
        <a href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 20px)',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '12px',
          color: 'white',
          textDecoration: 'none',
          fontSize: 'clamp(13px, 2.5vw, 14px)',
          fontWeight: '600',
          marginBottom: 'clamp(24px, 6vw, 40px)',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
          e.currentTarget.style.transform = 'translateX(-4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.transform = 'translateX(0)';
        }}>
          <span style={{ fontSize: '18px' }}>←</span>
          Volver al inicio
        </a>

        {/* Header impactante */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{
              display: 'inline-block',
              padding: '10px 24px',
              background: 'linear-gradient(90deg, rgba(59,130,246,0.2), rgba(168,85,247,0.2))',
              border: '1px solid rgba(59,130,246,0.3)',
              borderRadius: '50px',
              color: '#93c5fd',
              fontSize: '14px',
              fontWeight: '600',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 20px rgba(59,130,246,0.2)'
            }}>
              ⚡ Presupuesto Instantáneo
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: '900',
            color: 'white',
            marginBottom: '24px',
            lineHeight: '1.1',
            textShadow: '0 0 40px rgba(59,130,246,0.5)'
          }}>
            Obtén tu <span style={{
              background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% auto',
              animation: 'gradient 3s linear infinite'
            }}>Cotización</span>
            <br />en Segundos
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#cbd5e1',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.8'
          }}>
            Sistema inteligente de presupuestación. Completa el formulario y obtén
            un precio estimado al instante. <strong style={{ color: '#60a5fa' }}>Sin vueltas, sin sorpresas.</strong>
          </p>
        </div>

        {/* Beneficios con animación */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '60px'
        }}>
          {[
            { icon: '⚡', color: '#3b82f6', title: 'Respuesta Inmediata', desc: 'Cálculo automático y contacto en menos de 24 horas' },
            { icon: '✓', color: '#10b981', title: '100% Gratuito', desc: 'Sin costo, sin compromiso, sin letra chica' },
            { icon: '💰', color: '#a855f7', title: 'Precios Transparentes', desc: 'Presupuestos claros y competitivos del mercado' }
          ].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '32px',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              boxShadow: `0 10px 40px rgba(0,0,0,0.3)`,
              animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.borderColor = `${item.color}80`;
              e.currentTarget.style.boxShadow = `0 20px 60px ${item.color}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)';
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginBottom: '20px',
                boxShadow: `0 10px 30px ${item.color}50`
              }}>
                {item.icon}
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '8px'
              }}>{item.title}</h3>
              <p style={{
                fontSize: '14px',
                color: '#94a3b8',
                lineHeight: '1.6'
              }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Formulario */}
        <FormularioCotizacion />

        {/* Footer Info mejorado */}
        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '16px 24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <p style={{
              color: '#cbd5e1',
              marginBottom: '16px',
              fontSize: '14px',
              fontWeight: '600'
            }}>¿Tienes dudas? Estamos aquí para ayudarte</p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <a href="tel:+56995748162" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  padding: '8px 16px',
                  borderRadius: '10px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59,130,246,0.2)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}>
                  <span style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    boxShadow: '0 10px 30px rgba(59,130,246,0.4)'
                  }}>📱</span>
                  <span style={{ fontWeight: '700', fontSize: '16px' }}>+56 9 95748162</span>
                </a>
                
                <a href="https://wa.me/56995748162" target="_blank" rel="noopener noreferrer" style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  boxShadow: '0 10px 30px rgba(37,211,102,0.4)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(37,211,102,0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(37,211,102,0.4)';
                }}>
                  💬
                </a>
              </div>
              
              <a href="mailto:yfuelaluz@gmail.com" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'white',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                padding: '8px 16px',
                borderRadius: '10px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(168,85,247,0.2)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}>
                <span style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  boxShadow: '0 10px 30px rgba(168,85,247,0.4)'
                }}>📧</span>
                <span style={{ fontWeight: '700', fontSize: '14px' }}>yfuelaluz@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Asistente Virtual */}
      <AsistenteVirtual />

      {/* Botón volver arriba */}
      {mostrarBotonTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            border: '2px solid white',
            boxShadow: '0 6px 20px rgba(245, 158, 11, 0.5)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            zIndex: 9998,
            transition: 'all 0.3s',
            animation: 'fadeIn 0.3s ease-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(245, 158, 11, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.5)';
          }}
        >
          ↑
        </button>
      )}

      {/* Animaciones CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.2); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
