import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { DashboardService } from '../../dashboard/dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Animations } from '../../../../layout/animations';
import { APPEARANCE, MY_FORMATS_DATE } from '../../content';
import { BondUI } from '../../../models/bond.model';
import * as moment from 'moment';
import { BondService } from '../bond.service';
import { OrganisationService } from '../../organisation/organisation.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'capture-bond',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_DATE },
  ],
})
export class CaptureComponent implements OnInit {
  appearance: string = APPEARANCE;
  form: FormGroup;
  formErrors: any;
  bonds: BondUI;
  currencys: Array<string> = [
    'AUD', 'USD', 'SGD', 'HKD', 'etc'
  ];
  frequencies: Array<string> = ['Monthly', 'Quarterly', 'Semi-annual', 'Annual', 'etc'];
  orgs: any[] = [];
  radioValue: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private bondService: BondService,
    private cookieService: CookieService,
    private organisationService: OrganisationService
  ) {
    this.organisationService.getOrganizations().then(org => {
      this.orgs = org;
    });
    this.formErrors = {
      cusip: {},
      isin: {},
      issuer: {},
      faceValue: {},
      currency: {},
      firstSettleDate: {},
      maturityDate: {},
      amountOutstanding: {},
      type: {},
      frequency: {},
      firstDate: {},
      rate: {},
      benchmark: {}
    };
  }

  ngOnInit() {
    this.createForm();
    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });
  }

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

  cancel() {
    this.router.navigate(['bond/list']);
  }

  async save() {
    const { ISIN, faceValue, currency, issueDate, couponPaymentDate, maturityDate, type, annualCouponRate, CUSIP, amountOutstanding, benchmark } = this.form.value;
    const { Issuer, frequency, name } = this.form.value;
    const org = await this.organisationService.getOrganisationPromise('fullLegalName', Issuer);
    const formData = {
      data: {
        attributes: {
          ISIN,
          CUSIP,
          name: name || '',
          orgId: org.orgId,
          faceValue,
          currency,
          frequency,
          issueDate: moment(issueDate).format('DD/MM/YYYY'),
          closedDate: moment(maturityDate).format('DD/MM/YYYY'),
          couponPaymentDate: moment(couponPaymentDate).format('DD/MM/YYYY'),
          bondType: parseInt(type, 10),
          annualCouponRate: parseFloat(annualCouponRate),
          amountOutstanding,
          benchmark,
          status: 'Active',
          privateKey: '2a24d6e0b60d160f885f9dd022149ec7ad6c0507bdf4cd1d534635bb2aebcac7',
          publicKey: '03d7c69c5cbc0f63916abfa016841583369369fa70950082a76aa8a126cf7405d0',
          action: 'createBond'
        }
      }
    };
    if (this.form.valid) {
      this.bondService.postBond(formData, this.cookieService.get('user')).subscribe(res => {
        if (res.link){
          this.form.reset();
          this.router.navigate(['bond/list']);
        }
      });
    }
  }

  async onSubmit() {
    this.save();
  }

  saveNew(event) {
    this.router.navigate(['bond/list']);
  }

  createForm() {
    this.form = this.formBuilder.group({
      ISIN: ['', [Validators.required, Validators.maxLength(12), Validators.minLength(12)]],
      CUSIP: ['', [Validators.required, Validators.maxLength(9), Validators.minLength(9)]],
      name: ['', Validators.required],
      Issuer: ['', Validators.required],
      faceValue: ['', [Validators.required, Validators.pattern('^-?[0-9]+$')]],
      currency: ['', Validators.required],
      issueDate: ['', Validators.required],
      maturityDate: ['', Validators.required],
      amountOutstanding: ['', Validators.pattern('^-?[0-9]+$')],
      type: ['', Validators.required],
      frequency: ['', Validators.required],
      couponPaymentDate: ['', Validators.required],
      annualCouponRate: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$')]],
      benchmark: ['', Validators.pattern('^-?[0-9]+$')]
    });
  }
}


