const express = require('express');
const router = express.Router();
const { stocks } = require('../data/stocks');
const { buildOptionsChain, expirations } = require('../data/options');

router.get('/:ticker/chain', (req, res) => {
  const ticker = (req.params.ticker || 'PETR4').toUpperCase();
  const expiration = req.query.expiration || 'nov24';
  const stock = stocks[ticker];
  const underlyingPrice = stock ? stock.price : 36.45;
  const chain = buildOptionsChain(underlyingPrice, ticker);
  const exp = expirations.find(e => e.value === expiration) || expirations[0];
  res.json({
    success: true,
    data: {
      ticker,
      underlyingPrice,
      expiration: exp,
      expirations,
      chain
    }
  });
});

router.get('/:ticker/expirations', (req, res) => {
  res.json({ success: true, data: expirations });
});

module.exports = router;
