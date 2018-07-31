import { Component, ElementRef, HostBinding, Inject, OnDestroy, Renderer2, ViewEncapsulation, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { Subscription } from 'rxjs';


import { navigation } from '../layout/components/navigation/navigation';
import { ConfigService } from '../layout/services/config.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    // tslint:disable-next-line:component-selector
    selector     : 'app-main',
    templateUrl  : './main.component.html',
    styleUrls    : ['./main.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnDestroy
{
    onConfigChanged: Subscription;
    Settings: any;
    navigation: any;
    login: boolean;

    @HostBinding('attr.layout-mode') layoutMode;

    constructor(
        private cookieService: CookieService,
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
        private config: ConfigService,
        private platform: Platform,
        @Inject(DOCUMENT) private document: any
    )
    {
        this.onConfigChanged =
            this.config.onConfigChanged
                .subscribe(
                    (newSettings) => {
                        this.Settings = newSettings;
                        this.layoutMode = this.Settings.layout.mode;
                    }
                );

        if ( this.platform.ANDROID || this.platform.IOS )
        {
            this.document.body.className += ' is-mobile';
        }

        this.navigation = navigation;
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
        this.login = this.cookieService.check('user');
    }

    ngOnDestroy()
    {
        this.onConfigChanged.unsubscribe();
    }

    addClass(className: string)
    {
        this._renderer.addClass(this._elementRef.nativeElement, className);
    }

    removeClass(className: string)
    {
        this._renderer.removeClass(this._elementRef.nativeElement, className);
    }
}
