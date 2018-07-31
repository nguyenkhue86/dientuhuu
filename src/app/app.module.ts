import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';
import { LayoutModule } from './layout/layout.module';

import { AppComponent } from './app.component';
import { MainModule } from './main/main.module';

import { OrganisationModule } from './main/components/organisation/organisation.module';
import { TradingAccountModule } from './main/components/trading-account/trading-account.module';
import { BondModule } from './main/components/bond/bond.module';
import { QuoteModule } from './main/components/quote/quote.module';
import { OrderModule } from './main/components/order/order.module';
import { BondTransactionModule } from './main/components/bond-transaction/bond-transaction.module';
import { BondTransferModule } from './main/components/bond-transfer/bond-transfer.module';

import { SharedModule } from './layout/shared.module';
import { LayoutConfig } from './layout-config';
import { DashboardModule } from './main/components/dashboard/dashboard.module';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { DashboardDbService } from './mock/dashboard-db.service';

import { MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';

import { StoreModule } from '@ngrx/store';
import { reducer } from './main/reducers/tutorial.reducer';
import { reducerTitle } from './main/reducers/title.reducer';
import { HomeModule } from './main/components/home/home.module';
import { LoginModule } from './main/components/login/login.module';
import { UserModule } from './main/components/user/user.module';


const appRoutes: Routes = [
    {
        path      : '**',
        redirectTo: 'home'
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        TranslateModule.forRoot(),
        LayoutModule.forRoot(LayoutConfig),
        InMemoryWebApiModule.forRoot(DashboardDbService, {
        delay             : 0,
        passThruUnknownUrl: true
      }),
        SharedModule,
        MainModule,

        LoginModule,
        HomeModule,
        UserModule,
        OrganisationModule,
        TradingAccountModule,
        BondModule,
        QuoteModule,
        OrderModule,
        BondTransactionModule,
        BondTransferModule,

        DashboardModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,

        StoreModule.forRoot({
            tutorial: reducer,
            title: reducerTitle
          })
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}