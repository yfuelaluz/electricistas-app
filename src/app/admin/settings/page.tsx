'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const envVars = [
    {
      category: 'Supabase',
      vars: [
        {
          name: 'NEXT_PUBLIC_SUPABASE_URL',
          value: process.env.NEXT_PUBLIC_SUPABASE_URL || 'No configurado',
          description: 'URL del proyecto Supabase'
        },
        {
          name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
          value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'No configurado',
          description: 'Clave anónima de Supabase (pública)',
          masked: true
        },
        {
          name: 'SUPABASE_SERVICE_ROLE_KEY',
          value: 'Configurado en servidor',
          description: 'Clave de servicio (privada)',
          masked: true
        }
      ]
    },
    {
      category: 'Transbank',
      vars: [
        {
          name: 'TRANSBANK_COMMERCE_CODE',
          value: process.env.TRANSBANK_COMMERCE_CODE || 'No configurado',
          description: 'Código de comercio Transbank'
        },
        {
          name: 'TRANSBANK_API_KEY',
          value: 'Configurado en servidor',
          description: 'API Key de Transbank (privada)',
          masked: true
        }
      ]
    },
    {
      category: 'Email (Resend)',
      vars: [
        {
          name: 'RESEND_API_KEY',
          value: 'Configurado en servidor',
          description: 'API Key de Resend para emails',
          masked: true
        },
        {
          name: 'FROM_EMAIL',
          value: 'onboarding@resend.dev',
          description: 'Email remitente (cambiar a noreply@electricistaschile.com tras verificación)'
        }
      ]
    },
    {
      category: 'Analytics',
      vars: [
        {
          name: 'NEXT_PUBLIC_GA_MEASUREMENT_ID',
          value: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'No configurado',
          description: 'ID de Google Analytics'
        }
      ]
    }
  ];

  function copyToClipboard(text: string, name: string) {
    navigator.clipboard.writeText(text);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Volver al Panel Admin
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
          <p className="text-gray-600 mt-2">Variables de entorno y configuración de la plataforma</p>
        </div>

        {/* Alertas importantes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Seguridad</h3>
              <p className="text-sm text-yellow-700">
                Las variables de entorno sensibles no se muestran por seguridad. Para modificarlas,
                accede a la configuración de Vercel o al archivo .env.local en desarrollo.
              </p>
            </div>
          </div>
        </div>

        {/* Variables de entorno por categoría */}
        {envVars.map((category) => (
          <div key={category.category} className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="font-semibold text-gray-900">{category.category}</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {category.vars.map((envVar) => (
                  <div key={envVar.name} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="font-mono text-sm font-semibold text-gray-900">
                          {envVar.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {envVar.description}
                        </div>
                      </div>
                      {!envVar.masked && envVar.value !== 'No configurado' && (
                        <button
                          onClick={() => copyToClipboard(envVar.value, envVar.name)}
                          className="ml-4 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          {copied === envVar.name ? '✓ Copiado' : 'Copiar'}
                        </button>
                      )}
                    </div>
                    <div className="font-mono text-sm bg-gray-100 px-3 py-2 rounded">
                      {envVar.masked ? '••••••••••••••••' : envVar.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Enlaces importantes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="font-semibold text-gray-900">Enlaces Importantes</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://vercel.com/alejandro-fernandezs-projects-18ef35f8/electricistas-app/settings/environment-variables"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Vercel - Variables de Entorno</div>
                    <div className="text-sm text-gray-600">Configurar variables en producción</div>
                  </div>
                  <span className="text-2xl">🔧</span>
                </div>
              </a>

              <a
                href="https://supabase.com/dashboard/project/dqgiquwspkxeqbztatff"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Supabase Dashboard</div>
                    <div className="text-sm text-gray-600">Base de datos y autenticación</div>
                  </div>
                  <span className="text-2xl">🗄️</span>
                </div>
              </a>

              <a
                href="https://www.transbank.cl/web-services/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Transbank</div>
                    <div className="text-sm text-gray-600">Portal de comercio</div>
                  </div>
                  <span className="text-2xl">💳</span>
                </div>
              </a>

              <a
                href="https://resend.com/domains"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Resend - Dominios</div>
                    <div className="text-sm text-gray-600">Verificar dominio de email</div>
                  </div>
                  <span className="text-2xl">📧</span>
                </div>
              </a>

              <a
                href="https://analytics.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Google Analytics</div>
                    <div className="text-sm text-gray-600">Ver estadísticas de tráfico</div>
                  </div>
                  <span className="text-2xl">📊</span>
                </div>
              </a>

              <a
                href="https://github.com/alejandrofernandez/electricistas-app"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Repositorio GitHub</div>
                    <div className="text-sm text-gray-600">Código fuente</div>
                  </div>
                  <span className="text-2xl">🐙</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Información del sistema */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Información del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Entorno:</span>{' '}
              <span className="font-semibold">
                {process.env.NODE_ENV === 'production' ? '🟢 Producción' : '🟡 Desarrollo'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Next.js:</span>{' '}
              <span className="font-semibold">16.0.10</span>
            </div>
            <div>
              <span className="text-gray-600">Dominio:</span>{' '}
              <span className="font-semibold">www.electricistaschile.com</span>
            </div>
            <div>
              <span className="text-gray-600">Región Supabase:</span>{' '}
              <span className="font-semibold">Virginia, USA</span>
            </div>
          </div>
        </div>

        {/* Tareas pendientes */}
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-2xl mr-3">📋</span>
            <div>
              <h3 className="font-semibold text-orange-900 mb-2">Tareas Pendientes</h3>
              <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
                <li>Verificar dominio electricistaschile.com en Resend para emails</li>
                <li>Actualizar FROM_EMAIL a noreply@electricistaschile.com</li>
                <li>Configurar Supabase Auth en páginas de registro</li>
                <li>Habilitar Realtime en tablas conversations y messages en Supabase</li>
                <li>Agregar protección de autenticación admin a rutas /admin/*</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
