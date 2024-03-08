---
title: 快速开始
subtitle: Quick Start
path: 'getting-started'
order: 2
---

# 安装

```bash
$ npm i @worktile/gantt --save
# or
$ yarn add @worktile/gantt
```

# 使用

### 导入模块

```ts
import { NgModule } from '@angular/core';
import { NgxGanttModule } from '@worktile/gantt';

@NgModule({
  ...
  imports: [ NgxGanttModule, ... ]
  ...
})
export class AppModule {

}
```

<br/>

### 引入样式

在 angular.json 中引入

```json
{
  "styles": ["node_modules/@worktile/gantt/styles/index.scss"]
}
```

在 style.scss 中引入预构建样式文件

```
@use "@worktile/gantt/styles/index.scss";
```

### 组件中使用

```html
<!-- component.html -->
<ngx-gantt #gantt [items]="items">
  <ngx-gantt-table>
    <ngx-gantt-column name="标题" width="300px">
      <ng-template #cell let-item="item"> {{ item.title }} </ng-template>
    </ngx-gantt-column>
  </ngx-gantt-table>
</ngx-gantt>
```

```javascript
// component.ts
@Component({
  selector: 'app-gantt-example',
  templateUrl: './gantt.component.html'
})
export class AppGanttExampleComponent {
  items: GanttItem[] = [
    { id: '000000', title: 'Task 0', start: 1627729997, end: 1628421197, expandable: true },
    { id: '000001', title: 'Task 1', start: 1617361997, end: 1625483597, links: ['000003', '000004', '000000'], expandable: true },
    { id: '000002', title: 'Task 2', start: 1610536397, end: 1610622797 },
    { id: '000003', title: 'Task 3', start: 1628507597, end: 1633345997, expandable: true }
  ];

  constructor() {}
}
```
