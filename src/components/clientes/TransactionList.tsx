'use client';

import { useState } from 'react';

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

interface TransactionListProps {
  transactions: Transaction[];
  onRefund?: (token: string, amount: number) => void;
}

export default function TransactionList({ transactions, onRefund }: TransactionListProps) {
  const [loadingRefund, setLoadingRefund] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    const badges = {
      AUTHORIZED: 'bg-green-100 text-green-800 border-green-300',
      REVERSED: 'bg-gray-100 text-gray-800 border-gray-300',
      FAILED: 'bg-red-100 text-red-800 border-red-300',
      INITIALIZED: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };

    const labels = {
      AUTHORIZED: 'Autorizada',
      REVERSED: 'Reembolsada',
      FAILED: 'Fallida',
      INITIALIZED: 'Iniciada'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRefund = async (token: string, amount: number) => {
    if (!onRefund) return;

    const confirmed = confirm(
      `¿Estás seguro de solicitar el reembolso de ${formatCurrency(amount)}?\n\nEsta acción no se puede deshacer.`
    );

    if (confirmed) {
      setLoadingRefund(token);
      await onRefund(token, amount);
      setLoadingRefund(null);
    }
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay transacciones</h3>
        <p className="mt-1 text-sm text-gray-500">Aún no has realizado ningún pago.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Orden de Compra
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Monto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tarjeta
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(transaction.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                {transaction.buy_order}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                {formatCurrency(transaction.amount)}
                {transaction.nullified_amount > 0 && (
                  <div className="text-xs text-red-600 mt-1">
                    Reembolsado: {formatCurrency(transaction.nullified_amount)}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(transaction.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {transaction.card_number ? (
                  <div>
                    <div className="font-mono">**** {transaction.card_number.slice(-4)}</div>
                    {transaction.installments_number && transaction.installments_number > 1 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {transaction.installments_number} cuotas
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {transaction.status === 'AUTHORIZED' && transaction.balance > 0 && onRefund && (
                  <button
                    onClick={() => handleRefund(transaction.token, transaction.balance)}
                    disabled={loadingRefund === transaction.token}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingRefund === transaction.token ? 'Procesando...' : 'Solicitar Reembolso'}
                  </button>
                )}
                {transaction.status === 'REVERSED' && (
                  <span className="text-gray-400 text-xs">Reembolsada</span>
                )}
                {transaction.status === 'FAILED' && (
                  <span className="text-gray-400 text-xs">Fallida</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
