export interface Bond{
  cusip: string;
  isin: string;
  issuer: string;

  faceValue: string;
  currency: string;
  firstSettleDate: string;
  matunityDate: string;
  amountOutstanding: string;

  type: string;
  frequency: string;
  firstDate: string;
  rate: string;
  benchmark: string;
}
export interface Bond2{
  ISIN: string;
  orgID: string;
  name: string;
  faceValue: string;
  description: string;
  countryOfQuote: string;
  annualCouponRate: string;
  couponPaymentDate: string;
  CUSIP: string;
}
export interface Bond3{
  action: string;
  currency: string;
  description: string;
  isin: string;
  issueDate: string;
  market: string;
  parValue: string;
  privateKey: string;
  stockName: string;
  uniqueId: string;
}