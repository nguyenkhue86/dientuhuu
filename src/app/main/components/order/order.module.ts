import { NgModule } from '@angular/core';

import { CaptureModule } from './capture/capture.module';
import { DetailsModule } from './details/details.module';
import { ListModule } from './list/list.module';
import { OrderService } from './order.service';
import { TradingAccountService } from '../trading-account/trading-account.service';
import { BondService } from '../bond/bond.service';

@NgModule({
    imports     : [
       CaptureModule,
       DetailsModule,
       ListModule
    ],
    providers   : [
        OrderService,
        BondService,
        TradingAccountService
    ]
})
export class OrderModule{}
