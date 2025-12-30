'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Stats {
  totalRevenue: number;
  totalTransactions: number;
  successRate: number;
  totalClients: number;
  totalProfessionals: number;
  activeConversations: number;
  revenueByMonth: { month: string; revenue: number }[];
  transactionsByDay: { day: string; count: number }[];
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);

      // Obtener todas las transacciones
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*');

      // Obtener clientes
      const { data: clients } = await supabase
        .from('clientes')
        .select('id');

      // Obtener profesionales
      const { data: professionals } = await supabase
        .from('profesionales')
        .select('id');

      // Obtener conversaciones activas
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id')
        .gt('last_message_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Calcular estadísticas
      const totalRevenue = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
      const totalTransactions = transactions?.length || 0;
      const authorizedTransactions = transactions?.filter(t => t.status === 'AUTHORIZED').length || 0;
      const successRate = totalTransactions > 0 ? (authorizedTransactions / totalTransactions) * 100 : 0;

      // Revenue por mes (últimos 6 meses)
      const revenueByMonth: { month: string; revenue: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStr = date.toLocaleDateString('es-CL', { year: 'numeric', month: 'short' });
        
        const monthRevenue = transactions?.filter(t => {
          const tDate = new Date(t.created_at);
          return tDate.getMonth() === date.getMonth() && 
                 tDate.getFullYear() === date.getFullYear() &&
                 t.status === 'AUTHORIZED';
        }).reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

        revenueByMonth.push({ month: monthStr, revenue: monthRevenue });
      }

      // Transacciones por día (últimos 7 días)
      const transactionsByDay: { day: string; count: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStr = date.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric' });
        
        const dayCount = transactions?.filter(t => {
          const tDate = new Date(t.created_at);
          return tDate.toDateString() === date.toDateString();
        }).length || 0;

        transactionsByDay.push({ day: dayStr, count: dayCount });
      }

      setStats({
        totalRevenue,
        totalTransactions,
        successRate,
        totalClients: clients?.length || 0,
        totalProfessionals: professionals?.length || 0,
        activeConversations: conversations?.length || 0,
        revenueByMonth,
        transactionsByDay
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Cargando estadísticas...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-600">Error al cargar estadísticas</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Volver al Panel Admin
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Estadísticas de la Plataforma</h1>
          <p className="text-gray-600 mt-2">Métricas clave y análisis de rendimiento</p>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="text-sm text-gray-600 mb-1">Ingresos Totales</div>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</div>
            <div className="text-xs text-gray-500 mt-2">Desde el inicio</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="text-sm text-gray-600 mb-1">Total Transacciones</div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalTransactions}</div>
            <div className="text-xs text-gray-500 mt-2">Todas las transacciones</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="text-sm text-gray-600 mb-1">Tasa de Éxito</div>
            <div className="text-3xl font-bold text-gray-900">{stats.successRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-500 mt-2">Transacciones aprobadas</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="text-sm text-gray-600 mb-1">Clientes Registrados</div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalClients}</div>
            <div className="text-xs text-gray-500 mt-2">Total de usuarios</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="text-sm text-gray-600 mb-1">Profesionales</div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalProfessionals}</div>
            <div className="text-xs text-gray-500 mt-2">Electricistas registrados</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-pink-500">
            <div className="text-sm text-gray-600 mb-1">Conversaciones Activas</div>
            <div className="text-3xl font-bold text-gray-900">{stats.activeConversations}</div>
            <div className="text-xs text-gray-500 mt-2">Últimos 7 días</div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ingresos por mes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ingresos por Mes</h2>
            <div className="space-y-3">
              {stats.revenueByMonth.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-20 text-sm text-gray-600">{item.month}</div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                      <div
                        className="bg-green-500 h-full rounded-full flex items-center justify-end pr-2"
                        style={{
                          width: `${Math.max(5, (item.revenue / Math.max(...stats.revenueByMonth.map(m => m.revenue), 1)) * 100)}%`
                        }}
                      >
                        <span className="text-xs text-white font-semibold">
                          {formatCurrency(item.revenue)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transacciones por día */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Transacciones por Día (Última Semana)</h2>
            <div className="space-y-3">
              {stats.transactionsByDay.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-20 text-sm text-gray-600">{item.day}</div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full flex items-center justify-end pr-2"
                        style={{
                          width: `${Math.max(5, (item.count / Math.max(...stats.transactionsByDay.map(d => d.count), 1)) * 100)}%`
                        }}
                      >
                        <span className="text-xs text-white font-semibold">
                          {item.count} transacciones
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/transactions"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
            >
              <div className="text-2xl mb-2">💳</div>
              <div className="font-semibold text-gray-900">Ver Transacciones</div>
            </Link>
            <Link
              href="/admin/professionals"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
            >
              <div className="text-2xl mb-2">👷</div>
              <div className="font-semibold text-gray-900">Gestionar Profesionales</div>
            </Link>
            <Link
              href="/admin/clients"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
            >
              <div className="text-2xl mb-2">👥</div>
              <div className="font-semibold text-gray-900">Ver Clientes</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
