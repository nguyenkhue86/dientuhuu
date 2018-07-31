import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Router } from '@angular/router';

import { DashboardService } from '../../dashboard/dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Animations } from '../../../../layout/animations';
import { APPEARANCE } from '../../content';
import { DataSource } from '@angular/cdk/collections';
import { FilesDataSource } from '../list/list.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { BondTransactionService } from '../bond-transaction.service';
import { BondService } from '../../bond/bond.service';
import { Bond, BondUI } from '../../../models/bond.model';
import { QuoteService } from '../../quote/quote.service';
import { OrderService } from '../../order/order.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'capture-order',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.scss']
})
export class CaptureComponent implements OnInit {

  //display table,paging and sort------------------------------------------------------------------
  displayedColumnsOfOrder = ['orderTime', 'accountName', 'priceLimit', 'quantity', 'match'];
  displayedColumnsOfQuote = ['quoteTime', 'tradingAccount', 'price', 'quantity', 'match'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  appearance: string = APPEARANCE;
  dataSource: FilesDataSource;

  //declare static data ---------------------------------------------------------------------------
  dataRawOrder: any[] =[];
  dataOrder: any = [];

  dataRawQuote: any[] = [];
  dataQuote: any = [];

   transactionType:string;

  type: any[] = [
    { 'name': 'Buy', 'value': '0' },
    { 'name': 'Sell', 'value': '1' }
  ];
  market:string[]=[
    "US Domestic US Domestic",
    "XHKG Hong Kong Exchanges and Clearing",
    "XLON London Stock Exchange",
    "NASDAQ Stock Market",
    "XTKS Tokyo Stock Exchange",
    "XASX ASX Tradematch"
];
//Contructor-------------------------------------------------------------------------------------
constructor(
  private formBuilder: FormBuilder,
  private router: Router,
  private bondTransctionService: BondTransactionService,
  private bondInstrumentService: BondService,
  private quoteService:QuoteService,
  private orderService: OrderService,
  private cookieService: CookieService
) {
  this.formErrors = {
    type: {},
    bondInstrument: {},
    market: {},
    matchOrder: {},
    matchQuote: {}
  };
  this.searchBondInstrument('');
  this.searchMarket('');
}
  //filter search field-----------------------------------------------------------------------------
  filteredOptionsBondInstrument: BondUI[];
  filteredOptionsMarket: string[];

  // seacrh function---------------------------------------------------------
  searchBondInstrument(value: string) {
    const filterValue = value.toLowerCase();
    if (value == '') {
      this.bondInstrumentService.getBonds().subscribe(data => {
          this.filteredOptionsBondInstrument = data;
        });
    } else {
      this.bondInstrumentService.getBond("name", value.toLowerCase()).subscribe(
        data => {
          this.filteredOptionsBondInstrument = data;
        });
    }
  }

  searchMarket(value: string) {
    const filterValue = value.toLowerCase();
    if (value == '') {
      this.filteredOptionsMarket = this.market;
    } else {
      this.filteredOptionsMarket = this.market.filter(m=>m.toLowerCase().indexOf(filterValue)===0);
    }
  }
  //define DisplayWith-------------------------------------------------------
  displayBondInstrument(bondInstrument) {
    if (bondInstrument != null) {
      return bondInstrument.name;
    }
  }

  displayMarket(market) {
    if (market != null) {
      return market;
    }
  }


  //formgroup--------------------------------------------------------------------------------------
  form: FormGroup;
  formErrors: any;

  // param ---------------------------------------------------------------------
  order: any = null;
  quote: any = null;

  // onFormValuesChanged -------------------------------------------------------
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

    // active checkbox -------------------------------------------------------------
    checkOrder(event, order) {
      this.order = order;
      this.form.patchValue({ matchOrder: false });
      event.value = true;
    }
    checkQuote(event, quote) {
      this.quote = quote;
      this.form.patchValue({ matchQuote: false });
      event.value = true;
    }

    // action form ------------------------------------------------------------------
    search(){
      console.log(this.form.valid);
      if(this.form.valid){
        console.log("in");
        if ( this.form.value.type == '0' ){
          this.transactionType = 'Sell';
        }else{
          this.transactionType = 'Buy';
        }
        this.form.patchValue({matchOrder:false,matchQuote: false});
        this.quoteService.getSearchQuotes(this.form.value.bondInstrument.ISIN?this.form.value.bondInstrument.ISIN:"","",this.transactionType,"",this.form.value.market?this.form.value.market:"",'Open').subscribe(data =>{
          this.dataRawQuote=data;
          this.setDataQuote();
        });
        
        this.orderService.searchOrders(this.form.value.type,this.form.value.bondInstrument.ISIN?this.form.value.bondInstrument.ISIN:"","","Open",this.form.value.market?this.form.value.market:"").subscribe(data =>{
          this.dataRawOrder=data;
          this.setDataOrder();
        });
      }
    }
    cancel() { 
      this.router.navigate(['bond-transaction/list']); 
    }
    reset(){
      this.form.reset();
    }

    save() {
      console.log(this.order,this.quote);
      if (this.order == null) { 
        alert("Order is empty");
      } 
      else if (this.quote == null) {
        alert("Quote is empty");
      } else if(this.order.accountId==this.quote.accountId){
        alert("Error:Order Account and Quote Account are one!")
      } else {
        let date =new Date();
          const bondTransaction ={
            orderId:this.order.orderId,
            quoteId:this.quote.quoteId,
            transactionStatus:'Ready To Settle',
            transactionType:this.order.transactionType,
            ISIN: this.order.ISIN,
            quantity: this.order.quantity>=this.quote.quantity?this.quote.quantity:this.order.quantity,
            market:this.order.market,
            price:this.quote.price,
            theirTradingAccount:this.quote.tradingAccount.accountId,
            ourAccountId:this.order.tradingAccount.accountId,
            tradeDate:date.toLocaleDateString(),
            valueDate: new Date(date.setDate(date.getDate()+1)).toLocaleDateString(),
            settlementDate: new Date(date.setDate(date.getDate()+2)).toLocaleDateString(),
            privateKey: 'b6df148cd7691befa6d20d3c278fa49fa0ca62306338e884ba0cdeeda2de437b',
            publicKey: '03d7c69c5cbc0f63916abfa016841583369369fa70950082a76aa8a126cf7405d0',
            action:'createBondTransaction'
          }
        this.bondTransctionService.postBondTransaction(bondTransaction,this.cookieService.get('user')).subscribe(data=>{
        });
        this.router.navigate(['bond-transaction/list']);
      }
      //this.router.navigate(['organisation/list']);
    }

    saveNew(event) { this.router.navigate(['bond-transaction/list']); }
  //set data sourse-------------------------------------------------------------------------------
  setDataOrder(){
    this.dataOrder.onContactsChanged = new BehaviorSubject({});
    this.dataOrder.onContactsChanged.next(this.dataRawOrder);
    this.dataOrder.dataSource = new FilesDataSource(this.dataOrder, this.paginator, this.sort);
  }
  setDataQuote(){
    this.dataQuote.onContactsChanged = new BehaviorSubject({});
    this.dataQuote.onContactsChanged.next(this.dataRawQuote);
    this.dataQuote.dataSource = new FilesDataSource(this.dataQuote, this.paginator, this.sort);
  }
  //Oninit-----------------------------------------------------------------------------------------
  ngOnInit() {
    this.setDataOrder();
    this.setDataQuote();
    
    // Reactive Form
    this.form = this.formBuilder.group({
      company: [
        {
          value: 'TMA Solutions',
          disabled: true
        }, Validators.required
      ],
      type: ['', Validators.required],
      bondInstrument: ['', Validators.required],
      market: ['', Validators.required],
      matchOrder: [''],
      matchQuote: ['']
    });

    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });
  }
}


