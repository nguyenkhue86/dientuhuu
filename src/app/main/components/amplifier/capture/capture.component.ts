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
import { title } from '../amplifier';

import { AmplifierService } from '../amplifier.service';
import { Amplifier } from '../../../models/amplifier.model';
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
  dataAmplifier:  any;

  //declare contructor------------------------------------------------------------------
    constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private store: Store<AppState>,
      private amplifierService: AmplifierService
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
    // const filterValue=  value.toLowerCase();
    // if (value == '') {
    //   this.tradingAccountService.getLocation().subscribe(
    //     data => {
    //       this.filteredOptionsLocation = data;
    //     });
    // } else {
    //   this.tradingAccountService.getLocation().subscribe(
    //     data => {
    //       this.filteredOptionsLocation = data.filter(d=>d.name.toLowerCase().indexOf(filterValue)===0);
    //     });
    // }
  }
  searchCountry(value: string) {
    // const filterValue=  value.toLowerCase();
    // if (value == '') {
    //   this.tradingAccountService.getCountry().subscribe(
    //     data => {
    //       this.filteredOptionsCountry = data;
    //     });
    // } else {
    //   this.tradingAccountService.getCountry().subscribe(
    //     data => {
    //       this.filteredOptionsCountry = data.filter(d=>d.country.toLowerCase().indexOf(filterValue)===0);
    //     });
    // }
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
  }
  save(){
    if (this.form.valid){
      this.dataAmplifier.action = 'createOrganization';
      this.dataAmplifier.privateKey = 'b6df148cd7691befa6d20d3c278fa49fa0ca62306338e884ba0cdeeda2de437b';
      this.dataAmplifier.publicKey = '03d7c69c5cbc0f63916abfa016841583369369fa70950082a76aa8a126cf7405d0';
      this.dataAmplifier.fullLegalName = this.form.value.fullLegalName;
      this.dataAmplifier.shortName = this.form.value.shortName;
      this.dataAmplifier.status = this.form.value.status;
      this.dataAmplifier.industry = this.form.value.industry;
      this.dataAmplifier.location = this.form.value.location;
      this.dataAmplifier.pricingSource = this.form.value.pricingSource;
      this.dataAmplifier.countryOfLocation = this.form.value.countryOfLocation;
      this.resetForm();
      this.router.navigate(['organisation/list']);
    }
  }

  saveNew(event){
    this.router.navigate(['organisation/list']);
  }
}


