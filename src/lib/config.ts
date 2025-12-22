// Validación de variables de entorno críticas
const requiredEnvVars = {
  // Webpay
  WEBPAY_AMBIENTE: process.env.WEBPAY_AMBIENTE,
  WEBPAY_COMMERCE_CODE: process.env.WEBPAY_COMMERCE_CODE,
  WEBPAY_API_KEY: process.env.WEBPAY_API_KEY,
  // URL Base
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  // Email
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_TO: process.env.EMAIL_TO,
};

const missingVars: string[] = [];

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    missingVars.push(key);
  }
});

if (missingVars.length > 0) {
  console.error('❌ Error: Faltan variables de entorno críticas:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n💡 Copia .env.example a .env.local y configura las variables.');
  
  // En desarrollo, solo advertir. En producción, fallar.
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Faltan variables de entorno críticas: ${missingVars.join(', ')}`);
  }
}

export const config = {
  webpay: {
    ambiente: requiredEnvVars.WEBPAY_AMBIENTE || 'integracion',
    commerceCode: requiredEnvVars.WEBPAY_COMMERCE_CODE || '',
    apiKey: requiredEnvVars.WEBPAY_API_KEY || '',
  },
  app: {
    baseUrl: requiredEnvVars.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  },
  email: {
    apiKey: requiredEnvVars.RESEND_API_KEY || '',
    to: requiredEnvVars.EMAIL_TO || '',
  },
};
