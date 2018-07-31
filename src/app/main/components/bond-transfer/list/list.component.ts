import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import * as shape from 'd3-shape';
import { MatTableDataSource,MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { of as observableOf, merge } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators';

import { Router } from "@angular/router";

import { BondTransferService } from '../bond-transfer.service';
import { APPEARANCE } from '../../content'; 

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

  tradingAccount: any[] = [
    {accountName: "ACName 1", accountType: "ACType 1", owner: "ACOwner 1", status: "Active", country: "VN 1"},
    {accountName: "ACName 2", accountType: "ACType 2", owner: "ACOwner 2", status: "Active", country: "VN 2"},
    {accountName: "ACName 3", accountType: "ACType 3", owner: "ACOwner 3", status: "Active", country: "VN 3"},
    {accountName: "ACName 4", accountType: "ACType 4", owner: "ACOwner 4", status: "Active", country: "VN 4"},
    {accountName: "ACName 5", accountType: "ACType 5", owner: "ACOwner 5", status: "Inactive", country: "VN 5"},
    {accountName: "ACName 6", accountType: "ACType 6", owner: "ACOwner 6", status: "Inactive", country: "VN 6"},
    {accountName: "ACName 7", accountType: "ACType 7", owner: "ACOwner 7", status: "Inactive", country: "VN 7"},
    {accountName: "ACName 8", accountType: "ACType 8", owner: "ACOwner 8", status: "Inactive", country: "VN 8"},
    {accountName: "ACName 9", accountType: "ACType 9", owner: "ACOwner 9", status: "Inactive", country: "VN 9"},
  ];

  dataRaw:  any;
  data: any = [];  

  constructor(
    // private organisationService: OrganisationService
      private router: Router
  ) {
    this.dataRaw = this.tradingAccount;
  }

  ngOnInit() {
    this.data.onContactsChanged = new BehaviorSubject({});
    this.data.onContactsChanged.next(this.dataRaw);
    this.data.dataSource = new FilesDataSource(this.data,this.paginator,this.sort);

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  hide(){
  }
  search(){
    alert("Search");
  }
  clear(event){
    alert("Clear");
  }

  toDetails(){
    this.router.navigate(['organisation/details']);
  }
  
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
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

