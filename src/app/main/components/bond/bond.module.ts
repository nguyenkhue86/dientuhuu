import { NgModule } from '@angular/core';

import { CaptureModule } from './capture/capture.module';
import { ListModule } from './list/list.module';
import { DetailsModule } from './details/details.module';

import { BondService } from './bond.service';
import { OrganisationService } from '../organisation/organisation.service';

@NgModule({
    imports     : [
       CaptureModule,
       ListModule,
       DetailsModule
    ],
    providers   : [
        BondService,
        OrganisationService
    ]
})
export class BondModule{}
