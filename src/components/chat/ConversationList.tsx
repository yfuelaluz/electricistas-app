'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Conversation {
  id: string;
  cliente_nombre: string;
  profesional_nombre: string;
  last_message: string;
  last_message_at: string;
  unread_cliente: number;
  unread_profesional: number;
}

interface ConversationListProps {
  userType: 'cliente' | 'profesional';
  onSelectConversation: (conversationId: string, otherUserName: string) => void;
}

export default function ConversationList({ userType, onSelectConversation }: ConversationListProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      const column = userType === 'cliente' ? 'cliente_id' : 'profesional_id';
      
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq(column, user.id)
        .order('last_message_at', { ascending: false });

      if (error) {
        console.error('Error cargando conversaciones:', error);
      } else {
        setConversations(data || []);
      }
      setLoading(false);
    };

    fetchConversations();

    // Suscribirse a cambios en conversaciones
    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, userType]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' });
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Cargando conversaciones...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
        <p>📭 No tienes conversaciones aún</p>
        <p style={{ fontSize: '14px', marginTop: '8px' }}>
          Tus chats con {userType === 'cliente' ? 'profesionales' : 'clientes'} aparecerán aquí
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
      {conversations.map((conv) => {
        const otherUserName = userType === 'cliente' ? conv.profesional_nombre : conv.cliente_nombre;
        const unreadCount = userType === 'cliente' ? conv.unread_cliente : conv.unread_profesional;
        
        return (
          <div
            key={conv.id}
            onClick={() => onSelectConversation(conv.id, otherUserName)}
            style={{
              padding: '16px',
              borderBottom: '1px solid #e5e7eb',
              cursor: 'pointer',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
          >
            {/* Avatar */}
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '20px',
              flexShrink: 0
            }}>
              {otherUserName.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px'
              }}>
                <div style={{ fontWeight: 'bold', fontSize: '15px' }}>
                  {otherUserName}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {formatTime(conv.last_message_at)}
                </div>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{
                  color: '#6b7280',
                  fontSize: '14px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1
                }}>
                  {conv.last_message || 'Sin mensajes'}
                </div>
                {unreadCount > 0 && (
                  <div style={{
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '2px 8px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginLeft: '8px'
                  }}>
                    {unreadCount}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
