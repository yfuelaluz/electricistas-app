'use client';

import { useState } from 'react';

export default function TestWebpayPage() {
  const [monto, setMonto] = useState('10000');
  const [descripcion, setDescripcion] = useState('Pago de prueba');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePagar = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/webpay/crear-pago?monto=${monto}&descripcion=${encodeURIComponent(descripcion)}&plan=test`
      );
      
      const data = await response.json();

      if (data.success && data.url && data.token) {
        // Crear formulario y redirigir a Webpay
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.url;

        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = 'token_ws';
        tokenInput.value = data.token;
        form.appendChild(tokenInput);

        document.body.appendChild(form);
        form.submit();
      } else {
        setError('Error al crear la transacción: ' + (data.error || 'Error desconocido'));
        setLoading(false);
      }
    } catch (err) {
      setError('Error de red: ' + (err instanceof Error ? err.message : 'Error desconocido'));
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)',
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '40px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '900',
            background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            🧪 Test Webpay Plus
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Prueba de integración con Transbank
          </p>
        </div>

        {/* Información de ambiente */}
        <div style={{
          background: 'rgba(59,130,246,0.1)',
          border: '2px solid #3b82f6',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '30px'
        }}>
          <p style={{ color: '#60a5fa', fontSize: '14px', margin: 0, fontWeight: '600' }}>
            ℹ️ Ambiente: INTEGRACIÓN (Pruebas)
          </p>
          <p style={{ color: '#93c5fd', fontSize: '12px', margin: '8px 0 0 0' }}>
            Usa las tarjetas de prueba de Transbank
          </p>
        </div>

        {/* Formulario */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{
              display: 'block',
              color: '#cbd5e1',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Monto (CLP)
            </label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                background: 'rgba(255,255,255,0.05)',
                border: '2px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600'
              }}
              min="50"
              step="100"
            />
            <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0 0' }}>
              Mínimo: $50 CLP
            </p>
          </div>

          <div>
            <label style={{
              display: 'block',
              color: '#cbd5e1',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Descripción
            </label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                background: 'rgba(255,255,255,0.05)',
                border: '2px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px'
              }}
              placeholder="Ej: Pago de suscripción mensual"
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '2px solid #ef4444',
              borderRadius: '12px',
              padding: '16px',
              color: '#fca5a5',
              fontSize: '14px'
            }}>
              ❌ {error}
            </div>
          )}

          <button
            onClick={handlePagar}
            disabled={loading || !monto || parseInt(monto) < 50}
            style={{
              padding: '18px 32px',
              background: loading ? '#64748b' : 'linear-gradient(90deg, #3b82f6, #2563eb)',
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              border: 'none',
              borderRadius: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 10px 40px rgba(59,130,246,0.4)',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 15px 50px rgba(59,130,246,0.6)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(59,130,246,0.4)';
              }
            }}
          >
            {loading ? '⏳ Creando transacción...' : '💳 Pagar con Webpay'}
          </button>
        </div>

        {/* Tarjetas de prueba */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'rgba(16,185,129,0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(16,185,129,0.2)'
        }}>
          <h3 style={{ color: '#10b981', fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
            💳 Tarjetas de Prueba Transbank
          </h3>
          
          <div style={{ fontSize: '13px', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
              <strong style={{ color: '#10b981' }}>✅ Aprobada:</strong> 4051 8856 0044 6623
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                CVV: 123 | Fecha: cualquiera futura | RUT: 11.111.111-1
              </div>
            </div>
            
            <div style={{ padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
              <strong style={{ color: '#ef4444' }}>❌ Rechazada:</strong> 4051 8842 3993 7763
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                Para probar flujo de rechazo
              </div>
            </div>
          </div>
        </div>

        {/* Botón volver */}
        <a href="/" style={{
          display: 'block',
          textAlign: 'center',
          marginTop: '30px',
          color: '#60a5fa',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          ← Volver al inicio
        </a>
      </div>
    </div>
  );
}
