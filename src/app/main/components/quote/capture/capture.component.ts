import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { DashboardService } from '../../dashboard/dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Animations } from '../../../../layout/animations';
import { APPEARANCE } from '../../content';
import { QuoteService } from '../quote.service';
import { TradingAccountService } from '../../trading-account/trading-account.service';
import { DISABLED } from '@angular/forms/src/model';
import { BondService } from '../../bond/bond.service';
import * as moment from 'moment';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'capture-quote',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.scss']
})
export class CaptureComponent implements OnInit {
  appearance: string = APPEARANCE;
  form: FormGroup;
  formErrors: any;
  tradingAccount: any[];
  bond: any[] = [];
  quoteTypes: any[] = [
    { name: 'Buy', value: 'Buy' },
    { name: 'Sell', value: 'Sell' }
  ];
  status: any[] = [
    { 'name': 'Open', 'value': 'Open' },
    { 'name': 'Completed', 'value': 'Completed' },
    { 'name': 'Partial Match', 'value': 'Partial Match' },
  ];
  transactionType: any[] = [
    { 'name': 'Buy', 'value': 'Buy' },
    { 'name': 'Sell', 'value': 'Sell' }
  ];
  market: string[] = [
    'US Domestic US Domestic',
    'XHKG Hong Kong Exchanges and Clearing',
    'XLON London Stock Exchange',
    'NASDAQ Stock Market',
    'XTKS Tokyo Stock Exchange',
    'XASX ASX Tradematch'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private quoteService: QuoteService,
    private cookieService: CookieService,
    private tradingAccountService: TradingAccountService,
    private bondService: BondService
  ) {
    this.formErrors = {
      pricingSource: {},
      quantity: {},
      price: {},
      quoteType: {},
      transactionType: {},
      status: {},
      tradingAccount: {},
      isin: {},
      issuer: {},
      matunityDate: {},
      timeOfQuote: {},
      market: {},
      tradeCurrency: {},
      settlementCurrency: {}
    };
    this.getTradingAccount('');
    this.getBond('');
  }

  ngOnInit() {
    // Reactive Form : ['', Validators.required],
    this.form = this.formBuilder.group({
      company: [
        {
          value: 'TMA Solutions',
          disabled: true
        }, Validators.required
      ],
      quoteType: ['', Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
      status: ['', Validators.required],
      tradingAccount: ['', Validators.required],
      ISIN: ['', Validators.required],
      issuer: ['', Validators.required],
      matunityDate: ['', Validators.required],
      timeOfQuote: ['', Validators.required],
      market: [''],
      tradeCurrency: ['', Validators.required],
      settlementCurrency: ['', Validators.required],
    });

    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });
  }
  // search Function
  getTradingAccount(accountName){
    this.tradingAccountService.searchTradingAccounts('', accountName, '', '', '').subscribe(data => {
      this.tradingAccount = data;
    });
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
  setBond() {
    this.form.patchValue({ issuer: this.form.value.ISIN.name });
    const issueDate = this.form.value.ISIN.issueDate.split('/').map(e => parseInt(e, 10));
    this.form.patchValue({
      matunityDate: moment().set({
        date: issueDate[0],
        month: issueDate[1] - 1,
        year: issueDate[2]
      })
    });
  }
  // define DisplayWith-------------------------------------------------------------------------
  displayTradingAccount(tradingAccount) {
    if (tradingAccount != null) {
      return tradingAccount.accountName;
    }
  }

  displayBond(bond) {
    if (bond != null) {
      return bond.ISIN;
    }
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
    this.router.navigate(['organisation/list']);
  }

  save() {
    if (this.form.valid) {
      const quote = {
        ISIN: this.form.value.ISIN.ISIN,
        accountId: this.form.value.tradingAccount.accountId,
        quoteType: this.form.value.quoteType,
        action: 'createQuotes',
        bondInstrumentName: this.form.value.issuer,
        market: this.form.value.market,
        status: this.form.value.status,
        // outstandingQuantity: '',
        ownerName: this.form.value.tradingAccount.accountName,
        price: parseInt(this.form.value.price, 10),
        privateKey: 'b6df148cd7691befa6d20d3c278fa49fa0ca62306338e884ba0cdeeda2de437b',
        publicKey: '03d7c69c5cbc0f63916abfa016841583369369fa70950082a76aa8a126cf7405d0',
        quantity: parseInt(this.form.value.quantity, 10),
        settlementCurrency: this.form.value.settlementCurrency,
        timeOfQuote: moment(this.form.value.timeOfQuote).format('YYYY-MM-DDTHH:mm'),
        tradeCurrency: this.form.value.tradeCurrency
      };
      this.quoteService.postQuote(quote, this.cookieService.get('user')).subscribe(data => {
        if (data.link) {
          this.router.navigate(['quote/list']);
        }
      });
    }
  }

  saveNew(event) {
    this.router.navigate(['quote/list']);
  }
}


