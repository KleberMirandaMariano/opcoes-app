const express = require('express');
const router = express.Router();

router.post('/run', (req, res) => {
  const { strategy, timeframe } = req.body || {};
  // Resultados mock de backtest
  res.json({
    success: true,
    data: {
      strategy: strategy || 'Venda Coberta',
      timeframe: timeframe || '2Y',
      patrimonioFinal: 142500,
      variacao: 42.5,
      chartPoints: [100, 98, 102, 105, 108, 112, 115, 118, 125, 130, 142.5],
      labels: ['Jan 22', 'Mar 22', 'Jun 22', 'Set 22', 'Dez 22', 'Mar 23', 'Jun 23', 'Set 23', 'Dez 23', 'Out 23', 'Jan 24'],
      metrics: {
        taxaAcerto: 68.4,
        profitFactor: 1.85,
        maxDrawdown: -12.4,
        sharpe: 2.1
      },
      trades: [
        { symbol: 'PETRL400', strategy: 'Venda Coberta', entry: '12 Out 23', exit: '15 Nov 23', pnl: 1250, pct: 4.2 },
        { symbol: 'VALE M700', strategy: 'Venda Coberta', entry: '05 Set 23', exit: '20 Out 23', pnl: -480, pct: -1.8 },
        { symbol: 'ITUB L350', strategy: 'Venda Coberta', entry: '10 Ago 23', exit: '15 Set 23', pnl: 890, pct: 2.5 }
      ]
    }
  });
});

module.exports = router;
