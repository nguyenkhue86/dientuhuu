import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatMenuModule, MatProgressBarModule, MatToolbarModule } from '@angular/material';
import { ToolbarComponent } from './toolbar.component';
import {SharedModule} from '../../shared.module';




@NgModule({
    declarations: [
        ToolbarComponent
    ],
    imports     : [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatToolbarModule,
        SharedModule,

    ],
    exports     : [
        ToolbarComponent
    ]
})
export class ToolbarModule
{
}
