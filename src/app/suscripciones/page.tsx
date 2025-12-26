'use client';
import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '../../components/ui/Navigation';
import Footer from '../../components/ui/Footer';
import SubscriptionPlans from '../../components/services/SubscriptionPlans';
import { Button } from '../../components/ui/button';

export default function SuscripcionesPage() {
  const [userType, setUserType] = useState<'client' | 'professional'>('client');
  const searchParams = useSearchParams();
  const pagoExitoso = useMemo(() => searchParams.get('pago') === 'exitoso', [searchParams]);
  const plan = useMemo(() => searchParams.get('plan'), [searchParams]);

  const planLabel = plan ? plan.replace('cliente-', '').replace('-', ' ') : 'cliente';
  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.08)',
    color: 'white',
    outline: 'none'
  };

  const handleSelectPlan = (planId: string) => {
    console.log('Plan seleccionado:', planId);
    alert(`Has seleccionado el plan: ${planId}`);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0b1224 100%)', color: 'white' }}>
      <Navigation />

      <main className="flex-1">
        {pagoExitoso && (
          <div className="px-4 pt-6">
            <div style={{
              maxWidth: '1080px',
              margin: '0 auto',
              background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(37,99,235,0.08))',
              border: '1px solid rgba(34,197,94,0.25)',
              borderRadius: '20px',
              padding: '18px 20px',
              boxShadow: '0 15px 40px rgba(34,197,94,0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '22px'
                }}>✓</div>
                <div>
                  <p style={{ margin: 0, color: '#bbf7d0', fontWeight: 700 }}>Pago confirmado</p>
                  <p style={{ margin: 0, color: 'white', fontWeight: 800 }}>Plan activado: {planLabel}</p>
                </div>
                <a href="/suscripciones#registro-cliente" style={{ marginLeft: 'auto', textDecoration: 'none' }}>
                  <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold">Ir a registro</Button>
                </a>
              </div>
            </div>
          </div>
        )}

        <section className="relative py-16 sm:py-20">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25), transparent 40%), radial-gradient(circle at 80% 10%, rgba(168,85,247,0.22), transparent 38%), radial-gradient(circle at 50% 60%, rgba(16,185,129,0.2), transparent 45%)' }} />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight" style={{ color: '#7dd3fc' }}>
              Elige el plan perfecto
              <span className="block" style={{ color: 'white' }}>y activa tu acceso</span>
            </h1>
            <p className="text-lg sm:text-xl" style={{ color: '#cbd5f5', maxWidth: '780px', margin: '0 auto 24px' }}>
              Suscripción activa. Completa tu registro de cliente y empieza a usar la plataforma de inmediato.
            </p>
            <div className="inline-flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '999px', padding: '8px 10px' }}>
              <button
                onClick={() => setUserType('client')}
                className={`px-5 py-2 rounded-full font-semibold ${userType === 'client' ? 'bg-white text-slate-900 shadow-lg' : 'text-white hover:bg-white/10'}`}
              >Soy Cliente</button>
              <button
                onClick={() => setUserType('professional')}
                className={`px-5 py-2 rounded-full font-semibold ${userType === 'professional' ? 'bg-white text-slate-900 shadow-lg' : 'text-white hover:bg-white/10'}`}
              >Soy Profesional</button>
            </div>
          </div>
        </section>

        {pagoExitoso && (
          <section id="registro-cliente" className="pb-10 px-4">
            <div style={{
              maxWidth: '1080px',
              margin: '0 auto',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(148,163,184,0.08))',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '24px',
              padding: '22px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.35)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
                <div>
                  <p style={{ margin: 0, color: '#a5f3fc', fontWeight: 700, letterSpacing: '0.01em' }}>Registro de cliente</p>
                  <h2 style={{ margin: 0, color: 'white', fontSize: '24px', fontWeight: 900 }}>Activa tu cuenta y continúa</h2>
                </div>
                <a href={`/cotizacion${plan ? `?plan=${plan}` : ''}`} style={{ textDecoration: 'none' }}>
                  <Button className="bg-cyan-400 text-slate-900 hover:bg-cyan-300 font-semibold">Continuar</Button>
                </a>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                <input placeholder="Nombre completo" style={fieldStyle} />
                <input placeholder="Correo" type="email" style={fieldStyle} />
                <input placeholder="Teléfono" style={fieldStyle} />
                <input placeholder="Comuna" style={fieldStyle} />
                <input placeholder="Dirección" style={fieldStyle} />
                <textarea placeholder="Detalle breve del trabajo" rows={3} style={{ ...fieldStyle, gridColumn: '1 / -1', minHeight: '96px' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                <Button className="bg-white text-slate-900 hover:bg-slate-100 font-semibold">Guardar y seguir</Button>
                <a href={`/cotizacion${plan ? `?plan=${plan}` : ''}`} style={{ textDecoration: 'none' }}>
                  <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">Ir a solicitar cotización</Button>
                </a>
              </div>
            </div>
          </section>
        )}

        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <SubscriptionPlans userType={userType} onSelectPlan={handleSelectPlan} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
