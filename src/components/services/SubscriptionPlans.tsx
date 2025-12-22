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
  
  const clientPlans: Plan[] = [
    {
      id: 'client-free',
      name: 'Gratis',
      type: 'client',
      price: 0,
      period: 'monthly',
      features: [
        'Búsqueda de profesionales',
        'Hasta 3 solicitudes al mes',
        'Chat básico',
        'Valoraciones públicas',
      ],
    },
    {
      id: 'client-premium',
      name: 'Premium',
      type: 'client',
      price: billingPeriod === 'monthly' ? 4990 : 49900,
      period: billingPeriod,
      popular: true,
      savings: billingPeriod === 'yearly' ? 'Ahorra $9,980' : undefined,
      features: [
        'Solicitudes ilimitadas',
        'Prioridad en respuestas',
        'Chat en tiempo real',
        'Soporte 24/7',
        'Descuentos exclusivos',
        'Garantía de satisfacción',
        'Historial de servicios',
      ],
    },
  ];
  
  const professionalPlans: Plan[] = [
    {
      id: 'pro-basic',
      name: 'Básico',
      type: 'professional',
      price: billingPeriod === 'monthly' ? 9990 : 99900,
      period: billingPeriod,
      savings: billingPeriod === 'yearly' ? 'Ahorra $19,980' : undefined,
      features: [
        'Perfil profesional',
        'Hasta 10 proyectos/mes',
        'Comisión 15%',
        'Valoraciones de clientes',
        'Chat con clientes',
      ],
    },
    {
      id: 'pro-premium',
      name: 'Premium',
      type: 'professional',
      price: billingPeriod === 'monthly' ? 19990 : 199900,
      period: billingPeriod,
      popular: true,
      savings: billingPeriod === 'yearly' ? 'Ahorra $39,980' : undefined,
      features: [
        'Proyectos ilimitados',
        'Comisión reducida 10%',
        'Destacado en búsquedas',
        'Insignia verificado',
        'Soporte prioritario',
        'Estadísticas avanzadas',
        'Protección de pagos',
        'Marketing en plataforma',
      ],
    },
    {
      id: 'pro-elite',
      name: 'Elite',
      type: 'professional',
      price: billingPeriod === 'monthly' ? 34990 : 349900,
      period: billingPeriod,
      savings: billingPeriod === 'yearly' ? 'Ahorra $69,980' : undefined,
      features: [
        'Todo de Premium',
        'Comisión 5%',
        'Posición destacada #1',
        'Gestor de cuenta dedicado',
        'Campañas publicitarias',
        'Capacitaciones exclusivas',
        'Certificaciones premium',
        'Red de networking',
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
        
        {/* Toggle de periodo */}
        {userType === 'professional' && (
          <div className="inline-flex items-center gap-3 bg-white p-2 rounded-xl shadow-soft">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-primary-600 text-white shadow-button'
                  : 'text-secondary-600 hover:bg-secondary-50'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all relative ${
                billingPeriod === 'yearly'
                  ? 'bg-primary-600 text-white shadow-button'
                  : 'text-secondary-600 hover:bg-secondary-50'
              }`}
            >
              Anual
              <Badge variant="success" size="sm" className="absolute -top-2 -right-2">
                -17%
              </Badge>
            </button>
          </div>
        )}
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
              onClick={() => onSelectPlan?.(plan.id)}
              disabled={currentPlan === plan.id}
            >
              {currentPlan === plan.id ? (
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
