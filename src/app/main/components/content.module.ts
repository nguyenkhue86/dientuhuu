import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ContentComponent } from './content.component';
import { SharedModule } from '../../layout/shared.module';
import { MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';

@NgModule({
    declarations: [
        ContentComponent
    ],
    imports     : [
        RouterModule,
        SharedModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule
    ],
    exports: [
        ContentComponent
    ]
})
export class ContentModule
{
}
