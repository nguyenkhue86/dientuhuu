import { Component, HostBinding, Input } from '@angular/core';
import {TooltipPosition} from '@angular/material';

@Component({
    selector   : 'nav-vertical-item',
    templateUrl: './nav-vertical-item.component.html',
    styleUrls  : ['./nav-vertical-item.component.scss']
})
export class NavVerticalItemComponent
{
    @HostBinding('class') classes = 'nav-item';
    @Input() item: any;

    position: TooltipPosition = 'right';
    constructor()
    {
    }
}
