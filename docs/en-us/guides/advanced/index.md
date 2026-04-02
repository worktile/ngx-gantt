---
title: Advanced Customization
path: 'advanced'
order: 500
---

ngx-gantt provides deep customization capabilities, supporting custom views and fully custom layouts. It fits scenarios where you need special time granularity or fully custom rendering logic.

## Chapter List

- [Custom Views](guides/advanced/custom-views) - Extend the `GanttView` abstract class to create a custom time-granularity view
- [Advanced Layout](guides/advanced/advanced-layout) - Use `ngx-gantt-root` to fully customize layout and rendering logic

## Use Cases

Advanced customization is suitable for the following scenarios:

- **Custom Views**: You need special time granularity or tick display (e.g., a biweekly view or a custom workday view)
- **Advanced Layout**: You only want to rely on ngx-gantt's view abilities, and you need a fully customized layout and rendering logic

## Recommended Approach

> **⚠️ Important**: Advanced customization requires a deep understanding of ngx-gantt's internal implementation and has higher requirements for users. We recommend using it after you fully understand the core concepts and data structures.

- **Custom Views**: You need to understand the view system, tick calculation, and formatting strategies
- **Advanced Layout**: You need to read the source code and be familiar with the properties and methods provided by `GanttUpper`
