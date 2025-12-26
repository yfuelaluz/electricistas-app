'use client';
import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/button';
import { Badge } from '../ui/Badge';

interface Plan {
  id: string;
  name: string;
  type: 'client' | 'professional';
  price: number;
  period: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
  savings?: string;
}

interface SubscriptionPlansProps {
  userType: 'client' | 'professional';
  currentPlan?: string;
  onSelectPlan?: (planId: string) => void;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  userType,
  currentPlan,
  onSelectPlan,
}) => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  
  const handleSelectPlan = async (planId: string) => {
    // Si el plan es gratuito, solo llamar el callback
    if (planId === 'cliente-basico') {
      onSelectPlan?.(planId);
      return;
    }

    try {
      setLoadingPlan(planId);
      
      const response = await fetch('/api/webpay/crear-pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear el pago');
      }

      const data = await response.json();
      
      // Redirigir a Webpay
      window.location.href = `${data.url}?token_ws=${data.token}`;
    } catch (error: any) {
      console.error('Error al procesar el pago:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoadingPlan(null);
    }
  };
  
  const clientPlans: Plan[] = [
    {
      id: 'cliente-basico',
      name: 'Básico',
      type: 'client',
      price: 0,
      period: 'monthly',
      features: [
        'Búsqueda de profesionales',
        'Hasta 2 solicitudes al mes',
        'Chat básico',
        'Valoraciones públicas',
      ],
    },
    {
      id: 'cliente-premium',
      name: 'Premium',
      type: 'client',
      price: 14990,
      period: 'monthly',
      popular: true,
      features: [
        'Hasta 6 solicitudes al mes',
        'Prioridad en respuestas',
        'Chat en tiempo real',
        'Soporte prioritario',
        'Descuentos exclusivos',
        'Historial de servicios',
      ],
    },
    {
      id: 'cliente-empresa',
      name: 'Empresa',
      type: 'client',
      price: 29990,
      period: 'monthly',
      features: [
        'Solicitudes ilimitadas',
        'Máxima prioridad',
        'Chat en tiempo real',
        'Soporte 24/7',
        'Descuentos máximos',
        'Garantía de satisfacción',
        'Historial completo',
        'Múltiples proyectos',
      ],
    },
  ];
  
  const professionalPlans: Plan[] = [
    {
      id: 'profesional-starter',
      name: 'Starter',
      type: 'professional',
      price: 14990,
      period: 'monthly',
      features: [
        'Perfil profesional',
        'Hasta 5 leads/mes',
        'Valoraciones de clientes',
        'Chat con clientes',
        'Notificaciones básicas',
      ],
    },
    {
      id: 'profesional-pro',
      name: 'Pro',
      type: 'professional',
      price: 29990,
      period: 'monthly',
      popular: true,
      features: [
        'Hasta 10 leads/mes',
        'Destacado en búsquedas',
        'Insignia verificado',
        'Soporte prioritario',
        'Estadísticas avanzadas',
        'Protección de pagos',
        'Marketing en plataforma',
      ],
    },
    {
      id: 'profesional-elite',
      name: 'Elite',
      type: 'professional',
      price: 59990,
      period: 'monthly',
      features: [
        'Leads ilimitados',
        'Posición destacada #1',
        'Gestor de cuenta dedicado',
        'Campañas publicitarias',
        'Capacitaciones exclusivas',
        'Certificaciones premium',
        'Red de networking',
        'Soporte 24/7 VIP',
      ],
    },
  ];
  
  const plans = userType === 'client' ? clientPlans : professionalPlans;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value);
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold gradient-text">
          Planes de Suscripción
        </h2>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          {userType === 'client'
            ? 'Encuentra los mejores profesionales con beneficios exclusivos'
            : 'Crece tu negocio y consigue más clientes'}
        </p>
      </div>
      
      {/* Planes */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative flex flex-col ${
              plan.popular ? 'ring-2 ring-primary-500 shadow-card-hover scale-105' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge variant="primary" size="md" className="shadow-lg">
                  ⭐ Más Popular
                </Badge>
              </div>
            )}
            
            {plan.savings && (
              <div className="absolute -top-4 right-4">
                <Badge variant="success" size="sm">
                  {plan.savings}
                </Badge>
              </div>
            )}
            
            <div className="flex-1 space-y-6">
              {/* Header del plan */}
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-secondary-900">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-primary-600">
                    {formatCurrency(plan.price)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-secondary-500">
                      /{plan.period === 'monthly' ? 'mes' : 'año'}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="divider" />
              
              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-secondary-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* CTA Button */}
            <Button
              variant={plan.popular ? 'primary' : 'ghost'}
              className="w-full mt-6"
              onClick={() => handleSelectPlan(plan.id)}
              disabled={currentPlan === plan.id || loadingPlan === plan.id}
            >
              {loadingPlan === plan.id ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : currentPlan === plan.id ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Plan actual
                </>
              ) : plan.price === 0 ? (
                'Comenzar gratis'
              ) : (
                'Seleccionar plan'
              )}
            </Button>
          </Card>
        ))}
      </div>
      
      {/* FAQ de suscripciones */}
      <Card className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-secondary-900 mb-4">
          Preguntas frecuentes
        </h3>
        <div className="space-y-4 text-secondary-700">
          <div>
            <h4 className="font-semibold mb-2">¿Puedo cambiar de plan?</h4>
            <p className="text-sm">
              Sí, puedes actualizar o degradar tu plan en cualquier momento. Los cambios se aplicarán en tu próximo ciclo de facturación.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">¿Cómo funciona la garantía?</h4>
            <p className="text-sm">
              Ofrecemos una garantía de 30 días. Si no estás satisfecho, te devolvemos tu dinero sin preguntas.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">¿Puedo cancelar en cualquier momento?</h4>
            <p className="text-sm">
              Sí, puedes cancelar tu suscripción cuando quieras. Mantendrás el acceso hasta el final de tu periodo de facturación.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SubscriptionPlans;
