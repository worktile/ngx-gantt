# ngx-gantt

**语言：** [English](README.md) | **中文**

[![CircleCI](https://circleci.com/gh/worktile/ngx-gantt.svg?style=shield)](https://circleci.com/gh/worktile/ngx-gantt)
[![Coverage Status][coveralls-image]][coveralls-url]
[![npm (scoped)](https://img.shields.io/npm/v/@worktile/gantt?style=flat)](https://www.npmjs.com/package/@worktile/gantt)
[![npm](https://img.shields.io/npm/dm/@worktile/gantt)](https://www.npmjs.com/package/@worktile/gantt)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@worktile/gantt)
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)

[coveralls-image]: https://coveralls.io/repos/github/worktile/ngx-gantt/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/worktile/ngx-gantt

适用于 Angular 的现代甘特图组件，npm 包名为 [`@worktile/gantt`](https://www.npmjs.com/package/@worktile/gantt)。

## 文档

**[在线文档（GitHub Pages）](https://worktile.github.io/ngx-gantt/)** — 使用指南、API 说明与示例。

## 安装

```bash
npm install @worktile/gantt
# 或
yarn add @worktile/gantt
```

**可选：** 若使用导出或打印功能（`GanttPrintService`），请单独安装 [`html2canvas`](https://www.npmjs.com/package/html2canvas)。

```bash
npm install html2canvas
```

## 快速开始

### 环境要求

- Angular **≥ 21**
- Peer 依赖：`@angular/cdk`、`date-fns`、`@date-fns/tz`、`rxjs`

版本与安装命令见 [快速开始](https://worktile.github.io/ngx-gantt/guides/getting-started)。

### 样式

任选一种：

1. **`angular.json`** — 在 `styles` 数组中加入 `node_modules/@worktile/gantt/styles/index.scss`。
2. 全局 SCSS

```scss
@use '@worktile/gantt/styles/index.scss';
```

### 组件

推荐使用 **Standalone** 引入；或在 `NgModule` 中导入 `NgxGanttModule`。

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

## 本地开发

```bash
git clone git@github.com:worktile/ngx-gantt.git
cd ngx-gantt
npm ci
npm run start
```

<h2 id="contributors-">贡献者 ✨</h2>

感谢以下贡献者（[emoji 说明](https://allcontributors.org/docs/en/emoji-key)）：

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

本项目遵循 [all-contributors](https://github.com/all-contributors/all-contributors) 规范，欢迎各种形式的贡献。

## 开源协议

[MIT](https://github.com/worktile/ngx-gantt/blob/master/LICENSE)
