'use client';

import { useState, useEffect } from 'react';
import { TipoServicio, Urgencia, SolicitudCotizacion } from '@/types/cotizacion';
import { calcularPresupuestoEstimado, formatearPrecio } from '@/lib/calculadora-precios';

const TIPOS_SERVICIO: { value: TipoServicio; label: string; descripcion: string }[] = [
  { value: 'instalacion-electrica', label: 'Instalación Eléctrica', descripcion: 'Nueva instalación o ampliación' },
  { value: 'reparacion-emergencia', label: 'Reparación de Emergencia', descripcion: 'Fallas urgentes' },
  { value: 'proyecto-construccion', label: 'Proyecto de Construcción', descripcion: 'Obra nueva completa' },
  { value: 'iluminacion', label: 'Iluminación', descripcion: 'Diseño e instalación de luces' },
  { value: 'panel-solar', label: 'Panel Solar', descripcion: 'Energía fotovoltaica' },
  { value: 'automatizacion', label: 'Automatización', descripcion: 'Domótica y control inteligente' },
  { value: 'certificacion', label: 'Certificación SEC', descripcion: 'Tramites y certificados' },
];

export default function FormularioCotizacion() {
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [presupuestoEstimado, setPresupuestoEstimado] = useState<number>(0);
  
  const [formData, setFormData] = useState<SolicitudCotizacion>({
    cliente: {
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
      comuna: '',
    },
    servicio: {
      tipo: 'instalacion-electrica',
      descripcion: '',
      urgencia: 'normal',
    },
  });

  useEffect(() => {
    const estimado = calcularPresupuestoEstimado({
      tipo: formData.servicio.tipo,
      urgencia: formData.servicio.urgencia,
      metrosCuadrados: formData.servicio.metrosCuadrados,
      puntosDeLuz: formData.servicio.puntosDeLuz,
    });
    setPresupuestoEstimado(estimado);
  }, [
    formData.servicio.tipo,
    formData.servicio.urgencia,
    formData.servicio.metrosCuadrados,
    formData.servicio.puntosDeLuz,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const response = await fetch('/api/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al enviar');

      setExito(true);
      setFormData({
        cliente: { nombre: '', email: '', telefono: '', direccion: '', comuna: '' },
        servicio: { tipo: 'instalacion-electrica', descripcion: '', urgencia: 'normal' },
      });
      
      setTimeout(() => setExito(false), 5000);
    } catch (error) {
      alert('Error al enviar la cotización. Intenta nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: '8px'
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Sección Cliente */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '32px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(59,130,246,0.4)'
          }}>
            <span style={{ fontSize: '24px' }}>👤</span>
          </div>
          <h3 style={{ fontSize: '28px', fontWeight: '800', color: 'white', margin: 0 }}>Tus Datos</h3>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Nombre Completo *</label>
            <input
              type="text"
              required
              value={formData.cliente.nombre}
              onChange={(e) => setFormData({
                ...formData,
                cliente: { ...formData.cliente, nombre: e.target.value }
              })}
              style={inputStyle}
              placeholder="Juan Pérez"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div>
            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              required
              value={formData.cliente.email}
              onChange={(e) => setFormData({
                ...formData,
                cliente: { ...formData.cliente, email: e.target.value }
              })}
              style={inputStyle}
              placeholder="juan@email.com"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div>
            <label style={labelStyle}>Teléfono *</label>
            <input
              type="tel"
              required
              value={formData.cliente.telefono}
              onChange={(e) => setFormData({
                ...formData,
                cliente: { ...formData.cliente, telefono: e.target.value }
              })}
              style={inputStyle}
              placeholder="+569 1234 5678"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div>
            <label style={labelStyle}>Comuna *</label>
            <input
              type="text"
              required
              value={formData.cliente.comuna}
              onChange={(e) => setFormData({
                ...formData,
                cliente: { ...formData.cliente, comuna: e.target.value }
              })}
              style={inputStyle}
              placeholder="Santiago"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Dirección</label>
            <input
              type="text"
              value={formData.cliente.direccion}
              onChange={(e) => setFormData({
                ...formData,
                cliente: { ...formData.cliente, direccion: e.target.value }
              })}
              style={inputStyle}
              placeholder="Av. Libertador 1234"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
      </div>

      {/* Sección Servicio */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '32px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(168,85,247,0.4)'
          }}>
            <span style={{ fontSize: '24px' }}>⚡</span>
          </div>
          <h3 style={{ fontSize: '28px', fontWeight: '800', color: 'white', margin: 0 }}>Servicio Requerido</h3>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Tipo de Servicio *</label>
            <select
              required
              value={formData.servicio.tipo}
              onChange={(e) => setFormData({
                ...formData,
                servicio: { ...formData.servicio, tipo: e.target.value as TipoServicio }
              })}
              style={{
                ...inputStyle,
                cursor: 'pointer'
              }}
            >
              {TIPOS_SERVICIO.map(tipo => (
                <option key={tipo.value} value={tipo.value} style={{ background: '#1e293b', color: 'white' }}>
                  {tipo.label} - {tipo.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Urgencia *</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(['normal', 'urgente', 'emergencia'] as Urgencia[]).map(urgencia => (
                <label
                  key={urgencia}
                  style={{
                    cursor: 'pointer',
                    padding: '20px',
                    border: formData.servicio.urgencia === urgencia 
                      ? '2px solid #3b82f6' 
                      : '2px solid rgba(255,255,255,0.15)',
                    borderRadius: '16px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    background: formData.servicio.urgencia === urgencia 
                      ? 'rgba(59,130,246,0.2)' 
                      : 'rgba(255,255,255,0.05)',
                    boxShadow: formData.servicio.urgencia === urgencia
                      ? '0 10px 30px rgba(59,130,246,0.3)'
                      : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (formData.servicio.urgencia !== urgencia) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (formData.servicio.urgencia !== urgencia) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="urgencia"
                    value={urgencia}
                    checked={formData.servicio.urgencia === urgencia}
                    onChange={(e) => setFormData({
                      ...formData,
                      servicio: { ...formData.servicio, urgencia: e.target.value as Urgencia }
                    })}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: '18px', fontWeight: '700', color: 'white', textTransform: 'capitalize' }}>
                    {urgencia}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {formData.servicio.tipo === 'instalacion-electrica' && (
            <div>
              <label style={labelStyle}>Cantidad de Puntos de Luz</label>
              <input
                type="number"
                min="0"
                value={formData.servicio.puntosDeLuz || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  servicio: { ...formData.servicio, puntosDeLuz: parseInt(e.target.value) || undefined }
                })}
                style={inputStyle}
                placeholder="Ej: 15"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#a855f7';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(168,85,247,0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          )}

          {formData.servicio.tipo === 'proyecto-construccion' && (
            <div>
              <label style={labelStyle}>Metros Cuadrados</label>
              <input
                type="number"
                min="0"
                value={formData.servicio.metrosCuadrados || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  servicio: { ...formData.servicio, metrosCuadrados: parseInt(e.target.value) || undefined }
                })}
                style={inputStyle}
                placeholder="Ej: 120"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#a855f7';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(168,85,247,0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          )}

          <div>
            <label style={labelStyle}>Descripción del Trabajo *</label>
            <textarea
              required
              rows={4}
              value={formData.servicio.descripcion}
              onChange={(e) => setFormData({
                ...formData,
                servicio: { ...formData.servicio, descripcion: e.target.value }
              })}
              placeholder="Describe lo más detallado posible el trabajo que necesitas..."
              style={{
                ...inputStyle,
                resize: 'vertical',
                minHeight: '120px',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#a855f7';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(168,85,247,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
      </div>

      {/* Presupuesto Estimado */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '24px',
        transform: 'translateZ(0)', // Forzar aceleración GPU
        backfaceVisibility: 'hidden' // Prevenir flickering
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
          boxShadow: '0 0 60px rgba(59,130,246,0.5)',
          willChange: 'transform' // Optimización de rendering
        }}></div>
        <div style={{
          position: 'relative',
          background: 'rgba(59,130,246,0.95)',
          backdropFilter: 'blur(10px)',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(59,130,246,0.4)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#ddd', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              Presupuesto Estimado
            </p>
            <p style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: '900', color: 'white', margin: 0, textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              {formatearPrecio(presupuestoEstimado)}
            </p>
            <p style={{ fontSize: '13px', color: '#e0e7ff', opacity: 0.9 }}>
              *Precio referencial, sujeto a evaluación técnica
            </p>
          </div>
        </div>
      </div>

      {/* Botón Enviar */}
      <button
        type="submit"
        disabled={enviando}
        style={{
          padding: '20px 40px',
          background: enviando ? '#64748b' : 'linear-gradient(90deg, #3b82f6, #2563eb)',
          color: 'white',
          fontSize: '18px',
          fontWeight: '700',
          border: 'none',
          borderRadius: '16px',
          cursor: enviando ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 10px 40px rgba(59,130,246,0.4)',
          opacity: enviando ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (!enviando) {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 15px 50px rgba(59,130,246,0.6)';
          }
        }}
        onMouseLeave={(e) => {
          if (!enviando) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 40px rgba(59,130,246,0.4)';
          }
        }}
      >
        {enviando ? '⏳ Enviando...' : '⚡ Solicitar Cotización Ahora'}
      </button>

      {/* Mensaje de éxito */}
      {exito && (
        <div style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 20px 60px rgba(16,185,129,0.4)',
          animation: 'slideIn 0.4s ease-out'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px'
          }}>
            ✓
          </div>
          <div>
            <p style={{ fontSize: '20px', fontWeight: '700', color: 'white', margin: 0, marginBottom: '4px' }}>
              ¡Cotización enviada exitosamente!
            </p>
            <p style={{ fontSize: '14px', color: '#d1fae5', margin: 0 }}>
              Nos pondremos en contacto contigo pronto. Revisa tu email.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </form>
  );
}
