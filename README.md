# K6 Performance Testing Project

Este projeto demonstra como usar k6 para testes de performance com uma aplicação Docker real.

## Estrutura do Projeto

```
k6-testing-project/
├── api/                    # Aplicação Node.js de exemplo
│   ├── src/
│   │   ├── app.js         # Servidor Express
│   │   ├── routes/        # Rotas da API
│   │   └── middleware/    # Middlewares
│   ├── package.json
│   └── Dockerfile
├── k6-tests/              # Scripts de teste k6
│   ├── load-test.js       # Teste de carga
│   ├── stress-test.js     # Teste de estresse
│   ├── spike-test.js      # Teste de pico
│   └── smoke-test.js      # Teste de fumaça
├── docker-compose.yml     # Orquestração dos containers
├── grafana/              # Dashboards para visualização
└── README.md
```

## Requisitos

- Docker e Docker Compose
- k6 (instalado localmente ou via Docker)
- Node.js (para desenvolvimento da API)

## Como usar

### 1. Subir a aplicação de teste

```bash
docker-compose up -d api
```

### 2. Executar testes k6

```bash
# Teste de fumaça
k6 run k6-tests/smoke-test.js

# Teste de carga
k6 run k6-tests/load-test.js

# Teste de estresse
k6 run k6-tests/stress-test.js

# Teste de pico
k6 run k6-tests/spike-test.js
```

### 3. Visualizar resultados com Grafana

```bash
docker-compose up -d grafana influxdb
```

Acesse: http://localhost:3000 (admin/admin)

## API Endpoints

A aplicação de exemplo fornece os seguintes endpoints:

- `GET /` - Health check
- `GET /api/users` - Lista usuários
- `POST /api/users` - Cria usuário
- `GET /api/users/:id` - Busca usuário por ID
- `PUT /api/users/:id` - Atualiza usuário
- `DELETE /api/users/:id` - Remove usuário
- `GET /api/products` - Lista produtos
- `POST /api/login` - Autenticação
- `GET /api/heavy` - Endpoint com processamento pesado

## Cenários de Teste

### Smoke Test
- 1 usuário virtual
- 1 minuto de duração
- Verifica se a aplicação está funcionando

### Load Test
- 10 usuários virtuais
- 5 minutos de duração
- Simula carga normal

### Stress Test
- Escala gradualmente até 100 usuários
- 10 minutos de duração
- Identifica ponto de quebra

### Spike Test
- Picos súbitos de 50 usuários
- Testa recuperação da aplicação

## Métricas

Os testes coletam métricas como:
- Tempo de resposta
- Taxa de requisições
- Taxa de erro
- Throughput
- Utilização de recursos

## 📚 Guia de Conhecimentos

### 🧪 Tipos de Teste K6

#### 1️⃣ Smoke Test (Verificação Básica)
- **Usuários**: 1 usuário virtual
- **Duração**: 1 minuto
- **Objetivo**: Verificar se a API funciona básicamente
- **Quando usar**: Primeiro teste a executar, após deploys
```bash
k6 run k6-tests/smoke-test.js
```

#### 2️⃣ Load Test (Teste de Carga Normal)
- **Usuários**: 10 usuários virtuais
- **Duração**: 5 minutos
- **Objetivo**: Simular uso normal do sistema
- **Quando usar**: Validar performance em condições normais
```bash
k6 run k6-tests/load-test.js
```

#### 3️⃣ Stress Test (Teste de Estresse)
- **Usuários**: Até 100 usuários virtuais
- **Duração**: 15 minutos
- **Objetivo**: Encontrar o ponto de quebra do sistema
- **Quando usar**: Descobrir limites máximos
```bash
k6 run k6-tests/stress-test.js
```

