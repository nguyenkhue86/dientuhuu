import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { BondUI } from '../../../models/bond.model';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Animations } from '../../../../layout/animations';
import { APPEARANCE, MY_FORMATS_DATE } from '../../content';

import * as moment from 'moment';

import { BondService } from '../bond.service';
import { OrganisationService } from '../../organisation/organisation.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'details-bond',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_DATE },
  ]
})
export class DetailsComponent implements OnInit {
  isin: string;
  appearance: string = APPEARANCE;
  activeEdit: Boolean = false;
  bonds: BondUI;
  form: FormGroup;
  formErrors: any;
  maturityDate: any;
  issueDate: any;
  date: any;
  type: Boolean;

  _isinCusip: string;
  _issuer: string;

  currencys: Array<string> = [
    'AUD', 'USD', 'SGD', 'HKD', 'etc'
  ];

  frequencies: Array<string> = ['Monthly', 'Quarterly', 'Semi-annual', 'Annual', 'etc'];

  orgs: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private bondService: BondService,
    private cookieService: CookieService,
    private organisationService: OrganisationService
  ) {
    this.isin = this.route.snapshot.params.isin;
    this._isinCusip = this.route.snapshot.params.issinCusip;
    this._issuer = this.route.snapshot.params.issuer;
    this.organisationService.getOrganizations().then(org => {
      this.orgs = org;
    });
    this.bondService.getBond('ISIN', this.isin).subscribe(
      data => {
        this.bonds = data[0];
        this.setFormValue();
        this.form.disable();
      }
    );

    this.formErrors = {
      legalName: {},
      shortName: {},
      status: {},
      location: {},
      country: {},
      workZone: {}
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
    this.setFormValue();
    this.form.disable();
    this.activeEdit = !this.activeEdit;
  }

  back() {
    this.router.navigate(['bond/list']);
  }

  amend() {
    this.activeEdit = !this.activeEdit;
    this.form.enable();
  }

  async save() {
    const { ISIN, faceValue, currency, issueDate, couponPaymentDate, maturityDate, type, annualCouponRate, CUSIP, amountOutstanding, benchmark, name } = this.form.value;
    const { Issuer, frequency } = this.form.value;
    const org = await this.organisationService.getOrganisationPromise('fullLegalName', Issuer);
    const formData = {
      data: {
        attributes: {
          ISIN,
          CUSIP,
          orgId: org.orgId,
          name,
          faceValue,
          frequency,
          currency,
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
          action: 'updateBond'
        }
      }
    };
    // console.log(issueDate.add('days', 1));
    if (this.form.valid) {
      this.activeEdit = !this.activeEdit;
      this.bondService.postBond(formData, this.cookieService.get('user')).subscribe(res => {
        if (res.link) {
          this.form.reset();
          this.router.navigate(['bond/list']);
        }
      });
    }
  }

  onSubmit () {
    this.save();
  }

  setFormValue() {
    const { ISIN, CUSIP, organization, faceValue, currency, amountOutstanding, bondType, frequency } = this.bonds;
    const { annualCouponRate, benchmark, name } = this.bonds;
    const closedDate = this.bonds.closedDate.split('/').map(e => parseInt(e, 10));
    const issueDate = this.bonds.issueDate.split('/').map(e => parseInt(e, 10));
    const couponPaymentDate = this.bonds.couponPaymentDate.split('/').map(e => parseInt(e, 10));
    this.form.setValue({
      ISIN,
      CUSIP,
      name: name || '',
      Issuer: organization.fullLegalName || '',
      faceValue,
      currency,
      issueDate: moment().set({
        date: 5,
        month: issueDate[1] - 1,
        year: issueDate[2]
      }),
      maturityDate: moment().set({
        date: closedDate[0],
        month: closedDate[1] - 1,
        year: closedDate[2]
      }),
      amountOutstanding: amountOutstanding || '',
      type: bondType + '',
      frequency: frequency || '',
      couponPaymentDate: moment().set({
        date: couponPaymentDate[0],
        month: couponPaymentDate[1] - 1,
        year: couponPaymentDate[2]
      }),
      annualCouponRate,
      benchmark: benchmark || ''
    });
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

