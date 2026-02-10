/**
 * Camada de provedores de dados do mercado (Brasil).
 * Ordem: Brapi (principal) → HG Brasil (failover) → Mock local.
 * Opções: nenhuma API gratuita REST expõe grade completa; manter mock ou B3 COTAHIST.
 */

const BRAPI_BASE = 'https://brapi.dev/api';
const HG_BASE = 'https://api.hgbrasil.com/finance';

const brapiToken = process.env.BRAPI_TOKEN || process.env.BRAPI_API_KEY || '';
const hgKey = process.env.HGBRASIL_KEY || process.env.HG_KEY || '';
const BRAPI_TEST_TICKERS = ['PETR4', 'VALE3', 'ITUB4', 'MGLU3'];
function canUseBrapiWithoutToken(ticker) {
  return BRAPI_TEST_TICKERS.includes((ticker || '').toUpperCase());
}

// --- Brapi (ações, índices, fundamentos, histórico) ---
async function brapiFetch(path, opts = {}) {
  if (!path.startsWith('/')) path = '/' + path;
  const sep = path.includes('?') ? '&' : '?';
  const url = `${BRAPI_BASE}${path}${sep}${opts.qs || ''}`;
  const headers = { Accept: 'application/json', ...(opts.headers || {}) };
  if (brapiToken) headers['Authorization'] = `Bearer ${brapiToken}`;
  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) throw new Error(`Brapi ${res.status}`);
  return res.json();
}

async function getBrapiIndices() {
  const tickers = '^BVSP,IFIX'; // Ibovespa e IFIX; Brapi usa ^BVSP
  const data = await brapiFetch(`/quote/${tickers}`);
  const results = data.results || [];
  const map = {};
  results.forEach(r => {
    const sym = (r.symbol || '').replace('^', '');
    map[sym === 'BVSP' ? 'IBOVESPA' : sym] = {
      symbol: sym === 'BVSP' ? 'IBOVESPA' : sym,
      name: r.shortName || r.longName || sym,
      value: r.regularMarketPrice,
      change: r.regularMarketChangePercent ?? 0,
      changePoints: r.regularMarketChange
    };
  });
  return map;
}

async function getBrapiQuote(ticker) {
  const data = await brapiFetch(`/quote/${ticker}?fundamental=true`);
  const r = (data.results && data.results[0]) || null;
  if (!r) return null;
  const stats = r.defaultKeyStatistics || r.summaryDetail || {};
  return {
    ticker: r.symbol,
    name: r.longName || r.shortName || r.symbol,
    shortName: r.shortName || r.symbol,
    sector: (r.summaryProfile && r.summaryProfile.sector) || (r.summaryProfile && r.summaryProfile.industry) || '-',
    price: r.regularMarketPrice,
    change: r.regularMarketChangePercent ?? 0,
    changeValue: r.regularMarketChange ?? 0,
    logo: r.logourl || null,
    about: (r.summaryProfile && r.summaryProfile.longBusinessSummary) || null,
    fundamentals: {
      pl: stats.trailingPE ?? r.priceEarnings ?? 0,
      dy: (stats.yield && stats.yield * 100) ?? 0,
      roe: (stats.returnOnEquity && stats.returnOnEquity * 100) ?? 0,
      pvp: stats.priceToBook ?? 0
    }
  };
}

async function getBrapiQuoteHistory(ticker, range = '5d') {
  const data = await brapiFetch(`/quote/${ticker}?range=${range}&interval=1d`);
  const r = (data.results && data.results[0]) || null;
  const hist = (r && r.historicalDataPrice) || [];
  return hist.map(h => h.close ?? h.adjustedClose).filter(Boolean);
}

/** Lista de ações (altas/baixas): Brapi quote/list com ordenação por variação */
async function getBrapiStocksList(filter = 'altas') {
  const data = await brapiFetch('/quote/list?sortBy=change&sortOrder=' + (filter === 'baixas' ? 'asc' : 'desc') + '&limit=20&type=stock');
  const results = data.stocks || [];
  return results.map(s => ({
    ticker: s.stock || s.symbol,
    name: s.name || s.stock,
    sector: s.sector || '-',
    price: s.close ?? s.price ?? 0,
    change: s.change ?? 0
  }));
}

// --- HG Brasil (failover: índices e cotações em uma chamada) ---
async function hgFetch(path) {
  const url = path.startsWith('http') ? path : `${HG_BASE}${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HG ${res.status}`);
  return res.json();
}

