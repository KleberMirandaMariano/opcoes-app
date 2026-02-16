/**
 * RB3 Fallback Service
 *
 * Se RB3 (R/Plumber) não conseguir rodar no Windows,
 * este serviço oferece uma alternativa usando dados mock
 * com comportamento realista para desenvolvimento/teste.
 *
 * Usage:
 * - Se RB3_ENABLED=false ou R não funciona
 * - Importa este módulo automaticamente
 */

const NodeCache = require('node-cache');
const logger = require('../utils/logger');

const cache = new NodeCache({ stdTTL: 300 });

// Dados mock mais realistas
const mockIndices = [
    { symbol: 'IBOVESPA', name: 'Ibovespa', value: 131500, change: 0.45, lastUpdate: new Date() },
    { symbol: 'IFIX', name: 'IFIX', value: 11850, change: -0.15, lastUpdate: new Date() },
    { symbol: 'DOLAR', name: 'Dólar/Real', value: 5.2850, change: 0.25, lastUpdate: new Date() },
    { symbol: 'BTC', name: 'Bitcoin', value: 68450, change: 1.85, lastUpdate: new Date() }
];

const mockStocks = {
    'PETR4': {
        symbol: 'PETR4',
        name: 'Petrobras S.A.',
        sector: 'Energia',
        value: 30.52,
        change: 0.35,
        volume: 45230000,
        lastUpdate: new Date()
    },
    'VALE3': {
        symbol: 'VALE3',
        name: 'Vale S.A.',
        sector: 'Mineração',
        value: 95.28,
        change: -0.12,
        volume: 23450000,
        lastUpdate: new Date()
    },
    'ITUB4': {
        symbol: 'ITUB4',
        name: 'Banco Itaú Unibanco S.A.',
        sector: 'Financeiro',
        value: 28.75,
        change: 0.58,
        volume: 34560000,
        lastUpdate: new Date()
    },
    'BBAS3': {
        symbol: 'BBAS3',
        name: 'Banco do Brasil S.A.',
        sector: 'Financeiro',
        value: 32.45,
        change: 0.22,
        volume: 28940000,
        lastUpdate: new Date()
    },
    'WEGE3': {
        symbol: 'WEGE3',
        name: 'WEG S.A.',
        sector: 'Industrial',
        value: 58.90,
        change: -0.45,
        volume: 19230000,
        lastUpdate: new Date()
    }
};

/**
 * Simula variação de preço realista
 */
function getRealisticChange() {
    // Retorna variação entre -2% e +2%
    return (Math.random() - 0.5) * 4;
}

/**
 * Retorna índices de mercado (fallback mock)
 */
async function getIndices() {
    try {
        const cacheKey = 'rb3_fallback_indices';
        const cached = cache.get(cacheKey);

        if (cached) {
            logger.debug('RB3 Fallback: Cache hit para índices');
            return cached;
        }

        // Simula pequenas variações para parecer tempo real
        const indices = mockIndices.map(idx => ({
            ...idx,
            change: getRealisticChange(),
            value: idx.value * (1 + getRealisticChange() / 100),
            lastUpdate: new Date()
        }));

        cache.set(cacheKey, indices);
        logger.info('RB3 Fallback: Índices retornados (mock com variação)');

        return indices;
    } catch (error) {
        logger.error('Erro no RB3 Fallback getIndices', error);
        return mockIndices;
    }
}

/**
 * Retorna dados de uma ação (fallback mock)
 */
async function getStock(ticker) {
    try {
        const cacheKey = `rb3_fallback_stock_${ticker}`;
        const cached = cache.get(cacheKey);

        if (cached) {
            logger.debug(`RB3 Fallback: Cache hit para ${ticker}`);
            return cached;
        }

        const stock = mockStocks[ticker];

        if (!stock) {
            logger.warn(`RB3 Fallback: Ação ${ticker} não encontrada em mock data`);
            return null;
        }

        const data = {
            ...stock,
            change: getRealisticChange(),
            value: stock.value * (1 + getRealisticChange() / 100),
            volume: Math.floor(stock.volume * (0.8 + Math.random() * 0.4)),
            lastUpdate: new Date()
        };

        cache.set(cacheKey, data);
        logger.info(`RB3 Fallback: Dados de ${ticker} retornados (mock)`);

        return data;
    } catch (error) {
        logger.error(`Erro no RB3 Fallback getStock(${ticker})`, error);
        return mockStocks[ticker] || null;
    }
}

/**
 * Retorna lista de ações (fallback mock)
 */
async function getStocksList(filter = 'all') {
    try {
        const cacheKey = `rb3_fallback_list_${filter}`;
        const cached = cache.get(cacheKey);

        if (cached) {
            logger.debug(`RB3 Fallback: Cache hit para lista ${filter}`);
            return cached;
        }

        let list = Object.values(mockStocks).map(stock => ({
            ...stock,
            change: getRealisticChange(),
            value: stock.value * (1 + getRealisticChange() / 100)
        }));

        // Filtrar conforme solicitado
        if (filter === 'altas') {
            list = list.filter(s => s.change > 0).sort((a, b) => b.change - a.change);
        } else if (filter === 'baixas') {
            list = list.filter(s => s.change < 0).sort((a, b) => a.change - b.change);
        } else {
            list = list.sort((a, b) => b.change - a.change);
        }

        cache.set(cacheKey, list);
        logger.info(`RB3 Fallback: Lista ${filter} retornada (mock)`);

        return list;
    } catch (error) {
        logger.error(`Erro no RB3 Fallback getStocksList(${filter})`, error);
        return Object.values(mockStocks);
    }
}

/**
 * Retorna histórico de preços (fallback mock)
 */
async function getStockHistory(ticker, days = 30) {
    try {
        const cacheKey = `rb3_fallback_history_${ticker}_${days}`;
        const cached = cache.get(cacheKey);

        if (cached) {
            logger.debug(`RB3 Fallback: Cache hit para histórico ${ticker}`);
            return cached;
        }

        const stock = mockStocks[ticker];
        if (!stock) return [];

        const history = [];
        let currentPrice = stock.value;
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            const dailyChange = (Math.random() - 0.5) * 0.04; // ±2% variação diária
            currentPrice *= (1 + dailyChange);

            history.push({
                date: date.toISOString().split('T')[0],
                open: currentPrice * 0.99,
                high: currentPrice * 1.01,
                low: currentPrice * 0.98,
                close: currentPrice,
                volume: Math.floor(stock.volume * (0.5 + Math.random()))
            });
        }

        cache.set(cacheKey, history);
        logger.info(`RB3 Fallback: Histórico de ${days} dias para ${ticker} (mock)`);

        return history;
    } catch (error) {
        logger.error(`Erro no RB3 Fallback getStockHistory(${ticker})`, error);
        return [];
    }
}

/**
 * Status do serviço fallback
 */
async function getStatus() {
    return {
        available: true,
        source: 'mock_fallback',
        message: 'Usando dados mock (RB3 não disponível)',
        timestamp: new Date()
    };
}

/**
 * Limpa cache do fallback
 */
function clearCache() {
    cache.flushAll();
    logger.info('RB3 Fallback: Cache limpo');
}

module.exports = {
    getIndices,
    getStock,
    getStocksList,
    getStockHistory,
    getStatus,
    clearCache
};
