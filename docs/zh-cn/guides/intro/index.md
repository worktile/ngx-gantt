---
title: 介绍
subtitle: Intro
path: 'intro'
order: 1
---

# 一句话介绍

`ngx-gantt` 是一款基于 Angular 框架的甘特图组件，支持多种视图展示并支持多种高级的特性，能快速的帮助开发者搭建自己的甘特图应用。

# 特性

- 6 种内置视图（时、日、周、月、季、年），并支持自定义视图
- 任务分组展示
- 树形结构数据展示并支持异步加载
- 任务前后置依赖关联及展示
- 任务拖拽更改时间
- 表格自定义
- 滚动加载数据
- 导出为图片
- 可定制化开发

# 动机

2020 年，[PingCode](https://pingcode.com) 准备做一款项目集管理的产品 Plan，Plan 这款产品包含多项目路线图管理，进度管理，资源跟踪以及里程碑管理，其中涉及到路线图，里程碑等功能都需要基于甘特图来实现，随后我们开始调研 Github 中开源的一些甘特图的组件，最终都因为不能满足我们的需求而 pass，其中主要的原因有以下几点：

- 不能很好的支持 Angular
- 有一些功能强大的库依旧依赖 JQuery
- 不支持多层级展示
- 默认支持的视图不满足我们的场景
- 不够灵活

基于上述原因，我们决定自己造轮子，做一款基于 Angular 的甘特图组件。

## 当前版本

[![npm (scoped)](https://img.shields.io/npm/v/@worktile/gantt?style=flat-square)](https://www.npmjs.com/package/@worktile/gantt)

## 支持 Angular 版本

`ngx-gantt` 与 `@angular/core` 保持相同的主版本号，目前支持 Angular ^17.0.0 版本。

## 依赖第三方库

- Components Dev Kit (Angular CDK)
- date-fns
- html2canvas

# 参与贡献

Gantt 目前还处于开发中，欢迎一起参与贡献 https://github.com/worktile/ngx-gantt 。
