import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuração do teste de fumaça
export const options = {
  vus: 1, // 1 usuário virtual
  duration: '1m', // 1 minuto
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% das requisições devem ser < 500ms
    http_req_failed: ['rate<0.1'], // Taxa de erro deve ser < 10%
  },
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // Teste básico de health check
  let response = http.get(`${BASE_URL}/`);
  check(response, {
    'status é 200': (r) => r.status === 200,
    'resposta contém status OK': (r) => r.json('status') === 'OK',
  });

  sleep(1);

  // Teste de listagem de usuários
  response = http.get(`${BASE_URL}/api/users`);
  check(response, {
    'users endpoint retorna 200': (r) => r.status === 200,
    'resposta contém array de usuários': (r) => Array.isArray(r.json('users')),
  });

  sleep(1);

  // Teste de listagem de produtos
  response = http.get(`${BASE_URL}/api/products`);
  check(response, {
    'products endpoint retorna 200': (r) => r.status === 200,
    'resposta contém array de produtos': (r) => Array.isArray(r.json('products')),
  });

  sleep(1);
}