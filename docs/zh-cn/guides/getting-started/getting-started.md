---
title: 快速开始
path: 'getting-started'
order: 110
---

本指南将帮助您在几分钟内开始使用 ngx-gantt。

## 📦 安装依赖

使用 npm 或 yarn 安装核心包：

```bash
npm install @worktile/gantt --save
# 或
yarn add @worktile/gantt
```

ngx-gantt 需要以下 **peerDependencies**，请确保已安装：

- `@angular/common` >= 21.0.0
- `@angular/core` >= 21.0.0
- `@angular/cdk` >= 21.0.0
- `rxjs` ^6.5.0 || ^7.0.0
- `date-fns` >= 4.0.0
- `@date-fns/tz` >= 1.0.0

如果尚未安装，请运行：

```bash
npm install @angular/cdk date-fns @date-fns/tz --save
```

## 🎨 样式引入

ngx-gantt 需要引入样式文件才能正常显示。有两种方式：

### 方式一：在 angular.json 中配置（推荐）

在 `angular.json` 的 `styles` 数组中添加：

```json
{
  "styles": ["node_modules/@worktile/gantt/styles/index.scss"]
}
```

### 方式二：在 SCSS 文件中引入

在您的全局样式文件（如 `styles.scss`）中：

```scss
@use '@worktile/gantt/styles/index.scss';
```

> **💡 提示**：如果使用 `@use` 语法，确保您的项目支持 Sass（Dart Sass）。

## 📥 导入组件

ngx-gantt 支持两种导入方式：**Standalone** 和 **NgModule**。

### Standalone 方式（推荐）

Standalone 是 Angular 目前推荐的现代导入方式

```typescript
import { Component } from '@angular/core';
import { NgxGanttComponent, NgxGanttTableComponent, NgxGanttTableColumnComponent, GanttItem, GanttViewType } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-example',
  standalone: true,
  imports: [NgxGanttComponent, NgxGanttTableComponent, NgxGanttTableColumnComponent],
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType">
      <ngx-gantt-table>
        <ngx-gantt-column name="任务名称" width="200px">
          <ng-template #cell let-item="item">
            {{ item.title }}
          </ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>
  `
})
export class GanttExampleComponent {
  viewType = GanttViewType.day;

  items: GanttItem[] = [
    {
      id: '1',
      title: '设计阶段',
      start: 1627729997, // Unix 时间戳（秒）
      end: 1628421197
    },
    {
      id: '2',
      title: '开发阶段',
      start: 1628507597,
      end: 1633345997
    },
    {
      id: '3',
      title: '测试阶段',
      start: 1633433997,
      end: 1636035597
    }
  ];
}
```

### NgModule 方式

如果您仍在使用传统的 NgModule 架构：

```typescript
import { NgModule } from '@angular/core';
import { NgxGanttModule } from '@worktile/gantt';

@NgModule({
  imports: [
    NgxGanttModule
    // ... 其他模块
  ]
  // ...
})
export class AppModule {}
```

## 🚀 Hello World

下面是一个完整的甘特图示例，包含组件类和模板：

### 完整示例

```typescript
import { Component } from '@angular/core';
import { NgxGanttComponent, NgxGanttTableComponent, NgxGanttTableColumnComponent, GanttItem, GanttViewType } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-example',
  standalone: true,
  imports: [NgxGanttComponent, NgxGanttTableComponent, NgxGanttTableColumnComponent],
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType">
      <ngx-gantt-table>
        <ngx-gantt-column name="任务名称" width="200px">
          <ng-template #cell let-item="item">
            {{ item.title }}
          </ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>
  `
})
export class GanttExampleComponent {
  viewType = GanttViewType.day;

  items: GanttItem[] = [
    {
      id: '1',
      title: '设计阶段',
      start: 1627729997,
      end: 1628421197
    },
    {
      id: '2',
      title: '开发阶段',
      start: 1628507597,
      end: 1633345997
    },
    {
      id: '3',
      title: '测试阶段',
      start: 1633433997,
      end: 1636035597
    }
  ];
}
```

### 关键概念

| 概念               | 说明                                                                |
| ------------------ | ------------------------------------------------------------------- |
| `items`            | 任务数据数组，每个任务至少需要 `id`、`title`、`start` 或 `end` 属性 |
| `viewType`         | 视图类型，支持 `hour`、`day`、`week`、`month`、`quarter`、`year`    |
| `ngx-gantt-table`  | 表格组件，用于显示任务列表                                          |
| `ngx-gantt-column` | 表格列定义，通过 `#cell` 模板自定义单元格内容                       |

### 时间格式

`start` 和 `end` 支持以下格式：

- **Unix 时间戳（秒）**：`1627729997`（推荐）
- **Date 对象**：`new Date(1627729997 * 1000)`
- **GanttDate 对象**：`new GanttDate(1627729997)`

> **💡 提示**：如果只提供 `start` 或 `end`，组件会自动计算默认宽度。

## ✅ 验证安装

运行应用后，您应该能看到一个包含三个任务的甘特图。如果遇到问题，请查看下方的常见问题部分。

## 📚 下一步

现在您已经成功运行了第一个甘特图！接下来可以：

- 📖 [数据模型](../core/data-model.md) - 学习 GanttItem 和 GanttGroup 的结构
- ⏰ [时间与时区](../core/date-timezone.md) - 理解时间处理和时区配置
- 🎨 [功能指南](../features/index.md) - 了解任务拖拽、依赖链接等高级功能
- 🎯 [完整示例](https://github.com/worktile/ngx-gantt/tree/master/example/src/app/gantt) - 参考更多实际使用场景

## ❓ 常见问题

### 样式未生效？

- 确保已正确引入样式文件
- 检查浏览器控制台是否有样式加载错误
- 确认使用的是 Sass（Dart Sass）而不是 Node Sass

### 时间显示不正确？

- 检查时间格式是否正确，确保使用 Unix 时间戳（秒）或 Date 对象
- 查看 [时间与时区](../core/date-timezone.md) 了解更多
- 确认时区配置是否正确

### 组件未显示？

- 检查是否正确导入了组件
- 确认 `items` 数组不为空
- 查看浏览器控制台是否有错误信息
- 确认样式文件已正确引入

### 导入错误？

- 确认已安装所有 peer dependencies
- 检查 Angular 版本是否符合要求（>= 21.0.0）
- 确认使用的是 Standalone 或 NgModule 方式之一

<!-- ## 🔗 相关链接

- [核心概念](../core/index.md) - 深入理解数据模型、时间、视图和性能
- [功能指南](../features/index.md) - 详细的功能使用说明
- [配置与样式](../configuration/index.md) - 全局配置、主题化和国际化
- [GitHub 仓库](https://github.com/worktile/ngx-gantt) - 查看源码和提交 Issue -->
