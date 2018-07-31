import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DashboardService } from '../../dashboard/dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Animations } from '../../../../layout/animations';
import { APPEARANCE, MY_FORMATS_DATE } from '../../content';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { OrderService } from '../../order/order.service';
import { OrderUpdate, OrderUI } from '../../../models/order.model';
import { TradingAccountService } from '../../trading-account/trading-account.service';
import { BondService } from '../../bond/bond.service';

import { BondUI } from '../../../models/bond.model';
import { TradingAccount } from '../../trading-account/trading-account';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'details-order',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_DATE }
  ]
})
export class DetailsComponent implements OnInit
{
  appearance: string = APPEARANCE;
  orderUI: OrderUI;
  order: OrderUpdate;
  form: FormGroup;
  formErrors: any;
  status:any[] = [
    {"name": "Active", "value": "active"},
    {"name": "Deactive", "value": "deactive"}
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
  orderId: string;
  disableForm: boolean = true;
  responsePost: any;
  transactionTypes:any[] = [
    {"name": "Buy", "value": "Buy"},
    {"name": "Sell", "value": "Sell"}
  ];
  currencies: Array<string> = [
    'AUD', 'USD', 'SGD', 'HKD', 'GBP'
  ];

    constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private route: ActivatedRoute,
      private orderService: OrderService,
      private tradingAccountService: TradingAccountService,
      private bondService: BondService,
      private cookieService: CookieService
    )
    {
      this.orderId = this.route.snapshot.paramMap.get('orderId');
      this.orderService.getOrderById(this.orderId).subscribe(data => {
        if (data != null) {
          this.orderUI = data[0];
          this.form.disable();
          this.setValueForm();
        } else {
          console.log("Order Id must be difference from null");
        }
      });

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
  }

  ngOnInit()
  {
    // Reactive Form
    this.form = this.formBuilder.group({
      company   : [
        {
          value   : 'TMA Solutions',
          disabled: true
        }, Validators.required
      ],
      transactionType : ['', Validators.required],
      ISIN : ['', Validators.required],
      quantity : [0, Validators.required],
      priceLimit : [0],
      tradingAccount : ['', Validators.required],
      orderTime : ['', Validators.required],
      market : [''],
      tradeCurrency    : ['', Validators.required],
      settlementCurrency  : ['', Validators.required],
      grossConsideration   : [0]
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

  amend(){
    this.form.enable();
    this.disableForm = false;
  }

  cancelEditForm(){
    this.setValueForm();
    this.form.disable();
    this.disableForm = true;
  }

  save() {
    console.log(this.form.valid);
    if (this.orderUI.status == 'Open') {
      this.order.action = "updateOrder";
      this.order.orderId = this.orderId;
      this.order.accountId = this.accountId;
      this.order.ISIN = this.myControlBond.value;
      this.order.transactionType = 0;
      if (this.form.value.transactionType === 'Sell') {
        this.order.transactionType = 1;
      }
      this.order.quantity = this.form.value.quantity;
      this.order.priceLimit = this.form.value.priceLimit;
      this.order.orderTime = this.form.value.orderTime;
      this.order.market = this.form.value.market;
      this.order.tradeCurrency = this.form.value.tradeCurrency;
      this.order.settlementCurrency = this.form.value.settlementCurrency;
      this.order.grossConsideration = this.form.value.quantity * this.form.value.priceLimit;
      this.order.status = this.orderUI.status;
      this.order.privateKey = "b6df148cd7691befa6d20d3c278fa49fa0ca62306338e884ba0cdeeda2de437b";
      this.order.publicKey = "03d7c69c5cbc0f63916abfa016841583369369fa70950082a76aa8a126cf7405d0",
      this.responsePost = this.orderService.postOrder(this.order, this.cookieService.get('user'));

      if (this.responsePost !== null && this.responsePost.status !== 0) {
        this.form.disable();
        this.disableForm = true;
      }
    }
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

  myChangeAcc($event, account) {
    if ($event.source.selected) {
      this.accountId = account.accountId;
    }
  }

  setValueForm(){
    this.form.setValue({
      company: [
        {
          value: 'TMA Solutions',
          disabled: true
        }, Validators.required
      ],
      'transactionType': (this.orderUI.transactionType === 1 ? 'Sell' : 'Buy'),
      'ISIN': (this.orderUI.ISIN != null ? this.orderUI.ISIN : ""),
      'quantity': (this.orderUI.quantity != null ? this.orderUI.quantity : 0),
      'priceLimit': (this.orderUI.priceLimit != null ? this.orderUI.priceLimit : 0),
      'tradingAccount' : (this.orderUI.tradingAccount != null && this.orderUI.tradingAccount.accountCode != null ? this.orderUI.tradingAccount.accountCode : ""),
      'orderTime': (this.orderUI.orderTime != null ? this.orderUI.orderTime : ""),
      'market': (this.orderUI.market != null ? this.orderUI.market : ""),
      'tradeCurrency': (this.orderUI.tradeCurrency != null ? this.orderUI.tradeCurrency : ""),
      'settlementCurrency': (this.orderUI.settlementCurrency != null ? this.orderUI.settlementCurrency: ""),
      'grossConsideration': (this.orderUI.quantity * this.orderUI.priceLimit)
    });

    this.myControlBond.setValue(this.orderUI.ISIN);
    this.myControlAccount.setValue((this.orderUI.tradingAccount != null && this.orderUI.tradingAccount.accountCode != null ? this.orderUI.tradingAccount.accountCode : ""));
    this.accountId = this.orderUI.accountId;
    this.order = dataOrder;
  }
}

const dataOrder: OrderUpdate= {
  orderId: "0",
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
  action: "OpdateOrder"
}
