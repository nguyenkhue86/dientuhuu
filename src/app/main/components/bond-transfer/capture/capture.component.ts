import { Component, OnInit } from '@angular/core';

import { Router } from "@angular/router";

import { DashboardService } from '../../dashboard/dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Animations } from '../../../../layout/animations';
import { APPEARANCE } from '../../content';

@Component({
  selector: 'bond-transfer',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.scss']
})
export class CaptureComponent implements OnInit
{
  appearance: string = APPEARANCE;
  form: FormGroup;
  formErrors: any;
  status:any[] = [
    {"name": "Buy", "value": "buy"},
    {"name": "Sell", "value": "sell"}
  ];

    constructor(
      private formBuilder: FormBuilder,
      private router: Router
    ){
      this.formErrors = {
        fromTradingAccount: {},
        toTradingAccount: {},
        bondInstrument: {},
        quantity: {}
      };
    }

  ngOnInit()
  {
    // Reactive Form ['', Validators.required],
    this.form = this.formBuilder.group({
      company   : [
        {
          value   : 'TMA Solutions',
          disabled: true
        }, Validators.required
      ],
      fromTradingAccount: ['', Validators.required],
      toTradingAccount: ['', Validators.required],
      bondInstrument: ['', Validators.required],
      quantity: ['', Validators.required]
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
  
  save(){
    this.router.navigate(['organisation/list']);
  }

  saveNew(event){
    this.router.navigate(['organisation/list']);
  }
}


