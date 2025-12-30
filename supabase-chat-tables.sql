-- Tabla de conversaciones
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profesional_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  cliente_nombre TEXT,
  profesional_nombre TEXT,
  last_message TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  unread_cliente INTEGER DEFAULT 0,
  unread_profesional INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cliente_id, profesional_id)
);

-- Tabla de mensajes
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sender_type TEXT CHECK (sender_type IN ('cliente', 'profesional')) NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_conversations_cliente ON conversations(cliente_id);
CREATE INDEX IF NOT EXISTS idx_conversations_profesional ON conversations(profesional_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER conversations_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW
EXECUTE FUNCTION update_conversations_updated_at();

-- Función para actualizar conversación cuando llega mensaje nuevo
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
DECLARE
  conv conversations%ROWTYPE;
BEGIN
  -- Obtener la conversación
  SELECT * INTO conv FROM conversations WHERE id = NEW.conversation_id;
  
  -- Actualizar last_message y contadores
  IF NEW.sender_type = 'cliente' THEN
    UPDATE conversations 
    SET 
      last_message = NEW.content,
      last_message_at = NEW.created_at,
      unread_profesional = unread_profesional + 1
    WHERE id = NEW.conversation_id;
  ELSE
    UPDATE conversations 
    SET 
      last_message = NEW.content,
      last_message_at = NEW.created_at,
      unread_cliente = unread_cliente + 1
    WHERE id = NEW.conversation_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER message_inserted
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_on_message();

-- Habilitar Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso para conversations
CREATE POLICY "Usuarios pueden ver sus propias conversaciones"
ON conversations FOR SELECT
USING (auth.uid() = cliente_id OR auth.uid() = profesional_id);

CREATE POLICY "Usuarios pueden crear conversaciones"
ON conversations FOR INSERT
WITH CHECK (auth.uid() = cliente_id OR auth.uid() = profesional_id);

CREATE POLICY "Usuarios pueden actualizar sus conversaciones"
ON conversations FOR UPDATE
USING (auth.uid() = cliente_id OR auth.uid() = profesional_id);

-- Políticas de acceso para messages
CREATE POLICY "Usuarios pueden ver mensajes de sus conversaciones"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE id = conversation_id 
    AND (cliente_id = auth.uid() OR profesional_id = auth.uid())
  )
);

CREATE POLICY "Usuarios pueden enviar mensajes a sus conversaciones"
ON messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE id = conversation_id 
    AND (cliente_id = auth.uid() OR profesional_id = auth.uid())
  )
  AND sender_id = auth.uid()
);

-- Comentarios
COMMENT ON TABLE conversations IS 'Conversaciones entre clientes y profesionales';
COMMENT ON TABLE messages IS 'Mensajes individuales dentro de conversaciones';
COMMENT ON COLUMN conversations.unread_cliente IS 'Contador de mensajes no leídos por el cliente';
COMMENT ON COLUMN conversations.unread_profesional IS 'Contador de mensajes no leídos por el profesional';
