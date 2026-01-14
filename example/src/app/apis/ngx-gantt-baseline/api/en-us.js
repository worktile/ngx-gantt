module.exports = [
    {
        type: 'component',
        name: 'ngx-gantt-baseline',
        description: 'Baseline display component, used to display comparison baseline between planned and actual progress',
        properties: [
            {
                name: 'baselineItem',
                description: `Baseline data item`,
                type: 'GanttBaselineItemInternal'
            },
            {
                name: 'template',
                description: `Baseline custom template`,
                type: 'TemplateRef<any>'
            }
        ]
    }
];
