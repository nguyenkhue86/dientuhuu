import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import * as shape from 'd3-shape';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { of as observableOf, merge } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { OrderService } from '../../order/order.service';
import { TradingAccountService } from '../../trading-account/trading-account.service';
import { BondService } from '../../bond/bond.service';

import { BondUI } from '../../../models/bond.model';
import { TradingAccount } from '../../trading-account/trading-account';
import { OrderUI } from '../../../models/order.model';

import { Router } from "@angular/router";

import { APPEARANCE } from '../../content'; 

@Component({
  selector: 'list-order',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: FilesDataSource;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  appearance: string = APPEARANCE; 
  displayedColumns = ['transactionType', 'tradingAccount', 'isin', 'orderTime', 'status', 'quantity', 'tradeCurrency', 'settlementCurrency'];

  order: any[] = [];

  dataRaw:  any;
  data: any = [];  

  constructor(
      private orderService: OrderService,
      private tradingAccountService: TradingAccountService,
      private bondService: BondService,
      private router: Router
  ) {
    this.dataRaw = this.data;

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

  ngOnInit() {
    this.data.onContactsChanged = new BehaviorSubject({});
    this.data.onContactsChanged.next(this.dataRaw);
    this.data.dataSource = new FilesDataSource(this.data,this.paginator,this.sort);    
  }
  hide(){
  }
  
  search(){
    this.orderService.searchOrders(
      this.myControlBuySell.value != null ? this.myControlBuySell.value : "",
      this.isinValue != null ? this.isinValue : "",
      this.accountCodeValue != null ? this.accountCodeValue : "",
      this.myControlStatus.value != null ? this.myControlStatus.value : "","").subscribe(
        data => {
          this.dataRaw = data;
          this.data.onContactsChanged = new BehaviorSubject({});
          this.data.onContactsChanged.next(this.dataRaw);
          this.data.dataSource = new FilesDataSource(this.data, this.paginator, this.sort);
        }
      );
  }

  clear(event) {
    this.myControlBond.setValue("");
    this.myControlAccount.setValue("");
    this.myControlBuySell.setValue("");
    this.myControlStatus.setValue("");
  }

  toDetails(orderId) {
    this.router.navigate(['order/details', orderId]);
  }

  myControlBuySell = new FormControl();
  optionsBuySell: string[] = ['Buy', 'Sell'];

  myControlStatus = new FormControl();
  optionsStatus: string[] = ['Active', 'Deactive'];
  
  myControlBond = new FormControl();
  filteredBonds: Observable<BondUI[]>;
  bondChoice: BondUI;
  listBonds: BondUI[] = [];

  myControlAccount = new FormControl();  
  filteredAccounts:Observable<TradingAccount[]>;
  accountChoice: TradingAccount;
  listAccounts: TradingAccount[] = [];
  isinValue: any;
  accountCodeValue: any;

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
    this.accountCodeValue = event$.option.value;
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
}

export class FilesDataSource extends DataSource<any>
{
  data: any = [];
  constructor(
    private dataRaw,
    private paginator: MatPaginator,
    private sort: MatSort
  )
  {
    super();
    this.data = this.dataRaw;
  }


  connect(): Observable<any[]>
  {
    return this.data.onContactsChanged;
  }

  disconnect() {}

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

