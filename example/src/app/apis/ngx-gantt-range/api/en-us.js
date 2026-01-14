module.exports = [
    {
        type: 'component',
        name: 'ngx-gantt-range',
        description: 'Range display component, used to display range type task items',
        properties: [
            {
                name: 'template',
                description: `Range custom template`,
                type: 'TemplateRef<any>'
            },
            {
                name: 'item',
                description: `Task item data (passed via signal)`,
                type: 'GanttItemInternal'
            }
        ]
    }
];
