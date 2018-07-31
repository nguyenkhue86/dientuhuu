import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


import { navigation } from '../navigation/navigation';
import {ConfigService} from '../../services/config.service';
import {SidebarService} from '../sidebar/sidebar.service';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Title } from '../../../main/models/title.model';
import { Tutorial } from '../../../main/models/tutorial.model';
import { AppState } from '../../../app.state';


@Component({
    // tslint:disable-next-line:component-selector
    selector   : 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls  : ['./toolbar.component.scss']
})

export class ToolbarComponent implements OnInit
{
    // title: Observable<Tutorial[]>;
    title: Observable<Title[]>;

    userStatusOptions: any[];
    languages: any;
    selectedLanguage: any;
    showLoadingBar: boolean;
    horizontalNav: boolean;
    noNav: boolean;
    navigation: any;

    constructor(
        private router: Router,
        private config: ConfigService,
        private sidebarService: SidebarService,
        private translate: TranslateService,
        private store: Store<AppState>
    )
    {
        // this.title = store.select('tutorial');
        this.title = store.select('title');
        // console.log(this.title.name);
        this.userStatusOptions = [
            {
                'title': 'Online',
                'icon' : 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon' : 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon' : 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];

        this.languages = [
            {
                'id'   : 'en',
                'title': 'English',
                'flag' : 'us'
            },
            {
                'id'   : 'vn',
                'title': 'Vietnamese',
                'flag' : 'vn'
            }
        ];

        this.selectedLanguage = this.languages[0];

        router.events.subscribe(
            (event) => {
                if ( event instanceof NavigationStart )
                {
                    this.showLoadingBar = true;
                }
                if ( event instanceof NavigationEnd )
                {
                    this.showLoadingBar = false;
                }
            });

        this.config.onConfigChanged.subscribe((settings) => {
            this.horizontalNav = settings.layout.navigation === 'top';
            this.noNav = settings.layout.navigation === 'none';
        });

        this.navigation = navigation;
    }

    
    ngOnInit() {
    }

    toggleSidebarOpened(key)
    {
        this.sidebarService.getSidebar(key).toggleOpen();
    }

    search(value)
    {
        // Do your search here...
        console.log(value);
    }

    setLanguage(lang)
    {
        // Set the selected language for toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this.translate.use(lang.id);
    }
    logout(){

    }
}
