import http from 'k6/http';
import { check, sleep } from 'k6';

// TESTE PASSO A PASSO - CONSTRUÇÃO INCREMENTAL
// Este arquivo mostra como construir um teste do zero

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<1000'], // Mais tolerante para início
    http_req_failed: ['rate<0.1'],     // Mais tolerante para início
  },
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  console.log('=== INICIANDO TESTE PASSO A PASSO ===');
  
  // ==========================================
  // STEP 1: HEALTH CHECK (Sempre primeiro!)
  // ==========================================
  console.log('Step 1: Health Check');
  
  let response = http.get(`${BASE_URL}/`);
  
  // Validações básicas
  const healthOk = check(response, {
    'Health check - Status 200': (r) => r.status === 200,
    'Health check - Tem status': (r) => r.json('status') !== undefined,
    'Health check - Status = OK': (r) => r.json('status') === 'OK',
    'Health check - Tem timestamp': (r) => r.json('timestamp') !== undefined,
  });
  
  if (!healthOk) {
    console.error('❌ Health check falhou - API pode estar offline');
    return; // Para execução se API não estiver funcionando
  }
  
  console.log('✅ Health check passou');
  sleep(0.5);

  // ==========================================
  // STEP 2: DESCOBRIR ESTRUTURA DE USUÁRIOS
  // ==========================================
  console.log('Step 2: Explorando endpoint de usuários');
  
  response = http.get(`${BASE_URL}/api/users`);
  
  check(response, {
    'Users - Status 200': (r) => r.status === 200,
    'Users - É JSON': (r) => {
      try {
        r.json();
        return true;
      } catch {
        return false;
      }
    },
    'Users - Tem propriedade users': (r) => r.json('users') !== undefined,
    'Users - users é array': (r) => Array.isArray(r.json('users')),
    'Users - Tem paginação': (r) => r.json('pagination') !== undefined,
  });

  // Analisar estrutura da resposta
  const usersData = response.json();
  console.log(`📊 Encontrados ${usersData.users.length} usuários`);
  console.log(`📄 Paginação: página ${usersData.pagination.currentPage} de ${usersData.pagination.totalPages}`);
  
  sleep(0.5);

  // ==========================================  
  // STEP 3: TESTAR PAGINAÇÃO
  // ==========================================
  console.log('Step 3: Testando paginação');
  
  // Testar diferentes páginas
  const testPages = [1, 2, 3];
  testPages.forEach(page => {
    response = http.get(`${BASE_URL}/api/users?page=${page}&limit=2`);
    
    check(response, {
      [`Paginação página ${page} - Status 200`]: (r) => r.status === 200,
      [`Paginação página ${page} - Tem dados`]: (r) => r.json('users').length >= 0,
    });
  });
  
  sleep(0.5);

  // ==========================================
  // STEP 4: TESTAR BUSCA POR ID
  // ==========================================
  console.log('Step 4: Testando busca por ID');
  
  // Pegar ID de um usuário existente
  const firstUser = usersData.users[0];
  if (firstUser && firstUser.id) {
    response = http.get(`${BASE_URL}/api/users/${firstUser.id}`);
    
    check(response, {
      'Busca por ID - Status 200': (r) => r.status === 200,
      'Busca por ID - Tem ID correto': (r) => r.json('id') === firstUser.id,
      'Busca por ID - Tem nome': (r) => r.json('name') !== undefined,
      'Busca por ID - Tem email': (r) => r.json('email') !== undefined,
    });
    
    console.log(`✅ Usuário encontrado: ${response.json('name')}`);
  }
  
  // Testar ID inexistente
  response = http.get(`${BASE_URL}/api/users/999999`);
  check(response, {
    'ID inexistente - Status 404': (r) => r.status === 404,
  });
  
  sleep(0.5);

  // ==========================================
  // STEP 5: DESCOBRIR COMO FAZER LOGIN
  // ==========================================
  console.log('Step 5: Testando autenticação');
  
  // Primeiro, tentar sem dados para ver o erro
  response = http.post(`${BASE_URL}/api/login`, JSON.stringify({}), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(response, {
    'Login sem dados - Status 400': (r) => r.status === 400,
    'Login sem dados - Mensagem de erro': (r) => r.json('error') !== undefined,
  });
  
  console.log(`💡 Erro esperado: ${response.json('error')}`);
  
  // Agora fazer login correto
  const loginData = {
    email: 'joao@email.com',
    password: 'senha123'
  };
  
  response = http.post(`${BASE_URL}/api/login`, JSON.stringify(loginData), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  let token = '';
  const loginSuccess = check(response, {
    'Login correto - Status 200': (r) => r.status === 200,
    'Login correto - Tem token': (r) => r.json('token') !== undefined,
    'Login correto - Tem user': (r) => r.json('user') !== undefined,
  });
  
  if (loginSuccess) {
    token = response.json('token');
    console.log(`✅ Login realizado. Token obtido: ${token.substring(0, 20)}...`);
  }
  
  sleep(0.5);

  // ==========================================
  // STEP 6: EXPLORAR ENDPOINT DE PRODUTOS
  // ==========================================
  console.log('Step 6: Explorando produtos');
  
  response = http.get(`${BASE_URL}/api/products`);
  
  check(response, {
    'Produtos - Status 200': (r) => r.status === 200,
    'Produtos - Tem array products': (r) => Array.isArray(r.json('products')),
    'Produtos - Tem total': (r) => r.json('total') !== undefined,
  });
  
  const productsData = response.json();
  console.log(`🛍️ Encontrados ${productsData.total} produtos`);
  
  // Descobrir categorias disponíveis
  const categories = [...new Set(productsData.products.map(p => p.category))];
  console.log(`📂 Categorias disponíveis: ${categories.join(', ')}`);
  
  // Testar filtros por categoria
  categories.forEach(category => {
    response = http.get(`${BASE_URL}/api/products?category=${category}`);
    
    check(response, {
      [`Filtro ${category} - Status 200`]: (r) => r.status === 200,
      [`Filtro ${category} - Produtos filtrados`]: (r) => {
        const prods = r.json('products');
        return prods.every(p => p.category === category);
      },
    });
  });
  
  sleep(0.5);

  // ==========================================
  // STEP 7: TESTAR OPERAÇÕES DE ESCRITA
  // ==========================================
  console.log('Step 7: Testando criação de usuário');
  
  // Criar usuário com dados únicos
  const timestamp = Date.now();
  const newUser = {
    name: `Usuario Teste ${timestamp}`,
    email: `teste${timestamp}@example.com`,
    password: 'senha123'
  };
  
  response = http.post(`${BASE_URL}/api/users`, JSON.stringify(newUser), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(response, {
    'Criar usuário - Status 201': (r) => r.status === 201,
    'Criar usuário - Tem ID': (r) => r.json('id') !== undefined,
    'Criar usuário - Nome correto': (r) => r.json('name') === newUser.name,
    'Criar usuário - Email correto': (r) => r.json('email') === newUser.email,
    'Criar usuário - Sem senha na resposta': (r) => r.json('password') === undefined,
  });
  
  const createdUser = response.json();
  console.log(`✅ Usuário criado: ID ${createdUser.id}`);
  
  sleep(0.5);

  // ==========================================
  // STEP 8: TESTAR OPERAÇÕES AUTENTICADAS
  // ==========================================
  if (token) {
    console.log('Step 8: Testando operação autenticada');
    
    const newProduct = {
      name: `Produto Teste ${timestamp}`,
      price: 99.99,
      category: 'electronics'
    };
    
    response = http.post(`${BASE_URL}/api/products`, JSON.stringify(newProduct), {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    check(response, {
      'Criar produto - Status 201': (r) => r.status === 201,
      'Criar produto - Tem ID': (r) => r.json('id') !== undefined,
      'Criar produto - Nome correto': (r) => r.json('name') === newProduct.name,
      'Criar produto - Preço correto': (r) => r.json('price') === newProduct.price,
    });
    
    console.log(`✅ Produto criado: ${response.json('name')}`);
  } else {
    console.log('⚠️ Pulando teste autenticado - sem token');
  }
  
  sleep(0.5);

  // ==========================================
  // STEP 9: TESTAR ENDPOINTS ESPECIAIS
  // ==========================================
  console.log('Step 9: Testando endpoints especiais');
  
  // Endpoint de processamento pesado
  response = http.get(`${BASE_URL}/api/heavy?duration=50`);
  
  check(response, {
    'Heavy processing - Status 200': (r) => r.status === 200,
    'Heavy processing - Tem mensagem': (r) => r.json('message') !== undefined,
    'Heavy processing - Tem timestamp': (r) => r.json('timestamp') !== undefined,
  });
  
  // Endpoint instável
  response = http.get(`${BASE_URL}/api/flaky`);
  
  check(response, {
    'Flaky endpoint - Status válido': (r) => r.status === 200 || r.status === 500,
  });
  
  if (response.status === 500) {
    console.log('⚠️ Endpoint flaky retornou erro (comportamento esperado)');
  }
  
  console.log('=== TESTE PASSO A PASSO CONCLUÍDO ===');
  sleep(1);
}