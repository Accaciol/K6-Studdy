import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Métrica customizada para taxa de erro
const errorRate = new Rate('errors');

// Configuração do teste de carga
export const options = {
  stages: [
    { duration: '1m', target: 10 }, // Ramp up para 10 usuários em 1 minuto
    { duration: '3m', target: 10 }, // Mantém 10 usuários por 3 minutos
    { duration: '1m', target: 0 },  // Ramp down para 0 usuários em 1 minuto
  ],
  thresholds: {
    http_req_duration: ['p(95)<800'], // 95% das requisições devem ser < 800ms
    http_req_failed: ['rate<0.05'], // Taxa de erro deve ser < 5%
    errors: ['rate<0.05'], // Taxa de erro customizada < 5%
  },
};

const BASE_URL = 'http://localhost:3000';

// Dados de teste
const users = [
  { name: 'Usuario Teste 1', email: 'user1@test.com', password: 'senha123' },
  { name: 'Usuario Teste 2', email: 'user2@test.com', password: 'senha123' },
  { name: 'Usuario Teste 3', email: 'user3@test.com', password: 'senha123' },
];

const products = [
  { name: 'Produto A', price: 99.99, category: 'electronics' },
  { name: 'Produto B', price: 149.99, category: 'furniture' },
  { name: 'Produto C', price: 79.99, category: 'electronics' },
];

export default function () {
  // 1. Health Check
  let response = http.get(`${BASE_URL}/`);
  check(response, {
    'health check status 200': (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(0.5);

  // 2. Listagem de usuários com paginação
  const page = Math.floor(Math.random() * 3) + 1;
  response = http.get(`${BASE_URL}/api/users?page=${page}&limit=5`);
  check(response, {
    'lista usuários status 200': (r) => r.status === 200,
    'paginação presente': (r) => r.json('pagination') !== undefined,
  }) || errorRate.add(1);

  sleep(0.5);

  // 3. Buscar usuário específico
  const userId = Math.floor(Math.random() * 3) + 1;
  response = http.get(`${BASE_URL}/api/users/${userId}`);
  check(response, {
    'busca usuário status 200': (r) => r.status === 200,
    'usuário tem id': (r) => r.json('id') !== undefined,
  }) || errorRate.add(1);

  sleep(0.5);

  // 4. Login (para obter token)
  const loginData = {
    email: 'joao@email.com',
    password: 'senha123'
  };
  
  response = http.post(`${BASE_URL}/api/login`, JSON.stringify(loginData), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  let token = '';
  const loginSuccess = check(response, {
    'login status 200': (r) => r.status === 200,
    'token recebido': (r) => r.json('token') !== undefined,
  });
  
  if (loginSuccess) {
    token = response.json('token');
  } else {
    errorRate.add(1);
  }

  sleep(0.5);

  // 5. Listar produtos com filtros
  const categories = ['electronics', 'furniture'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  response = http.get(`${BASE_URL}/api/products?category=${category}&minPrice=50`);
  check(response, {
    'lista produtos status 200': (r) => r.status === 200,
    'produtos filtrados': (r) => r.json('products').length >= 0,
  }) || errorRate.add(1);

  sleep(0.5);

  // 6. Criar novo usuário (operação mais pesada)
  const userData = users[Math.floor(Math.random() * users.length)];
  userData.email = `test_${Math.random().toString(36).substr(2, 9)}@example.com`;
  
  response = http.post(`${BASE_URL}/api/users`, JSON.stringify(userData), {
    headers: { 'Content-Type': 'application/json' },
  });
  check(response, {
    'criar usuário status 201': (r) => r.status === 201,
    'usuário criado tem id': (r) => r.json('id') !== undefined,
  }) || errorRate.add(1);

  sleep(0.5);

  // 7. Criar produto (se tiver token)
  if (token) {
    const productData = products[Math.floor(Math.random() * products.length)];
    productData.name = `${productData.name} ${Math.random().toString(36).substr(2, 5)}`;
    
    response = http.post(`${BASE_URL}/api/products`, JSON.stringify(productData), {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    check(response, {
      'criar produto status 201': (r) => r.status === 201,
      'produto criado tem id': (r) => r.json('id') !== undefined,
    }) || errorRate.add(1);
  }

  sleep(0.5);

  // 8. Endpoint com processamento pesado (ocasionalmente)
  if (Math.random() < 0.3) { // 30% de chance
    const duration = Math.floor(Math.random() * 200) + 50; // 50-250ms
    response = http.get(`${BASE_URL}/api/heavy?duration=${duration}`);
    check(response, {
      'processamento pesado status 200': (r) => r.status === 200,
    }) || errorRate.add(1);
  }

  sleep(1);
}