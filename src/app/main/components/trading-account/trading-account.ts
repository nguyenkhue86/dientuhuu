import { Title } from '../../models/title.model';

export const title: Title = {
  name: "Trading Account",
  icon: "account_box"
}

export interface TradingAccount{
  accountCode: string;
  accountName: string;
  accountType: string;
  action: string;
  branchId: string;
  countryOfLocation: string;
  location: string;
  privateKey: string;
  publicKey: string;
  status: string;
  }