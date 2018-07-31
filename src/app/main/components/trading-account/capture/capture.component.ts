import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { DashboardService } from '../../dashboard/dashboard.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Animations } from '../../../../layout/animations';
import { APPEARANCE } from '../../content';

import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { Title } from '../../../models/title.model';
import * as TitleActions from '../../../actions/title.actions';
import { Observable } from 'rxjs/Observable';
import { title } from '../trading-account';

import { map, startWith } from 'rxjs/operators';
import { Organisation } from '../../../models/organisation.model';
import { OrganisationService } from '../../organisation/organisation.service';
import { TradingAccountService } from '../trading-account.service';
import { LowerCasePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'capture-trading-account',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.scss']
})
export class CaptureComponent implements OnInit {
  // declare param -----------------------------------------------------------
  appearance: string = APPEARANCE;
  form: FormGroup;
  formErrors: any;
  tradingAccount: any;
  filteredOptionsLocation: Observable<string[]>;
  filteredOptionsCountry: Observable<string[]>;
  filteredOptionsBranch: any = [];
  accountStatus: any[] = [
    { 'name': 'Active', 'value': 'Active' },
    { 'name': 'Deactive', 'value': 'Deactive' }
  ];
  type: any[] = [
    { 'name': 'Broker', 'value': 'Broker' },
    { 'name': 'Client', 'value': 'Client' }
  ];
  optionsLocation: any[];
  optionsCountry: any[];

  // contructor -------------------------------------------------------------------------
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<AppState>,
    private organisationService: OrganisationService,
    private tradingAccountService: TradingAccountService,
    private cookieService: CookieService
  ) {
    this.store.dispatch(new TitleActions.ChangeTitle(title));
    this.formErrors = {
      accountName: {},
      accountCode: {},
      accountType: {},
      status: {}
    };
    this.searchBranch('');
    this.searchLocation('');
    this.searchCountry('');
    this.resetTradingAccount();
  }
  // ----------------------------------------------------------------------------------
  ngOnInit() {
    // Reactive Form
    this.form = this.formBuilder.group({
      company: [
        {
          value: 'TMA Solutions',
          disabled: true
        }, Validators.required
      ],
      accountName: ['', Validators.required],
      accountCode: ['', Validators.required],
      accountType: ['', Validators.required],
      branchId: [''],
      status: ['', Validators.required],
      location: [''],
      countryOfLocation: ['']
    });
    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });
    // this.filteredOptionsCountry = this.myControlCountry.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value, this.optionsCountry))
    // );

    // this.filteredOptionsLocation = this.myControlLocation.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value, this.optionsLocation))
    // );
  }


  // function seacrh---------------------------------------------------------------------
  searchBranch(value: string) {
    const filterValue = value.toLowerCase();
    // tslint:disable-next-line:triple-equals
    if (value == '') {
      this.tradingAccountService.getBranch().subscribe(
        data => {
          this.filteredOptionsBranch = data;
        });
    } else {
      this.tradingAccountService.getBranch().subscribe(
        data => {
          this.filteredOptionsBranch = data.filter(d => d.branchName.toLowerCase().indexOf(filterValue) === 0);
        });
    }
  }
  searchLocation(value: string) {
    const filterValue = value.toLowerCase();
    // tslint:disable-next-line:triple-equals
    if (value == '') {
      this.tradingAccountService.getLocation().subscribe(
        data => {
          this.filteredOptionsLocation = data;
        });
    } else {
      this.tradingAccountService.getLocation().subscribe(
        data => {
          this.filteredOptionsLocation = data.filter(d => d.name.toLowerCase().indexOf(filterValue) === 0);
        });
    }
  }
  searchCountry(value: string) {
    const filterValue =  value.toLowerCase();
    // tslint:disable-next-line:triple-equals
    if (value == '') {
      this.tradingAccountService.getCountry().subscribe(
        data => {
          this.filteredOptionsCountry = data;
        });
    } else {
      this.tradingAccountService.getCountry().subscribe(
        data => {
          this.filteredOptionsCountry = data.filter(d => d.country.toLowerCase().indexOf(filterValue) === 0);
        });
    }
  }
  // define DisplayWith-------------------------------------------------------------------------
  displayBranch(branch) {
    if (branch != null) {
      return branch.branchName;
    }
  }
  displayLocation(location) {
    if (location != null) {
      return location;
    }
  }
  displayCountry(country) {
    if (country != null) {
      return country;
    }
  }

  // validate form------------------------------------------------------------------------------------------
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

  // functin action
  cancel() {
    this.router.navigate(['trading-account/list']);
  }

  resetTradingAccount() {
    this.tradingAccount = {
      accountCode: '',
      accountName: '',
      accountType: '',
      action: '',
      branchId: '',
      countryOfLocation: '',
      location: '',
      privateKey: 'b6df148cd7691befa6d20d3c278fa49fa0ca62306338e884ba0cdeeda2de437b',
      publicKey: '03d7c69c5cbc0f63916abfa016841583369369fa70950082a76aa8a126cf7405d0',
      status: 'active'
    };
  }

  save() {

    if (this.form.valid) {
      this.tradingAccount.action = 'createTradingAccount';
      this.tradingAccount.accountName = this.form.value.accountName;
      this.tradingAccount.accountType = this.form.value.accountType;
      this.tradingAccount.accountCode = this.form.value.accountCode;
      this.tradingAccount.branchId = this.form.value.branchId.branchName;
      this.tradingAccount.location = this.form.value.location;
      this.tradingAccount.countryOfLocation = this.form.value.countryOfLocation;
      this.tradingAccountService.postTradingAccount(this.tradingAccount,this.cookieService.get('user'));
      this.router.navigate(['trading-account/list']);
    }
  }

  saveNew(event) {
    if (this.form.valid) {
      this.tradingAccount.action = 'createTradingAccount';
      this.tradingAccount.accountName = this.form.value.accountName;
      this.tradingAccount.accountType = this.form.value.accountType;
      this.tradingAccount.accountCode = this.form.value.accountCode;
      this.tradingAccount.branchId = this.form.value.branchId.branchName;
      this.tradingAccount.location = this.form.value.location;
      this.tradingAccount.countryOfLocation = this.form.value.countryOfLocation;
      this.tradingAccountService.postTradingAccount(this.tradingAccount,this.cookieService.get('user'));
      this.router.navigate(['trading-account/list']);
    }
  }


  private _filter(value: string, options): string[] {
    const filterValue = value.toLowerCase();

    return options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
}


