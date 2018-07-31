import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import * as shape from 'd3-shape';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { of as observableOf, merge } from 'rxjs';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { startWith } from 'rxjs/operators';

import { Router } from '@angular/router';

import { APPEARANCE } from '../../content';
import { QuoteService } from '../quote.service';
import { OrganisationService } from '../../organisation/organisation.service';
import { BondService } from '../../bond/bond.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'list-quotes',
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
  form: FormGroup;
  displayedColumns = ['timeOfQuote', 'isincusip', 'status', 'quoteType', 'quantity', 'tradingAccount', 'market'];
  quoteTypes: any[] = [
    { name: 'Buy', value: 'Buy' },
    { name: 'Sell', value: 'Sell' }
  ];
  columns: any[] = [];
  status: any[] = [
    { 'name': 'Open', 'value': 'Open' },
    { 'name': 'Completed', 'value': 'Completed' },
    { 'name': 'Partial Match', 'value': 'Partial Match' },
  ];
  tradingAccount: any[] = [];
  bond: any[] = [];
  dataRaw: any;
  data: any = [];

  constructor(
    private organisationService: OrganisationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private quoteService: QuoteService,
    private bondService: BondService,
  ) {
    this.createForm();
    this.hide();
    this.organisationService.getOrganizations()
      .then(org => {
        this.options = org;
      });
    this.bondService.getBonds().subscribe(bonds => {
      this.bond = bonds;
    })
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  hide() {
    this.changeData([]);
  }

  changeData(data: any) {
    this.dataRaw = data;
    this.data.onContactsChanged = new BehaviorSubject({});
    this.data.onContactsChanged.next(this.dataRaw);
    this.data.dataSource = new FilesDataSource(this.data, this.paginator, this.sort);
  }
  
  clear(event) {
    this.form.reset();
  }

  toDetails(quoteId) {
    this.router.navigate(['quote/details', quoteId]);
  }

  /**
   * Create form
   */
  createForm = (): void => {
    this.form = this.formBuilder.group({
      quoteType: [''],
      ISIN: [''],
      status: ['']
    });
  }

  async onSearch() {
    let { ISIN, quoteType, status } = this.form.value;
    let arrayQuery = [
      { field: 'ISIN', value: ISIN },
      { field: 'quoteType', value: quoteType },
      { field: 'status', value: status }
    ];
    const quotes = await this.quoteService.getBy(arrayQuery);
    this.changeData(quotes);
    this.form.reset();
  }

  myControl = new FormControl();
  options: any[] = [];
  filteredOptions: Observable<string[]>;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => {
      if (option.fullLegalName) {
        return option.fullLegalName.toLowerCase().indexOf(filterValue) === 0;
      }
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

