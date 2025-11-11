import { Component, Input, ElementRef, HostBinding, inject } from '@angular/core';
import { icons } from './icons';

@Component({
    selector: 'gantt-icon',
    template: '',
    standalone: true
})
export class GanttIconComponent {
    private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    @HostBinding('class.gantt-icon') isIcon = true;

    @Input() set iconName(name: string) {
        this.setSvg(name);
    }

    constructor() {}

    setSvg(name: string) {
        const iconSvg = icons[name];
        if (iconSvg) {
            this.elementRef.nativeElement.innerHTML = iconSvg;
        } else {
            this.elementRef.nativeElement.innerHTML = '';
        }
    }
}
