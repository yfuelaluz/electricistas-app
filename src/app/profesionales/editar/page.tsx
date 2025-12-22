'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditarPerfil() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [profesional, setProfesional] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    rut: '',
    email: '',
    telefono: '',
    especialidad: '',
    comunas: '',
    experiencia: '',
    certificaciones: '',
    descripcion: '',
    password: ''
  });

  useEffect(() => {
    // Cargar datos del profesional desde localStorage
    const sessionData = localStorage.getItem('profesional');
    if (!sessionData) {
      router.push('/profesionales/login');
      return;
    }

    const session = JSON.parse(sessionData);
    setProfesional(session);
    setFormData({
      nombreCompleto: session.nombreCompleto || '',
      rut: session.rut || '',
      email: session.email || '',
      telefono: session.telefono || '',
      especialidad: session.especialidad || '',
      comunas: session.comunas || '',
      experiencia: session.experiencia || '',
      certificaciones: session.certificaciones || '',
      descripcion: session.descripcion || '',
      password: ''
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      const response = await fetch(`/api/profesionales/${profesional.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Actualizar sesión en localStorage
        localStorage.setItem('profesional', JSON.stringify(data.profesional));
        setMensaje('✅ Perfil actualizado exitosamente');
        setTimeout(() => {
          router.push('/profesionales/dashboard');
        }, 2000);
      } else {
        setMensaje('❌ Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('❌ Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!profesional) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>Editar Perfil</h1>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '16px'
          }}>Actualiza tu información profesional</p>
        </div>

        {/* Mensaje */}
        {mensaje && (
          <div style={{
            padding: '16px',
            background: mensaje.includes('✅') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `2px solid ${mensaje.includes('✅') ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
            borderRadius: '12px',
            color: 'white',
            marginBottom: '24px',
            textAlign: 'center'
          }}>{mensaje}</div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '24px',
          padding: '40px',
          border: '2px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {/* Nombre Completo */}
            <div style={{gridColumn: '1 / -1'}}>
              <label style={{
                display: 'block',
                color: '#22d3ee',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>Nombre Completo *</label>
              <input
                type="text"
                value={formData.nombreCompleto}
                onChange={(e) => setFormData({...formData, nombreCompleto: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px'
                }}
              />
            </div>

            {/* RUT */}
            <div>
              <label style={{
                display: 'block',
                color: '#22d3ee',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>RUT *</label>
              <input
                type="text"
                value={formData.rut}
                onChange={(e) => setFormData({...formData, rut: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px'
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{
                display: 'block',
                color: '#22d3ee',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px'
                }}
              />
            </div>

            {/* Teléfono */}
            <div>
              <label style={{
                display: 'block',
                color: '#22d3ee',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>Teléfono *</label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px'
                }}
              />
            </div>

            {/* Especialidad */}
            <div>
              <label style={{
                display: 'block',
                color: '#22d3ee',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>Especialidad *</label>
              <input
                type="text"
                value={formData.especialidad}
                onChange={(e) => setFormData({...formData, especialidad: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px'
                }}
              />
            </div>

            {/* Comunas */}
            <div style={{gridColumn: '1 / -1'}}>
              <label style={{
                display: 'block',
                color: '#22d3ee',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>Comunas que atiendes *</label>
              <input
                type="text"
                value={formData.comunas}
                onChange={(e) => setFormData({...formData, comunas: e.target.value})}
                required
                placeholder="Ej: Valparaíso, Viña del Mar, Quilpué"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px'
                }}
              />
            </div>

            {/* Experiencia */}
            <div>
              <label style={{
                display: 'block',
                color: '#22d3ee',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>Años de Experiencia *</label>
              <input
                type="number"
                value={formData.experiencia}
                onChange={(e) => setFormData({...formData, experiencia: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px'
                }}
              />
            </div>

            {/* Certificaciones */}
            <div>
              <label style={{
                display: 'block',
                color: '#22d3ee',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>Certificaciones</label>
              <input
                type="text"
                value={formData.certificaciones}
                onChange={(e) => setFormData({...formData, certificaciones: e.target.value})}
                placeholder="Ej: SEC Clase A, etc."
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px'
                }}
              />
            </div>

            {/* Descripción */}
            <div style={{gridColumn: '1 / -1'}}>
              <label style={{
                display: 'block',
                color: '#22d3ee',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>Descripción de tus servicios *</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                required
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Contraseña (opcional) */}
            <div style={{gridColumn: '1 / -1'}}>
              <label style={{
                display: 'block',
                color: '#22d3ee',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>Nueva Contraseña (dejar en blanco para mantener la actual)</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Solo si quieres cambiarla"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          {/* Botones */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '32px',
            flexWrap: 'wrap'
          }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '16px',
                background: loading ? 'rgba(100,100,100,0.5)' : 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Guardando...' : '💾 Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/profesionales/dashboard')}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '16px',
                background: 'rgba(255,255,255,0.1)',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              ← Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
