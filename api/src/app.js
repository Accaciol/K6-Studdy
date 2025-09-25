const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'k6-test-secret';

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Dados em memória para simulação
let users = [
  { id: '1', name: 'João Silva', email: 'joao@email.com', password: '$2a$10$hash' },
  { id: '2', name: 'Maria Santos', email: 'maria@email.com', password: '$2a$10$hash' },
  { id: '3', name: 'Pedro Costa', email: 'pedro@email.com', password: '$2a$10$hash' }
];

let products = [
  { id: '1', name: 'Notebook', price: 2500.00, category: 'electronics' },
  { id: '2', name: 'Mouse', price: 50.00, category: 'electronics' },
  { id: '3', name: 'Teclado', price: 150.00, category: 'electronics' },
  { id: '4', name: 'Monitor', price: 800.00, category: 'electronics' },
  { id: '5', name: 'Cadeira', price: 400.00, category: 'furniture' }
];

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Simulação de processamento pesado
const heavyProcessing = (duration = 100) => {
  const start = Date.now();
  while (Date.now() - start < duration) {
    // Simula processamento CPU intensivo
    Math.random() * Math.random();
  }
};

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Autenticação
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // Simula verificação de senha (em produção, usar bcrypt.compare)
  const token = jwt.sign(
    { userId: user.id, email: user.email }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );

  res.json({ 
    token, 
    user: { id: user.id, name: user.name, email: user.email }
  });
});

// CRUD Usuários
app.get('/api/users', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedUsers = users
    .map(({ password, ...user }) => user) // Remove senha
    .slice(startIndex, endIndex);

  res.json({
    users: paginatedUsers,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(users.length / limit),
      totalUsers: users.length,
      hasNext: endIndex < users.length,
      hasPrev: startIndex > 0
    }
  });
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.post('/api/users', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }

  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Email já existe' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword
  };

  users.push(newUser);
  
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  const { name, email } = req.body;
  const userIndex = users.findIndex(u => u.id === req.params.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  if (email && users.find(u => u.email === email && u.id !== req.params.id)) {
    return res.status(409).json({ error: 'Email já existe' });
  }

  users[userIndex] = { ...users[userIndex], name, email };
  const { password, ...userWithoutPassword } = users[userIndex];
  
  res.json(userWithoutPassword);
});

app.delete('/api/users/:id', authenticateToken, (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  users.splice(userIndex, 1);
  res.status(204).send();
});

// CRUD Produtos
app.get('/api/products', (req, res) => {
  const { category, minPrice, maxPrice } = req.query;
  let filteredProducts = [...products];

  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
  }

  res.json({
    products: filteredProducts,
    total: filteredProducts.length
  });
});

app.post('/api/products', authenticateToken, (req, res) => {
  const { name, price, category } = req.body;
  
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios' });
  }

  const newProduct = {
    id: uuidv4(),
    name,
    price: parseFloat(price),
    category
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Endpoint com processamento pesado
app.get('/api/heavy', (req, res) => {
  const duration = parseInt(req.query.duration) || 100;
  heavyProcessing(duration);
  
  res.json({ 
    message: 'Processamento concluído',
    processingTime: `${duration}ms`,
    timestamp: new Date().toISOString()
  });
});

// Endpoint que simula erro intermitente
app.get('/api/flaky', (req, res) => {
  // 20% de chance de erro
  if (Math.random() < 0.2) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
  
  res.json({ message: 'Sucesso!', timestamp: new Date().toISOString() });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Health check disponível em http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Recebido SIGTERM, fechando servidor...');
  server.close(() => {
    console.log('Servidor fechado.');
    process.exit(0);
  });
});

module.exports = app;