const express = require('express');
const router = express.Router();
const rb3Client = require('../services/rb3-client');
const logger = require('../utils/logger');

/**
 * GET /api/rb3/status
 * Verifica status da API RB3
 */
router.get('/status', async (req, res) => {
  try {
    const status = await rb3Client.getStatus();
    res.json({ success: true, data: status });
  } catch (e) {
    logger.error(`Erro ao obter status RB3: ${e.message}`);
    res.status(500).json({ success: false, error: e.message });
  }
});

/**
 * POST /api/rb3/clear-cache
 * Limpa cache da API RB3
 */
router.post('/clear-cache', (req, res) => {
  try {
    const key = req.body.key || null;
    rb3Client.clearCache(key);
    res.json({ success: true, message: key ? `Cache ${key} limpo` : 'Cache completamente limpo' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/**
 * POST /api/rb3/force-refresh
 * Força atualização dos dados da API RB3
 */
router.post('/force-refresh', async (req, res) => {
  try {
    const dataType = req.body.type || 'all';

    let updated = [];

    if (['all', 'indices'].includes(dataType)) {
      rb3Client.clearCache('indices');
      const indices = await rb3Client.getIndices();
      if (indices) updated.push('indices');
    }

    if (['all', 'stocks'].includes(dataType)) {
      rb3Client.clearCache('stocks_list_altas');
      rb3Client.clearCache('stocks_list_baixas');
      const altas = await rb3Client.getStocksList('altas');
      if (altas) updated.push('stocks_altas');
      const baixas = await rb3Client.getStocksList('baixas');
      if (baixas) updated.push('stocks_baixas');
    }

    if (dataType === 'stock' && req.body.ticker) {
      const ticker = (req.body.ticker || '').toUpperCase();
      rb3Client.clearCache(`stock_${ticker}`);
      const stock = await rb3Client.getStock(ticker);
      if (stock) updated.push(`stock_${ticker}`);
    }

    res.json({
      success: true,
      message: `Atualizado: ${updated.join(', ')}`,
      updated
    });
  } catch (e) {
    logger.error(`Erro ao força atualizar RB3: ${e.message}`);
    res.status(500).json({ success: false, error: e.message });
  }
});

/**
 * GET /api/rb3/health
 * Health check da API RB3
 */
router.get('/health', async (req, res) => {
  try {
    const available = await rb3Client.isRB3Available();
    res.json({
      success: true,
      rb3_available: available,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
