module.exports = [
    {
        type: 'component',
        name: 'ngx-gantt-range',
        description: '区间展示组件，用于显示 range 类型的任务项',
        properties: [
            {
                name: 'template',
                description: `区间自定义模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: 'item',
                description: `任务项数据（通过 signal 传入）`,
                type: 'GanttItemInternal'
            }
        ]
    }
];
