import { NgModule } from '@angular/core';

import { CaptureModule } from './capture/capture.module';
import { DetailsModule } from './details/details.module';
import { ListModule } from './list/list.module';

@NgModule({
    imports     : [
        CaptureModule,
    //    DetailsModule,
    //    ListModule
    ]
})
export class BondTransferModule{}
