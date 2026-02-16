// Funções de fallback reutilizáveis

const { stocks: mockStocks, getChartPoints } = require('../data/stocks');

/**
 * Obtém dados de uma ação com fallback para mock
 * @param {Function} getStockFn - Função async que retorna dados reais
 * @param {string} ticker - Símbolo da ação
 * @returns {Promise<Object>} Dados da ação
 */
async function getStockWithFallback(getStockFn, ticker) {
  try {
    const stock = await getStockFn(ticker);
    if (stock) return stock;
  } catch (e) {
    // Fallback para mock
  }

  let stock = mockStocks[ticker];
  if (!stock) {
    stock = {
      ticker,
      name: ticker,
      shortName: ticker,
      sector: '-',
      price: 36 + Math.random() * 10,
      change: Math.random() * 4 - 1,
      changeValue: 0.5,
      fundamentals: { pl: 0, dy: 0, roe: 0, pvp: 0 }
    };
  }
  return stock;
}

/**
 * Obtém histórico de preços com fallback para mock
 * @param {Function} getChartFn - Função async que retorna histórico
 * @param {string} ticker - Símbolo da ação
 * @param {string} range - Período (ex: 5d, 1m)
 * @returns {Promise<Object>} { points, range }
 */
async function getChartWithFallback(getChartFn, ticker, range) {
  try {
    const chart = await getChartFn(ticker, range);
    if (chart?.points?.length) return chart;
  } catch (e) {
    // Fallback para mock
  }

  const points = getChartPoints(ticker, range);
  return { points, range };
}

module.exports = {
  getStockWithFallback,
  getChartWithFallback
};
