import { NgModule } from '@angular/core';

import { CaptureModule } from './capture/capture.module';
import { DetailsModule } from './details/details.module';
import { ListModule } from './list/list.module';
import { BondTransactionService } from './bond-transaction.service';

@NgModule({
    imports     : [
       CaptureModule,
       DetailsModule,
       ListModule
    ],
    providers:[ BondTransactionService ]
})
export class BondTransactionModule{}
