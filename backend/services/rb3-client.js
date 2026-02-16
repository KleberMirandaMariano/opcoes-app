/**
 * Cliente para integração com API RB3
 * A API RB3 roda em http://localhost:3002
 * Este cliente consulta os dados e faz cache local
 *
 * Se RB3 não estiver disponível, usa fallback com dados mock
 */

const logger = require('../utils/logger');
const rb3Fallback = require('./rb3-fallback');

const RB3_API_URL = process.env.RB3_API_URL || 'http://localhost:3002';
const RB3_ENABLED = process.env.RB3_ENABLED !== 'false';

// Cache com timeout
const cache = new Map();
const CACHE_TTL = 300000; // 5 minutos

/**
 * Verifica se a API RB3 está disponível
 */
async function isRB3Available() {
  if (!RB3_ENABLED) return false;

  try {
    const response = await fetch(`${RB3_API_URL}/health`, {
      timeout: 5000
    });
    return response.ok;
  } catch (e) {
    logger.warn('API RB3 não está disponível');
    return false;
  }
}

/**
 * Obtém dados do cache ou faz requisição
 */
async function getCached(key, fetchFn, ttl = CACHE_TTL) {
  const cached = cache.get(key);

  if (cached && Date.now() - cached.time < ttl) {
    logger.debug(`Cache hit para ${key}`);
    return cached.data;
  }

  try {
    const data = await fetchFn();
    cache.set(key, { data, time: Date.now() });
    return data;
  } catch (e) {
    logger.error(`Erro ao buscar ${key}: ${e.message}`);
    throw e;
  }
}

/**
 * Obtém índices da API RB3
 */
async function getIndices() {
  const available = await isRB3Available();

  if (!available) {
    logger.warn('RB3 não disponível, usando fallback (dados mock)');
    return rb3Fallback.getIndices();
  }

  return getCached('indices', async () => {
    const response = await fetch(`${RB3_API_URL}/indices`);
    if (!response.ok) throw new Error(`RB3: ${response.status}`);

    const result = await response.json();
    if (!result.success) throw new Error(result.error);

    // Transformar para formato compatível
    return result.data.map(row => ({
      symbol: row.symbol,
      name: row.name,
      value: row.price,
      change: row.change,
      changePoints: row.price * (row.change / 100)
    }));
  });
}

/**
 * Obtém dados de uma ação específica
 */
async function getStock(ticker) {
  const available = await isRB3Available();

  if (!available) {
    logger.warn(`RB3 não disponível para ${ticker}, usando fallback (dados mock)`);
    return rb3Fallback.getStock(ticker);
  }

  return getCached(`stock_${ticker}`, async () => {
    const response = await fetch(`${RB3_API_URL}/stocks/${ticker}`);
    if (!response.ok) throw new Error(`RB3: ${response.status}`);

    const result = await response.json();
    if (!result.success) throw new Error(result.error);

    // result.data é um tibble, pegar primeira linha
    const row = Array.isArray(result.data) ? result.data[0] : result.data;

    return {
      ticker: row.ticker,
      name: row.name,
      shortName: row.name,
      price: row.price,
      change: row.change,
      changeValue: row.price * (row.change / 100),
      sector: row.sector || '-',
      logo: null,
      about: null,
      fundamentals: row.fundamentals || {
        pl: 0,
        dy: 0,
        roe: 0,
        pvp: 0
      }
    };
  });
}

/**
 * Obtém lista de ações em alta ou baixa
 */
async function getStocksList(filter = 'altas') {
  const available = await isRB3Available();

  if (!available) {
    logger.warn('RB3 não disponível para lista de ações, usando fallback (dados mock)');
    return rb3Fallback.getStocksList(filter);
  }

  return getCached(`stocks_list_${filter}`, async () => {
    const response = await fetch(`${RB3_API_URL}/stocks/list/${filter}`);
    if (!response.ok) throw new Error(`RB3: ${response.status}`);

    const result = await response.json();
    if (!result.success) throw new Error(result.error);

    return result.data.map(row => ({
      ticker: row.ticker,
      name: row.name,
      sector: row.sector || '-',
      price: row.price,
      change: row.change
    }));
  });
}

/**
 * Obtém histórico de preços de uma ação
 */
async function getStockHistory(ticker, days = 30) {
  const available = await isRB3Available();

  if (!available) {
    logger.warn(`RB3 não disponível para histórico de ${ticker}, usando fallback (dados mock)`);
    return rb3Fallback.getStockHistory(ticker, days);
  }

  return getCached(`history_${ticker}_${days}`, async () => {
    const response = await fetch(`${RB3_API_URL}/stocks/${ticker}/history?days=${days}`);
    if (!response.ok) throw new Error(`RB3: ${response.status}`);

    const result = await response.json();
    if (!result.success) throw new Error(result.error);

    return result.data.map(row => row.price);
  });
}

/**
 * Limpa cache
 */
function clearCache(key = null) {
  if (key) {
    cache.delete(key);
    logger.info(`Cache limpo: ${key}`);
  } else {
    cache.clear();
    logger.info('Cache completamente limpo');
  }
}

/**
 * Retorna status da API RB3
 */
async function getStatus() {
  try {
    const response = await fetch(`${RB3_API_URL}/info`);
    if (!response.ok) {
      logger.warn('RB3 não está disponível, usando fallback');
      return rb3Fallback.getStatus();
    }

    const data = await response.json();
    return { available: true, ...data };
  } catch (e) {
    logger.warn(`Erro ao conectar RB3: ${e.message}, usando fallback`);
    return rb3Fallback.getStatus();
  }
}

module.exports = {
  getIndices,
  getStock,
  getStocksList,
  getStockHistory,
  isRB3Available,
  clearCache,
  getStatus
};
