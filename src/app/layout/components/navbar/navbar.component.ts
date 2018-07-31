import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { navigation } from '../navigation/navigation';
import {PerfectScrollbarDirective} from '../../directives/perfect-scrollbar/perfect-scrollbar.directive';
import {SidebarService} from '../sidebar/sidebar.service';
import {NavigationService} from '../navigation/navigation.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    // tslint:disable-next-line:component-selector
    selector     : 'navbar',
    templateUrl  : './navbar.component.html',
    styleUrls    : ['./navbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit, OnDestroy
{
    private PerfectScrollbar: PerfectScrollbarDirective;


    @ViewChild(PerfectScrollbarDirective) set directive(theDirective: PerfectScrollbarDirective)
    {
        if ( !theDirective )
        {
            return;
        }

        this.PerfectScrollbar = theDirective;

        this.navigationServiceWatcher =
            this.navigationService.onItemCollapseToggled.subscribe(() => {
                this.PerfectScrollbarUpdateTimeout = setTimeout(() => {
                    this.PerfectScrollbar.update();
                }, 310);
            });
    }

    @Input() layout;
    navigation: any;
    navigationServiceWatcher: Subscription;
    PerfectScrollbarUpdateTimeout;
    login: boolean;

    constructor(
        private sidebarService: SidebarService,
        private navigationService: NavigationService,
        private router: Router,
        private cookieService: CookieService
    )
    {
        // Navigation data
        this.navigation = navigation;

        // Default layout
        this.layout = 'vertical';
    }

    ngOnInit()
    {
        this.login = this.cookieService.check('user');
        this.router.events.subscribe(
            (event) => {
                if ( event instanceof NavigationEnd )
                {
                    if ( this.sidebarService.getSidebar('navbar') )
                    {
                        this.sidebarService.getSidebar('navbar').close();
                    }
                }
            }
        );
    }

    ngOnDestroy()
    {
        if ( this.PerfectScrollbarUpdateTimeout )
        {
            clearTimeout(this.PerfectScrollbarUpdateTimeout);
        }

        if ( this.navigationServiceWatcher )
        {
            this.navigationServiceWatcher.unsubscribe();
        }
    }

    toggleSidebarOpened()
    {
        this.sidebarService.getSidebar('navbar').toggleOpen();
    }

    toggleSidebarFolded()
    {
        this.sidebarService.getSidebar('navbar').toggleFold();
    }
}
