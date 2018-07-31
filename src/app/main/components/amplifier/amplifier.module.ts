import { NgModule } from '@angular/core';

import { CaptureModule } from './capture/capture.module';
import { DetailsModule } from './details/details.module';
import { ListModule } from './list/list.module';
import { AmplifierService } from './amplifier.service';

@NgModule({
    imports     : [
       CaptureModule,
       DetailsModule,
       ListModule
    ],
    providers: [
        AmplifierService
    ]
})
export class AmplifierModule{}
