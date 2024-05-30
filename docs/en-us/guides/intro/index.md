---
title: Intro
path: 'intro'
order: 1
---

# Introduction

`ngx-gantt` is a Gantt chart component based on the Angular framework. It supports multiple view displays and multiple advanced features, and can quickly help developers build their own Gantt chart applications.

# Features

- 6 built-in views (hour, day, week, month, quarter, year), and support for custom views
- Task grouping display
- Tree structure data display and support for asynchronous loading
- Task front and back dependency association and display
- Task drag and drop to change time
- Table customization
- Scrolling data loading
- Export as image
- Customizable development

# Motivation

In 2020, [PingCode](https://pingcode.com) is preparing to make a product Plan for project portfolio management. Plan includes multi-project roadmap management, progress management, resource tracking and milestone management. Among them, roadmaps, milestones and other functions need to be implemented based on Gantt charts. Then we began to investigate some open source Gantt chart components in Github, but they were eventually rejected because they could not meet our needs. The main reasons are as follows:

- Cannot support Angular well
- Some powerful libraries still rely on JQuery
- Does not support multi-level display
- The default supported views do not meet our scenarios
- Not flexible enough

Based on the above reasons, we decided to reinvent the wheel and make a Gantt chart component based on Angular.

## Current Version

[![npm (scoped)](https://img.shields.io/npm/v/@worktile/gantt?style=flat-square)](https://www.npmjs.com/package/@worktile/gantt)

## Supported Angular Versions

`ngx-gantt` keeps the same major version number as `@angular/core` and currently supports Angular ^17.0.0 version.

## Third Party Dependencies

- Components Dev Kit (Angular CDK)
- date-fns
- html2canvas

# Contribution

Gantt is still under development, you're welcome to contribute https://github.com/worktile/ngx-gantt.
