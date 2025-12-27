/**
 * SCRIPT DE PRUEBA AUTOMATIZADO - APIS
 * 
 * Este script prueba todas las APIs principales para verificar que funcionan correctamente
 * Ejecutar: npx tsx scripts/test-apis-completo.ts
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

interface TestResult {
  name: string;
  endpoint: string;
  status: 'passed' | 'failed';
  statusCode?: number;
  error?: string;
  data?: any;
}

const results: TestResult[] = [];

function logTest(result: TestResult) {
  const icon = result.status === 'passed' ? '✅' : '❌';
  console.log(`${icon} ${result.name}`);
  if (result.statusCode) {
    console.log(`   Status: ${result.statusCode}`);
  }
  if (result.error) {
    console.log(`   Error: ${result.error}`);
  }
  if (result.data) {
    console.log(`   Data: ${JSON.stringify(result.data).substring(0, 100)}...`);
  }
  console.log('');
  results.push(result);
}

async function testAPI(name: string, endpoint: string, options?: RequestInit) {
  try {
    console.log(`🔍 Testing: ${name}...`);
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    if (response.ok) {
      logTest({
        name,
        endpoint,
        status: 'passed',
        statusCode: response.status,
        data: Array.isArray(data) ? `Array(${data.length})` : data
      });
    } else {
      logTest({
        name,
        endpoint,
        status: 'failed',
        statusCode: response.status,
        error: JSON.stringify(data)
      });
    }
  } catch (error) {
    logTest({
      name,
      endpoint,
      status: 'failed',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

async function runTests() {
  console.log('\n🚀 INICIANDO PRUEBAS DE APIs\n');
  console.log('='.repeat(50));
  console.log('\n');

  // 1. PROFESIONALES
  console.log('📋 PROFESIONALES\n');
  await testAPI('GET /api/profesionales', '/api/profesionales');
  
  // 2. CLIENTES
  console.log('📋 CLIENTES\n');
  await testAPI('GET /api/clientes', '/api/clientes');
  
  // 3. COTIZACIONES
  console.log('📋 COTIZACIONES\n');
  await testAPI('GET /api/cotizaciones', '/api/cotizaciones');
  
  // 4. REVIEWS
  console.log('📋 REVIEWS\n');
  await testAPI('GET /api/reviews', '/api/reviews');
  
  // 5. PORTFOLIO
  console.log('📋 PORTFOLIO\n');
  await testAPI('GET /api/portfolio?profesionalId=1', '/api/portfolio?profesionalId=1');
  
  // 6. GALERIA
  console.log('📋 GALERIA\n');
  await testAPI('GET /api/galeria', '/api/galeria');
  
  // RESUMEN
  console.log('\n');
  console.log('='.repeat(50));
  console.log('\n📊 RESUMEN DE PRUEBAS\n');
  
  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const total = results.length;
  
  console.log(`Total: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('\n❌ TESTS FALLIDOS:\n');
    results.filter(r => r.status === 'failed').forEach(r => {
      console.log(`   - ${r.name}: ${r.error || 'Unknown error'}`);
    });
  }
  
  console.log('\n='.repeat(50));
  console.log('\n✅ PRUEBAS COMPLETADAS\n');
  
  process.exit(failed > 0 ? 1 : 0);
}

// Ejecutar pruebas
runTests().catch(console.error);
