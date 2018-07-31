import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
// import * as shape from 'd3-shape';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { of as observableOf, merge } from 'rxjs';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators';

import { BondService } from '../bond.service';
import { Router, ActivatedRoute } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { APPEARANCE } from '../../content';
import { OrganisationService } from '../../organisation/organisation.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'list-organisation',
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
  displayedColumns = ['isinCusip', 'bondName', 'issuer', 'faceValue', 'issueDate', 'maturityDate'];

  form: FormGroup;

  dataRaw: any;
  data: any = [];

  _isinCusip: string;
  _issuer: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private bondService: BondService,
    private organisationService: OrganisationService
  ) {
    this.createForm();
    this._isinCusip = this.route.snapshot.params.issinCusip;
    this._issuer = this.route.snapshot.params.issuer;
    this.hide();
    this.organisationService.getOrganizations()
      .then(org => {
        this.options = org;
      });
  }

  ngOnInit() {
    if (this._isinCusip || this._issuer) {
      this.form.setValue({
        CUSIP: this._isinCusip,
        ISIN: this._issuer
      });
      this.onSearch(this._isinCusip, this._issuer);
    }
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  changeData(data) {
    this.dataRaw = data;
    this.data.onContactsChanged = new BehaviorSubject({});
    this.data.onContactsChanged.next(this.dataRaw);
    this.data.dataSource = new FilesDataSource(data, this.paginator, this.sort);
  }

  search() {
    let filterString = '';
    if (this.form.get('ISIN').value.length !== 0) {
      filterString += '?ISIN=' + this.form.get('ISIN').value;
    }

    this.bondService.getBondsFilter(filterString).subscribe(
      data => {
        this.changeData(data);
      }
    );
  }

  async onSearch(issinCusip, issuer) {
    // tslint:disable-next-line:no-unused-expression
    if (!issinCusip && !issuer) {
      // tslint:disable-next-line:prefer-const
      let bonds = await this.bondService.getBondsPromise();
      this.changeData(bonds);
    }

    if (issinCusip && !issuer) {
      // tslint:disable-next-line:prefer-const
      let bondObj = {
        field: 'ISIN',
        value: issinCusip.toString()
      };

      // tslint:disable-next-line:prefer-const
      let bond = await this.bondService.getBondPromise(bondObj);
      this.changeData(bond);
    }
    if (!issinCusip && issuer) {
      // tslint:disable-next-line:prefer-const
      let objOrg: any = {
        field: 'fullLegalName',
        value: issuer.toString()
      };

      // tslint:disable-next-line:prefer-const
      let org: any = await this.organisationService.getOrganization(objOrg);

      // tslint:disable-next-line:prefer-const
      let bondObj = {
        field: 'orgId',
        value: org[0].orgId || ''
      };
      const bond = await this.bondService.getBondPromise(bondObj);
      this.changeData(bond);
    }

    if (issinCusip && issuer) {
      // tslint:disable-next-line:prefer-const
      let objOrg: any = {
        field: 'fullLegalName',
        value: issuer.toString()
      };

      // tslint:disable-next-line:prefer-const
      let org: any = await this.organisationService.getOrganization(objOrg);
      const arr: Array<any> = [
        {
          field: 'ISIN',
          value: issinCusip.toString()
        },
        {
          field: 'orgId',
          value: org.orgId || ''
        }
      ];
      // tslint:disable-next-line:prefer-const
      let bonds = await this.bondService.getBondPromise(arr);
      this.changeData(bonds);
    }
    this._isinCusip = issinCusip;
    this._issuer = issuer;
    this.form.reset();
  }

  clear(event) {
    this.form.reset();
  }

  hide() {
    this.changeData([]);
  }

  toDetails(isin) {
    // tslint:disable-next-line:prefer-const
    // let store = {
    //   isin,
    //   issinCusip: this._isinCusip,
    //   issuer: this._issuer
    // };
    // console.log(store);
    this.router.navigate(['bond/details', { isin, issinCusip: this._isinCusip, issuer: this._issuer }]);
  }

  // tslint:disable-next-line:member-ordering
  myControl = new FormControl();
  // tslint:disable-next-line:member-ordering
  options: Array<any> = [];
  // tslint:disable-next-line:member-ordering
  filteredOptions: Observable<string[]>;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => {
      if (option.fullLegalName) {
        return option.fullLegalName.toLowerCase().indexOf(filterValue) === 0;
      }
    });
  }

  /**
   * show list with await
   */
  showList = async () => {
    const bonds = await this.bondService.getBondsPromise();
    this.changeData(bonds);
  }

  /**
   * Create form
   */
  createForm = (): void => {
    this.form = this.formBuilder.group({
      CUSIP: [''],
      ISIN: ['']
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

