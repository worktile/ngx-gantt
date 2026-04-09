# ngx-gantt

**Language:** **English** | [中文](README.zh-CN.md)

[![CircleCI](https://circleci.com/gh/worktile/ngx-gantt.svg?style=shield)](https://circleci.com/gh/worktile/ngx-gantt)
[![Coverage Status][coveralls-image]][coveralls-url]
[![npm (scoped)](https://img.shields.io/npm/v/@worktile/gantt?style=flat)](https://www.npmjs.com/package/@worktile/gantt)
[![npm](https://img.shields.io/npm/dm/@worktile/gantt)](https://www.npmjs.com/package/@worktile/gantt)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@worktile/gantt)
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)

[coveralls-image]: https://coveralls.io/repos/github/worktile/ngx-gantt/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/worktile/ngx-gantt

A modern Gantt chart component for Angular, published as [`@worktile/gantt`](https://www.npmjs.com/package/@worktile/gantt).

## Documentation

**[Documentation (GitHub Pages)](https://worktile.github.io/ngx-gantt/)** — guides, API, and examples.

## Installation

```bash
npm install @worktile/gantt
# or
yarn add @worktile/gantt
```

**Optional:** install [`html2canvas`](https://www.npmjs.com/package/html2canvas) if you use export or print (`GanttPrintService`).

```bash
npm install html2canvas
```

## Quick start

### Requirements

- Angular **≥ 21**
- Peer dependencies: `@angular/cdk`, `date-fns`, `@date-fns/tz`, `rxjs`

See [Getting Started](https://worktile.github.io/ngx-gantt/guides/getting-started) for exact versions and install commands.

### Styles

Pick one:

1. `angular.json` — add `node_modules/@worktile/gantt/styles/index.scss` to the `styles` array.
2. Global SCSS

```scss
@use '@worktile/gantt/styles/index.scss';
```

### Component

Use **standalone** imports (recommended), or import `NgxGanttModule` in your `NgModule`.

```ts
import { Component } from '@angular/core';
import { NgxGanttComponent, NgxGanttTableComponent, NgxGanttTableColumnComponent, GanttItem, GanttViewType } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-example',
  standalone: true,
  imports: [NgxGanttComponent, NgxGanttTableComponent, NgxGanttTableColumnComponent],
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType">
      <ngx-gantt-table>
        <ngx-gantt-column name="Title" width="200px">
          <ng-template #cell let-item="item">{{ item.title }}</ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>
  `
})
export class AppGanttExampleComponent {
  viewType = GanttViewType.day;

  items: GanttItem[] = [
    { id: '1', title: 'Task 0', start: 1627729997, end: 1628421197 },
    { id: '2', title: 'Task 1', start: 1617361997, end: 1625483597 }
  ];
}
```

## Development

```bash
git clone git@github.com:worktile/ngx-gantt.git
cd ngx-gantt
npm ci
npm run start
```

## Contributors ✨

Thanks to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/walkerkay"><img src="https://avatars.githubusercontent.com/u/15701592?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Walker</b></sub></a><br /><a href="#question-walkerkay" title="Answering Questions">💬</a> <a href="https://github.com/walkerkay/ngx-gantt/commits?author=walkerkay" title="Code">💻</a> <a href="#design-walkerkay" title="Design">🎨</a> <a href="https://github.com/walkerkay/ngx-gantt/commits?author=walkerkay" title="Documentation">📖</a> <a href="#infra-walkerkay" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-walkerkay" title="Maintenance">🚧</a> <a href="#projectManagement-walkerkay" title="Project Management">📆</a> <a href="https://github.com/walkerkay/ngx-gantt/pulls?q=is%3Apr+reviewed-by%3Awalkerkay" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/HandsomeButterball"><img src="https://avatars.githubusercontent.com/u/17664721?v=4?s=100" width="100px;" alt=""/><br /><sub><b>zhangwen</b></sub></a><br /><a href="https://github.com/walkerkay/ngx-gantt/commits?author=HandsomeButterball" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/mengshuicmq"><img src="https://avatars.githubusercontent.com/u/13193164?v=4?s=100" width="100px;" alt=""/><br /><sub><b>cmq</b></sub></a><br /><a href="https://github.com/walkerkay/ngx-gantt/commits?author=mengshuicmq" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## License

[MIT](https://github.com/worktile/ngx-gantt/blob/master/LICENSE)
