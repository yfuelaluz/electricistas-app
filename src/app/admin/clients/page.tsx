'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Client {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  created_at: string;
}

interface ClientTransaction {
  client_email: string;
  total_transactions: number;
  total_spent: number;
  last_transaction: string;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientStats, setClientStats] = useState<Map<string, ClientTransaction>>(new Map());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClient();

  useEffect(() => {
    loadClientsAndStats();
  }, []);

  async function deleteClient(id: string, nombre: string, email: string) {
    const stats = clientStats.get(email);
    const transactionInfo = stats ? `\n- ${stats.total_transactions} transacciones por ${formatCurrency(stats.total_spent)}` : '';
    
    const confirmMessage = `¿Estás seguro de eliminar permanentemente a "${nombre}"?\n\nEsta acción NO se puede deshacer y eliminará:\n- Su perfil completo\n- Sus cotizaciones${transactionInfo}\n- Su historial completo\n\n¿Confirmar eliminación?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    // Segunda confirmación
    if (!confirm('⚠️ ÚLTIMA ADVERTENCIA: Esta acción es IRREVERSIBLE. ¿Continuar?')) {
      return;
    }

    try {
      // Eliminar cotizaciones del cliente
      await supabase
        .from('cotizaciones')
        .delete()
        .eq('cliente_email', email);

      // Nota: Las transacciones NO se eliminan por motivos de auditoría/contabilidad
      // Solo se elimina el perfil del cliente

      // Eliminar cliente
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Actualizar localmente
      setClients(clients.filter(c => c.id !== id));
      clientStats.delete(email);
      setClientStats(new Map(clientStats));
      alert('✅ Cliente eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      alert('❌ Error al eliminar el cliente. Revisa la consola.');
    }
  }

  async function loadClientsAndStats() {
    try {
      setLoading(true);

      // Cargar clientes
      const { data: clientsData, error: clientsError } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;
      setClients(clientsData || []);

      // Cargar transacciones para calcular estadísticas
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('user_email, amount, status, created_at');

      if (transactionsError) throw transactionsError;

      // Calcular estadísticas por cliente
      const statsMap = new Map<string, ClientTransaction>();
      transactionsData?.forEach(transaction => {
        const email = transaction.user_email;
        if (!email) return;

        const existing = statsMap.get(email) || {
          client_email: email,
          total_transactions: 0,
          total_spent: 0,
          last_transaction: transaction.created_at
        };

        existing.total_transactions += 1;
        if (transaction.status === 'AUTHORIZED') {
          existing.total_spent += transaction.amount || 0;
        }
        if (new Date(transaction.created_at) > new Date(existing.last_transaction)) {
          existing.last_transaction = transaction.created_at;
        }

        statsMap.set(email, existing);
      });

      setClientStats(statsMap);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredClients = clients.filter(client => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      client.nombre?.toLowerCase().includes(search) ||
      client.email?.toLowerCase().includes(search) ||
      client.telefono?.includes(search)
    );
  });

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  const totalClients = clients.length;
  const clientsWithTransactions = Array.from(clientStats.keys()).length;
  const totalRevenue = Array.from(clientStats.values()).reduce((sum, stat) => sum + stat.total_spent, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Cargando clientes...</div>
          </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-600 mt-2">Administra los usuarios de la plataforma</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Clientes</div>
            <div className="text-3xl font-bold text-gray-900">{totalClients}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Con Transacciones</div>
            <div className="text-3xl font-bold text-green-600">{clientsWithTransactions}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Ingresos Totales</div>
            <div className="text-3xl font-bold text-blue-600">{formatCurrency(totalRevenue)}</div>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar cliente
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nombre, email o teléfono..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Tabla de clientes */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transacciones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Gastado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Actividad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No se encontraron clientes
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => {
                    const stats = clientStats.get(client.email);
                    return (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {client.nombre}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{client.email}</div>
                          <div className="text-xs text-gray-500">{client.telefono}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDate(client.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {stats?.total_transactions || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-green-600">
                            {formatCurrency(stats?.total_spent || 0)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {stats?.last_transaction
                              ? formatDate(stats.last_transaction)
                              : 'Sin actividad'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => deleteClient(client.id, client.nombre, client.email)}
                            className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
                            title="Eliminar permanentemente"
                          >
                            🗑️ Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen */}
        <div className="mt-6 text-sm text-gray-600">
          Mostrando {filteredClients.length} de {clients.length} clientes
        </div>
      </div>
    </div>
  );
}
