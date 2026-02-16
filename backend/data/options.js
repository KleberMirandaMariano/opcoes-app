// Dados mock de opções (grade de calls/puts)

function buildOptionsChain(underlyingPrice, ticker = 'PETR4') {
  const strikes = [];
  const step = 1;
  const minStrike = Math.floor(underlyingPrice / step) * step - 4;
  const maxStrike = minStrike + 8;
  for (let k = minStrike; k <= maxStrike; k += step) {
    const dist = (k - underlyingPrice) / step;
    const callLast = Math.max(0.05, (underlyingPrice - k) * 0.5 + 0.3 + Math.random() * 0.5);
    const putLast = Math.max(0.05, (k - underlyingPrice) * 0.5 + 0.3 + Math.random() * 0.5);
    strikes.push({
      strike: k,
      call: { last: Number(callLast.toFixed(2)), varPct: (Math.random() * 6 - 2).toFixed(1), volume: Math.floor(100000 + Math.random() * 500000) },
      put: { last: Number(putLast.toFixed(2)), varPct: (Math.random() * 6 - 2).toFixed(1), volume: Math.floor(10000 + Math.random() * 200000) },
      isITMCall: k < underlyingPrice,
      isITMPut: k > underlyingPrice
    });
  }
  return strikes.sort((a, b) => a.strike - b.strike);
}

const expirations = [
  { value: 'oct24', label: '18 OUT 24 (15d)', days: 15 },
  { value: 'nov24', label: '15 NOV 24 (42d)', days: 42 },
  { value: 'dec24', label: '20 DEZ 24 (78d)', days: 78 }
];

module.exports = { buildOptionsChain, expirations };
