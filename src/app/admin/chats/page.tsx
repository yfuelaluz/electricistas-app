'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Conversation {
  id: string;
  cliente_id: string;
  profesional_id: string;
  cliente_nombre?: string;
  profesional_nombre?: string;
  last_message: string;
  last_message_at: string;
  unread_count_cliente: number;
  unread_count_profesional: number;
  created_at: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: string;
  content: string;
  created_at: string;
}

export default function AdminChatsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  async function loadConversations() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Enriquecer con nombres de clientes y profesionales
      const enrichedConversations = await Promise.all(
        (data || []).map(async (conv) => {
          const { data: cliente } = await supabase
            .from('clientes')
            .select('nombre')
            .eq('id', conv.cliente_id)
            .single();

          const { data: profesional } = await supabase
            .from('profesionales')
            .select('nombre_completo')
            .eq('id', conv.profesional_id)
            .single();

          return {
            ...conv,
            cliente_nombre: cliente?.nombre || 'Cliente desconocido',
            profesional_nombre: profesional?.nombre_completo || 'Profesional desconocido'
          };
        })
      );

      setConversations(enrichedConversations);
    } catch (error) {
      console.error('Error cargando conversaciones:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages(conversationId: string) {
    try {
      setLoadingMessages(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    } finally {
      setLoadingMessages(false);
    }
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-CL');
  }

  const activeConversations = conversations.filter(c => {
    const lastMessage = new Date(c.last_message_at);
    const daysSinceLastMessage = (Date.now() - lastMessage.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceLastMessage <= 7;
  });

  const totalUnreadMessages = conversations.reduce(
    (sum, c) => sum + c.unread_count_cliente + c.unread_count_profesional,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Cargando chats...</div>
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
          <h1 className="text-3xl font-bold text-gray-900">Monitoreo de Chats</h1>
          <p className="text-gray-600 mt-2">Supervisa las conversaciones entre clientes y profesionales</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Conversaciones</div>
            <div className="text-3xl font-bold text-gray-900">{conversations.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Activas (7 días)</div>
            <div className="text-3xl font-bold text-green-600">{activeConversations.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Mensajes Sin Leer</div>
            <div className="text-3xl font-bold text-blue-600">{totalUnreadMessages}</div>
          </div>
        </div>

        {/* Vista de chats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de conversaciones */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="font-semibold text-gray-900">Conversaciones</h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No hay conversaciones aún
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation === conv.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-gray-900">
                        {conv.cliente_nombre} ↔️ {conv.profesional_nombre}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(conv.last_message_at)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {conv.last_message}
                    </div>
                    {(conv.unread_count_cliente > 0 || conv.unread_count_profesional > 0) && (
                      <div className="mt-2 flex gap-2">
                        {conv.unread_count_cliente > 0 && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            Cliente: {conv.unread_count_cliente} sin leer
                          </span>
                        )}
                        {conv.unread_count_profesional > 0 && (
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                            Profesional: {conv.unread_count_profesional} sin leer
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Vista de mensajes */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="font-semibold text-gray-900">
                {selectedConversation ? 'Mensajes' : 'Selecciona una conversación'}
              </h2>
            </div>
            <div className="p-4 max-h-[600px] overflow-y-auto">
              {!selectedConversation ? (
                <div className="text-center text-gray-500 py-12">
                  Selecciona una conversación para ver los mensajes
                </div>
              ) : loadingMessages ? (
                <div className="text-center text-gray-500 py-12">
                  Cargando mensajes...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  No hay mensajes en esta conversación
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_type === 'cliente' ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          message.sender_type === 'cliente'
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-blue-500 text-white'
                        }`}
                      >
                        <div className="text-xs font-semibold mb-1 opacity-75">
                          {message.sender_type === 'cliente' ? 'Cliente' : 'Profesional'}
                        </div>
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        <div className="text-xs mt-1 opacity-75">
                          {new Date(message.created_at).toLocaleString('es-CL')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nota informativa */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-2xl mr-3">ℹ️</span>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Monitoreo de Chats</h3>
              <p className="text-sm text-blue-700">
                Esta herramienta te permite supervisar todas las conversaciones entre clientes y profesionales.
                Puedes ver el historial completo de mensajes, detectar problemas y asegurar un servicio de calidad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
