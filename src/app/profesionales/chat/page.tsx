'use client';
import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ConversationList from '@/components/chat/ConversationList';
import ChatWindow from '@/components/chat/ChatWindow';

export default function ChatProfesionalesPage() {
  const [selectedConversation, setSelectedConversation] = useState<{
    id: string;
    name: string;
  } | null>(null);

  return (
    <ProtectedRoute redirectTo="/profesionales/login">
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)',
        padding: '20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            color: 'white'
          }}>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
              💬 Mensajes con Clientes
            </h1>
            <p style={{ margin: '8px 0 0', opacity: 0.9 }}>
              Responde a las consultas de tus clientes
            </p>
          </div>

          {/* Chat Container */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: selectedConversation ? '350px 1fr' : '1fr',
            gap: '20px',
            transition: 'all 0.3s'
          }}>
            {/* Lista de conversaciones */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 'bold'
              }}>
                Conversaciones
              </div>
              <ConversationList
                userType="profesional"
                onSelectConversation={(id, name) => setSelectedConversation({ id, name })}
              />
            </div>

            {/* Ventana de chat */}
            {selectedConversation && (
              <div>
                <button
                  onClick={() => setSelectedConversation(null)}
                  style={{
                    marginBottom: '12px',
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ← Volver
                </button>
                <ChatWindow
                  conversationId={selectedConversation.id}
                  otherUserName={selectedConversation.name}
                  userType="profesional"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
