import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Métrica customizada para taxa de erro
const errorRate = new Rate('errors');

// Configuração do teste de estresse
export const options = {
  stages: [
    { duration: '2m', target: 20 },  // Ramp up para 20 usuários
    { duration: '2m', target: 50 },  // Ramp up para 50 usuários
    { duration: '2m', target: 100 }, // Ramp up para 100 usuários
    { duration: '5m', target: 100 }, // Mantém 100 usuários por 5 minutos
    { duration: '2m', target: 50 },  // Ramp down para 50 usuários
    { duration: '2m', target: 20 },  // Ramp down para 20 usuários
    { duration: '2m', target: 0 },   // Ramp down para 0 usuários
  ],
  thresholds: {
    http_req_duration: [
      'p(95)<1000', // 95% das requisições devem ser < 1s (mais tolerante)
      'p(99)<2000', // 99% das requisições devem ser < 2s
    ],
    http_req_failed: ['rate<0.1'], // Taxa de erro deve ser < 10%
    errors: ['rate<0.1'], // Taxa de erro customizada < 10%
  },
};

const BASE_URL = 'http://localhost:3000';

// Pool de dados para variação
const testUsers = [
  { name: 'Usuario Stress 1', email: 'stress1@test.com', password: 'senha123' },
  { name: 'Usuario Stress 2', email: 'stress2@test.com', password: 'senha123' },
  { name: 'Usuario Stress 3', email: 'stress3@test.com', password: 'senha123' },
  { name: 'Usuario Stress 4', email: 'stress4@test.com', password: 'senha123' },
  { name: 'Usuario Stress 5', email: 'stress5@test.com', password: 'senha123' },
];

const testProducts = [
  { name: 'Produto Stress A', price: 199.99, category: 'electronics' },
  { name: 'Produto Stress B', price: 299.99, category: 'furniture' },
  { name: 'Produto Stress C', price: 399.99, category: 'electronics' },
  { name: 'Produto Stress D', price: 499.99, category: 'furniture' },
];

export default function () {
  // Aumenta a variação dos padrões de acesso conforme o número de usuários
  const currentVUs = __ENV.K6_VUS || 1;
  const isHighLoad = currentVUs > 50;
  
  // 1. Health Check (sempre executado)
  let response = http.get(`${BASE_URL}/`);
  check(response, {
    'health check ok': (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(isHighLoad ? 0.1 : 0.5);

  // 2. Múltiplas requisições concorrentes para usuários
  const requests = [];
  const numRequests = Math.floor(Math.random() * 3) + 1; // 1-3 requisições
  
  for (let i = 0; i < numRequests; i++) {
    const page = Math.floor(Math.random() * 5) + 1;
    requests.push(['GET', `${BASE_URL}/api/users?page=${page}&limit=10`]);
  }

  const responses = http.batch(requests);
  for (const resp of responses) {
    check(resp, {
      'batch users request ok': (r) => r.status === 200,
    }) || errorRate.add(1);
  }

  sleep(isHighLoad ? 0.1 : 0.3);

  // 3. Operações de escrita intensivas
  if (Math.random() < 0.7) { // 70% de chance
    const userData = testUsers[Math.floor(Math.random() * testUsers.length)];
    userData.email = `stress_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@test.com`;
    
    response = http.post(`${BASE_URL}/api/users`, JSON.stringify(userData), {
      headers: { 'Content-Type': 'application/json' },
    });
    check(response, {
      'criar usuário sob stress ok': (r) => r.status === 201,
    }) || errorRate.add(1);
  }

  sleep(isHighLoad ? 0.05 : 0.2);

  // 4. Login para obter token
  const loginData = {
    email: 'joao@email.com',
    password: 'senha123'
  };
  
  response = http.post(`${BASE_URL}/api/login`, JSON.stringify(loginData), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  let token = '';
  if (check(response, { 'login stress ok': (r) => r.status === 200 })) {
    token = response.json('token');
  } else {
    errorRate.add(1);
  }

  sleep(isHighLoad ? 0.05 : 0.2);

  // 5. Busca intensiva de produtos com filtros variados
  const categories = ['electronics', 'furniture'];
  const minPrices = [0, 50, 100, 200];
  const maxPrices = [500, 1000, 2000];
  
  const category = categories[Math.floor(Math.random() * categories.length)];
  const minPrice = minPrices[Math.floor(Math.random() * minPrices.length)];
  const maxPrice = maxPrices[Math.floor(Math.random() * maxPrices.length)];
  
  response = http.get(`${BASE_URL}/api/products?category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
  check(response, {
    'busca produtos filtrada ok': (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(isHighLoad ? 0.05 : 0.2);

  // 6. Operações autenticadas (se tiver token)
  if (token && Math.random() < 0.5) { // 50% de chance
    const productData = testProducts[Math.floor(Math.random() * testProducts.length)];
    productData.name = `${productData.name} Stress ${Date.now()}`;
    
    response = http.post(`${BASE_URL}/api/products`, JSON.stringify(productData), {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    check(response, {
      'criar produto autenticado ok': (r) => r.status === 201,
    }) || errorRate.add(1);
  }

  sleep(isHighLoad ? 0.05 : 0.2);

  // 7. Endpoint de processamento pesado (para testar limites)
  if (Math.random() < 0.4) { // 40% de chance
    const duration = Math.floor(Math.random() * 300) + 100; // 100-400ms
    response = http.get(`${BASE_URL}/api/heavy?duration=${duration}`);
    check(response, {
      'processamento pesado sob stress': (r) => r.status === 200,
    }) || errorRate.add(1);
  }

  sleep(isHighLoad ? 0.05 : 0.3);

  // 8. Teste do endpoint instável
  if (Math.random() < 0.3) { // 30% de chance
    response = http.get(`${BASE_URL}/api/flaky`);
    check(response, {
      'endpoint instável responde': (r) => r.status === 200 || r.status === 500,
    }) || errorRate.add(1);
  }

  // Pausa variável baseada na carga atual
  const sleepTime = isHighLoad ? Math.random() * 0.5 : Math.random() * 2 + 0.5;
  sleep(sleepTime);
}