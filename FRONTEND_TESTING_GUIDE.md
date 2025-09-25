# 🖥️ Guia: Testando Telas de Sistema com K6

## 🎯 Estratégias para Testar Frontend

### **1. Abordagens Possíveis**

#### 🔧 **A) Testar APIs que Alimentam a Tela**
```
Tela de Login → API /login
Tela de Dashboard → APIs /users, /metrics, /notifications
Tela de E-commerce → APIs /products, /cart, /checkout
```
**Vantagem**: Mais eficiente, foca na performance do backend
**Quando usar**: Para validar capacidade dos serviços

#### 🌐 **B) Testar Requisições do Browser**
```
Capturar requisições reais do navegador
Replicar no k6 com mesmos headers/cookies
```
**Vantagem**: Testa exatamente o que o usuário faz
**Quando usar**: Para validar fluxo completo

#### 📱 **C) Testar com Browser Real (k6 browser)**
```
Automatizar cliques, digitação, navegação
Medir performance de rendering
```
**Vantagem**: Testa experiência completa do usuário
**Quando usar**: Para testes de UX e performance visual

---

## 🛠️ Método 1: Mapeamento via Developer Tools

### **Passo 1: Capturar Requisições da Tela**

1. **Abrir DevTools** (F12)
2. **Aba Network** → Clear (🚫)
3. **Usar a tela normalmente**
4. **Analisar requisições capturadas**

#### Exemplo Prático - Tela de Login:

```bash
# Requisições capturadas:
POST /api/auth/login          # Fazer login
GET  /api/user/profile        # Buscar dados do usuário  
GET  /api/dashboard/summary   # Carregar resumo
GET  /api/notifications       # Carregar notificações
```

### **Passo 2: Converter para Teste K6**

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '2m',
};

const BASE_URL = 'https://meusite.com';

