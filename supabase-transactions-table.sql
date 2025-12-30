-- ============================================
-- TABLA: transactions (Transacciones Webpay)
-- ============================================
-- Guarda todas las transacciones de pagos realizadas con Transbank Webpay Plus
-- Incluye: pagos aprobados, rechazados, y devoluciones

CREATE TABLE IF NOT EXISTS transactions (
  -- Identificador único de la transacción en nuestra DB
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Token de Webpay (identificador único de Transbank)
  token TEXT NOT NULL UNIQUE,
  
  -- Orden de compra generada por nosotros
  buy_order TEXT NOT NULL,
  
  -- Información del pago
  amount INTEGER NOT NULL, -- Monto en pesos chilenos
  status TEXT NOT NULL, -- INITIALIZED, AUTHORIZED, REVERSED, FAILED
  
  -- Tipo de pago
  payment_type_code TEXT, -- VN (Venta Normal Crédito), VD (Venta Débito), etc.
  
  -- Detalles de la tarjeta (últimos 4 dígitos)
  card_number TEXT,
  
  -- Información de cuotas (si aplica)
  installments_number INTEGER DEFAULT 0,
  installments_amount INTEGER DEFAULT 0,
  
  -- Código de autorización de Transbank
  authorization_code TEXT,
  
  -- Código de respuesta
  response_code INTEGER,
  
  -- Información de anulaciones
  balance INTEGER, -- Saldo restante después de anulaciones parciales
  nullified_amount INTEGER DEFAULT 0, -- Monto total anulado
  
  -- Relación con usuario (opcional por ahora)
  user_id UUID, -- Se puede vincular con tabla users cuando exista
  user_email TEXT,
  
  -- Descripción del producto/servicio
  description TEXT,
  
  -- Sesión de compra
  session_id TEXT,
  
  -- Fechas
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  transaction_date TIMESTAMPTZ, -- Fecha de la transacción según Transbank
  accounting_date TEXT, -- Fecha contable
  
  -- Información adicional (JSON flexible)
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Índices para búsquedas rápidas
  CONSTRAINT valid_status CHECK (status IN ('INITIALIZED', 'AUTHORIZED', 'REVERSED', 'FAILED'))
);

-- ============================================
-- ÍNDICES para optimizar búsquedas
-- ============================================

-- Buscar por token (muy común)
CREATE INDEX IF NOT EXISTS idx_transactions_token ON transactions(token);

-- Buscar por buy_order
CREATE INDEX IF NOT EXISTS idx_transactions_buy_order ON transactions(buy_order);

-- Buscar por estado
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Buscar por usuario
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- Buscar por email
CREATE INDEX IF NOT EXISTS idx_transactions_user_email ON transactions(user_email);

-- Buscar por fecha de creación (para reportes)
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

-- ============================================
-- FUNCIÓN para actualizar updated_at automáticamente
-- ============================================

CREATE OR REPLACE FUNCTION update_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER para updated_at
-- ============================================

DROP TRIGGER IF EXISTS trigger_update_transactions_updated_at ON transactions;

CREATE TRIGGER trigger_update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_transactions_updated_at();

-- ============================================
-- COMENTARIOS en las columnas (documentación)
-- ============================================

COMMENT ON TABLE transactions IS 'Historial completo de transacciones de pago con Transbank Webpay Plus';
COMMENT ON COLUMN transactions.token IS 'Token único de Webpay para esta transacción';
COMMENT ON COLUMN transactions.buy_order IS 'Orden de compra generada por nuestra aplicación';
COMMENT ON COLUMN transactions.amount IS 'Monto de la transacción en pesos chilenos (CLP)';
COMMENT ON COLUMN transactions.status IS 'Estado actual: INITIALIZED, AUTHORIZED, REVERSED, FAILED';
COMMENT ON COLUMN transactions.payment_type_code IS 'Tipo de pago: VN (Crédito), VD (Débito), etc.';
COMMENT ON COLUMN transactions.balance IS 'Saldo restante después de anulaciones parciales';
COMMENT ON COLUMN transactions.nullified_amount IS 'Monto total que ha sido anulado/devuelto';

-- ============================================
-- PERMISOS (Row Level Security - RLS)
-- ============================================
-- Por ahora deshabilitado, se configurará cuando tengamos autenticación

-- Habilitar RLS (comentado hasta tener auth)
-- ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Política de ejemplo para cuando tengamos auth:
-- CREATE POLICY "Los usuarios pueden ver sus propias transacciones"
--   ON transactions
--   FOR SELECT
--   USING (auth.uid() = user_id);

-- ============================================
-- DATOS DE EJEMPLO (opcional - comentado)
-- ============================================

-- INSERT INTO transactions (
--   token,
--   buy_order,
--   amount,
--   status,
--   payment_type_code,
--   description
-- ) VALUES (
--   '01ab_example_token',
--   'TEST-' || EXTRACT(EPOCH FROM NOW())::TEXT,
--   50000,
--   'AUTHORIZED',
--   'VN',
--   'Pago de prueba'
-- );

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que la tabla se creó correctamente
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'transactions'
ORDER BY ordinal_position;
