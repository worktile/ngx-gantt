module.exports = [
    {
        type: 'component',
        name: 'ngx-gantt-baseline',
        description: '基线展示组件，用于显示计划与实际进度的对比基线',
        properties: [
            {
                name: 'baselineItem',
                description: `基线数据项`,
                type: 'GanttBaselineItemInternal'
            },
            {
                name: 'template',
                description: `基线自定义模板`,
                type: 'TemplateRef<any>'
            }
        ]
    }
];
