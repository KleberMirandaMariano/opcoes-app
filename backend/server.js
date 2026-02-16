require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const path = require('path');
const logger = require('./utils/logger');

// Validar variáveis de ambiente críticas
const SESSION_SECRET = process.env.SESSION_SECRET || 'default-dev-secret-change-in-production';
if (process.env.NODE_ENV === 'production' && SESSION_SECRET === 'default-dev-secret-change-in-production') {
  logger.error('SESSION_SECRET não configurado em produção!');
  process.exit(1);
}

const marketRoutes = require('./routes/market');
const stocksRoutes = require('./routes/stocks');
const optionsRoutes = require('./routes/options');
const ordersRoutes = require('./routes/orders');
const strategiesRoutes = require('./routes/strategies');
const backtestRoutes = require('./routes/backtest');
const settingsRoutes = require('./routes/settings');
const rb3Routes = require('./routes/rb3');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de logging de requisições
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const statusIcon = status >= 400 ? '❌' : status >= 300 ? '⚠️' : '✅';
    logger.debug(`${statusIcon} ${req.method} ${req.path} ${status} ${duration}ms`);
  });
  next();
});

// Segurança: Headers HTTP
app.use(helmet());

// CORS com configuração segura
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3001').split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      log('warn', `CORS rejeitado para origem: ${origin}`);
      callback(new Error('CORS não permitido'));
    }
  },
  credentials: true
}));

// Session management
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Middleware para criar/manter session do usuário
app.use((req, res, next) => {
  if (!req.session.userId) {
    req.session.userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    logger.info(`Nova sessão criada: ${req.session.userId}`);
  }
  next();
});

app.use(express.json());

// API
app.use('/api/market', marketRoutes);
app.use('/api/stocks', stocksRoutes);
app.use('/api/options', optionsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/strategies', strategiesRoutes);
app.use('/api/backtest', backtestRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/rb3', rb3Routes);

// Frontend estático (app unificado)
const frontendPath = path.join(__dirname, '..', 'app');
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  }
});

// Middleware de tratamento de erro global
app.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.path}: ${err.message}`);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Erro interno do servidor' : err.message
  });
});

app.listen(PORT, () => {
  logger.info(`Servidor rodando em http://localhost:${PORT}`);
  logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
