import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { DashboardService } from '../../dashboard/dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Animations } from '../../../../layout/animations';
import { APPEARANCE } from '../../content';

import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { Title } from '../../../models/title.model';
import * as TitleActions from '../../../actions/title.actions';
import { Observable } from 'rxjs/Observable';
import { title } from '../organisation';

import { OrganisationService } from '../organisation.service';
import { Organisation } from '../../../models/organisation.model';
import { TradingAccountService } from '../../trading-account/trading-account.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'capture-organisation',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.scss']
})

export class CaptureComponent implements OnInit
{
  appearance: string = APPEARANCE;
  form: FormGroup;
  formErrors: any;
  filteredOptionsLocation: Observable<string[]>;
  filteredOptionsCountry: Observable<string[]>;
  status: any[] = [
    {'name': 'Active', 'value': 'Active'},
    {'name': 'Deactive', 'value': 'Deactive'}
  ];
  dataOrganisation:  any;

  //declare contructor------------------------------------------------------------------
    constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private store: Store<AppState>,
      private organisationService: OrganisationService,
      private tradingAccountService:TradingAccountService
    ){
      this.store.dispatch(new TitleActions.ChangeTitle(title) );
      this.resetForm();
      this.formErrors = {
        fullLegalName : {},
        shortName : {},
        status    : {},
        industry  : {},
        ticker    : {},
        pricingSource : {},
        location  : {},
        countryOfLocation   : {}
      };
      this.searchLocation('');
      this.searchCountry('');
    }
//ngOnInit----------------------------------------------------------------------
  ngOnInit()
  {
    // Reactive Form
    this.form = this.formBuilder.group({
      company   : [
        {
          value   : 'TMA Solutions',
          disabled: true
        }, Validators.required
      ],
      fullLegalName : ['', Validators.required],
      shortName : ['', Validators.required],
      status    : ['', Validators.required],
      industry  : [''],
      ticker    : [''],
      pricingSource: [''],
      location  : [''],
      countryOfLocation: ['']
    });

    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });
  }

  // seacrh function---------------------------------------------------------------------
  searchLocation(value: string) {
    const filterValue=  value.toLowerCase();
    if (value == '') {
      this.tradingAccountService.getLocation().subscribe(
        data => {
          this.filteredOptionsLocation = data;
        });
    } else {
      this.tradingAccountService.getLocation().subscribe(
        data => {
          this.filteredOptionsLocation = data.filter(d=>d.name.toLowerCase().indexOf(filterValue)===0);
        });
    }
  }
  searchCountry(value: string) {
    const filterValue=  value.toLowerCase();
    if (value == '') {
      this.tradingAccountService.getCountry().subscribe(
        data => {
          this.filteredOptionsCountry = data;
        });
    } else {
      this.tradingAccountService.getCountry().subscribe(
        data => {
          this.filteredOptionsCountry = data.filter(d=>d.country.toLowerCase().indexOf(filterValue)===0);
        });
    }
  }

  //define DisplayWith-------------------------------------------------------------------------
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

  //change form function--------------------------------------------------------
  onFormValuesChanged()
  {
    for ( const field in this.formErrors )
    {
      if ( !this.formErrors.hasOwnProperty(field) )
      {
        continue;
      }

      // Clear previous errors
      this.formErrors[field] = {};

      // Get the control
      const control = this.form.get(field);

      if ( control && control.dirty && !control.valid )
      {
        this.formErrors[field] = control.errors;
      }
    }
  }
//action function---------------------------------------------------------------------
  cancel(){
    // alert(this.form.get("legalName").value);
    this.router.navigate(['organisation/list']);
  }
  resetForm(){
    this.dataOrganisation = {
      action: '',
      privateKey: '',
      publicKey: '',
      fullLegalName: '',
      shortName: '',
      status: '',
      industry: '',
      pricingSource: '',
      location: '',
      countryOfLocation: ''
    };
  }
  save(){
    if (this.form.valid){
      this.dataOrganisation.action = 'createOrganization';
      this.dataOrganisation.privateKey = 'b6df148cd7691befa6d20d3c278fa49fa0ca62306338e884ba0cdeeda2de437b';
      this.dataOrganisation.publicKey = '03d7c69c5cbc0f63916abfa016841583369369fa70950082a76aa8a126cf7405d0';
      this.dataOrganisation.fullLegalName = this.form.value.fullLegalName;
      this.dataOrganisation.shortName = this.form.value.shortName;
      this.dataOrganisation.status = this.form.value.status;
      this.dataOrganisation.industry = this.form.value.industry;
      this.dataOrganisation.location = this.form.value.location;
      this.dataOrganisation.pricingSource = this.form.value.pricingSource;
      this.dataOrganisation.countryOfLocation = this.form.value.countryOfLocation;
      this.organisationService.postOrganization(this.dataOrganisation).subscribe(data => console.log(data));
      this.resetForm();
      this.router.navigate(['organisation/list']);
    }
  }

  saveNew(event){
    this.router.navigate(['organisation/list']);
  }
}


