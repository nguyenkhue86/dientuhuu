import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule,
    MatSidenavModule, MatTableModule, MatTabsModule, MatToolbarModule, MatAutocompleteModule, MatDatepickerModule,
  } from '@angular/material';
import {
     MatInputModule,
     MatStepperModule } from '@angular/material';

import { DashboardService } from '../../dashboard/dashboard.service';
import { DetailsComponent } from './details.component';
import { SharedModule } from '../../../../layout/shared.module';

const routes: Routes = [
    {
        path     : 'quote/details/:quoteId',
        component: DetailsComponent
    }
];

@NgModule({
    declarations: [
        DetailsComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        MatToolbarModule,
        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatSidenavModule,
        MatTableModule,
        MatTabsModule,
        MatInputModule,
        MatStepperModule,
        SharedModule,
        MatAutocompleteModule,
        MatDatepickerModule
    ],
    providers   : [
        DashboardService
    ]
})
export class DetailsModule
{
}
