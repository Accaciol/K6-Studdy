import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Métrica customizada para taxa de erro
const errorRate = new Rate('errors');

// Configuração do teste de pico (spike)
export const options = {
  stages: [
    { duration: '1m', target: 5 },   // Carga normal inicial
    { duration: '30s', target: 50 }, // Pico súbito para 50 usuários
    { duration: '1m', target: 5 },   // Volta para carga normal
    { duration: '30s', target: 80 }, // Segundo pico ainda maior
    { duration: '1m', target: 5 },   // Recuperação
    { duration: '30s', target: 100 }, // Pico máximo
    { duration: '2m', target: 5 },   // Recuperação final
    { duration: '30s', target: 0 },  // Finalização
  ],
  thresholds: {
    http_req_duration: [
      'p(90)<1500', // 90% das requisições devem ser < 1.5s (tolerante para picos)
      'p(95)<3000', // 95% das requisições devem ser < 3s
    ],
    http_req_failed: ['rate<0.15'], // Taxa de erro deve ser < 15% (mais tolerante)
    errors: ['rate<0.15'], // Taxa de erro customizada < 15%
  },
};

const BASE_URL = 'http://localhost:3000';

// Dados para simular carga variada
const spikeUsers = [
  { name: 'Spike User 1', email: 'spike1@test.com', password: 'senha123' },
  { name: 'Spike User 2', email: 'spike2@test.com', password: 'senha123' },
  { name: 'Spike User 3', email: 'spike3@test.com', password: 'senha123' },
];

const spikeProducts = [
  { name: 'Spike Product A', price: 99.99, category: 'electronics' },
  { name: 'Spike Product B', price: 199.99, category: 'furniture' },
];

export default function () {
  const currentVUs = __ENV.K6_VUS || 1;
  const isSpike = currentVUs > 20; // Considera pico quando > 20 usuários
  
  // Durante picos, simula comportamento mais agressivo
  const aggressiveFactor = isSpike ? 3 : 1;
  
  // 1. Health check rápido
  let response = http.get(`${BASE_URL}/`);
  check(response, {
    'spike health check': (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(0.1);

  // 2. Múltiplas requisições simultâneas durante picos
  if (isSpike) {
    const batchRequests = [];
    const numBatchRequests = Math.floor(Math.random() * 4) + 2; // 2-5 requisições
    
    for (let i = 0; i < numBatchRequests; i++) {
      const endpoint = Math.random() < 0.5 ? '/api/users' : '/api/products';
      const page = Math.floor(Math.random() * 10) + 1;
      batchRequests.push(['GET', `${BASE_URL}${endpoint}?page=${page}&limit=5`]);
    }
    
    const batchResponses = http.batch(batchRequests);
    for (const resp of batchResponses) {
      check(resp, {
        'spike batch request': (r) => r.status === 200,
      }) || errorRate.add(1);
    }
  } else {
    // Comportamento normal durante períodos calmos
    response = http.get(`${BASE_URL}/api/users?page=1&limit=10`);
    check(response, {
      'normal users request': (r) => r.status === 200,
    }) || errorRate.add(1);
  }

  sleep(isSpike ? 0.05 : 0.3);

  // 3. Criação intensiva de usuários durante picos
  for (let i = 0; i < aggressiveFactor; i++) {
    if (Math.random() < 0.6) { // 60% de chance
      const userData = spikeUsers[Math.floor(Math.random() * spikeUsers.length)];
      userData.email = `spike_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@test.com`;
      
      response = http.post(`${BASE_URL}/api/users`, JSON.stringify(userData), {
        headers: { 'Content-Type': 'application/json' },
      });
      check(response, {
        'spike create user': (r) => r.status === 201 || r.status === 409, // 409 = conflito, esperado sob alta carga
      }) || errorRate.add(1);
      
      if (isSpike) sleep(0.02); // Pausa mínima durante picos
    }
  }

  sleep(isSpike ? 0.05 : 0.2);

  // 4. Login intensivo
  const loginAttempts = isSpike ? Math.floor(Math.random() * 3) + 1 : 1;
  let token = '';
  
  for (let i = 0; i < loginAttempts; i++) {
    const loginData = {
      email: 'joao@email.com',
      password: 'senha123'
    };
    
    response = http.post(`${BASE_URL}/api/login`, JSON.stringify(loginData), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (check(response, { 'spike login': (r) => r.status === 200 })) {
      token = response.json('token');
      break; // Sucesso, para de tentar
    } else {
      errorRate.add(1);
    }
    
    if (isSpike) sleep(0.02);
  }

  sleep(isSpike ? 0.05 : 0.2);

  // 5. Busca agressiva de produtos
  const searchRequests = isSpike ? Math.floor(Math.random() * 3) + 2 : 1;
  
  for (let i = 0; i < searchRequests; i++) {
    const filters = [];
    if (Math.random() < 0.5) filters.push(`category=${Math.random() < 0.5 ? 'electronics' : 'furniture'}`);
    if (Math.random() < 0.5) filters.push(`minPrice=${Math.floor(Math.random() * 200)}`);
    if (Math.random() < 0.3) filters.push(`maxPrice=${Math.floor(Math.random() * 1000) + 500}`);
    
    const queryString = filters.length > 0 ? `?${filters.join('&')}` : '';
    response = http.get(`${BASE_URL}/api/products${queryString}`);
    
    check(response, {
      'spike product search': (r) => r.status === 200,
    }) || errorRate.add(1);
    
    if (isSpike) sleep(0.02);
  }

  sleep(isSpike ? 0.05 : 0.2);

  // 6. Operações autenticadas intensivas
  if (token && isSpike) {
    const authOperations = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < authOperations; i++) {
      if (Math.random() < 0.7) { // 70% chance de criar produto
        const productData = spikeProducts[Math.floor(Math.random() * spikeProducts.length)];
        productData.name = `${productData.name} Spike ${Date.now()} ${i}`;
        
        response = http.post(`${BASE_URL}/api/products`, JSON.stringify(productData), {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        
        check(response, {
          'spike auth create product': (r) => r.status === 201,
        }) || errorRate.add(1);
      }
      
      sleep(0.02);
    }
  }

  sleep(isSpike ? 0.05 : 0.2);

  // 7. Processamento pesado sob picos
  if (Math.random() < (isSpike ? 0.6 : 0.3)) {
    const duration = isSpike ? Math.floor(Math.random() * 200) + 50 : Math.floor(Math.random() * 100) + 50;
    response = http.get(`${BASE_URL}/api/heavy?duration=${duration}`);
    
    check(response, {
      'spike heavy processing': (r) => r.status === 200,
    }) || errorRate.add(1);
  }

  sleep(isSpike ? 0.05 : 0.2);

  // 8. Teste do endpoint instável (mais provável durante picos)
  if (Math.random() < (isSpike ? 0.5 : 0.2)) {
    response = http.get(`${BASE_URL}/api/flaky`);
    check(response, {
      'spike flaky endpoint': (r) => r.status === 200 || r.status === 500,
    }) || errorRate.add(1);
  }

  // 9. Busca específica de usuários durante picos
  if (isSpike && Math.random() < 0.4) {
    const userIds = ['1', '2', '3'];
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    
    response = http.get(`${BASE_URL}/api/users/${userId}`);
    check(response, {
      'spike user lookup': (r) => r.status === 200,
    }) || errorRate.add(1);
  }

  // Pausa final ajustada ao contexto
  const finalSleep = isSpike ? Math.random() * 0.2 : Math.random() * 1 + 0.5;
  sleep(finalSleep);
}