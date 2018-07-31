import { Component, OnInit } from '@angular/core';

import { BondTransaction } from '../bond-transaction';

import { Router,ActivatedRoute } from "@angular/router";

import { DashboardService } from '../../dashboard/dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Animations } from '../../../../layout/animations';
import { APPEARANCE } from '../../content'; 
import { BondTransactionService } from '../bond-transaction.service';
@Component({
  selector: 'details-bond-transaction',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit
{
  appearance: string = APPEARANCE; 
  transactionId:string;
  bondTransaction: any;
  form: FormGroup;
  formErrors: any;
  status:any[] = [
    {"name": "Active", "value": "active"},
    {"name": "Deactive", "value": "deactive"}
  ];

    constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private route: ActivatedRoute,
      private bondTransactionService: BondTransactionService
    )
    {
      this.transactionId = this.route.snapshot.paramMap.get('transactionId');
      this.bondTransactionService.getBondTransaction(this.transactionId).subscribe(data=>{
        this.bondTransaction = data[0];
        this.setFormValue();
        this.form.disable();
        console.log(data[0]);
      }
      )
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
      quantity : ['', Validators.required],
      bondInstrument : ['',Validators.required],
      tradeDate    : ['', Validators.required],
      valueDate  : ['', Validators.required],
      ourTradingAccount   : ['', Validators.required],
      price  : ['', Validators.required],
      grossConsideration    : ['', Validators.required],
      settlementConsideration  : ['', Validators.required],
      market   : ['', Validators.required],
      settlementDate  : ['', Validators.required]
    });

    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });
  }

  setFormValue(){
    this.form.patchValue({
      quantity : this.bondTransaction.quantity,
      bondInstrument : this.bondTransaction.ISIN,
      tradeDate    : this.bondTransaction.tradeDate,
      valueDate  : this.bondTransaction.valueDate,
      ourTradingAccount   : this.bondTransaction.ourTradingAccount?this.bondTransaction.ourTradingAccount.accountName:"",
      price  : this.bondTransaction.price,
      grossConsideration    : "N/A",
      settlementConsideration  : "N/A",
      market   : this.bondTransaction.market,
      settlementDate  : this.bondTransaction.settlementDate
    })
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
  
  refresh(){
    //this.router.navigate(['organisation/list']);
  }
  
  view(){
    //this.router.navigate(['organisation/list']);
  }
}

const dataBondTransaction: BondTransaction = {
  orderId:'',
  quoteId:'',
  quantity: 0,
  price: 0,
  ISIN: '',
  tradeDate: '',
  valueDate: '',
  theirTradingAccount: '',
  ourAccountId:'',
  
  transactionStatus: '',
  transactionType: '',
  market: '',
  settlementDate: '',

  privateKey: '',
  publicKey: '',
  action:''
}