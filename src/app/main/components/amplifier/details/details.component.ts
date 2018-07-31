import { Component, OnInit } from '@angular/core';

import { Amplifier } from '../../../models/amplifier.model';

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
import { title } from '../amplifier';

import { AmplifierService } from '../amplifier.service';
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
  amplifier: Amplifier;
  amplifierId: string;
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
    private amplifierService: AmplifierService,
  ) {
    this.store.dispatch(new TitleActions.ChangeTitle(title));
    this.amplifierId = this.route.snapshot.paramMap.get('id');
    this.amplifierService.getAmplifierByParamater('id='+this.amplifierId).subscribe(data => {
      this.amplifier = data[0];
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
  }
  setValueForm(){
    this.form.setValue({
      company: [
        {
          value: 'TMA Solutions',
          disabled: true
        }, Validators.required
      ],
      'fullLegalName': this.amplifier.fullLegalName,
      'shortName': this.amplifier.shortName,
      'status': this.amplifier.status,
      'industry': this.amplifier.industry,
      'ticker': 'static ticker',
      'orgId' : this.amplifier.orgId,
      'pricingSource': this.amplifier.pricingSource,
      'location': this.amplifier.location,
      'countryOfLocation': this.amplifier.countryOfLocation,
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
      this.router.navigate(['organisation/list']);
  }
}
