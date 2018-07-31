import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';
import {
    MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule,
    MatSidenavModule, MatTableModule, MatTabsModule, MatToolbarModule, MatPaginatorModule, MatSortModule
  } from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {
     MatInputModule,
     MatStepperModule } from '@angular/material';

import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { ListComponent } from './list.component';
import {SharedModule} from '../../../../layout/shared.module';
const routes: Routes = [
    {
        path     : 'amplifier/list',
        component: ListComponent
    }
];

@NgModule({
    declarations: [
        ListComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        CdkTableModule,
        MatPaginatorModule,
        MatSortModule,
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
        MatAutocompleteModule,
        SharedModule,
        MatCardModule
    ],
    entryComponents: []
})
export class ListModule
{
}
