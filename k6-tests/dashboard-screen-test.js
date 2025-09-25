import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Teste para uma TELA DE DASHBOARD típica
// Simula usuários acessando uma tela administrativa

const errorRate = new Rate('tela_errors');

export const options = {
  scenarios: {
    // Cenário 1: Usuários normais navegando
    usuarios_navegando: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 15 }, // Crescimento gradual
        { duration: '5m', target: 15 }, // Uso constante
        { duration: '1m', target: 0 },  // Finalização
      ],
      exec: 'cenario_dashboard',
    },
    
    // Cenário 2: Picos de acesso (horário comercial)
    pico_comercial: {
      executor: 'ramping-vus', 
      startVUs: 0,
      stages: [
        { duration: '30s', target: 30 }, // Pico súbito
        { duration: '2m', target: 30 },  // Pico mantido
        { duration: '30s', target: 5 },  // Queda
      ],
      exec: 'cenario_dashboard',
      startTime: '3m', // Inicia após 3 minutos
    }
  },
  
  thresholds: {
    http_req_duration: ['p(95)<2000'], // Dashboard pode ser mais lento
    http_req_failed: ['rate<0.05'],
    tela_errors: ['rate<0.05'],
  },
};

const BASE_URL = 'http://localhost:3000';

// Dados simulando diferentes perfis de usuário
const usuarios = [
  { email: 'joao@email.com', password: 'senha123', perfil: 'admin' },
  { email: 'maria@email.com', password: 'senha123', perfil: 'user' },
  { email: 'pedro@email.com', password: 'senha123', perfil: 'user' },
];

