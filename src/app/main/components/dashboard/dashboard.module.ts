import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';
import {
  MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule,
  MatSidenavModule, MatTableModule, MatTabsModule, MatToolbarModule,
} from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardService } from './dashboard.service';
import { DashboardComponent } from './dashboard.component';
import { SharedModule} from '../../../layout/shared.module';
import { WidgetModule} from '../../../layout/components/widget/widget.module';
import { AddChartFormComponent } from './addChart-form/addChart-form.component';


const routes: Routes = [
    {
        path     : 'dashboard',
        component: DashboardComponent,
        resolve  : {
            data: DashboardService
        }
    }
];

@NgModule({
    declarations: [
        DashboardComponent,
        AddChartFormComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        MatToolbarModule,
        CdkTableModule,
        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatSidenavModule,
        MatTableModule,
        MatTabsModule,
        NgxChartsModule,
        SharedModule,
        WidgetModule
    ],
    providers   : [
        DashboardService
    ]
})
export class DashboardModule
{
}

