import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatMenuModule, MatProgressBarModule, MatToolbarModule,
    MatFormFieldModule,MatInputModule, } from '@angular/material';
import { ToolbarComponent } from './toolbar.component';
import {SharedModule} from '../../shared.module';
import { CommonModule } from '@angular/common';  

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
        MatFormFieldModule,
        MatInputModule,
        CommonModule
    ],
    exports     : [
        ToolbarComponent
    ]
})
export class ToolbarTopModule
{
}
