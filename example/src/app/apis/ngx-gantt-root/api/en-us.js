module.exports = [
    {
        type: 'component',
        name: 'ngx-gantt-root',
        description: 'Gantt chart root component, used to control the overall layout structure of the Gantt chart',
        properties: [
            {
                name: 'sideWidth',
                description: `Left content area width (pixels)`,
                type: 'number'
            },
            {
                name: '#sideTemplate',
                description: `Left content custom template`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#mainTemplate',
                description: `Right main content custom template`,
                type: 'TemplateRef<any>'
            }
        ]
    }
];
