"use client";
import { useState } from "react";

export default function AsistenteVirtual() {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviarWhatsApp = () => {
    if (!mensaje.trim()) return;
    
    setEnviando(true);
    const mensajeFormateado = `🚨 *CONSULTA URGENTE - Asistente Virtual*%0A%0A` +
      `💬 *Mensaje:* ${mensaje}%0A%0A` +
      `⏰ *Hora:* ${new Date().toLocaleString('es-ES')}`;
    
    const whatsappUrl = `https://wa.me/56995748162?text=${mensajeFormateado}`;
    window.open(whatsappUrl, '_blank');
    
    setTimeout(() => {
      setMensaje("");
      setEnviando(false);
      setAbierto(false);
    }, 1000);
  };

  return (
    <>
      {/* Botón flotante */}
      {!abierto && (
        <button
          onClick={() => setAbierto(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            border: '3px solid white',
            boxShadow: '0 8px 30px rgba(59, 130, 246, 0.6)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            zIndex: 9999,
            transition: 'all 0.3s',
            animation: 'pulse 2s infinite'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(59, 130, 246, 0.6)';
          }}
        >
          👷
        </button>
      )}

      {/* Ventana de chat */}
      {abierto && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '350px',
          maxWidth: 'calc(100vw - 48px)',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '20px',
          border: '3px solid #3b82f6',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
          zIndex: 10000,
          overflow: 'hidden',
          animation: 'slideUp 0.3s ease-out'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px'
              }}>
                👷
              </div>
              <div>
                <div style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>
                  Asistente Virtual
                </div>
                <div style={{
                  color: '#bfdbfe',
                  fontSize: '12px'
                }}>
                  ● En línea
                </div>
              </div>
            </div>
            <button
              onClick={() => setAbierto(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
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
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '24px' }}>
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <p style={{
                color: '#60a5fa',
                fontSize: '15px',
                margin: 0,
                lineHeight: '1.5'
              }}>
                👋 ¡Hola! Soy tu asistente virtual.
                <br />
                <strong>¿En qué te puedo ayudar?</strong>
              </p>
            </div>

            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe tu consulta aquí..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '16px',
                borderRadius: '12px',
                border: '2px solid rgba(148, 163, 184, 0.3)',
                background: 'rgba(30, 41, 59, 0.5)',
                color: 'white',
                fontSize: '15px',
                resize: 'vertical',
                marginBottom: '16px',
                fontFamily: 'inherit'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  enviarWhatsApp();
                }
              }}
            />

            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={enviarWhatsApp}
                disabled={!mensaje.trim() || enviando}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: mensaje.trim() && !enviando
                    ? 'linear-gradient(90deg, #10b981, #059669)'
                    : 'rgba(148, 163, 184, 0.3)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: mensaje.trim() && !enviando ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (mensaje.trim() && !enviando) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {enviando ? '⏳ Enviando...' : '📱 Enviar WhatsApp'}
              </button>
            </div>

            <p style={{
              fontSize: '12px',
              color: '#94a3b8',
              textAlign: 'center',
              marginTop: '12px',
              marginBottom: 0
            }}>
              💡 Respuesta urgente vía WhatsApp
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
