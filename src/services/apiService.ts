/**
 * Serviço de Integração com Backend Node.js + RB3
 * Fornece dados em tempo real da Bolsa B3
 */

const API_BASE = '/api';

// Aproximação da função de erro (Abramowitz & Stegun, erro máx. 1.5e-7)
// Necessário pois Math.erf() não faz parte do padrão ECMAScript
function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  const t = 1.0 / (1.0 + 0.3275911 * x);
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  return sign * (1.0 - poly * Math.exp(-x * x));
}

/**
 * Faz requisição GET para a API
 */
async function apiGet<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error(`Erro ao buscar ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Faz requisição POST para a API
 */
async function apiPost<T>(endpoint: string, body: any): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error(`Erro ao fazer POST em ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Busca dados de mercado (índices)
 */
export async function getMarketIndices() {
  return apiGet('/market/indices');
}

/**
 * Busca lista de ações em alta ou baixa
 */
export async function getStocks(filter: 'altas' | 'baixas' = 'altas') {
  return apiGet(`/market/stocks?filter=${filter}`);
}

/**
 * Busca detalhes de uma ação específica
 */
export async function getStockDetail(ticker: string) {
  return apiGet(`/stocks/${ticker}`);
}

/**
 * Busca histórico de preços de uma ação
 */
export async function getStockHistory(ticker: string, days: number = 30) {
  return apiGet(`/stocks/${ticker}/history?days=${days}`);
}

/**
 * Busca opções disponíveis para uma ação
 */
export async function getOptionsForStock(ticker: string) {
  return apiGet(`/options/${ticker}`);
}

/**
 * Analisa uma opção específica
 */
export async function analyzeOption(ticker: string, strikePrice: number, type: 'call' | 'put') {
  return apiPost('/options/analyze', {
    ticker,
    strikePrice,
    type,
  });
}

/**
 * Busca lista de ordens do usuário
 */
export async function getUserOrders() {
  return apiGet('/orders');
}

/**
 * Cria uma nova ordem
 */
export async function createOrder(orderData: any) {
  return apiPost('/orders', orderData);
}

/**
 * Busca configurações do usuário
 */
export async function getUserSettings() {
  return apiGet('/settings');
}

/**
 * Atualiza configurações do usuário
 */
export async function updateUserSettings(settings: any) {
  return apiPost('/settings', settings);
}

/**
 * Busca status da conexão RB3
 */
export async function getRB3Status() {
  return apiGet('/rb3/status');
}

/**
 * Simula um preço de opção usando o modelo Black-Scholes
 */
export function simulateOptionPrice(
  stockPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  riskFreeRate: number,
  volatility: number,
  isCall: boolean
): number {
  // Black-Scholes Formula
  const d1 = (Math.log(stockPrice / strikePrice) + (riskFreeRate + Math.pow(volatility, 2) / 2) * timeToExpiry) / (volatility * Math.sqrt(timeToExpiry));
  const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

  const N = (x: number) => 0.5 * (1 + erf(x / Math.sqrt(2)));

  if (isCall) {
    return stockPrice * N(d1) - strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * N(d2);
  } else {
    return strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * N(-d2) - stockPrice * N(-d1);
  }
}

/**
 * Calcula gregas de uma opção
 */
export function calculateGreeks(
  stockPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  riskFreeRate: number,
  volatility: number,
  isCall: boolean
) {
  const d1 = (Math.log(stockPrice / strikePrice) + (riskFreeRate + Math.pow(volatility, 2) / 2) * timeToExpiry) / (volatility * Math.sqrt(timeToExpiry));
  const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

  const N = (x: number) => 0.5 * (1 + erf(x / Math.sqrt(2)));
  const n = (x: number) => Math.exp(-Math.pow(x, 2) / 2) / Math.sqrt(2 * Math.PI);

  const delta = isCall ? N(d1) : N(d1) - 1;
  const gamma = n(d1) / (stockPrice * volatility * Math.sqrt(timeToExpiry));
  const vega = stockPrice * n(d1) * Math.sqrt(timeToExpiry) / 100;
  const theta = isCall
    ? (-stockPrice * n(d1) * volatility / (2 * Math.sqrt(timeToExpiry)) - riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * N(d2)) / 365
    : (-stockPrice * n(d1) * volatility / (2 * Math.sqrt(timeToExpiry)) + riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * N(-d2)) / 365;
  const rho = isCall
    ? strikePrice * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * N(d2) / 100
    : -strikePrice * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * N(-d2) / 100;

  return { delta, gamma, vega, theta, rho };
}

export default {
  getMarketIndices,
  getStocks,
  getStockDetail,
  getStockHistory,
  getOptionsForStock,
  analyzeOption,
  getUserOrders,
  createOrder,
  getUserSettings,
  updateUserSettings,
  getRB3Status,
  simulateOptionPrice,
  calculateGreeks,
};
