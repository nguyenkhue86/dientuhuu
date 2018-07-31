import { Component, OnInit } from '@angular/core';

import { Organisation } from '../../../models/organisation.model';

import { Router, ActivatedRoute } from '@angular/router';

import { DashboardService } from '../../dashboard/dashboard.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Animations } from '../../../../layout/animations';
import { APPEARANCE } from '../../content';

import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { Title } from '../../../models/title.model';
import * as TitleActions from '../../../actions/title.actions';
import { Observable } from 'rxjs/Observable';
import { title } from '../organisation';

import { OrganisationService } from '../organisation.service';
import { TradingAccountService } from '../../trading-account/trading-account.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'details-bond',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  appearance: string = APPEARANCE;
  // tslint:disable-next-line:no-inferrable-types
  disableForm: boolean = true;
  organisation: Organisation;
  fullLegalName: string;
  form: FormGroup;
  formErrors: any;
  filteredOptionsLocation: Observable<string[]>;
  filteredOptionsCountry: Observable<string[]>;
  status: any[] = [
    { 'name': 'active', 'value': 'Active' },
    { 'name': 'deactive', 'value': 'Deactive' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private organisationService: OrganisationService,
    private tradingAccountService: TradingAccountService
  ) {
    this.store.dispatch(new TitleActions.ChangeTitle(title));
    this.fullLegalName = this.route.snapshot.paramMap.get('fullLegalName');
    this.organisationService.getOrganisation('fullLegalName', this.fullLegalName).subscribe(data => {
      this.organisation = data[0];
      this.form.disable();
      this.setValueForm();
    });
    // this.organisation = dataOrganisation;
    this.formErrors = {
      fullLegalName: {},
      shortName: {},
      status: {},
      industry: {},
      ticker: {},
      pricingSource: {},
      location: {},
      countryOfLocation: {},
      workZone: {}
    };
    this.searchLocation('');
    this.searchCountry('');
  }
  setValueForm(){
    this.form.setValue({
      company: [
        {
          value: 'TMA Solutions',
          disabled: true
        }, Validators.required
      ],
      'fullLegalName': this.organisation.fullLegalName,
      'shortName': this.organisation.shortName,
      'status': this.organisation.status,
      'industry': this.organisation.industry,
      'ticker': 'static ticker',
      'orgId' : this.organisation.orgId,
      'pricingSource': this.organisation.pricingSource,
      'location': this.organisation.location,
      'countryOfLocation': this.organisation.countryOfLocation,
      'workZone': ''
    });
  }
  // ngOnInit----------------------------------------------------------------------
  ngOnInit() {
    // Reactive Form
    this.form = this.formBuilder.group({
      company: [
        {
          value: 'TMA Solutions',
          disabled: true
        }, Validators.required
      ],
      fullLegalName: ['', Validators.required],
      shortName: ['', [Validators.required, Validators.maxLength(5)]],
      status: ['', Validators.required],
      industry: [''],
      ticker: [''],
      pricingSource: [''],
      orgId: [''],
      location: [''],
      countryOfLocation: [''],
      workZone: ['']
    });

    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });
  }
  // seacrh function---------------------------------------------------------------------
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
    const filterValue = value.toLowerCase();
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

  // change form function--------------------------------------------------------
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
// action function---------------------------------------------------------------------
  cancel() {
    this.router.navigate(['organisation/list']);
  }

  amend() {
    this.form.enable();
    this.disableForm = false;
  }
  cancelEditForm(){
    this.setValueForm();
    this.form.disable();
    this.disableForm = true;
  }
  save(){
    console.log(this.form.valid);
    if (this.form.valid){
      this.organisation.action = 'updateOrganization';
      this.organisation.privateKey = 'b6df148cd7691befa6d20d3c278fa49fa0ca62306338e884ba0cdeeda2de437b';
      this.organisation.publicKey = '03d7c69c5cbc0f63916abfa016841583369369fa70950082a76aa8a126cf7405d0';
      this.organisation.fullLegalName = this.form.value.fullLegalName;
      this.organisation.shortName = this.form.value.shortName;
      this.organisation.status = this.form.value.status;
      this.organisation.industry = this.form.value.industry;
      this.organisation.pricingSource = this.form.value.pricingSource;
      this.organisation.location = this.form.value.location;
      this.organisation.countryOfLocation = this.form.value.countryOfLocation;
      this.organisationService.postOrganization(this.organisation).subscribe(data => 0);
      this.router.navigate(['organisation/list']);
    }
  }
}
