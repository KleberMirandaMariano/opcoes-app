// Middleware de validação reutilizável

const validateTicker = (req, res, next) => {
  const ticker = (req.params.ticker || '').toUpperCase();
  if (!ticker || !/^[A-Z0-9]{4,6}$/.test(ticker)) {
    return res.status(400).json({ success: false, error: 'Ticker inválido' });
  }
  req.params.ticker = ticker;
  next();
};

const validateOrder = (req, res, next) => {
  const { ticker, side, type, quantity, price } = req.body;

  // Validar ticker
  if (!ticker || !/^[A-Z0-9]{4,6}$/.test(ticker)) {
    return res.status(400).json({ success: false, error: 'Ticker inválido' });
  }

  // Validar side
  if (!['compra', 'venda'].includes(side)) {
    return res.status(400).json({ success: false, error: 'Side deve ser "compra" ou "venda"' });
  }

  // Validar type
  if (type && !['Limitada', 'Mercado', 'Stop'].includes(type)) {
    return res.status(400).json({ success: false, error: 'Type inválido' });
  }

  // Validar quantity
  if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 100000) {
    return res.status(400).json({ success: false, error: 'Quantidade deve ser entre 1 e 100000' });
  }

  // Validar price
  if (typeof price !== 'number' || price < 0 || price > 1000000) {
    return res.status(400).json({ success: false, error: 'Preço deve estar entre 0 e 1000000' });
  }

  next();
};

const validateStrategy = (req, res, next) => {
  const { strategy, timeframe } = req.body;

  if (strategy && typeof strategy !== 'string') {
    return res.status(400).json({ success: false, error: 'Strategy deve ser string' });
  }

  if (timeframe && !/^[0-9]{1,2}[HMDYW]$/.test(timeframe)) {
    return res.status(400).json({ success: false, error: 'Timeframe inválido (ex: 1D, 1W, 1M)' });
  }

  next();
};

module.exports = {
  validateTicker,
  validateOrder,
  validateStrategy
};
