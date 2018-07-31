import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CONFIG, ConfigService } from './services/config.service';
import { MatchMediaService } from './services/match-media.service';
import { MatSidenavHelperService } from './directives/mat-sidenav/mat-sidenav.service';
import { NavigationService } from './components/navigation/navigation.service';
import { SidebarService } from './components/sidebar/sidebar.service';
import { SplashScreenService } from './services/splash-screen.service';
import { TranslationLoaderService } from './services/translation-loader.service';

@NgModule({
    entryComponents: [],
    providers      : [
        ConfigService,
        MatchMediaService,
        MatSidenavHelperService,
        NavigationService,
        SidebarService,
        SplashScreenService,
        TranslationLoaderService
    ]
})
export class LayoutModule
{
    constructor(@Optional() @SkipSelf() parentModule: LayoutModule)
    {
        if ( parentModule )
        {
            throw new Error('LayoutModule is already loaded. Import it in the AppModule only!');
        }
    }

    static forRoot(config): ModuleWithProviders
    {
        return {
            ngModule : LayoutModule,
            providers: [
                {
                    provide : CONFIG,
                    useValue: config
                }
            ]
        };
    }
}
