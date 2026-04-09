module.exports = [
    {
        type: 'component',
        name: 'ngx-gantt-table',
        description: '甘特图左侧表格组件',
        properties: [
            {
                name: 'draggable',
                description: `是否允许在表格中拖拽排序`,
                default: false,
                type: 'boolean'
            },
            {
                name: 'maxWidth',
                description: `表格最大宽度（像素）`,
                type: 'number'
            },
            {
                name: 'width',
                description: `表格固定宽度（像素）`,
                type: 'number'
            },
            {
                name: 'dropEnterPredicate',
                description: `拖拽进入判断函数，控制是否允许拖拽到指定位置`,
                type: '(context: GanttTableDragEnterPredicateContext<T>) => boolean'
            },
            {
                name: 'dragDropped',
                description: `拖拽放置完成事件`,
                type: 'EventEmitter<GanttTableDragDroppedEvent>'
            },
            {
                name: 'dragStarted',
                description: `拖拽开始事件`,
                type: 'EventEmitter<GanttTableDragStartedEvent>'
            },
            {
                name: 'dragEnded',
                description: `拖拽结束事件`,
                type: 'EventEmitter<GanttTableDragEndedEvent>'
            },
            {
                name: 'columnChanges',
                description: `列宽变化事件`,
                type: 'EventEmitter<GanttTableEvent>'
            },
            {
                name: 'resizeChange',
                description: `表格尺寸变化事件`,
                type: 'EventEmitter<number>'
            },
            {
                name: 'itemClick',
                description: `任务项点击事件`,
                type: 'EventEmitter<GanttTableItemClickEvent>'
            },
            {
                name: '#rowBeforeSlot',
                description: `行前置插槽模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#rowAfterSlot',
                description: `行后置插槽模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#tableEmpty',
                description: `空表格模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#tableFooter',
                description: `表格底部模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#settingsSlot',
                description: `表格设置插槽模板`,
                type: 'TemplateRef<any>'
            }
        ]
    },
    {
        type: 'component',
        name: 'ngx-gantt-column',
        description: '甘特图表格列组件',
        properties: [
            {
                name: 'name',
                description: `列名称`,
                type: 'string'
            },
            {
                name: 'width',
                description: `列宽度（数字或字符串，如 '100px'、'20%'）`,
                type: 'string | number'
            },
            {
                name: 'showExpandIcon',
                description: `是否显示展开图标`,
                type: 'boolean'
            },
            {
                name: '#header',
                description: `列头自定义模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#cell',
                description: `单元格自定义模板`,
                type: 'TemplateRef<any>'
            }
        ]
    }
];
