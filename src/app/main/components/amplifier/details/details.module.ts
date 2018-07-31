import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule,
    MatSidenavModule, MatTableModule, MatTabsModule, MatToolbarModule,
  } from '@angular/material';
import {
     MatInputModule,
     MatStepperModule } from '@angular/material';

import { DashboardService } from '../../dashboard/dashboard.service';
import { DetailsComponent } from './details.component';
import { SharedModule } from '../../../../layout/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
const routes: Routes = [
    {
        path     : 'amplifier/details/:id',
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
        MatAutocompleteModule
    ],
    providers   : [
        DashboardService
    ]
})
export class DetailsModule
{
}