import {TradingAccount} from './trading-account.model';
export interface Order {
    transactionType: number;
    ISIN: string;
    quantity: number;
    priceLimit: number;
    accountId: string;
  
    orderTime: string;
    market: string;
    tradeCurrency: string;
    settlementCurrency: string;
    grossConsideration: number;
    status: string;

    privateKey: string;
    publicKey: string;
    action: string;
  }

  export interface OrderUpdate extends Order {
    orderId: string;
  }

  export interface OrderUI extends OrderUpdate {  
    tradingAccount: TradingAccount;
  }
