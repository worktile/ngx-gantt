import { Component, Input, ElementRef, HostBinding, inject, input, effect } from '@angular/core';
import { icons } from './icons';

@Component({
    selector: 'gantt-icon',
    template: ''
})
export class GanttIconComponent {
    private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    @HostBinding('class.gantt-icon') isIcon = true;

    readonly iconName = input<string>();

    constructor() {
        effect(() => {
            this.setSvg(this.iconName());
        });
    }

    setSvg(name: string) {
        const iconSvg = icons[name];
        if (iconSvg) {
            this.elementRef.nativeElement.innerHTML = iconSvg;
        } else {
            this.elementRef.nativeElement.innerHTML = '';
        }
    }
}
