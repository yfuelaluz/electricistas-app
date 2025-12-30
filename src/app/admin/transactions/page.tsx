'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Transaction {
  id: string;
  token: string;
  buy_order: string;
  amount: number;
  status: string;
  payment_type_code: string;
  card_number: string | null;
  authorization_code: string;
  user_email: string | null;
  balance: number;
  nullified_amount: number;
  created_at: string;
  transaction_date: string;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClient();

  useEffect(() => {
    loadTransactions();
  }, [filter]);

  const loadTransactions = async () => {
    setLoading(true);
    let query = supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error:', error);
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  };

  const filteredTransactions = transactions.filter(tx =>
    tx.buy_order.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tx.user_email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: transactions.length,
    authorized: transactions.filter(t => t.status === 'AUTHORIZED').length,
    reversed: transactions.filter(t => t.status === 'REVERSED').length,
    totalRevenue: transactions
      .filter(t => t.status === 'AUTHORIZED')
      .reduce((sum, t) => sum + t.amount, 0)
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CL');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          padding: '24px',
          borderRadius: '16px',
          marginBottom: '24px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '32px' }}>
              💰 Transacciones Transbank
            </h1>
            <p style={{ margin: '8px 0 0', opacity: 0.9 }}>
              Gestión completa de pagos
            </p>
          </div>
          <Link href="/admin" style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px'
          }}>
            ← Volver
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            borderLeft: '4px solid #10b981'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Ingresos</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '8px 0' }}>
              {formatCurrency(stats.totalRevenue)}
            </div>
          </div>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            borderLeft: '4px solid #3b82f6'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Autorizadas</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '8px 0' }}>
              {stats.authorized}
            </div>
          </div>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            borderLeft: '4px solid #ef4444'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Reembolsadas</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '8px 0' }}>
              {stats.reversed}
            </div>
          </div>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            borderLeft: '4px solid #8b5cf6'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Transacciones</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '8px 0' }}>
              {stats.total}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '24px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            placeholder="Buscar por orden o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: '250px',
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="all">Todos los estados</option>
            <option value="AUTHORIZED">Autorizadas</option>
            <option value="REVERSED">Reembolsadas</option>
            <option value="INITIALIZED">Inicializadas</option>
            <option value="FAILED">Fallidas</option>
          </select>
        </div>

        {/* Table */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Cargando...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f9fafb' }}>
                  <tr>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Orden</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Email</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Monto</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Estado</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Fecha</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Autorización</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '13px' }}>
                        {tx.buy_order}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>
                        {tx.user_email || <span style={{ color: '#9ca3af' }}>N/A</span>}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold' }}>
                        {formatCurrency(tx.amount)}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          background: tx.status === 'AUTHORIZED' ? '#d1fae5' : 
                                     tx.status === 'REVERSED' ? '#fee2e2' : 
                                     tx.status === 'INITIALIZED' ? '#fef3c7' : '#f3f4f6',
                          color: tx.status === 'AUTHORIZED' ? '#065f46' : 
                                tx.status === 'REVERSED' ? '#991b1b' : 
                                tx.status === 'INITIALIZED' ? '#92400e' : '#6b7280'
                        }}>
                          {tx.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                        {formatDate(tx.created_at)}
                      </td>
                      <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '13px' }}>
                        {tx.authorization_code}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
