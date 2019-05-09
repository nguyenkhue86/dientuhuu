import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {SharedModule} from './ui-core/shared.module';
import {NavbarModule} from './layouts/navbar/navbar.module';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: './components/dashboard/dashboard.module#DashboardModule',
    data: {
      moduleName: 'Dashboard'
    }
  },
  {
    path: 'information',
    loadChildren: './components/about/about.module#AboutModule',
    data: {
      moduleName: 'About'
    }
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  }
];
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    SharedModule,
    NavbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
