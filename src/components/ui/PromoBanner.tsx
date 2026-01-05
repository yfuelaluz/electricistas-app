"use client";
import { useState, useEffect } from 'react';

interface PromoData {
  codigo: string;
  descripcion: string;
  porcentaje_descuento: number;
  fecha_inicio: string;
  fecha_fin: string;
  activa: boolean;
}

export default function PromoBanner() {
  const [promo, setPromo] = useState<PromoData | null>(null);
  const [mostrar, setMostrar] = useState(true);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    fetch('/api/promo/stats')
      .then(res => res.json())
      .then(data => {
        if (data.promoActiva) {
          setPromo(data.promoActiva);
        }
      })
      .catch(err => console.error('Error cargando promo:', err));
  }, []);

  if (!promo || !mostrar) return null;

  const copiarCodigo = () => {
    navigator.clipboard.writeText(promo.codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const calcularDiasRestantes = () => {
    const hoy = new Date();
    const fin = new Date(promo.fecha_fin);
    const diff = fin.getTime() - hoy.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const diasRestantes = calcularDiasRestantes();

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
      padding: '20px',
      marginBottom: '20px',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(251, 191, 36, 0.4)',
      overflow: 'hidden',
      animation: 'slideIn 0.6s ease-out'
    }}>
      {/* Botón cerrar */}
      <button
        onClick={() => setMostrar(false)}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(0,0,0,0.2)',
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
          transition: 'all 0.3s ease',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.2)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        ×
      </button>

      {/* Decoración de fondo */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        zIndex: 0
      }}></div>

      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        {/* Contenido principal */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <span style={{ fontSize: '40px' }}>🎉</span>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: '800',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
              }}>
                ¡OFERTA ESPECIAL!
              </h3>
              <p style={{
                margin: 0,
                fontSize: '16px',
                color: '#fff',
                opacity: 0.95
              }}>
                {promo.descripcion}
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginTop: '16px',
            flexWrap: 'wrap'
          }}>
            {/* Badge descuento */}
            <div style={{
              background: 'rgba(220, 38, 38, 0.95)',
              padding: '8px 20px',
              borderRadius: '50px',
              fontSize: '20px',
              fontWeight: '900',
              color: 'white',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
              border: '2px solid white'
            }}>
              {promo.porcentaje_descuento}% OFF
            </div>

            {/* Código promocional */}
            <div style={{
              background: 'white',
              padding: '10px 20px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              <div>
                <div style={{
                  fontSize: '11px',
                  color: '#64748b',
                  fontWeight: '600',
                  marginBottom: '2px'
                }}>
                  CÓDIGO
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '900',
                  color: '#d97706',
                  letterSpacing: '1px'
                }}>
                  {promo.codigo}
                </div>
              </div>
              <button
                onClick={copiarCodigo}
                style={{
                  background: copiado ? '#10b981' : '#f59e0b',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (!copiado) e.currentTarget.style.background = '#d97706';
                }}
                onMouseLeave={(e) => {
                  if (!copiado) e.currentTarget.style.background = '#f59e0b';
                }}
              >
                {copiado ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        </div>

        {/* Contador de días */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          padding: '20px',
          borderRadius: '16px',
          textAlign: 'center',
          minWidth: '140px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }}>
          <div style={{
            fontSize: '40px',
            fontWeight: '900',
            color: '#dc2626',
            marginBottom: '4px',
            lineHeight: 1
          }}>
            {diasRestantes}
          </div>
          <div style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#64748b',
            textTransform: 'uppercase'
          }}>
            {diasRestantes === 1 ? 'Día restante' : 'Días restantes'}
          </div>
          <div style={{
            fontSize: '11px',
            color: '#94a3b8',
            marginTop: '8px'
          }}>
            ¡Aprovecha ahora!
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
