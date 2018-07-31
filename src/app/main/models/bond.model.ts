import {Organisation} from './organisation.model';

export interface Bond {
    CUSIP: string;
    ISIN: string;
    action: string;
    annualCouponRate: string;
    bondType: number;
    closedDate: string;
    countryOfQuote: string;
    created: string;
    currency: string;
    description?: string;
    faceValue: string;
    issueDate: string;
    market: string;
    name: string;
    orgId: String;  
    privateKey?: string;
    publicKey?: string;
    status: string;
    frequency: string;
    rate: string;
    benchmark: string;
}

export interface BondUI  {
    CUSIP: string;
    ISIN: string;
    action: string;
    annualCouponRate: string;
    bondType: number;
    closedDate: string;
    countryOfQuote: string;
    created: string;
    currency: string;
    description?: string;
    faceValue: string;
    issueDate: string;
    market: string;
    name: string;
    orgId: String;  
    privateKey?: string;
    publicKey?: string;
    status: string;
    frequency: string;
    rate: string;
    benchmark: string;
    amountOutstanding?: string;
    couponPaymentDate?: string;
    organization: Organisation;
}
