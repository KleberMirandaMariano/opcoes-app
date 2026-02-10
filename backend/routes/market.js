const express = require('express');
const router = express.Router();
const { getIndices, getStocksList, getNews } = require('../services/providers');
const { indices: mockIndices, stocksAltas, stocksBaixas, news } = require('../data/market');

router.get('/indices', async (req, res) => {
  try {
    const data = await getIndices();
    return res.json({ success: true, data });
  } catch (e) {
    const list = [...mockIndices];
    return res.json({ success: true, data: list });
  }
});

router.get('/stocks', async (req, res) => {
  try {
    const filter = (req.query.filter || 'altas').toLowerCase();
    const list = await getStocksList(filter);
    return res.json({ success: true, data: list });
  } catch (e) {
    const filter = (req.query.filter || 'altas').toLowerCase();
    const list = filter === 'baixas' ? stocksBaixas : stocksAltas;
    return res.json({ success: true, data: list });
  }
});

router.get('/news', (req, res) => {
  res.json({ success: true, data: getNews() });
});

module.exports = router;
