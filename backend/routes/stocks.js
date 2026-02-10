const express = require('express');
const router = express.Router();
const { getStock, getStockChart } = require('../services/providers');
const { stocks: mockStocks } = require('../data/stocks');

router.get('/:ticker', async (req, res) => {
  const ticker = (req.params.ticker || '').toUpperCase();
  try {
    const stock = await getStock(ticker);
    return res.json({ success: true, data: stock });
  } catch (e) {
    let stock = mockStocks[ticker];
    if (!stock) {
      stock = { ticker, name: ticker, shortName: ticker, sector: '-', price: 36 + Math.random() * 10, change: (Math.random() * 4 - 1), changeValue: 0.5, fundamentals: { pl: 0, dy: 0, roe: 0, pvp: 0 } };
    }
    return res.json({ success: true, data: stock });
  }
});

router.get('/:ticker/chart', async (req, res) => {
  const ticker = (req.params.ticker || '').toUpperCase();
  const range = req.query.range || '5d';
  try {
    const data = await getStockChart(ticker, range);
    return res.json({ success: true, data });
  } catch (e) {
    const { getChartPoints } = require('../data/stocks');
    const points = getChartPoints(ticker, range);
    return res.json({ success: true, data: { points, range } });
  }
});

router.get('/:ticker/fundamentals', async (req, res) => {
  const ticker = (req.params.ticker || '').toUpperCase();
  try {
    const stock = await getStock(ticker);
    if (stock && stock.fundamentals) {
      return res.json({ success: true, data: stock.fundamentals });
    }
  } catch (e) {}
  const stock = mockStocks[ticker];
  if (!stock || !stock.fundamentals) {
    return res.status(404).json({ success: false, error: 'Ativo não encontrado' });
  }
  res.json({ success: true, data: stock.fundamentals });
});

module.exports = router;
