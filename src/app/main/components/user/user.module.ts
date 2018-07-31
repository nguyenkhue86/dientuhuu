import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';
import { UserComponent } from './user.component';

const routes: Routes = [
    {
        path     : 'user',
        component: UserComponent
    }
];

@NgModule({
    declarations: [
        UserComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        CdkTableModule
    ]
})
export class UserModule
{
}
