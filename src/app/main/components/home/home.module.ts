import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';
import { HomeComponent } from './home.component';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';  

const routes: Routes = [
    {
        path     : 'home',
        component: HomeComponent
    }
];

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        CdkTableModule,
        CommonModule
    ],
    providers: [ CookieService ]
})
export class HomeModule
{
}
