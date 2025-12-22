"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginProfesional() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      // Obtener profesionales
      const response = await fetch('/api/profesionales');
      const profesionales = await response.json();

      // Buscar TODOS los perfiles con este email y password
      const perfilesUsuario = profesionales.filter(
        (p: { email: string; password: string }) => 
          p.email === formData.email && p.password === formData.password
      );

      if (perfilesUsuario.length > 0) {
        // Guardar todos los perfiles en localStorage
        localStorage.setItem('profesional', JSON.stringify(perfilesUsuario[0])); // Perfil principal
        localStorage.setItem('todosLosPerfiles', JSON.stringify(perfilesUsuario)); // Todos los perfiles
        setMensaje(`✅ Bienvenido! (${perfilesUsuario.length} perfiles encontrados)`);
        setTimeout(() => {
          router.push('/profesionales/dashboard');
        }, 1000);
      } else {
        setMensaje("❌ Email o contraseña incorrectos");
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje("❌ Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
        maxWidth: '500px',
        width: '100%',
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
        }}>Iniciar Sesión</h1>

        <p style={{
          color: 'rgba(255,255,255,0.7)',
          textAlign: 'center',
          marginBottom: '32px',
          fontSize: '16px'
        }}>
          Accede a tu cuenta de profesional
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
            <div>
              <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Email
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

            <div>
              <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
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
                Volver
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
                {loading ? 'Verificando...' : 'Ingresar'}
              </button>
            </div>
          </div>
        </form>

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.7)'
        }}>
          ¿No tienes cuenta?{' '}
          <span
            onClick={() => router.push('/profesionales/registro')}
            style={{
              color: '#22d3ee',
              cursor: 'pointer',
              fontWeight: 'bold',
              textDecoration: 'underline'
            }}
          >
            Regístrate aquí
          </span>
        </div>
      </div>
    </div>
  );
}
