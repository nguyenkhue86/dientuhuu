export interface BondTransaction{
  orderId:string;
  quoteId:string;
  quantity: number;
  price: number;
  ISIN: string;
  tradeDate: '';
  valueDate: '';
  theirTradingAccount: string;
  ourAccountId:string;
  
  transactionStatus: string;
  transactionType: string;
  market: string;
  settlementDate: '';

  privateKey: string,
  publicKey: string,
  action:string;
}
