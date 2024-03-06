import { Component, Input, ElementRef, HostBinding } from '@angular/core';
import { icons } from './icons';

@Component({
    selector: 'gantt-icon',
    template: '',
    standalone: true
})
export class GanttIconComponent {
    @HostBinding('class.gantt-icon') isIcon = true;

    @Input() set iconName(name: string) {
        this.setSvg(name);
    }

    constructor(private elementRef: ElementRef<HTMLElement>) {}

    setSvg(name: string) {
        const iconSvg = icons[name];
        if (iconSvg) {
            this.elementRef.nativeElement.innerHTML = iconSvg;
        } else {
            this.elementRef.nativeElement.innerHTML = '';
        }
    }
}
