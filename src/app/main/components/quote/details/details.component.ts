import { CookieService } from 'ngx-cookie-service';
import { BondService } from './../../bond/bond.service';
import { TradingAccountService } from './../../trading-account/trading-account.service';
import { startWith, map } from 'rxjs/operators';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Observable } from 'rxjs';
import { Component, OnInit, forwardRef } from '@angular/core';
import { QuoteUI } from '../../../models/quote.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DashboardService } from '../../dashboard/dashboard.service';
import { FormBuilder, FormGroup, Validators, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Animations } from '../../../../layout/animations';
import { APPEARANCE, MY_FORMATS_DATE } from '../../content';
import { QuoteService } from '../quote.service';
import * as moment from 'moment';
import { BondUI } from '../../../models/bond.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'details-quote',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_DATE },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DetailsComponent),
      multi: true
    }
  ]
})
export class DetailsComponent implements OnInit {
  appearance: string = APPEARANCE;
  quote: any | QuoteUI;
  bond: BondUI[] = [];
  ISINControl = new FormControl();
  myTradingControl = new FormControl();
  options: Array<any> = [];
  filteredOptions: Observable<string[]>;
  quoteId: string;
  form: FormGroup;
  formErrors: any;
  tradingAccounts: any[] = [];
  quoteTypes: any[] = [
    { name: 'Buy', value: 'Buy' },
    { name: 'Sell', value: 'Sell' }
  ];
  status: any[] = [
    { 'name': 'Open', 'value': 'Open' },
    { 'name': 'Completed', 'value': 'Completed' },
    { 'name': 'Partial Match', 'value': 'Partial Match' },
  ];
  market: string[] = [
    'US Domestic US Domestic',
    'XHKG Hong Kong Exchanges and Clearing',
    'XLON London Stock Exchange',
    'NASDAQ Stock Market',
    'XTKS Tokyo Stock Exchange',
    'XASX ASX Tradematch'
  ];