async function getHGIndices() {
  const url = HG_BASE + (hgKey ? `?key=${hgKey}` : '');
  const data = await hgFetch(url);
  const results = (data && data.results) || {};
  const stocks = results.stocks || {};
  const cur = results.currencies || {};
  const map = {};
  if (stocks.IBOVESPA) {
    const v = stocks.IBOVESPA.points ?? stocks.IBOVESPA.price;
    map.IBOVESPA = { symbol: 'IBOVESPA', name: stocks.IBOVESPA.name || 'IBOVESPA', value: v, change: stocks.IBOVESPA.variation ?? stocks.IBOVESPA.change_percent ?? 0, changePoints: stocks.IBOVESPA.change_price ?? 0 };
  }
  if (stocks.IFIX) {
    map.IFIX = { symbol: 'IFIX', name: stocks.IFIX.name || 'IFIX', value: stocks.IFIX.points ?? stocks.IFIX.price, change: stocks.IFIX.variation ?? stocks.IFIX.change_percent ?? 0 };
  }
  if (cur.USD) {
    map.DOLAR = { symbol: 'DOLAR', name: 'DÓLAR', value: cur.USD.buy ?? cur.USD.sell, change: cur.USD.variation ?? 0 };
  }
  if (cur.BTC) {
    map.BTC = { symbol: 'BTC', name: 'BTC/BRL', value: cur.BTC.buy ?? cur.BTC.sell, change: cur.BTC.variation ?? 0 };
  }
  return map;
}

async function getHGStockPrice(ticker) {
  const url = `${HG_BASE}/stock_price?key=${hgKey}&symbol=${ticker.toLowerCase()}`;
  const data = await hgFetch(url);
  const results = (data && data.results) || {};
  const r = results[ticker.toUpperCase()];
  if (!r || r.error) return null;
  const fin = r.financials || {};
  const div = (fin.dividends || {});
  return {
    ticker: r.symbol,
    name: r.name || r.company_name || r.symbol,
    shortName: r.name || r.symbol,
    sector: r.sector || r.description || '-',
    price: r.price,
    change: r.change_percent ?? 0,
    changeValue: r.change_price ?? 0,
    logo: (r.logo && (r.logo.small || r.logo.big)) || null,
    about: r.ai_description || r.description || null,
    fundamentals: {
      pl: 0,
      dy: div.yield_12m ?? 0,
      roe: 0,
      pvp: fin.price_to_book_ratio ?? 0
    }
  };
}

// --- API unificada (tenta Brapi → HG → mock) ---
const { indices: mockIndices, stocksAltas, stocksBaixas, news } = require('../data/market');
const { stocks: mockStocks, getChartPoints } = require('../data/stocks');

function getMockIndices() {
  const list = [...mockIndices];
  const ibov = list.find(i => i.symbol === 'IBOVESPA');
  const rest = list.filter(i => i.symbol !== 'IBOVESPA');
  const obj = {};
  if (ibov) obj.IBOVESPA = { ...ibov, changePoints: ibov.changePoints ?? 0 };
  rest.forEach(i => { obj[i.symbol] = { ...i }; });
  return obj;
}

async function getIndices() {
  let data = {};
  if (brapiToken) {
    try {
      const bySymbol = await getBrapiIndices();
      if (Object.keys(bySymbol).length) data = bySymbol;
    } catch (e) { /* fallback */ }
  }
  if (Object.keys(data).length === 0 && hgKey) {
    try {
      data = await getHGIndices();
    } catch (e) { /* fallback */ }
  }
  if (Object.keys(data).length === 0) {
    const mock = getMockIndices();
    Object.assign(data, mock);
  }
  // Garantir IBOVESPA para o dashboard
  if (!data.IBOVESPA && data.BVSP) data.IBOVESPA = { ...data.BVSP, symbol: 'IBOVESPA' };
  return Object.values(data);
}

async function getStocksList(filter = 'altas') {
  if (brapiToken) {
    try {
      const list = await getBrapiStocksList(filter);
      if (list.length) return list;
    } catch (e) { /* fallback */ }
  }
  return filter === 'baixas' ? [...stocksBaixas] : [...stocksAltas];
}

async function getStock(ticker) {
  ticker = (ticker || '').toUpperCase();
  if (brapiToken || canUseBrapiWithoutToken(ticker)) {
    try {
      const q = await getBrapiQuote(ticker);
      if (q) return q;
    } catch (e) { /* fallback */ }
  }
  if (hgKey) {
    try {
      const q = await getHGStockPrice(ticker);
      if (q) return q;
    } catch (e) { /* fallback */ }
  }
  let stock = mockStocks[ticker];
  if (!stock) {
    stock = { ticker, name: ticker, shortName: ticker, sector: '-', price: 36 + Math.random() * 10, change: (Math.random() * 4 - 1), changeValue: 0.5, fundamentals: { pl: 0, dy: 0, roe: 0, pvp: 0 } };
  }
  return stock;
}

async function getStockChart(ticker, range = '5d') {
  if (brapiToken || canUseBrapiWithoutToken(ticker)) {
    try {
      const points = await getBrapiQuoteHistory(ticker, range);
      if (points && points.length) return { points, range };
    } catch (e) { /* fallback */ }
  }
  const points = getChartPoints(ticker, range);
  return { points, range };
}

function getNews() {
  return news;
}

module.exports = {
  getIndices,
  getStocksList,
  getStock,
  getStockChart,
  getNews,
  hasBrapi: !!brapiToken,
  hasHG: !!hgKey
};