export default function () {
  // Simular acesso à tela de login
  
  // 1. Carregar página inicial (se necessário)
  let response = http.get(`${BASE_URL}/login`);
  check(response, {
    'Página login carregou': (r) => r.status === 200,
  });
  
  // 2. Fazer login (requisição principal da tela)
  const loginData = {
    email: 'usuario@example.com',
    password: 'senha123'
  };
  
  response = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify(loginData), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  let token = '';
  if (check(response, { 'Login ok': (r) => r.status === 200 })) {
    token = response.json('token');
  }
  
  sleep(1); // Simular tempo de carregamento
  
  // 3. Carregar dados do dashboard (próxima tela)
  if (token) {
    response = http.get(`${BASE_URL}/api/user/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    check(response, {
      'Perfil carregado': (r) => r.status === 200,
    });
    
    // 4. Carregar outros componentes da tela
    response = http.get(`${BASE_URL}/api/dashboard/summary`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    check(response, {
      'Dashboard carregado': (r) => r.status === 200,
    });
  }
  
  sleep(2); // Tempo que usuário passa na tela
}
```

---

## 🎭 Método 2: Cenários por Tipo de Tela

### **📋 Tela de Listagem/Tabela**

```javascript
export default function () {
  // 1. Carregar primeira página
  let response = http.get(`${BASE_URL}/api/users?page=1&limit=20`);
  check(response, {
    'Lista carregada': (r) => r.status === 200,
    'Tem dados': (r) => r.json('data').length > 0,
  });
  
  // 2. Simular paginação
  const totalPages = response.json('totalPages');
  const randomPage = Math.floor(Math.random() * Math.min(totalPages, 5)) + 1;
  
  response = http.get(`${BASE_URL}/api/users?page=${randomPage}&limit=20`);
  check(response, { 'Paginação ok': (r) => r.status === 200 });
  
  // 3. Simular filtros
  response = http.get(`${BASE_URL}/api/users?status=active&search=João`);
  check(response, { 'Filtro ok': (r) => r.status === 200 });
  
  // 4. Simular ordenação
  response = http.get(`${BASE_URL}/api/users?sort=name&order=asc`);
  check(response, { 'Ordenação ok': (r) => r.status === 200 });
  
  sleep(3); // Tempo navegando na lista
}
```

### **📝 Tela de Formulário**

```javascript
export default function () {
  // 1. Carregar formulário (buscar dados iniciais)
  let response = http.get(`${BASE_URL}/api/form/user-create`);
  check(response, {
    'Formulário carregado': (r) => r.status === 200,
  });
  
  // 2. Carregar opções de select/dropdown
  response = http.get(`${BASE_URL}/api/departments`);
  check(response, { 'Opções carregadas': (r) => r.status === 200 });
  
  sleep(5); // Tempo preenchendo formulário
  
  // 3. Validar campos (requisições de validação)
  response = http.post(`${BASE_URL}/api/validate/email`, 
    JSON.stringify({ email: 'teste@example.com' }), {
    headers: { 'Content-Type': 'application/json' },
  });
  check(response, { 'Validação email ok': (r) => r.status === 200 });
  
  // 4. Submeter formulário
  const formData = {
    name: 'Usuário Teste',
    email: 'teste@example.com',
    department: 'TI',
    phone: '11999999999'
  };
  
  response = http.post(`${BASE_URL}/api/users`, JSON.stringify(formData), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(response, {
    'Formulário salvo': (r) => r.status === 201,
    'ID gerado': (r) => r.json('id') !== undefined,
  });
  
  sleep(1); // Tempo de feedback/redirecionamento
}
```

### **📊 Tela de Dashboard**

```javascript
export default function () {
  // 1. Carregar múltiplos widgets simultaneamente
  const requests = [
    ['GET', `${BASE_URL}/api/dashboard/stats`],
    ['GET', `${BASE_URL}/api/dashboard/chart-sales`],
    ['GET', `${BASE_URL}/api/dashboard/recent-orders`],
    ['GET', `${BASE_URL}/api/dashboard/notifications`],
  ];
  
  const responses = http.batch(requests);
  
  // Validar cada widget
  check(responses[0], { 'Stats carregadas': (r) => r.status === 200 });
  check(responses[1], { 'Gráfico carregado': (r) => r.status === 200 });
  check(responses[2], { 'Pedidos carregados': (r) => r.status === 200 });
  check(responses[3], { 'Notificações carregadas': (r) => r.status === 200 });
  
  sleep(10); // Tempo analisando dashboard
  
  // 2. Interações com filtros de período
  response = http.get(`${BASE_URL}/api/dashboard/chart-sales?period=7d`);
  check(response, { 'Filtro 7 dias ok': (r) => r.status === 200 });
  
  sleep(2);
  
  response = http.get(`${BASE_URL}/api/dashboard/chart-sales?period=30d`);  
  check(response, { 'Filtro 30 dias ok': (r) => r.status === 200 });
}
```

---

## 🔍 Método 3: Usando HAR Files

### **Capturar HAR (HTTP Archive)**

1. **DevTools** → Network → ⚙️ → **Export HAR**
2. **Converter HAR para K6**:

```bash
# Instalar conversor (se não tiver)
npm install -g har-to-k6

# Converter arquivo
har-to-k6 minha-sessao.har -o teste-gerado.js
```

### **Exemplo de HAR Convertido:**

```javascript
// Arquivo gerado automaticamente
import http from 'k6/http';
import { check } from 'k6';

export default function() {
  let response;
  
  // Requisição 1: Carregar página
  response = http.get('https://site.com/dashboard', {
    headers: {
      'accept': 'text/html,application/xhtml+xml',
      'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8',
      'cookie': 'session=abc123; user_id=456',
    },
  });
  
  // Requisição 2: API do dashboard
  response = http.get('https://site.com/api/dashboard/data', {
    headers: {
      'accept': 'application/json',
      'authorization': 'Bearer eyJ...',
      'referer': 'https://site.com/dashboard',
    },
  });
}
```

---

## 🎬 Método 4: K6 Browser (Testes Visuais)

### **Instalação:**
```bash
# Usar k6 com suporte a browser
k6 run --env K6_BROWSER_ENABLED=true teste-browser.js
```

### **Exemplo - Teste de Tela Completa:**

```javascript
import { browser } from 'k6/experimental/browser';
import { check } from 'k6';

export const options = {
  scenarios: {
    browser: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
};

export default async function () {
  const page = browser.newPage();
  
  try {
    // 1. Navegar para a tela
    await page.goto('https://meusite.com/login');
    
    // 2. Preencher formulário
    await page.locator('#email').type('usuario@test.com');
    await page.locator('#password').type('senha123');
    
    // 3. Clicar no botão
    await page.locator('#login-button').click();
    
    // 4. Aguardar carregamento da próxima tela
    await page.waitForSelector('.dashboard-container');
    
    // 5. Validações visuais
    check(page, {
      'Dashboard carregou': (p) => p.locator('.dashboard-title').isVisible(),
      'Sem erros': (p) => !p.locator('.error-message').isVisible(),
    });
    
    // 6. Simular interação com tabela
    await page.locator('#filter-input').type('João');
    await page.locator('#search-button').click();
    
    // 7. Medir performance
    const metrics = page.metrics();
    check(metrics, {
      'Tempo de carregamento ok': (m) => m.domContentLoaded < 2000,
    });
    
  } finally {
    page.close();
  }
}
```

---

## 📋 Checklist para Testar Telas

### **🔍 Análise Inicial:**
- [ ] Identificar todas as requisições da tela (F12)
- [ ] Mapear fluxo de navegação do usuário
- [ ] Identificar dados dinâmicos (IDs, tokens, timestamps)
- [ ] Verificar autenticação necessária
- [ ] Analisar parâmetros de filtros/paginação

### **🧪 Construção do Teste:**
- [ ] Começar com cenário mais simples
- [ ] Adicionar validações de resposta
- [ ] Simular tempos de "think time" realistas
- [ ] Testar cenários de erro (dados inválidos)
- [ ] Incluir diferentes perfis de usuário

### **📊 Métricas Importantes:**
- [ ] Tempo de carregamento inicial
- [ ] Tempo de resposta das APIs
- [ ] Taxa de erro por endpoint
- [ ] Throughput de requisições
- [ ] Performance com múltiplos usuários

---

## 🎯 Exemplo Prático: E-commerce

Vamos criar um teste para uma **tela de produtos**:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 20 },  // 20 usuários navegando
    { duration: '3m', target: 20 },  // Pico de navegação
    { duration: '1m', target: 0 },   // Finalizar
  ],
};

