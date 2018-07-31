import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[WidgetToggle]'
})
export class WidgetToggleDirective
{
    constructor(public el: ElementRef)
    {
    }
}
