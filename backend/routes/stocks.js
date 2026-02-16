const express = require('express');
const router = express.Router();
const { getStock, getStockChart } = require('../services/providers');
const { validateTicker } = require('../middleware/validators');
const { getStockWithFallback, getChartWithFallback } = require('../utils/fallbacks');

router.get('/:ticker', validateTicker, async (req, res) => {
  try {
    const stock = await getStockWithFallback(getStock, req.params.ticker);
    res.json({ success: true, data: stock });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Erro ao obter dados da ação' });
  }
});

router.get('/:ticker/chart', validateTicker, async (req, res) => {
  try {
    const range = req.query.range || '5d';
    const data = await getChartWithFallback(getStockChart, req.params.ticker, range);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Erro ao obter histórico' });
  }
});

router.get('/:ticker/fundamentals', validateTicker, async (req, res) => {
  try {
    const stock = await getStockWithFallback(getStock, req.params.ticker);
    if (stock?.fundamentals) {
      return res.json({ success: true, data: stock.fundamentals });
    }
    res.status(404).json({ success: false, error: 'Fundamentals não encontrados' });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Erro ao obter fundamentals' });
  }
});

module.exports = router;
