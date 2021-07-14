# ngx-gantt
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![CircleCI](https://circleci.com/gh/worktile/ngx-gantt.svg?style=shield)](https://circleci.com/gh/worktile/ngx-gantt)
[![Coverage Status][coveralls-image]][coveralls-url]
[![npm (scoped)](https://img.shields.io/npm/v/@worktile/gantt?style=flat)](https://www.npmjs.com/package/@worktile/gantt)
[![npm](https://img.shields.io/npm/dm/@worktile/gantt)](https://www.npmjs.com/package/@worktile/gantt)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@worktile/gantt)

[coveralls-image]: https://coveralls.io/repos/github/worktile/ngx-gantt/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/worktile/ngx-gantt

A modern and powerful gantt component for Angular

## Installation

```bash
$ npm i @worktile/ngx-gantt --save
# or
$ yarn add @worktile/ngx-gantt
```

## Demo

[Try out our live demo][http://gantt.ngnice.com/]

## Usage

### 1. Import the NgxGanttModule to use into your app.module.ts

```ts
import { NgModule } from '@angular/core';
import { NgxGanttModule } from '@worktile/ngx-gantt';

@NgModule({
  ...
  imports: [ NgxGanttModule, ... ]
  ...
})
export class AppModule {

}
```

### 2. Import style file in angular.json or import style in your style.scss

```json
{
  "styles": ["node_modules/@worktile/gantt/main.bundle.scss"]
}
```

```scss
@import '~@worktile/gantt/main.bundle.scss';
```

### 3. Using component

component.html

```html
<ngx-gantt #gantt [items]="items">
  <ngx-gantt-table>
    <ngx-gantt-column name="Title" width="300px">
      <ng-template #cell let-item="item"> {{ item.title }} </ng-template>
    </ngx-gantt-column>
  </ngx-gantt-table>
</ngx-gantt>
```

component.ts

```javascript
@Component({
  selector: 'app-gantt-example',
  templateUrl: './gantt.component.html'
})
export class AppGanttExampleComponent {
  items: GanttItem[] = [
    { id: '000000', title: 'Task 0', start: 1627729997, end: 1628421197 },
    { id: '000001', title: 'Task 1', start: 1617361997, end: 1625483597 }
  ];

  constructor() {}
}
```
See [Getting Started](http://gantt.ngnice.com/guides/getting-started) for more details.

## Development

```bash
$ git clone git@github.com:worktile/ngx-gantt.git
$ cd ngx-gantt
$ npm install
$ npm run start
```

## Roadmap
-   [ ] virtual scrolling

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/walkerkay"><img src="https://avatars.githubusercontent.com/u/15701592?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Walker</b></sub></a><br /><a href="https://github.com/walkerkay/ngx-gantt/commits?author=walkerkay" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
