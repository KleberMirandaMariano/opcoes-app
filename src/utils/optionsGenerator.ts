import { OptionType, MoneyStatus, StockData, OptionData } from '../types';

/**
 * Gera opções simuladas (CALL e PUT) para um ativo com gregas calculadas.
 * Os valores das gregas são simulados para fins demonstrativos.
 */
export const generateOptionsForStock = (
  stock: StockData,
  expiry: string,
  expiryDates: string[]
): OptionData[] => {
  const price = stock.currentPrice;
  if (price <= 0) return [];

  const expiryIndex = Math.max(0, expiryDates.indexOf(expiry));
  const timeFactor = 1 + expiryIndex * 0.15;
  const volatilityBase = 0.20 + expiryIndex * 0.05;

  const baseStrike = Math.round(price);
  const strikes = [
    baseStrike - 2,
    baseStrike - 1,
    baseStrike,
    baseStrike + 1,
    baseStrike + 2,
  ].filter(s => s > 0);

  const atmThreshold = price * 0.012;
  const options: OptionData[] = [];

  for (const [idx, strike] of strikes.entries()) {
    const distanceFromAtm = Math.abs(strike - price);

    // --- CALL ---
    const callStatus: MoneyStatus =
      distanceFromAtm <= atmThreshold ? MoneyStatus.ATM :
      strike < price ? MoneyStatus.ITM : MoneyStatus.OTM;

    const callIntrinsic = Math.max(0, price - strike);
    const callTimeValue = (Math.random() * 0.4 + 0.1) * timeFactor;
    const baseCallPremium = callIntrinsic + (callStatus === MoneyStatus.OTM ? callTimeValue * 0.4 : callTimeValue);
    const callSpread = Math.max(0.01, baseCallPremium * 0.03);
    const callDelta =
      callStatus === MoneyStatus.ITM ? 0.7 + Math.random() * 0.2 :
      callStatus === MoneyStatus.ATM ? 0.4 + Math.random() * 0.2 :
      0.1 + Math.random() * 0.2;

    options.push({
      id: `CALL-${stock.ticker}-${strike}-${idx}-${expiry}`,
      ticker: `${stock.ticker}${String.fromCharCode(65 + expiryIndex)}${Math.round(strike)}`,
      type: OptionType.CALL,
      strike,
      bidPrice: Number((baseCallPremium - callSpread / 2).toFixed(2)),
      askPrice: Number((baseCallPremium + callSpread / 2).toFixed(2)),
      premium: Number(baseCallPremium.toFixed(2)),
      expiry,
      status: callStatus,
      impliedVolatility: Number((volatilityBase + Math.random() * 0.1).toFixed(3)),
      delta: Number(callDelta.toFixed(2)),
      gamma: Number((Math.random() * 0.08 + 0.02).toFixed(3)),
      theta: Number((-0.05 - Math.random() * 0.1).toFixed(3)),
      vega: Number((0.1 + Math.random() * 0.1).toFixed(3)),
    });

    // --- PUT ---
    const putStatus: MoneyStatus =
      distanceFromAtm <= atmThreshold ? MoneyStatus.ATM :
      strike > price ? MoneyStatus.ITM : MoneyStatus.OTM;

    const putIntrinsic = Math.max(0, strike - price);
    const putTimeValue = (Math.random() * 0.35 + 0.1) * timeFactor;
    const basePutPremium = putIntrinsic + (putStatus === MoneyStatus.OTM ? putTimeValue * 0.4 : putTimeValue);
    const putSpread = Math.max(0.01, basePutPremium * 0.03);
    const putDelta =
      putStatus === MoneyStatus.ITM ? -0.7 - Math.random() * 0.2 :
      putStatus === MoneyStatus.ATM ? -0.4 + Math.random() * 0.2 :
      -0.1 - Math.random() * 0.2;

    options.push({
      id: `PUT-${stock.ticker}-${strike}-${idx}-${expiry}`,
      ticker: `${stock.ticker}${String.fromCharCode(77 + expiryIndex)}${Math.round(strike)}`,
      type: OptionType.PUT,
      strike,
      bidPrice: Number((basePutPremium - putSpread / 2).toFixed(2)),
      askPrice: Number((basePutPremium + putSpread / 2).toFixed(2)),
      premium: Number(basePutPremium.toFixed(2)),
      expiry,
      status: putStatus,
      impliedVolatility: Number((volatilityBase + Math.random() * 0.1).toFixed(3)),
      delta: Number(putDelta.toFixed(2)),
      gamma: Number((Math.random() * 0.08 + 0.02).toFixed(3)),
      theta: Number((-0.05 - Math.random() * 0.1).toFixed(3)),
      vega: Number((0.1 + Math.random() * 0.1).toFixed(3)),
    });
  }

  return options;
};
