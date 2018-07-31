import { Component, OnInit } from '@angular/core';

import { TradingAccount } from '../../../models/trading-account.model';

import { Router, ActivatedRoute } from "@angular/router";

import { DashboardService } from '../../dashboard/dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Animations } from '../../../../layout/animations';
import { APPEARANCE } from '../../content';
import { map, startWith } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { Title } from '../../../models/title.model'
import * as TitleActions from '../../../actions/title.actions';
import { Observable } from 'rxjs/Observable';
import { title } from '../trading-account';
import { TradingAccountService } from '../trading-account.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'details-trading-account',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit
{
  appearance: string = APPEARANCE;
  tradingAccount: TradingAccount;
  disableForm:Boolean=true;
  form: FormGroup;
  formErrors: any;
  accountId:string;
  filteredOptionsLocation: Observable<string[]>;
  filteredOptionsCountry: Observable<string[]>;
  filteredOptionsBranch: any = [];
  accountStatus: any[] = [
    { "name": "active", "value": "active" },
    { "name": "deactive", "value": "deactive" }
  ];
  type: any[] = [
    { "name": "Broker", "value": "Broker" },
    { "name": "Client", "value": "Client" }
  ]
  optionsLocation: any[];
  optionsCountry: any[];

    constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private route: ActivatedRoute,
      private store: Store<AppState>,
      private tradingAccountService:TradingAccountService,
      private cookieService: CookieService
    ){
      this.store.dispatch(new TitleActions.ChangeTitle(title) );
      this.accountId = this.route.snapshot.paramMap.get('accountId');
      this.tradingAccountService.getTradingAccount("accountId",this.accountId).subscribe(data=>{
        this.tradingAccount=data[0];
        this.form.disable();
        this.setValueForm();
        this.searchBranch("");
        this.searchLocation("");
        this.searchCountry("");
      });

      this.formErrors = {
        accountName : {},
        accountCode : {},
        accountType    : {},
        status   : {},
      };
      
    }
    setValueForm(){
      this.form.patchValue({
        'accountName': this.tradingAccount.accountName,
        'accountCode': this.tradingAccount.accountCode,
        'accountType': this.tradingAccount.accountType,
        'branchId': this.tradingAccount.branchId,
        'location' : this.tradingAccount.location,
        'countryOfLocation': this.tradingAccount.countryOfLocation,
        'status': this.tradingAccount.status
      });
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
      accountName : ['', Validators.required],
      accountCode : ['',Validators.required],
      accountType : ['', Validators.required],
      branchId  : [''],
      status  : ['', Validators.required],
      location   : [''],
      countryOfLocation  : ['']
    });

    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });
  }
  //function seacrh---------------------------------------------------------------------
  searchBranch(value: string) {
    const filterValue = value.toLowerCase();
    if (value == "") {
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
    if (value == "") {
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
    if (value == "") {
      this.tradingAccountService.getCountry().subscribe(
        data => {
          this.filteredOptionsCountry = data;
        });
    } else {
      this.tradingAccountService.getCountry().subscribe(
        data => {
          this.filteredOptionsCountry = data.filter(d => d.name.toLowerCase().indexOf(filterValue) === 0);
        });
    }
  }
   //define DisplayWith-------------------------------------------------------------------------
   displayBranch(branch) {
      if (branch != '') {
        return branch;
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
    this.router.navigate(['trading-account/list']);
  }

  cancelEditForm(){
    this.setValueForm();
    this.form.disable();
    this.disableForm = true;
  }

  amend(){
    this.form.enable();
    this.disableForm=false;
  }

  save() {
    if (this.form.valid) {
      this.tradingAccount.action = "updateTradingAccount";
      this.tradingAccount.accountName = this.form.value.accountName;
      this.tradingAccount.accountType = this.form.value.accountType;
      this.tradingAccount.accountCode = this.form.value.accountCode;
      this.tradingAccount.branchId = this.form.value.branchId;
      this.tradingAccount.location = this.form.value.location;
      this.tradingAccount.countryOfLocation = this.form.value.countryOfLocation;
      this.tradingAccount.status = this.form.value.status;
      this.tradingAccountService.postTradingAccount(this.tradingAccount,this.cookieService.get('user'));
      this.form.disable();
      this.disableForm=true;
    }
  }
}

const dataTradingAccount: TradingAccount = {
  accountId : '',
  accountName: '',
  accountCode: '',
  accountType: '',
  branchId: '',
  status: '',
  location: '',
  countryOfLocation: '',
  action: '',
  privateKey: 'b6df148cd7691befa6d20d3c278fa49fa0ca62306338e884ba0cdeeda2de437b',
  publicKey: '03d7c69c5cbc0f63916abfa016841583369369fa70950082a76aa8a126cf7405d0'
};
