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
import { CaptureComponent } from './capture.component';
import { SharedModule } from '../../../../layout/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    {
        path     : 'organisation/capture',
        component: CaptureComponent
    }
];

@NgModule({
    declarations: [
        CaptureComponent
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
        ReactiveFormsModule,
        FormsModule,
        MatAutocompleteModule
    ],
    providers   : [
        DashboardService
    ]
})
export class CaptureModule
{
}
