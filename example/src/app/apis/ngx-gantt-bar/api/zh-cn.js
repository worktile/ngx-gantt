module.exports = [
    {
        type: 'component',
        name: 'ngx-gantt-bar',
        description: '任务条展示组件，用于显示 bar 类型的任务项',
        properties: [
            {
                name: 'template',
                description: `任务条自定义模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: 'item',
                description: `任务项数据`,
                type: 'GanttItemInternal'
            },
            {
                name: 'barClick',
                description: `任务条点击事件`,
                type: 'EventEmitter<GanttBarClickEvent>'
            }
        ]
    }
];
