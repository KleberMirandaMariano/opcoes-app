const express = require('express');
const router = express.Router();
const { stocks } = require('../data/stocks');
const { buildOptionsChain, expirations } = require('../data/options');
const { validateTicker } = require('../middleware/validators');

router.get('/:ticker/chain', validateTicker, (req, res) => {
  try {
    const ticker = req.params.ticker;
    const expiration = req.query.expiration || 'nov24';

    // Validar expiration
    if (!expirations.find(e => e.value === expiration)) {
      return res.status(400).json({ success: false, error: 'Vencimento inválido' });
    }

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
  } catch (e) {
    res.status(500).json({ success: false, error: 'Erro ao obter cadeia de opções' });
  }
});

router.get('/:ticker/expirations', validateTicker, (req, res) => {
  res.json({ success: true, data: expirations });
});

module.exports = router;
