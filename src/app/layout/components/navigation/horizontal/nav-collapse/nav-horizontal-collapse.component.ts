import { Component, HostBinding, HostListener, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Animations } from '../../../../animations';
import { ConfigService } from '../../../../services/config.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector   : 'nav-horizontal-collapse',
    templateUrl: './nav-horizontal-collapse.component.html',
    styleUrls  : ['./nav-horizontal-collapse.component.scss'],
    animations : Animations
})
export class NavHorizontalCollapseComponent implements OnDestroy
{
    onConfigChanged: Subscription;
    settings: any;
    isOpen = false;

    @HostBinding('class') classes = 'nav-item nav-collapse';
    @Input() item: any;

    @HostListener('mouseenter')
    open()
    {
        this.isOpen = true;
    }

    @HostListener('mouseleave')
    close()
    {
        this.isOpen = false;
    }

    constructor(
        private config: ConfigService
    )
    {
        this.onConfigChanged =
            this.config.onConfigChanged
                .subscribe(
                    (newSettings) => {
                        this.settings = newSettings;
                    }
                );
    }

    ngOnDestroy()
    {
        this.onConfigChanged.unsubscribe();
    }
}