// Cenário principal: Usuário usando tela de dashboard
export function cenario_dashboard() {
  const usuario = usuarios[Math.floor(Math.random() * usuarios.length)];
  
  console.log(`👤 Usuário ${usuario.email} (${usuario.perfil}) acessando dashboard`);
  
  // =============================================
  // ETAPA 1: LOGIN - Autenticação na tela
  // =============================================
  
  let response = http.post(`${BASE_URL}/api/login`, JSON.stringify({
    email: usuario.email,
    password: usuario.password
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  let token = '';
  const loginOk = check(response, {
    '🔐 Login - Status 200': (r) => r.status === 200,
    '🔐 Login - Token recebido': (r) => r.json('token') !== undefined,
  });
  
  if (!loginOk) {
    console.error('❌ Falha no login, abortando sessão');
    errorRate.add(1);
    return;
  }
  
  token = response.json('token');
  const headers = { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  
  sleep(1); // Tempo de redirecionamento
  
  // =============================================
  // ETAPA 2: CARREGAMENTO INICIAL DO DASHBOARD
  // =============================================
  
  console.log('📊 Carregando componentes do dashboard...');
  
  // Simular carregamento de múltiplos widgets simultaneamente
  // (como uma tela real faria)
  const dashboardRequests = [
    ['GET', `${BASE_URL}/api/users`],        // Widget: Total de usuários
    ['GET', `${BASE_URL}/api/products`],     // Widget: Total de produtos  
    ['GET', `${BASE_URL}/api/users?page=1&limit=5`], // Widget: Usuários recentes
    ['GET', `${BASE_URL}/api/products?category=electronics&limit=3`], // Widget: Produtos em destaque
  ];
  
  const dashboardResponses = http.batch(dashboardRequests.map(req => ({
    method: req[0],
    url: req[1],
    params: { headers }
  })));
  
  // Validar cada widget do dashboard
  const widgetChecks = [
    check(dashboardResponses[0], {
      '📈 Widget Usuários - Carregou': (r) => r.status === 200,
      '📈 Widget Usuários - Tem dados': (r) => r.json('users').length >= 0,
    }),
    check(dashboardResponses[1], {
      '🛍️ Widget Produtos - Carregou': (r) => r.status === 200,  
      '🛍️ Widget Produtos - Tem dados': (r) => r.json('products').length >= 0,
    }),
    check(dashboardResponses[2], {
      '👥 Lista Recentes - Carregou': (r) => r.status === 200,
      '👥 Lista Recentes - Paginação ok': (r) => r.json('pagination') !== undefined,
    }),
    check(dashboardResponses[3], {
      '⭐ Produtos Destaque - Carregou': (r) => r.status === 200,
      '⭐ Produtos Destaque - Filtrado': (r) => {
        const prods = r.json('products');
        return prods.every(p => p.category === 'electronics');
      },
    }),
  ];
  
  const dashboardCarregou = widgetChecks.every(check => check);
  if (!dashboardCarregou) {
    errorRate.add(1);
  }
  
  sleep(3); // Usuário analisando dashboard inicial
  
  // =============================================
  // ETAPA 3: INTERAÇÕES COM FILTROS DE PERÍODO
  // =============================================
  
  console.log('📅 Usuário alterando período de visualização...');
  
  // Simular troca de período (comum em dashboards)
  const periodos = ['7d', '30d', '90d'];
  const periodoEscolhido = periodos[Math.floor(Math.random() * periodos.length)];
  
  response = http.get(`${BASE_URL}/api/users?createdAfter=${periodoEscolhido}`, {
    headers
  });
  
  check(response, {
    [`📅 Filtro ${periodoEscolhido} - Funcionou`]: (r) => r.status === 200,
  }) || errorRate.add(1);
  
  sleep(2); // Usuário analisando dados filtrados
  
  // =============================================
  // ETAPA 4: BUSCA/PESQUISA (se disponível)
  // =============================================
  
  if (Math.random() < 0.4) { // 40% dos usuários fazem busca
    console.log('🔍 Usuário fazendo busca...');
    
    const termosComuns = ['João', 'teste', 'admin', 'user'];
    const termo = termosComuns[Math.floor(Math.random() * termosComuns.length)];
    
    // Simular busca com debounce (como telas reais)
    sleep(0.5); // Usuário digitando
    
    response = http.get(`${BASE_URL}/api/users?search=${termo}`, {
      headers
    });
    
    check(response, {
      '🔍 Busca - Executou': (r) => r.status === 200,
      '🔍 Busca - Resultados válidos': (r) => Array.isArray(r.json('users')),
    }) || errorRate.add(1);
    
    sleep(2); // Usuário analisando resultados
  }
  
  // =============================================
  // ETAPA 5: OPERAÇÕES ADMIN (se for admin)
  // =============================================
  
  if (usuario.perfil === 'admin' && Math.random() < 0.3) { // 30% dos admins fazem operações
    console.log('👑 Admin executando operações...');
    
    // Criar novo usuário (operação administrativa)
    const novoUser = {
      name: `Admin User ${Date.now()}`,
      email: `admin${Date.now()}@test.com`,
      password: 'senha123'
    };
    
    response = http.post(`${BASE_URL}/api/users`, JSON.stringify(novoUser), {
      headers
    });
    
    check(response, {
      '👑 Admin - Criou usuário': (r) => r.status === 201,
      '👑 Admin - ID gerado': (r) => r.json('id') !== undefined,
    }) || errorRate.add(1);
    
    sleep(1);
    
    // Criar produto (operação administrativa)
    const novoProduto = {
      name: `Admin Product ${Date.now()}`,
      price: Math.floor(Math.random() * 1000) + 50,
      category: Math.random() < 0.5 ? 'electronics' : 'furniture'
    };
    
    response = http.post(`${BASE_URL}/api/products`, JSON.stringify(novoProduto), {
      headers
    });
    
    check(response, {
      '👑 Admin - Criou produto': (r) => r.status === 201,
      '👑 Admin - Produto válido': (r) => r.json('price') > 0,
    }) || errorRate.add(1);
  }
  
  // =============================================
  // ETAPA 6: NAVEGAÇÃO ENTRE PÁGINAS/ABAS
  // =============================================
  
  if (Math.random() < 0.6) { // 60% navegam para outras páginas
    console.log('📄 Usuário navegando para outras seções...');
    
    // Simular clique em abas/menus diferentes
    const secoes = [
      { nome: 'Usuários', url: '/api/users?page=1&limit=10' },
      { nome: 'Produtos', url: '/api/products?page=1&limit=10' },
      { nome: 'Detalhes', url: '/api/users/1' }
    ];
    
    const secao = secoes[Math.floor(Math.random() * secoes.length)];
    
    response = http.get(`${BASE_URL}${secao.url}`, { headers });
    
    check(response, {
      [`📄 Seção ${secao.nome} - Carregou`]: (r) => r.status === 200,
    }) || errorRate.add(1);
    
    sleep(4); // Usuário usando a nova seção
  }
  
  // =============================================
  // ETAPA 7: REFRESH/ATUALIZAÇÃO (ocasional)
  // =============================================
  
  if (Math.random() < 0.2) { // 20% fazem refresh
    console.log('🔄 Usuário atualizando dados...');
    
    response = http.get(`${BASE_URL}/api/users?refresh=true`, { headers });
    
    check(response, {
      '🔄 Refresh - Funcionou': (r) => r.status === 200,
    }) || errorRate.add(1);
    
    sleep(1);
  }
  
  // =============================================
  // ETAPA 8: FINALIZAÇÃO DA SESSÃO
  // =============================================
  
  // Simular tempo total na tela (mais realista)
  const tempoExtra = Math.random() * 5 + 2; // 2-7 segundos extras
  sleep(tempoExtra);
  
  console.log(`✅ ${usuario.email} finalizou sessão no dashboard`);
}

// Função adicional para simular diferentes comportamentos
export default cenario_dashboard;