'use client';
import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

interface PaymentMethod {
  id: string;
  type: 'card' | 'transfer' | 'wallet';
  name: string;
  icon: React.ReactNode;
}

interface PaymentGatewayProps {
  amount: number;
  serviceName: string;
  professionalName: string;
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentCancel?: () => void;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  amount,
  serviceName,
  professionalName,
  onPaymentSuccess,
  onPaymentCancel,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'details' | 'confirm'>('select');
  
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      type: 'card',
      name: 'Tarjeta de Crédito/Débito',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      id: 'transfer',
      type: 'transfer',
      name: 'Transferencia Bancaria',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
    {
      id: 'wallet',
      type: 'wallet',
      name: 'Billetera Digital',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
  ];
  
  const handlePayment = async () => {
    setProcessing(true);
    
    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const paymentId = `PAY-${Date.now()}`;
    onPaymentSuccess?.(paymentId);
    setProcessing(false);
    setShowModal(false);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(value);
  };
  
  return (
    <>
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-secondary-900">Resumen de pago</h3>
            <Badge variant="success">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Pago seguro
            </Badge>
          </div>
          
          <div className="divider" />
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary-600">Servicio:</span>
              <span className="font-semibold text-secondary-900">{serviceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Profesional:</span>
              <span className="font-semibold text-secondary-900">{professionalName}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-secondary-600">Monto total:</span>
              <span className="text-3xl font-bold text-primary-600">{formatCurrency(amount)}</span>
            </div>
          </div>
          
          <div className="divider" />
          
          <div className="bg-primary-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-primary-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-semibold text-sm">Protección de pago</span>
            </div>
            <p className="text-sm text-primary-700">
              Tu pago está protegido. El dinero se libera al profesional solo cuando confirmes que el trabajo está completo.
            </p>
          </div>
          
          <Button
            variant="primary"
            className="w-full flex items-center justify-center gap-2 px-8 py-3 text-lg"
            onClick={() => setShowModal(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Proceder al pago
          </Button>
        </div>
      </Card>
      
      {/* Modal de pago */}
      <Modal
        isOpen={showModal}
        onClose={() => !processing && setShowModal(false)}
        title="Pago seguro"
        size="lg"
      >
        {step === 'select' && (
          <div className="space-y-4">
            <p className="text-secondary-600">Selecciona tu método de pago preferido:</p>
            
            <div className="grid gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setSelectedMethod(method.id);
                    setStep('details');
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedMethod === method.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-secondary-200 hover:border-primary-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-primary-600">{method.icon}</div>
                    <span className="font-semibold text-secondary-900">{method.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {step === 'details' && (
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={() => setStep('select')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </Button>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Número de tarjeta
                </label>
                <input
                  type="text"
                  className="input-modern"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Fecha de vencimiento
                  </label>
                  <input
                    type="text"
                    className="input-modern"
                    placeholder="MM/AA"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    className="input-modern"
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Nombre del titular
                </label>
                <input
                  type="text"
                  className="input-modern"
                  placeholder="Juan Pérez"
                />
              </div>
            </div>
            
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setStep('confirm')}
            >
              Continuar
            </Button>
          </div>
        )}
        
        {step === 'confirm' && (
          <div className="space-y-6">
            <div className="bg-secondary-50 p-6 rounded-xl space-y-3">
              <h4 className="font-bold text-secondary-900">Confirmación de pago</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Servicio:</span>
                  <span className="font-semibold">{serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Profesional:</span>
                  <span className="font-semibold">{professionalName}</span>
                </div>
                <div className="pt-2 border-t border-secondary-200">
                  <div className="flex justify-between items-baseline">
                    <span className="text-secondary-600">Total a pagar:</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="primary"
                className="flex-1"
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? 'Procesando...' : 'Confirmar pago'}
              </Button>
              <Button
                onClick={() => setStep('details')}
                disabled={processing}
                className="border"
              >
                Volver
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default PaymentGateway;
