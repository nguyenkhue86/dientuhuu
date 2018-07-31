import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import * as shape from 'd3-shape';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { of as observableOf, merge } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators';

import { Router } from "@angular/router";
import { APPEARANCE } from '../../content';

import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { Title } from '../../../models/title.model'
import * as TitleActions from '../../../actions/title.actions';
import { title } from '../trading-account';
import { TradingAccountService } from '../trading-account.service';

@Component({
  selector: 'list-trading-account',
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
  displayedColumns = ['accountName', 'accountType', 'owner', 'status', 'location'];
  dataRaw: any;
  data: any = [];

  constructor(
    // private organisationService: OrganisationService
    private router: Router,
    private store: Store<AppState>,
    private tradingAccountService: TradingAccountService
  ) {
    this.store.dispatch(new TitleActions.ChangeTitle(title));

    this.dataRaw = this.data;
  }

  ngOnInit() {
    this.data.onContactsChanged = new BehaviorSubject({});
    this.data.onContactsChanged.next(this.dataRaw);
    this.data.dataSource = new FilesDataSource(this.data, this.paginator, this.sort);

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.options))
    );
  }
  hide() {
    this.dataRaw = this.data;
    this.data.onContactsChanged = new BehaviorSubject({});
    this.data.onContactsChanged.next(this.dataRaw);
    this.data.dataSource = new FilesDataSource(this.data, this.paginator, this.sort);
  }
  search() {

    this.tradingAccountService.searchTradingAccounts('',
      this.myControlAccountName.value != null ? this.myControlAccountName.value : "",
      this.myControlAccountType.value != null ? this.myControlAccountType.value : "", "",
      this.myControlStatus.value != null ? this.myControlStatus.value : "").subscribe(
        data => {
          this.dataRaw = data;
          this.data.onContactsChanged = new BehaviorSubject({});
          this.data.onContactsChanged.next(this.dataRaw);
          this.data.dataSource = new FilesDataSource(this.data, this.paginator, this.sort);
        }
      );
  }
  clear(event) {
    this.myControlAccountName.setValue("");
    this.myControlAccountType.setValue("");
    this.myControlStatus.setValue("");
  }

  toDetails(accountId) {
    this.router.navigate(['trading-account/details', accountId]);
  }

  myControl = new FormControl();
  myControlAccountType = new FormControl();
  myControlStatus = new FormControl();
  myControlAccountName = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  optionsAccountType: string[] = ['Broker', 'Client'];
  optionsStatus: string[] = ['active', 'deactive'];
  private _filter(value: string, options): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
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

