import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import * as shape from 'd3-shape';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { of as observableOf, merge } from 'rxjs';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { startWith } from 'rxjs/operators';

import { Router } from '@angular/router';

import { BondTransactionService } from '../bond-transaction.service';
import { APPEARANCE } from '../../content';
import { TradingAccountService } from '../../trading-account/trading-account.service';
import { BondService } from '../../bond/bond.service';
import { invalid } from 'moment';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'list-trading-account',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListComponent implements OnInit {

  //declare paramater---------------------------------------------------------------------------------------------------------
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: FilesDataSource;
  form: FormGroup;
  transactionTypes: Array<string> = ['Buy', 'Sell'];
  appearance: string = APPEARANCE;
  displayedColumns = ['transactionType', 'transactionStatus', 'tradingAccount', 'ISIN', 'tradeDate', 'valueDate', 'settlementDate', 'quantity', 'price', 'settlementConsideration', 'market'];

  tradingAccount: any[] = [
    { accountName: 'ACName 1', accountType: 'ACType 1', owner: 'ACOwner 1', status: 'Active', country: 'VN 1' },
    { accountName: 'ACName 2', accountType: 'ACType 2', owner: 'ACOwner 2', status: 'Active', country: 'VN 2' },
    { accountName: 'ACName 3', accountType: 'ACType 3', owner: 'ACOwner 3', status: 'Active', country: 'VN 3' },
    { accountName: 'ACName 4', accountType: 'ACType 4', owner: 'ACOwner 4', status: 'Active', country: 'VN 4' },
    { accountName: 'ACName 5', accountType: 'ACType 5', owner: 'ACOwner 5', status: 'Inactive', country: 'VN 5' },
    { accountName: 'ACName 6', accountType: 'ACType 6', owner: 'ACOwner 6', status: 'Inactive', country: 'VN 6' },
    { accountName: 'ACName 7', accountType: 'ACType 7', owner: 'ACOwner 7', status: 'Inactive', country: 'VN 7' },
    { accountName: 'ACName 8', accountType: 'ACType 8', owner: 'ACOwner 8', status: 'Inactive', country: 'VN 8' },
    { accountName: 'ACName 9', accountType: 'ACType 9', owner: 'ACOwner 9', status: 'Inactive', country: 'VN 9' },
  ];
  transactionBond: any[] = [
    { transactionType: "TT 1", transactionStatus: "Open", tradingAccount: "TA 1", ISIN: "ISCP1", bondName: "BN 1", tradeDate: "27/02/2018", valueDate: "01/07/2018", settlementDate: "27/07/2018", quantity: "25", price: "6", settlementConsideration: "STCD 1", market: "market 1" },
    { transactionType: "TT 2", transactionStatus: "Open", tradingAccount: "TA 2", ISIN: "ISCP1", bondName: "BN 2", tradeDate: "25/01/2018", valueDate: "02/07/2018", settlementDate: "22/07/2018", quantity: "25", price: "3", settlementConsideration: "STCD 2", market: "market 2" },
    { transactionType: "TT 3", transactionStatus: "Completed", tradingAccount: "TA 3", ISIN: "ISCP1", bondName: "BN 3", tradeDate: "27/03/2018", valueDate: "07/07/2018", settlementDate: "17/03/2018", quantity: "22", price: "4", settlementConsideration: "STCD 3", market: "market 3" },
    { transactionType: "TT 4", transactionStatus: "Open", tradingAccount: "TA 4", ISIN: "ISCP1", bondName: "BN 4", tradeDate: "21/01/2018", valueDate: "04/07/2018", settlementDate: "22/06/2018", quantity: "21", price: "8", settlementConsideration: "STCD 4", market: "market 4" },
    { transactionType: "TT 5", transactionStatus: "Completed", tradingAccount: "TA 5", ISIN: "ISCP1", bondName: "BN 5", tradeDate: "23/02/2018", valueDate: "03/07/2018", settlementDate: "27/07/2018", quantity: "29", price: "9", settlementConsideration: "STCD 5", market: "market 5" }
  ]

  dataRaw: any;
  data: any = [];
  transactionStatus:Array<string> = ["Ready To Settle", "Settled","Cancelled", "Failed"]
  //filter-----------------------------------------------------------------------------------------------------
  //filter paramater------------------------------------------------------------
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  filteredOptionsTradingAccount:any[];
  filteredOptionsBondInstrument:any[];

  //filter function-------------------------------------------------------------
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  searchTradingAccount(value:string){
    const filterValue=value.toLowerCase();
    if(filterValue==''){
      this.tradingAccountService.searchTradingAccounts('','','','','').subscribe(data=>{
        this.filteredOptionsTradingAccount=data;
      });
    }else{
      this.tradingAccountService.searchTradingAccounts('',filterValue,'','','').subscribe(data=>{
        this.filteredOptionsTradingAccount=data;
      });
    }
  }

  displayTradingAccount(tradingAccount):string{
    if(tradingAccount!=null){
      return tradingAccount.accountName;
    }
  }

  searchBondInstrument(value:string){
    const filterValue=value.toLowerCase();
    if(filterValue==''){
      this.bondInstrumentService.getBonds().subscribe(data=>{
        this.filteredOptionsBondInstrument=data;

      });
    }else{
      this.bondInstrumentService.getBond("name",filterValue).subscribe(data=>{
        this.filteredOptionsBondInstrument=data;
      });
    }
  }

  displayBondInstrument(bondInstrument):string{
    if(bondInstrument!=null){
      return bondInstrument.name;
    }
  }



  //contructor---------------------------------------------------------------------------------------------------
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private tradingAccountService: TradingAccountService,
    private bondInstrumentService: BondService,
    private bonTransactionService: BondTransactionService
  ) {
    this.dataRaw = [];
    this.createForm();
    this.searchTradingAccount('');
    this.searchBondInstrument('');
  }

  //OnInit ------------------------------------------------------------------------------------------------------
  ngOnInit() {
    this.data.onContactsChanged = new BehaviorSubject({});
    this.data.onContactsChanged.next(this.dataRaw);
    this.data.dataSource = new FilesDataSource(this.data, this.paginator, this.sort);

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.createForm();
  }

  //action form-------------------------------------------------------------------------------------------------
  hide() {
  }
  search() {
    console.log(this.form.value);
    let tradeStartDate="";
    let tradeEndDate = "";
    let valueStartDate ="";
    let valueEndDate = "";
    let transactionType="";
    if(this.form.value.tradeStartDate){
      tradeStartDate =(new Date((this.form.value.tradeStartDate).toString())).toLocaleDateString();
    }
    if(this.form.value.tradeEndDate){
      tradeEndDate = (new Date((this.form.value.tradeEndDate).toString())).toLocaleDateString();
    }
    if(this.form.value.valueStartDate){
      valueStartDate = (new Date((this.form.value.valueStartDate).toString())).toLocaleDateString();
    }
    if(this.form.value.valueEndDate){
      valueEndDate = (new Date((this.form.value.valueEndDate).toString())).toLocaleDateString()
    }
    if(this.form.value.transactionType){
      if(this.form.value.transactionType=="Buy"){
        transactionType="0";
      }else{
        transactionType="1";
      }
    }else{
      transactionType="";
    }
    this.bonTransactionService.searchBondTransaction(
      transactionType,
      this.form.value.transactionStatus?this.form.value.transactionStatus:"",
      this.form.value.tradingAccount.accountId?this.form.value.tradingAccount.accountId:"",
      this.form.value.bondInstrument.ISIN?this.form.value.bondInstrument.ISIN:"",
      tradeStartDate,
      tradeEndDate!="invalid Date"?tradeEndDate:"",
      valueStartDate!="invalid Date"?valueStartDate:"",
      valueEndDate!="invalid Date"?valueEndDate:"",
      this.form.value.quantityStart?this.form.value.quantityStart:"",
      this.form.value.quantityEnd?this.form.value.quantityEnd:"",
      this.form.value.market?this.form.value.market:""
    ).subscribe(data => {
      this.dataRaw=data;
      console.log(data);
      this.data.onContactsChanged = new BehaviorSubject({});
      this.data.onContactsChanged.next(this.dataRaw);
      this.data.dataSource = new FilesDataSource(this.data, this.paginator, this.sort);
    });
  }
  clear(event) {
    alert('Clear');
  }

  toDetails(transactionId) {
    this.router.navigate(['bond-transaction/details',transactionId]);
  }

  createForm = (): void => {
    this.form = this.formBuilder.group({
      transactionType: [''],
      transactionStatus: [''],
      tradingAccount: [''],
      bondInstrument: [''],
      tradeStartDate: [''],
      tradeEndDate: [''],
      valueStartDate: [''],
      valueEndDate: [''],
      quantityStart: [''],
      quantityEnd: [''],
      market: ['']
    });
  }
}

export class FilesDataSource extends DataSource<any>
{
  data: any = [];
  constructor(
    private dataRaw,
    private paginator: MatPaginator,
    private sort: MatSort
  ) {
    super();
    this.data = this.dataRaw;
  }


  connect(): Observable<any[]> {
    return this.data.onContactsChanged;
  }

  disconnect() { }

  private getPagedData(data: any[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  private getSortedData(data: any[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'uniqueID': return compare(a.uniqueID, b.uniqueID, isAsc);
        case 'shortName': return compare(a.shortName, b.shortName, isAsc);
        case 'location': return compare(a.location, b.location, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

