'use client';

import { useState, useEffect } from 'react';
import TransactionList from '@/components/clientes/TransactionList';

interface Transaction {
  id: string;
  token: string;
  buy_order: string;
  amount: number;
  status: 'INITIALIZED' | 'AUTHORIZED' | 'REVERSED' | 'FAILED';
  payment_type_code: string;
  card_number: string | null;
  installments_number: number | null;
  authorization_code: string;
  response_code: number;
  balance: number;
  nullified_amount: number;
  user_email: string | null;
  description: string | null;
  created_at: string;
  transaction_date: string;
}

export default function PedidosPage() {
  const [email, setEmail] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const fetchTransactions = async (userEmail: string) => {
    if (!userEmail || !userEmail.includes('@')) {
      setError('Por favor ingresa un email válido');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const response = await fetch(`/api/clientes/transacciones?email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar transacciones');
      }

      setTransactions(data.transactions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar transacciones');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (token: string, amount: number) => {
    try {
      const response = await fetch('/api/webpay/anular', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar reembolso');
      }

      // Mostrar resultado
      if (data.success) {
        alert(`✅ Reembolso procesado exitosamente\n\nMonto: $${amount.toLocaleString('es-CL')}\nCódigo de autorización: ${data.authorization_code}`);
        
        // Recargar transacciones
        if (email) {
          await fetchTransactions(email);
        }
      } else {
        throw new Error('El reembolso no pudo ser procesado');
      }
    } catch (err) {
      alert(`❌ Error: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransactions(email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📦 Mis Pedidos y Transacciones
          </h1>
          <p className="text-lg text-gray-600">
            Consulta el historial de tus pagos y solicita reembolsos
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Ingresa tu email para ver tus transacciones
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Buscando...
                  </span>
                ) : (
                  '🔍 Buscar'
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm font-medium">❌ {error}</p>
            </div>
          )}
        </div>

        {/* Transactions List */}
        {searched && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Historial de Transacciones
              </h2>
              {transactions.length > 0 && (
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                  {transactions.length} {transactions.length === 1 ? 'transacción' : 'transacciones'}
                </span>
              )}
            </div>

            <TransactionList 
              transactions={transactions} 
              onRefund={handleRefund}
            />

            {transactions.length > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-sm font-semibold text-yellow-800 mb-2">ℹ️ Información importante</h3>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• Los reembolsos se procesan inmediatamente con Transbank</li>
                  <li>• El dinero puede tardar de 5 a 10 días hábiles en reflejarse en tu cuenta</li>
                  <li>• Solo puedes solicitar reembolso de transacciones autorizadas</li>
                  <li>• Una vez reembolsada, la transacción no puede volver a procesarse</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Info Card */}
        {!searched && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Consulta tus pedidos
              </h3>
              <p className="text-gray-600">
                Ingresa tu email arriba para ver el historial completo de tus transacciones y solicitar reembolsos cuando sea necesario.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
