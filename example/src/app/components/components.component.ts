import { Component, OnInit } from '@angular/core';
import { DocItem } from '@docgeni/template';

@Component({
    selector: 'app-example-components',
    templateUrl: './components.component.html'
})
export class AppExampleComponentsComponent implements OnInit {
    menus: DocItem[] = [
        {
            id: 'basic',
            title: '基本使用',
            subtitle: 'Basic',
            path: 'basic'
        },
        {
            id: 'groups',
            title: '分组展示',
            subtitle: 'Groups',
            path: 'groups'
        },
        {
            id: 'custom-view',
            title: '自定义视图',
            subtitle: 'Custom View',
            path: 'custom-view'
        },
        {
            id: 'advanced',
            title: '高级使用',
            subtitle: 'Advanced',
            path: 'advanced'
        }
    ];

    constructor() {}

    ngOnInit() {}
}
