---
title: 快速开始
path: 'getting-started'
order: 2
---

## 安装

```bash
$ npm i @worktile/ngx-gantt --save
# or
$ yarn add @worktile/ngx-gantt
```

## 使用

### 导入模块

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

### 组件使用
```html
<ngx-gantt [start]="1514736000" end="1609430400"></ngx-gantt>
```
