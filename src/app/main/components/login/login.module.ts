import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';
import { LoginComponent } from './login.component';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from './alert.service';
import { AuthenticationService } from './authentication.service';

// const routes: Routes = [
//     {
//         path     : 'login',
//         component: LoginComponent
//     }
// ];

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports     : [
        // RouterModule.forChild(routes),
        CdkTableModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports : [
        LoginComponent
    ],
    providers: [ AlertService, AuthenticationService ],

})
export class LoginModule
{
}
