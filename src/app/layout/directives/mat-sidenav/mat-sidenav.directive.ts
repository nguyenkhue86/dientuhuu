import { Directive, Input, OnInit, HostListener, OnDestroy, HostBinding } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ObservableMedia } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import {MatSidenavHelperService} from './mat-sidenav.service';
import {MatchMediaService} from '../../services/match-media.service';


@Directive({
    selector: '[MatSidenavHelper]'
})
export class MatSidenavHelperDirective implements OnInit, OnDestroy
{
    matchMediaSubscription: Subscription;
    @HostBinding('class.mat-is-locked-open') isLockedOpen = true;
    @Input('MatSidenavHelper') id: string;
    @Input('mat-is-locked-open') matIsLockedOpenBreakpoint: string;

    constructor(
        private matSidenavService: MatSidenavHelperService,
        private matchMedia: MatchMediaService,
        private observableMedia: ObservableMedia,
        private matSidenav: MatSidenav
    )
    {
    }

    ngOnInit()
    {
        this.matSidenavService.setSidenav(this.id, this.matSidenav);

        if ( this.observableMedia.isActive(this.matIsLockedOpenBreakpoint) )
        {
            this.isLockedOpen = true;
            this.matSidenav.mode = 'side';
            this.matSidenav.toggle(true);
        }
        else
        {
            this.isLockedOpen = false;
            this.matSidenav.mode = 'over';
            this.matSidenav.toggle(false);
        }

        this.matchMediaSubscription = this.matchMedia.onMediaChange.subscribe(() => {
            if ( this.observableMedia.isActive(this.matIsLockedOpenBreakpoint) )
            {
                this.isLockedOpen = true;
                this.matSidenav.mode = 'side';
                this.matSidenav.toggle(true);
            }
            else
            {
                this.isLockedOpen = false;
                this.matSidenav.mode = 'over';
                this.matSidenav.toggle(false);
            }
        });
    }

    ngOnDestroy()
    {
        this.matchMediaSubscription.unsubscribe();
    }
}

@Directive({
    selector: '[MatSidenavToggler]'
})
export class MatSidenavTogglerDirective
{
    @Input('MatSidenavToggler') id;

    constructor(private MatSidenavService: MatSidenavHelperService)
    {
    }

    @HostListener('click')
    onClick()
    {
        this.MatSidenavService.getSidenav(this.id).toggle();
    }
}
