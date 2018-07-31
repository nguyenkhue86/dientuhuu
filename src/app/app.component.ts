import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';



import { locale as navigationEnglish } from './layout/components/navigation/i18n/en';
import { locale as navigatioVietnamese } from './layout/components/navigation/i18n/vn';
import {NavigationService} from './layout/components/navigation/navigation.service';

import {SplashScreenService} from './layout/services/splash-screen.service';
import {TranslationLoaderService} from './layout/services/translation-loader.service';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
    constructor(
        private translate: TranslateService,
        private navigationService: NavigationService,
        private splashScreen: SplashScreenService,
        private translationLoader: TranslationLoaderService
    )
    {
        // Add languages
        this.translate.addLangs(['en', 'vn']);

        // Set the default language
        this.translate.setDefaultLang('en');

        // Set the navigation translations
        this.translationLoader.loadTranslations(navigationEnglish, navigatioVietnamese);

        // Use a language
        this.translate.use('en');
    }
}
