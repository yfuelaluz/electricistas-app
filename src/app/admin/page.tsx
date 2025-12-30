'use client';
import Link from 'next/link';

export default function AdminHomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1000px',
        width: '100%'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          padding: '40px',
          borderRadius: '20px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 16px' }}>
            ⚡ Panel de Administración
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.9, margin: 0 }}>
            Electricistas Chile - Gestión Completa
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          <AdminCard
            href="/admin/transactions"
            icon="💰"
            title="Transacciones"
            description="Ver todas las transacciones de Transbank"
            color="#10b981"
          />
          
          <AdminCard
            href="/admin/stats"
            icon="📊"
            title="Estadísticas"
            description="Gráficos y métricas de ventas"
            color="#3b82f6"
          />
          
          <AdminCard
            href="/admin/professionals"
            icon="👷"
            title="Profesionales"
            description="Gestionar electricistas y carpinteros"
            color="#f59e0b"
          />
          
          <AdminCard
            href="/admin/clients"
            icon="👥"
            title="Clientes"
            description="Ver y administrar clientes"
            color="#8b5cf6"
          />
          
          <AdminCard
            href="/admin/chats"
            icon="💬"
            title="Chats"
            description="Monitorear conversaciones activas"
            color="#06b6d4"
          />
          
          <AdminCard
            href="/admin/settings"
            icon="⚙️"
            title="Configuración"
            description="Ajustes del sistema"
            color="#6b7280"
          />
        </div>

        <div style={{
          marginTop: '40px',
          textAlign: 'center'
        }}>
          <Link
            href="/"
            style={{
              color: 'white',
              textDecoration: 'none',
              opacity: 0.7,
              fontSize: '14px'
            }}
          >
            ← Volver al sitio principal
          </Link>
        </div>
      </div>
    </div>
  );
}

function AdminCard({ href, icon, title, description, color }: {
  href: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        borderLeft: `4px solid ${color}`,
        height: '100%'
      }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>
        <h3 style={{ margin: '0 0 8px', fontSize: '24px', color: '#1f2937' }}>
          {title}
        </h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
          {description}
        </p>
      </div>
    </Link>
  );
}
