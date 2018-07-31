export interface Order{
  type: string;
  instrument: string;
  quantity: string;
  priceLimit: string;
  tradingAccount: string;

  time: string;
  market: string;
  tradeCurrency: string;
  settlementCurrency: string;
  grossConsideration: string;
}