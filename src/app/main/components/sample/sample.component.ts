import {Component, OnInit} from '@angular/core';
import { locale as english } from './i18n/en';
import { locale as vietnamese } from './i18n/vn';
import {TranslationLoaderService} from '../../../layout/services/translation-loader.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector   : 'sample',
    templateUrl: './sample.component.html',
    styleUrls  : ['./sample.component.scss']
})
export class SampleComponent implements OnInit
{

  form: FormGroup;
  formErrors: any;

    constructor(private translationLoader: TranslationLoaderService,
                private formBuilder: FormBuilder)
    {
        this.translationLoader.loadTranslations(english, vietnamese);

      this.formErrors = {
        company   : {},
        firstName : {},
        lastName  : {},
        address   : {},
        address2  : {},
        city      : {},
        state     : {},
        postalCode: {},
        country   : {}
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
      firstName : ['', Validators.required],
      lastName  : ['', Validators.required],
      address   : ['', Validators.required],
      address2  : ['', Validators.required],
      city      : ['', Validators.required],
      state     : ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.maxLength(5)]],
      country   : ['', Validators.required]
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
}

