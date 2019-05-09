import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import {SharedModule} from '../../ui-core/shared.module';
import {MatIconModule} from '@angular/material';

@NgModule({
  declarations: [NavbarComponent],
  imports: [
    SharedModule,
    MatIconModule
  ],
  exports: [NavbarComponent]
})
export class NavbarModule { }
