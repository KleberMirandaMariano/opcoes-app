const express = require('express');
const router = express.Router();

// Simula saldo do usuário (em produção viria de auth/sessão)
let saldoDisponivel = 12450;
const orders = [];

router.get('/balance', (req, res) => {
  res.json({ success: true, data: { saldoDisponivel } });
});

router.post('/', (req, res) => {
  const { ticker, side, type, quantity, price, dayTrade } = req.body;
  const total = (quantity || 0) * (parseFloat(String(price).replace(',', '.')) || 0);
  if (total > saldoDisponivel && side === 'compra') {
    return res.status(400).json({ success: false, error: 'Saldo insuficiente' });
  }
  const order = {
    id: orders.length + 1,
    ticker,
    side: side || 'compra',
    type: type || 'Limitada',
    quantity: quantity || 100,
    price: price || 0,
    total: Number(total.toFixed(2)),
    dayTrade: !!dayTrade,
    status: 'simulado',
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  if (side === 'compra') saldoDisponivel -= total;
  else saldoDisponivel += total;
  res.json({ success: true, data: order });
});

router.get('/', (req, res) => {
  res.json({ success: true, data: orders });
});

module.exports = router;
