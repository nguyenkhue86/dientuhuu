import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material';

import { ContentModule } from './components/content.module';
import { FooterModule } from '../layout/components/footer/footer.module';
import { NavbarModule } from '../layout/components/navbar/navbar.module';
import { QuickPanelModule } from '../layout/components/quick-panel/quick-panel.module';
import { ToolbarModule } from '../layout/components/toolbar/toolbar.module';
import { ToolbarTopModule } from '../layout/components/toolbar-top/toolbar.module';
import { MainComponent } from './main.component';
import { SharedModule } from '../layout/shared.module';
import { SidebarModule } from '../layout/components/sidebar/sidebar.module';
import { NavigationModule } from '../layout/components/navigation/navigation.module';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { LoginModule } from './components/login/login.module';

@NgModule({
    declarations: [
        MainComponent,
    ],
    imports     : [
        RouterModule,
        MatSidenavModule,
        SharedModule,
        NavigationModule,
        SidebarModule,
        ContentModule,
        FooterModule,
        NavbarModule,
        QuickPanelModule,
        ToolbarModule,
        ToolbarTopModule,
        CommonModule,
        LoginModule
    ],
    exports     : [
        MainComponent
    ]
})
export class MainModule
{
}
