const express = require('express');
const router = express.Router();
const { getIndices, getStocksList, getNews } = require('../services/providers');
const { indices: mockIndices, stocksAltas, stocksBaixas, news } = require('../data/market');

router.get('/indices', async (req, res) => {
  try {
    const indicesData = await getIndices();
    res.json({ success: true, data: indicesData });
  } catch (e) {
    const indicesMock = [...mockIndices];
    res.json({ success: true, data: indicesMock });
  }
});

router.get('/stocks', async (req, res) => {
  try {
    const filterType = (req.query.filter || 'altas').toLowerCase();
    const stocksList = await getStocksList(filterType);
    res.json({ success: true, data: stocksList });
  } catch (e) {
    const filterType = (req.query.filter || 'altas').toLowerCase();
    const stocksList = filterType === 'baixas' ? stocksBaixas : stocksAltas;
    res.json({ success: true, data: stocksList });
  }
});

router.get('/news', (req, res) => {
  res.json({ success: true, data: getNews() });
});

module.exports = router;
