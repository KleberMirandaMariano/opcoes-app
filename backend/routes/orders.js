const express = require('express');
const router = express.Router();
const { validateOrder } = require('../middleware/validators');

// Store de saldo e ordens por user session
const userSaldos = new Map();
const userOrders = new Map();

const INITIAL_BALANCE = 12450;
const MAX_ORDERS_PER_USER = 1000;

// Helper para obter dados do usuário
function getUserData(userId) {
  if (!userSaldos.has(userId)) {
    userSaldos.set(userId, INITIAL_BALANCE);
    userOrders.set(userId, []);
  }
  return {
    saldo: userSaldos.get(userId),
    orders: userOrders.get(userId)
  };
}

router.get('/balance', (req, res) => {
  const userId = req.session.userId;
  const { saldo } = getUserData(userId);
  res.json({ success: true, data: { saldoDisponivel: saldo } });
});

router.post('/', validateOrder, (req, res) => {
  try {
    const userId = req.session.userId;
    const { ticker, side, type, quantity, price, dayTrade } = req.body;
    const { saldo, orders } = getUserData(userId);

    // Calcular total
    const total = quantity * price;

    // Validar saldo
    if (total > saldo && side === 'compra') {
      return res.status(400).json({ success: false, error: 'Saldo insuficiente' });
    }

    // Limite de ordens
    if (orders.length >= MAX_ORDERS_PER_USER) {
      return res.status(400).json({ success: false, error: 'Limite de ordens atingido' });
    }

    // Criar ordem
    const order = {
      id: orders.length + 1,
      ticker,
      side: side || 'compra',
      type: type || 'Limitada',
      quantity,
      price: Number(price.toFixed(2)),
      total: Number(total.toFixed(2)),
      dayTrade: !!dayTrade,
      status: 'simulado',
      createdAt: new Date().toISOString()
    };

    orders.push(order);

    // Atualizar saldo
    const novoSaldo = side === 'compra' ? saldo - total : saldo + total;
    userSaldos.set(userId, novoSaldo);

    res.json({ success: true, data: order });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Erro ao processar ordem' });
  }
});

router.get('/', (req, res) => {
  const userId = req.session.userId;
  const { orders } = getUserData(userId);
  res.json({ success: true, data: orders });
});

module.exports = router;
