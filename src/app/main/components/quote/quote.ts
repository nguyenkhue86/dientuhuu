export interface Quote {
  pricingSource: string;
  bidQuantity: string;
  bidPrice: string;
  askQuantity: string;
  askPrice: string;
  tradingAccount: string;

  isin: string;
  issuer: string;
  matunityDate: string;

  timeOfQuote: string;
  market: string;
  tradeCurrency: string;
  settlementCurrency: string;
}
