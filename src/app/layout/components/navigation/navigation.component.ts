import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'navigation',
    templateUrl  : './navigation.component.html',
    styleUrls    : ['./navigation.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavigationComponent
{
    @Input() layout = 'vertical';
    @Input() navigation: any;

    constructor()
    {

    }
}
