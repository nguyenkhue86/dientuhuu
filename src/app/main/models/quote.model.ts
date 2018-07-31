import { TradingAccount } from './trading-account.model';

export interface Quote {
  accountId: string;
  action: string;
  bondInstrumentName: string;
  ISIN: string;
  market: string;
  ownerName: string;
  price: number;
  quantity: number;
  settlementCurrency: string;
  timeOfQuote: string;
  tradeCurrency: number;
  transactionType: string;
  publicKey?: string;
  privateKey?: string;
}

export interface QuoteUI {
  accountId: string;
  action: string;
  bondInstrumentName: string;
  ISIN: string;
  market: string;
  ownerName: string;
  price: number;
  quantity: number;
  settlementCurrency: string;
  timeOfQuote: string;
  tradeCurrency: number;
  transactionType: string;
  publicKey?: string;
  privateKey?: string;
  tradingAccount: TradingAccount;
}
