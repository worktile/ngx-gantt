module.exports = [
    {
        type: 'component',
        name: 'ngx-gantt-bar',
        description: 'Task bar display component, used to display bar type task items',
        properties: [
            {
                name: 'template',
                description: `Task bar custom template`,
                type: 'TemplateRef<any>'
            },
            {
                name: 'item',
                description: `Task item data`,
                type: 'GanttItemInternal'
            },
            {
                name: 'barClick',
                description: `Task bar click event`,
                type: 'EventEmitter<GanttBarClickEvent>'
            }
        ]
    }
];
