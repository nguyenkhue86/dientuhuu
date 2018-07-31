import { Component, OnInit } from '@angular/core';

import { Router } from "@angular/router";

import { DashboardService } from '../../dashboard/dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Animations } from '../../../../layout/animations';
import { APPEARANCE, MY_FORMATS_DATE } from '../../content';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { OrderService } from '../../order/order.service';
import { Order } from '../../../models/order.model';
import { TradingAccountService } from '../../trading-account/trading-account.service';
import { BondService } from '../../bond/bond.service';

import { BondUI } from '../../../models/bond.model';
import { TradingAccount } from '../../../models/trading-account.model';
import { User } from '../../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'capture-order',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_DATE }
  ]
})
export class CaptureComponent implements OnInit
{
  appearance: string = APPEARANCE;
  form: FormGroup;
  formErrors: any;
  order: Order;
  status:any[] = [
    {"name": "Buy", "value": "Buy"},
    {"name": "Sell", "value": "Sell"}
  ];
  currencies: Array<string> = [
    'AUD', 'USD', 'SGD', 'HKD', 'GBP'
  ];

  myControlBond = new FormControl();
  filteredBonds: Observable<BondUI[]>;
  listBonds: BondUI[] = [];

  myControlAccount = new FormControl();  
  filteredAccounts:Observable<TradingAccount[]>;
  accountChoice: TradingAccount;
  listAccounts: TradingAccount[] = [];
  isinValue: any;
  accountId: any;
  responsePost: any;
  userLogin: Observable<User>;

    constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private store: Store<AppState>,
      private orderService: OrderService,
      private tradingAccountService: TradingAccountService,
      private bondService: BondService,
      private cookieService: CookieService
    ){
      this.formErrors = {
        type: {},
        bondInstrument: {},
        quantity: {},
        priceLimit: {},
        tradingAccount: {},
        orderTime: {},
        market: {},
        tradeCurrency: {},
        settlementCurrency: {},
        grossConsideration: {}
      };

      this.filteredBonds = this.myControlBond.valueChanges
      .pipe(
        startWith(''),
        map(isin => this.filterBonds(isin)) 
      );

    this.filteredAccounts = this.myControlAccount.valueChanges
    .pipe(
      startWith(''),
      map(value => this.filterAccounts(value)) 
    );
    // this.userLogin = store.select('user');

    this.resetOrder();
  }

  ngOnInit()
  {
    // Reactive Form : ['', Validators.required],
    this.form = this.formBuilder.group({
      company   : [
        {
          value   : 'TMA Solutions',
          disabled: true
        }, Validators.required
      ],
      type : ['', Validators.required],
      bondId : ['', Validators.required],
      quantity : [0, Validators.required],
      priceLimit : [0, Validators.required],
      accId : ['', Validators.required],
      orderTime : ['', Validators.required],
      market : [''],
      tradeCurrency : ['', Validators.required],
      settlementCurrency : ['', Validators.required],
      grossConsideration: [0]
    });

    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });
  }

  onFormValuesChanged()
  {
    for ( const field in this.formErrors )
    {
      if ( !this.formErrors.hasOwnProperty(field) )
      {
        continue;
      }

      // Clear previous errors
      this.formErrors[field] = {};

      // Get the control
      const control = this.form.get(field);

      if ( control && control.dirty && !control.valid )
      {
        this.formErrors[field] = control.errors;
      }
    }
  }
  
  cancel(){
    this.router.navigate(['order/list']);
  }

  myChangeAcc($event, account) {
    if ($event.source.selected) {
      this.accountId = account.accountId;
    }    
  }
  
  save() {      
    this.order.action = "createOrder";
    this.order.accountId = this.accountId;
    this.order.ISIN = this.isinValue;
    if (this.form.value.type === 'Sell') {
      this.order.transactionType = 1;
    } else {
      this.order.transactionType = 0;
    }
    this.order.quantity = this.form.value.quantity;
    this.order.priceLimit = this.form.value.priceLimit;
    this.order.orderTime = this.form.value.orderTime;
    this.order.market = this.form.value.market;
    this.order.tradeCurrency = this.form.value.tradeCurrency;
    this.order.settlementCurrency = this.form.value.settlementCurrency;
    this.order.grossConsideration = this.form.value.quantity * this.form.value.priceLimit;
    this.order.privateKey = "b6df148cd7691befa6d20d3c278fa49fa0ca62306338e884ba0cdeeda2de437b";
    this.order.publicKey = "03d7c69c5cbc0f63916abfa016841583369369fa70950082a76aa8a126cf7405d0";
    this.order.status = "Open";
    
    this.responsePost = this.orderService.postOrder(this.order, this.cookieService.get('user'));

    if (this.responsePost !== null && this.responsePost.status !== 0) {
      this.form.disable();  
    }
  }

  saveNew(event){
    this.save();
    this.resetOrder();
  }

  selectBond(event$) {
    this.isinValue = event$.option.value;
  }

  filterBonds(name: string) {
    let bondFilter = name != '' ? '?ISIN='+name: ""; 
    let success: any = {};
    this.bondService.getBondsFilter(bondFilter)
      .subscribe((webScriptdata) => {
          success = webScriptdata;
          this.listBonds = success;
        },
        msg => {
          alert(msg);
        });


    return this.listBonds.filter(bond =>
      bond.ISIN.toLowerCase().includes(name.toLowerCase()));
  }

  selectAccount(event$) {
    
  }

  filterAccounts(accountCode: string) {
    let success: any = {};
    this.tradingAccountService.searchTradingAccounts(accountCode,"","","","")
      .subscribe((webScriptdata) => {
          success = webScriptdata;
          this.listAccounts = success;
          console.log(this.listAccounts);
        },
        msg => {
          alert(msg);
        });

    return this.listAccounts.filter(acc =>
      acc.accountCode.toLowerCase().includes(accountCode.toLowerCase()));
  }

  resetOrder(){
    this.order = dataOrder    
  }   
  
}

const dataOrder: Order= {
  transactionType: 0,
  ISIN: "",
  quantity: 0,
  priceLimit: 0,
  accountId: "",
  status: "Open",

  orderTime: "01/01/2000 00:00:00",
  market: "AUX",
  tradeCurrency: "GBP",
  settlementCurrency: "GBP",
  grossConsideration: 0.00,
  privateKey: "b6df148cd7691befa6d20d3c278fa49fa0ca62306338e884ba0cdeeda2de437b",
  publicKey: "03d7c69c5cbc0f63916abfa016841583369369fa70950082a76aa8a126cf7405d0",
  action: "createOrder"
}


