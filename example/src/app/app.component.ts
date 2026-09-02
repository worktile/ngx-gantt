import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'example-root',
    templateUrl: `./app.component.html`,
    styles: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent {
    @HostBinding(`class.dg-main`) isRoot = true;
    title = 'example';
}
