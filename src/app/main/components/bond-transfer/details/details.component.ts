import { Component, OnInit } from '@angular/core';

import { BondTransaction } from '../bond-transfer';

import { Router } from "@angular/router";

import { DashboardService } from '../../dashboard/dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Animations } from '../../../../layout/animations';
import { APPEARANCE } from '../../content'; 
@Component({
  selector: 'details-bond-transaction',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit
{
  appearance: string = APPEARANCE; 
  bondTransaction: BondTransaction;
  form: FormGroup;
  formErrors: any;
  status:any[] = [
    {"name": "Active", "value": "active"},
    {"name": "Deactive", "value": "deactive"}
  ];

    constructor(
      private formBuilder: FormBuilder,
      private router: Router
    )
    {
      this.bondTransaction = dataBondTransaction;
      this.formErrors = {
        legalName : {},
        shortName : {},
        status    : {},
        location  : {},
        country   : {},
        workZone  : {}
      };
    }

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
      legalName : ['', Validators.required],
      shortName : ['',[Validators.required, Validators.maxLength(5)]],
      status    : ['', Validators.required],
      location  : ['', Validators.required],
      country   : ['', Validators.required],
      workZone  : ['', Validators.required]
    });

    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });
  }

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
  
  cancel(){
    this.router.navigate(['organisation/list']);
  }
  
  amend(){
    this.router.navigate(['organisation/list']);
  }
}

const dataBondTransaction: BondTransaction = {
  quantity: "100",
  instrument: "SG1V61937297",
  tradeDate: "12/06/2018",
  valueDate: "14/06/2018",
  tradingAccount: "ABTA01",

  price: "1.00",
  grossConsideration: "100.00 SGD",
  settlementConsideration: "100.00 SGD",
  market: "SGX",
  settlementDate: "14/06/2018"
}