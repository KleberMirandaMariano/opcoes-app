const express = require('express');
const router = express.Router();

// Payoff simplificado para Bull Call Spread: compra call K1, vende call K2 (K2 > K1)
// Lucro máx = (K2 - K1) * 100 - custo; Prej máx = custo; BE = K1 + custo/100
function bullCallSpread(spot, k1, k2, call1Price, call2Price, qty = 1000) {
  const custo = (call1Price - call2Price) * qty;
  const lucroMax = (k2 - k1) * qty - custo;
  const breakeven = k1 + (call1Price - call2Price);
  return { custo, lucroMax, prejMax: Math.abs(Math.min(0, custo)), breakeven, payoff: [+custo, lucroMax] };
}

router.get('/payoff', (req, res) => {
  const { strategy, ticker, spot, legs } = req.query;
  const s = parseFloat(spot) || 38.45;
  if (strategy === 'bull_call_spread' || !strategy) {
    const k1 = 38, k2 = 41, c1 = 1.45, c2 = 0.55;
    const result = bullCallSpread(s, k1, k2, c1, c2);
    return res.json({
      success: true,
      data: {
        strategy: 'Bull Call Spread',
        spot: s,
        payoffAtExpiry: result.lucroMax,
        maxProfit: result.lucroMax,
        maxLoss: result.prejMax,
        breakeven: result.breakeven,
        cost: result.custo,
        points: [
          [32, -900], [35, -900], [result.breakeven, 0], [41, 2550], [45, 2550]
        ]
      }
    });
  }
  res.json({ success: true, data: {} });
});

router.get('/list', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'bull_call_spread', name: 'Bull Call Spread' },
      { id: 'iron_condor', name: 'Iron Condor' },
      { id: 'straddle', name: 'Straddle' },
      { id: 'butterfly', name: 'Butterfly' }
    ]
  });
});

module.exports = router;
