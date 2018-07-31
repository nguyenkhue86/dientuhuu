import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector   : 'nav-horizontal-item',
    templateUrl: './nav-horizontal-item.component.html',
    styleUrls  : ['./nav-horizontal-item.component.scss']
})
export class NavHorizontalItemComponent
{
    @HostBinding('class') classes = 'nav-item';
    @Input() item: any;
}
