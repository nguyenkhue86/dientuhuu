import { AfterContentInit, Component, ContentChildren, ElementRef, HostBinding,
  QueryList, Renderer2, ViewEncapsulation } from '@angular/core';
import { WidgetToggleDirective } from './widget-toggle.directive';

@Component({
    selector     : 'widget',
    templateUrl  : './widget.component.html',
    styleUrls    : ['./widget.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class WidgetComponent implements AfterContentInit
{
    @HostBinding('class.flipped') flipped = false;
    @ContentChildren(WidgetToggleDirective, {descendants: true}) toggleButtons: QueryList<WidgetToggleDirective>;

    constructor(private el: ElementRef, private renderer: Renderer2)
    {
    }

    ngAfterContentInit()
    {
        setTimeout(() => {

            this.toggleButtons.forEach(flipButton => {
                this.renderer.listen(flipButton.el.nativeElement, 'click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.toggle();
                });
            });
        });
    }

    toggle()
    {
        this.flipped = !this.flipped;
    }

}
