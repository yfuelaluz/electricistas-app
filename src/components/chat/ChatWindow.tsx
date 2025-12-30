'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  sender_type: 'cliente' | 'profesional';
  created_at: string;
  read: boolean;
}

interface ChatWindowProps {
  conversationId: string;
  otherUserName: string;
  userType: 'cliente' | 'profesional';
}

export default function ChatWindow({ conversationId, otherUserName, userType }: ChatWindowProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Cargar mensajes
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error cargando mensajes:', error);
      } else {
        setMessages(data || []);
      }
      setLoading(false);
    };

    fetchMessages();

    // Suscribirse a nuevos mensajes en tiempo real
    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      sender_type: userType,
      content: newMessage.trim(),
    });

    if (error) {
      console.error('Error enviando mensaje:', error);
      alert('Error al enviar mensaje');
    } else {
      setNewMessage('');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Cargando mensajes...</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
      background: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontWeight: 'bold'
      }}>
        💬 Chat con {otherUserName}
      </div>

      {/* Mensajes */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: '#f9fafb'
      }}>
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '40px' }}>
            No hay mensajes aún. ¡Envía el primero!
          </p>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.sender_type === userType;
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isOwnMessage ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: isOwnMessage ? '#667eea' : '#e5e7eb',
                    color: isOwnMessage ? 'white' : '#1f2937'
                  }}
                >
                  <div>{msg.content}</div>
                  <div style={{
                    fontSize: '11px',
                    marginTop: '4px',
                    opacity: 0.7,
                    textAlign: 'right'
                  }}>
                    {formatTime(msg.created_at)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} style={{
        padding: '16px',
        background: 'white',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        gap: '8px'
      }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={{
            flex: 1,
            padding: '10px 14px',
            border: '1px solid #d1d5db',
            borderRadius: '20px',
            outline: 'none',
            fontSize: '14px'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          style={{
            padding: '10px 24px',
            background: newMessage.trim() ? '#667eea' : '#d1d5db',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
