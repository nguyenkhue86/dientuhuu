export interface BondTransaction{
  quantity: string;
  instrument: string;
  tradeDate: string;
  valueDate: string;
  tradingAccount: string;

  price: string;
  grossConsideration: string;
  settlementConsideration: string;
  market: string;
  settlementDate: string;
}