import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'example-root',
    templateUrl: `./app.component.html`,
    styles: [],
    standalone: false
})
export class AppComponent {
    @HostBinding(`class.dg-main`) isRoot = true;
    title = 'example';
}
