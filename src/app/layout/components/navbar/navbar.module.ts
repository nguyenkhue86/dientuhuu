import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule, MatIconModule } from '@angular/material';
import { NavbarComponent } from './navbar.component';
import {SharedModule} from '../../shared.module';
import {NavigationModule} from '../navigation/navigation.module';
import { CommonModule } from '@angular/common';



@NgModule({
    declarations: [
        NavbarComponent
    ],
    imports     : [
        RouterModule,

        MatButtonModule,
        MatIconModule,

        SharedModule,
        NavigationModule,
        CommonModule
    ],
    exports     : [
        NavbarComponent
    ]
})
export class NavbarModule
{
}
