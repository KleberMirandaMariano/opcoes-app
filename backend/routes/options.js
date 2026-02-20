const express = require('express');
const router = express.Router();
const { stocks } = require('../data/stocks');
const { buildOptionsChain, expirations } = require('../data/options');
const rb3Client = require('../services/rb3-client');
const providers = require('../services/providers');
const { validateTicker } = require('../middleware/validators');

router.get('/:ticker/chain', validateTicker, async (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();
    const expiration = req.query.expiration || 'nov24';

    // Validar expiration
    if (!expirations.find(e => e.value === expiration)) {
      return res.status(400).json({ success: false, error: 'Vencimento inválido' });
    }

    // Tentar obter preço atual do provedor unificado
    let underlyingPrice = 36.45;
    try {
      const stock = await providers.getStock(ticker);
      if (stock) underlyingPrice = stock.price;
    } catch (e) {
      const stock = stocks[ticker];
      if (stock) underlyingPrice = stock.price;
    }

    // Tentar obter cadeia de opções do RB3
    let chain;
    try {
      chain = await rb3Client.getOptionsChain(ticker);
    } catch (e) {
      // Fallback para mock se RB3 falhar
      chain = buildOptionsChain(underlyingPrice, ticker);
    }

    const exp = expirations.find(e => e.value === expiration) || expirations[0];

    res.json({
      success: true,
      data: {
        ticker,
        underlyingPrice,
        expiration: exp,
        expirations,
        chain: chain || []
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