#### 4️⃣ Spike Test (Teste de Picos)
- **Usuários**: Picos súbitos até 100 usuários
- **Duração**: Variável com picos
- **Objetivo**: Testar recuperação da aplicação após picos
- **Quando usar**: Validar elasticidade e auto-scaling
```bash
k6 run k6-tests/spike-test.js
```

### 📊 Como Analisar Resultados

#### Métricas Principais

**📈 Tempo de Resposta (http_req_duration)**
- `avg`: Tempo médio (objetivo: < 100ms)
- `p(95)`: 95% das requisições (objetivo: < 500ms)
- `p(99)`: 99% das requisições (objetivo: < 1000ms)
- `max`: Pior caso registrado

**📊 Taxa de Erro (http_req_failed)**
- **Produção**: Deve ser < 1%
- **Testes de carga**: Deve ser < 5%
- **Testes de estresse**: Pode chegar a 10-15%

**🚀 Throughput (http_reqs)**
- Requisições por segundo
- Indica capacidade da aplicação
- Compare com requisitos de negócio

**👥 Usuários Virtuais (vus)**
- Carga atual no sistema
- Mostra escalabilidade

#### Interpretação dos Resultados

- **✅ Verde**: Teste passou nos thresholds definidos
- **❌ Vermelho**: Teste falhou - investigate o problema
- **🟡 Amarelo**: Próximo aos limites - atenção necessária

#### Checks vs Thresholds

**Checks**: Validações funcionais
```javascript
check(response, {
  'status é 200': (r) => r.status === 200,
  'resposta tem dados': (r) => r.json('data') !== undefined,
});
```

**Thresholds**: Critérios de performance
```javascript
thresholds: {
  http_req_duration: ['p(95)<500'], // 95% das requisições < 500ms
  http_req_failed: ['rate<0.1'],    // Taxa de erro < 10%
}
```

### 🎨 Monitoramento com Grafana

#### Configuração
1. Acesse: http://localhost:3001
2. Login: `admin` / `admin`
3. Dashboard K6 já configurado

#### Gráficos Principais
- **Response Time**: Tempo de resposta ao longo do tempo
- **Request Rate**: Requisições por segundo
- **Error Rate**: Taxa de erro
- **Active VUs**: Usuários virtuais ativos

#### Executar com Métricas
```bash
# Enviar métricas para InfluxDB/Grafana
k6 run --out influxdb=http://localhost:8086/k6 k6-tests/load-test.js
```

### 🚀 Fluxo de Testes Recomendado

1. **Smoke Test** → Verificação básica
2. **Load Test** → Performance normal
3. **Stress Test** → Encontrar limites
4. **Spike Test** → Testar elasticidade

### 🔧 Comandos Úteis

```bash
# Executar com mais usuários
k6 run --vus 20 --duration 5m k6-tests/load-test.js

# Executar com saída personalizada
k6 run --out json=results.json k6-tests/smoke-test.js

# Executar com variáveis de ambiente
k6 run -e BASE_URL=https://api.exemplo.com k6-tests/load-test.js

# Ver ajuda dos comandos
k6 run --help
```

### 🎯 Metas de Performance

#### Tempos de Resposta
- **Excelente**: < 100ms
- **Bom**: 100-300ms
- **Aceitável**: 300-1000ms
- **Lento**: > 1000ms

#### Taxa de Erro
- **Produção**: < 0.1%
- **Desenvolvimento**: < 1%
- **Teste de carga**: < 5%
- **Teste de estresse**: < 15%

### 🔍 Troubleshooting

#### Problemas Comuns
1. **Alta latência**: Verificar banco de dados, rede, processamento
2. **Muitos erros**: Verificar logs da aplicação, limites de conexão
3. **Memory leaks**: Monitorar uso de memória durante testes
4. **Timeouts**: Ajustar timeouts nos testes ou otimizar aplicação

#### Logs Importantes
```bash
# Ver logs da API
docker-compose logs api

# Ver logs do Grafana
docker-compose logs grafana

# Ver status dos containers
docker-compose ps
```