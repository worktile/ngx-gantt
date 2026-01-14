module.exports = [
    {
        type: 'component',
        name: 'ngx-gantt-table',
        description: 'Gantt chart left table component',
        properties: [
            {
                name: 'draggable',
                description: `Whether to allow drag sorting in the table`,
                default: false,
                type: 'boolean'
            },
            {
                name: 'maxWidth',
                description: `Maximum table width (pixels)`,
                type: 'number'
            },
            {
                name: 'width',
                description: `Fixed table width (pixels)`,
                type: 'number'
            },
            {
                name: 'dropEnterPredicate',
                description: `Drag enter predicate function to control whether dragging to specified position is allowed`,
                type: '(context: GanttTableDragEnterPredicateContext<T>) => boolean'
            },
            {
                name: 'dragDropped',
                description: `Drag drop completed event`,
                type: 'EventEmitter<GanttTableDragDroppedEvent>'
            },
            {
                name: 'dragStarted',
                description: `Drag start event`,
                type: 'EventEmitter<GanttTableDragStartedEvent>'
            },
            {
                name: 'dragEnded',
                description: `Drag end event`,
                type: 'EventEmitter<GanttTableDragEndedEvent>'
            },
            {
                name: 'columnChanges',
                description: `Column width change event`,
                type: 'EventEmitter<GanttTableEvent>'
            },
            {
                name: 'resizeChange',
                description: `Table resize event`,
                type: 'EventEmitter<number>'
            },
            {
                name: 'itemClick',
                description: `Task item click event`,
                type: 'EventEmitter<GanttTableItemClickEvent>'
            },
            {
                name: '#rowBeforeSlot',
                description: `Row before slot template`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#rowAfterSlot',
                description: `Row after slot template`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#tableEmpty',
                description: `Empty table template`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#tableFooter',
                description: `Table footer template`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#settingsSlot',
                description: `Table settings slot template`,
                type: 'TemplateRef<any>'
            }
        ]
    },
    {
        type: 'component',
        name: 'ngx-gantt-column',
        description: 'Gantt chart table column component',
        properties: [
            {
                name: 'name',
                description: `Column name`,
                type: 'string'
            },
            {
                name: 'width',
                description: `Column width (number or string, e.g. '100px', '20%')`,
                type: 'string | number'
            },
            {
                name: 'showExpandIcon',
                description: `Whether to display expand icon`,
                type: 'boolean'
            },
            {
                name: '#header',
                description: `Column header custom template`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#cell',
                description: `Cell custom template`,
                type: 'TemplateRef<any>'
            }
        ]
    }
];