  activeEdit: Boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private tradingAccountService: TradingAccountService,
    private quoteService: QuoteService,
    private cookieService: CookieService,
    private bondService: BondService
  ) {
    this.quoteId = this.route.snapshot.paramMap.get('quoteId');
    this.quoteService.getBy([{ field: 'quoteId', value: this.quoteId }]).then(quotes => {
      this.tradingAccountService.getTradingAccountsPromise().then(acc => {
        this.tradingAccounts = acc;
        this.quote = quotes[0];
        this.setFormValue();
        this.form.disable();
      });
    });
    this.formErrors = this.errorForm();
  }

  ngOnInit() {
    this.createForm();
    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });

    this.forAutocomplete();
  }

  onFormValuesChanged() {
    for (const field in this.formErrors) {
      if (!this.formErrors.hasOwnProperty(field)) {
        continue;
      }
      // Clear previous errors
      this.formErrors[field] = {};
      // Get the control
      const control = this.form.get(field);
      if (control && control.dirty && !control.valid) {
        this.formErrors[field] = control.errors;
      }
    }
  }

  cancel() {
    // this.setFormValue();
    this.form.disable();
    this.activeEdit = !this.activeEdit;
  }

  back() {
    this.router.navigate(['quote/list']);
  }

  async amend() {
    if (this.checkStatus()) {
      this.bond = await this.bondService.getBondsPromise();
      this.form.enable();
      this.activeEdit = !this.activeEdit;
    }
  }

  displayBond(bond) {
    if (bond != null) {
      return bond.ISIN;
    }
  }

  displayTradingAccount(tradingAccount) {
    if (tradingAccount != null) {
      return tradingAccount.accountName;
    }
  }

  getBond(isin) {
    if (isin !== '') {
      this.bondService.getBond('ISIN', isin).subscribe(data => {
        this.bond = data;
      });
    } else {
      this.bondService.getBonds().subscribe(data => {
        this.bond = data;
      });
    }
  }

  searchTradingAccount(accountName) {
    this.tradingAccountService.searchTradingAccounts('', accountName, '', '', '').subscribe(data => {
      this.tradingAccounts = data;
    });
  }

  setBond() {
    this.form.patchValue({ issuer: this.form.value.name });
    
    const issueDate = this.form.value.issueDate.split('/').map(e => parseInt(e, 10));
    this.form.patchValue({
      maturityDate: moment().set({
        date: issueDate[0],
        month: issueDate[1] - 1,
        year: issueDate[2]
      })
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => {
      if (option.accountName && option.accountName.toLowerCase().indexOf(filterValue) === 0) {
        return option;
      }
    });
  }

  async save() {
    const { ISIN, quoteType, tradingAccount, price, issuer, timeOfQuote, market, tradeCurrency, settlementCurrency, quantity, status } = this.form.value;
    const formData = {
      ISIN: ISIN.ISIN,
      accountId: tradingAccount.accountId,
      action: 'updateQuotes',
      bondInstrumentName: issuer,
      market,
      outstandingQuantity: null,
      ownerName: tradingAccount.accountName,
      price,
      privateKey: '141cfc676d71875b9efb884a95fb62c0da39a8ae9a203f892d81a68b9326cf12',
      publicKey: '0275616a9103ba1bd957637f7bab6f0ee0e2d4a45ad56c11f4e680a639e3fd5bb1',
      quantity,
      quoteId: this.quoteId,
      settlementCurrency,
      timeOfQuote,
      tradeCurrency,
      quoteType,
      status
    };
    
    if (this.form.valid){
      this.quoteService.postQuote(formData, this.cookieService.get('user')).subscribe(res => {
        if (res.link) {
          this.form.reset();
          this.router.navigate(['quote/list']);
        }
      });
    } else {
      alert('This form is invalid.')
    }
  }

  checkStatus(): boolean {
    return this.form.value.status === 'Open' ? true : false;
  }

  forAutocomplete(): void {
  }

  createForm(): void {
    this.form = this.formBuilder.group({
      quoteType: ['', Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
      tradingAccount: ['', Validators.required],
      ISIN: ['', Validators.required],
      issuer: ['', Validators.required],
      maturityDate: ['', Validators.required],
      timeOfQuote: ['', Validators.required],
      market: ['', Validators.required],
      tradeCurrency: ['', Validators.required],
      settlementCurrency: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  errorForm(): any {
    return {
      quoteType: {},
      quantity: {},
      price: {},
      tradingAccount: {},
      ISIN: {},
      issuer: {},
      maturityDate: {},
      timeOfQuote: {},
      market: {},
      tradeCurrency: {},
      settlementCurrency: {},
      status: {}
    };
  }

  setFormValue() {
    this.bondService.getBondPromise([{ field: 'ISIN', value: this.quote.ISIN }]).then(bond => {
      const closedDate = bond[0].closedDate.split('/').map(e => parseInt(e, 10));
      // this.ISINControl.setValue({ISIN: this.quote.ISIN});
      // this.myTradingControl.setValue({ accountName: this.quote.tradingAccount.accountName, accountId: this.quote.accountId })
      this.form.patchValue({
        quoteType: this.quote.quoteType,
        quantity: this.quote.quantity,
        price: this.quote.price,
        tradingAccount: this.quote.tradingAccount ? this.quote.tradingAccount : '',
        issuer: bond[0].organization.fullLegalName,
        ISIN: bond[0],
        maturityDate: moment().set({
          date: closedDate[0],
          month: closedDate[1] - 1,
          year: closedDate[2]
        }),
        timeOfQuote: this.quote.timeOfQuote,
        market: this.quote.market,
        tradeCurrency: this.quote.tradeCurrency,
        settlementCurrency: this.quote.settlementCurrency,
        status: this.quote.status
      });
    });
  }
}