const BASE_URL = 'https://loja.com';

export default function () {
  // Simular usuário navegando na loja
  
  // 1. Acessar página inicial
  let response = http.get(`${BASE_URL}/`);
  check(response, { 'Home carregou': (r) => r.status === 200 });
  
  sleep(2); // Usuário vendo a home
  
  // 2. Buscar produtos
  const searchTerms = ['notebook', 'mouse', 'teclado'];
  const search = searchTerms[Math.floor(Math.random() * searchTerms.length)];
  
  response = http.get(`${BASE_URL}/api/products?search=${search}&page=1`);
  check(response, {
    'Busca funcionou': (r) => r.status === 200,
    'Tem produtos': (r) => r.json('products').length > 0,
  });
  
  sleep(3); // Usuário analisando resultados
  
  // 3. Ver detalhes de um produto
  const products = response.json('products');
  if (products.length > 0) {
    const product = products[0];
    
    response = http.get(`${BASE_URL}/api/products/${product.id}`);
    check(response, {
      'Detalhes carregaram': (r) => r.status === 200,
      'Tem preço': (r) => r.json('price') > 0,
    });
    
    sleep(5); // Usuário lendo detalhes
    
    // 4. Adicionar ao carrinho (30% das vezes)
    if (Math.random() < 0.3) {
      response = http.post(`${BASE_URL}/api/cart/add`, 
        JSON.stringify({ productId: product.id, quantity: 1 }), {
        headers: { 'Content-Type': 'application/json' },
      });
      
      check(response, { 'Adicionou ao carrinho': (r) => r.status === 200 });
    }
  }
  
  sleep(1);
}
```

**Quer que eu ajude você a criar um teste específico para alguma tela do seu sistema?** Me conte qual tela você quer testar! 🚀