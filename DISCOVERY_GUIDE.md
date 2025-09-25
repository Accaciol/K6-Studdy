# 🔍 Guia: Como Descobrir Parâmetros e Criar Testes K6

## 📋 Metodologia Passo a Passo

### **1. Descoberta de API (API Discovery)**

#### 🕵️ Técnicas de Exploração:

1. **Documentação da API**
   - Swagger/OpenAPI
   - Postman Collections
   - README do projeto

2. **Exploração Manual**
   ```bash
   # Testar endpoint básico
   curl http://localhost:3000/
   
   # Listar recursos
   curl http://localhost:3000/api/users
   curl http://localhost:3000/api/products
   ```

3. **Análise de Network (Dev Tools)**
   - F12 no navegador → Network tab
   - Usar a aplicação normalmente
   - Copiar requisições como cURL

4. **Ferramentas de API Testing**
   - Postman
   - Insomnia  
   - HTTPie

### **2. Mapeamento de Endpoints**

#### 📊 Template de Análise:

```
ENDPOINT: GET /api/users
├── Parâmetros de Query:
│   ├── page (opcional, número)
│   ├── limit (opcional, número) 
│   └── search (opcional, string)
├── Headers necessários:
│   └── (nenhum)
├── Resposta esperada:
│   ├── Status: 200
│   ├── Formato: JSON
│   └── Estrutura: {users: [], pagination: {}}
└── Possíveis erros:
    ├── 400 - Parâmetros inválidos
    └── 500 - Erro interno
```

### **3. Processo de Descoberta Prática**

#### Step 1: Explorar Endpoints Base
```bash
# Health Check
curl http://localhost:3000/

# Endpoints principais
curl http://localhost:3000/api/users
curl http://localhost:3000/api/products
```

#### Step 2: Testar Parâmetros
```bash
# Paginação
curl "http://localhost:3000/api/users?page=1&limit=5"
curl "http://localhost:3000/api/users?page=2&limit=10"

# Filtros
curl "http://localhost:3000/api/products?category=electronics"
curl "http://localhost:3000/api/products?minPrice=100&maxPrice=500"
```

#### Step 3: Testar Métodos HTTP
```bash
# POST - Criar usuário
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@email.com","password":"123456"}'

# POST - Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"senha123"}'
```

#### Step 4: Testar Autenticação
```bash
# Obter token
TOKEN=$(curl -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"senha123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Usar token
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Produto Teste","price":99.99,"category":"electronics"}'
```

### **4. Construindo o Teste K6 Passo a Passo**

#### 📝 Template Base:
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,        // Começar com 1 usuário
  duration: '30s', // Teste curto inicial
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // Step 1: Sempre começar com health check
  
  // Step 2: Adicionar endpoints um por vez
  
  // Step 3: Validar cada resposta
  
  // Step 4: Adicionar sleep realista
}
```

### **5. Exemplo Prático: Construindo Teste da Nossa API**

#### 🎯 Análise dos Endpoints Descobertos:

**Endpoints Mapeados:**
- `GET /` - Health check
- `GET /api/users` - Lista usuários (suporta ?page=X&limit=Y)
- `GET /api/users/:id` - Busca usuário específico  
- `POST /api/users` - Cria usuário
- `POST /api/login` - Autenticação
- `GET /api/products` - Lista produtos (suporta ?category=X&minPrice=Y)
- `POST /api/products` - Cria produto (precisa autenticação)

#### 🧪 Construção Incremental:

```javascript
// VERSÃO 1: Apenas Health Check
export default function () {
  const response = http.get(`${BASE_URL}/`);
  check(response, {
    'health check ok': (r) => r.status === 200,
  });
  sleep(1);
}

// VERSÃO 2: + Listar Usuários  
export default function () {
  // Health check
  let response = http.get(`${BASE_URL}/`);
  check(response, {
    'health check ok': (r) => r.status === 200,
  });
  
  // Listar usuários
  response = http.get(`${BASE_URL}/api/users`);
  check(response, {
    'lista usuários ok': (r) => r.status === 200,
    'tem array users': (r) => Array.isArray(r.json('users')),
  });
  
  sleep(1);
}

// VERSÃO 3: + Paginação
export default function () {
  // ... código anterior ...
  
  // Testar paginação
  const page = Math.floor(Math.random() * 3) + 1;
  response = http.get(`${BASE_URL}/api/users?page=${page}&limit=5`);
  check(response, {
    'paginação funciona': (r) => r.status === 200,
    'tem pagination': (r) => r.json('pagination') !== undefined,
  });
}

// VERSÃO 4: + Login e Token
// ... continuar incrementalmente
```

### **6. Dicas para Descobrir Parâmetros**

#### 🔍 Estratégias:

1. **Análise de Código Fonte**
   ```bash
   # Ver rotas na API
   grep -r "router\." api/src/
   grep -r "req.query" api/src/
   grep -r "req.params" api/src/
   ```

2. **Teste de Limites**
   ```bash
   # Testar limites de paginação
   curl "http://localhost:3000/api/users?page=999"
   curl "http://localhost:3000/api/users?limit=1000"
   ```

3. **Teste de Validação**
   ```bash
   # Campos obrigatórios
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{}'  # Corpo vazio para ver erros
   ```

4. **Análise de Erros**
   ```bash
   # Ver mensagens de erro
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{"invalid": "data"}'
   ```

### **7. Checklist de Validações**

#### ✅ Para cada endpoint, validar:

- [ ] **Status Code** correto (200, 201, 404, etc.)
- [ ] **Response Body** tem estrutura esperada
- [ ] **Headers** necessários (Content-Type, etc.)
- [ ] **Parâmetros obrigatórios** funcionam
- [ ] **Parâmetros opcionais** funcionam
- [ ] **Validação de dados** (campos obrigatórios)
- [ ] **Autenticação** (se necessário)
- [ ] **Autorização** (permissões)
- [ ] **Rate Limiting** (se houver)
- [ ] **Paginação** (se suportada)

### **8. Ferramentas Úteis**

#### 🛠️ Para Descoberta:
- **cURL**: Testes rápidos via linha de comando
- **Postman**: Interface gráfica, exporta para k6
- **HTTPie**: cURL mais amigável
- **Browser DevTools**: Network tab
- **Swagger UI**: Se a API tiver documentação

#### 📊 Para Análise:
- **jq**: Processar JSON no terminal
- **Grafana**: Visualizar métricas
- **k6 Cloud**: Análise avançada de resultados

### **9. Exemplo Completo: Do Zero ao Teste**

#### 🎯 Cenário: Nova API de E-commerce

```bash
# 1. Descobrir endpoints
curl http://api.exemplo.com/
curl http://api.exemplo.com/health

# 2. Explorar recursos
curl http://api.exemplo.com/api/v1/products
curl http://api.exemplo.com/api/v1/users  

# 3. Testar parâmetros
curl "http://api.exemplo.com/api/v1/products?category=books&page=1"

# 4. Testar autenticação
curl -X POST http://api.exemplo.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# 5. Construir teste k6
# (seguir template incremental acima)
```

---

**🎓 Próximo passo:** Vamos aplicar isso na prática? Me diga qual API você quer testar e vamos descobrir os parâmetros juntos!