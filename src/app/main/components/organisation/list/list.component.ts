import { Component, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import * as shape from 'd3-shape';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { of as observableOf, merge } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators';

import { Router } from '@angular/router';

import { OrganisationService } from '../organisation.service';
import { APPEARANCE } from '../../content';

import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { Title } from '../../../models/title.model';
import * as TitleActions from '../../../actions/title.actions';
import { title } from '../organisation';

import { Organisation } from '../../../models/organisation.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'list-bond',
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

  displayedColumns = ['fullLegalName', 'shortName', 'location'];

  organisations: any[] = [];

  dataRaw: any;
  data: any = [];
  shortName = new FormControl();
  location = new FormControl();

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private organisationService: OrganisationService,
  ) {
    this.store.dispatch(new TitleActions.ChangeTitle(title));
    this.dataRaw = this.organisations;
  }

  ngOnInit() {
    // this.organisationService.getOrganisationList().subscribe(
    //   data => {
    //     this.dataRaw = data;
    //     this.data.onContactsChanged = new BehaviorSubject({});
    //     this.data.onContactsChanged.next(this.dataRaw);
    //     this.data.dataSource = new FilesDataSource(this.data, this.paginator, this.sort);
    //   }
    // );
    this.dataRaw = this.data;
  }

  getOrganisations = (): void => {
    this.organisationService.getOrganisationList().subscribe(listOrganisation => {
      console.log(listOrganisation);
      // this.organisations = listOrganisation;
    });
  }

  hide() {
    this.dataRaw = this.data;
    this.data.onContactsChanged = new BehaviorSubject({});
    this.data.onContactsChanged.next(this.dataRaw);
    this.data.dataSource = new FilesDataSource(this.data, this.paginator, this.sort);
  }
  search() {
    this.organisationService.getSearchOrganisations(
      this.shortName.value != null ? this.shortName.value : "",
      this.location.value != null ? this.location.value : "").subscribe(
        data => {
          this.dataRaw = data;
          this.data.onContactsChanged = new BehaviorSubject({});
          this.data.onContactsChanged.next(this.dataRaw);
          this.data.dataSource = new FilesDataSource(this.data, this.paginator, this.sort);
        }
      );
  }
  clear() {
    this.shortName.setValue("");
    this.location.setValue("");
  }

  toDetails(fullLegalName) {
    this.router.navigate(['organisation/details', fullLegalName]);
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
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.

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
        case 'legalName': return compare(a.legalName, b.legalName, isAsc);
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

