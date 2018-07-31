import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule,
    MatSidenavModule, MatTableModule, MatTabsModule, MatToolbarModule,
  } from '@angular/material';
import {
     MatInputModule,
     MatStepperModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { DashboardService } from '../../dashboard/dashboard.service';
import { CaptureComponent } from './capture.component';
import { SharedModule } from '../../../../layout/shared.module';

const routes: Routes = [
    {
        path     : 'bond/capture',
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
        MatDatepickerModule,
        MatNativeDateModule,
        MatMomentDateModule,
        MatRadioModule,
        SharedModule
    ],
    providers   : [
        DashboardService
    ]
})
export class CaptureModule
{
}
