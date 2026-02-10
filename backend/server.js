require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const marketRoutes = require('./routes/market');
const stocksRoutes = require('./routes/stocks');
const optionsRoutes = require('./routes/options');
const ordersRoutes = require('./routes/orders');
const strategiesRoutes = require('./routes/strategies');
const backtestRoutes = require('./routes/backtest');
const settingsRoutes = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API
app.use('/api/market', marketRoutes);
app.use('/api/stocks', stocksRoutes);
app.use('/api/options', optionsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/strategies', strategiesRoutes);
app.use('/api/backtest', backtestRoutes);
app.use('/api/settings', settingsRoutes);

// Frontend estático (app unificado)
const frontendPath = path.join(__dirname, '..', 'app');
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
