import { Component, OnInit } from '@angular/core';
import { mockItems, mockGroups } from './mocks';

@Component({
    selector: 'app-examples-gantt',
    templateUrl: './examples.component.html',
    styleUrls: ['./examples.component.scss'],
})
export class AppExamplesComponent implements OnInit {
    constructor() {}

    items = mockItems;

    groups = mockGroups;

    ngOnInit(): void {}
}
