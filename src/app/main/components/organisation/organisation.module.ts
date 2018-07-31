import { NgModule } from '@angular/core';

import { CaptureModule } from './capture/capture.module';
import { DetailsModule } from './details/details.module';
import { ListModule } from './list/list.module';
import { OrganisationService } from './organisation.service';

@NgModule({
    imports     : [
       CaptureModule,
       DetailsModule,
       ListModule
    ],
    providers: [
        OrganisationService
    ]
})
export class OrganisationModule{}
