import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatStepperModule } from '@angular/material';
import {SampleComponent} from './sample.component';
import {SharedModule} from '../../../layout/shared.module';
const routes: Routes = [
    {
        path     : 'sample',
        component: SampleComponent
    }
];

@NgModule({
    declarations: [
        SampleComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        SharedModule
    ]
})
export class SampleModule
{
}
