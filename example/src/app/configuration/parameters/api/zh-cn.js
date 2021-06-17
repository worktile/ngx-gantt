module.exports = [
    {
        type: 'component',
        name: 'ngx-gantt',
        description: '',
        properties: [
            {
                name: 'items',
                description: `设置数据项，如果单独设置items则会以列表形式展示，如果需要分组展示，则需要设置属性groupId对应分组数据`,
                type: 'GanttItem[]'
            },
            {
                name: 'groups',
                description: `设置分组数据`,
                type: 'GanttGroup[]'
            },
            {
                name: 'viewType',
                description: `设置视图类型`,
                type: `day | month | quarter`,
                default: 'month'
            },
            {
                name: 'start',
                description: `设置甘特图开始时间，格式为10位时间戳`,
                type: 'number'
            },
            {
                name: 'end',
                description: `设置甘特图结束时间，格式为10位时间戳`,
                type: 'number'
            },
            {
                name: 'draggable',
                description: `设置是否可拖拽`,
                type: 'boolean',
                default: 'false'
            },

            {
                name: 'linkable',
                description: `设置是否可连接关联关系`,
                type: 'boolean',
                default: 'false'
            },

            {
                name: 'maxLevel',
                description: `设置最大展示层级`,
                type: 'number',
                default: 2
            },

            {
                name: 'async',
                description: `设置是否开始异步`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'childrenResolve',
                description: `设置异步数据源返回函数，返回值为 Observable 数据流`,
                type: 'Function'
            },

            {
                name: 'styles',
                description: `配置内置的样式选项`,
                type: 'GanttStyles'
            },
            {
                name: 'viewOptions',
                description: `配置视图选项`,
                type: 'GanttViewOptions'
            },
            {
                name: 'disabledLoadOnScroll',
                description: `设置是否禁用滚动加载`,
                type: 'boolean',
                default: false
            },
            {
                name: 'loadOnScroll',
                description: `滚动加载事件`,
                type: 'EventEmitter<GanttLoadOnScrollEvent>'
            },
            {
                name: 'dragStarted',
                description: `拖拽开始后事件`,
                type: 'EventEmitter<GanttDragEvent>'
            },
            {
                name: 'dragEnded',
                description: `拖拽结束后事件`,
                type: 'EventEmitter<GanttDragEvent>'
            },
            {
                name: 'linkDragStarted',
                description: `关联关系拖拽开始后事件`,
                type: 'EventEmitter<GanttLinkDragEvent>'
            },
            {
                name: 'linkDragEnded',
                description: `关联关系拖拽结束后事件`,
                type: 'EventEmitter<GanttLinkDragEvent>'
            },
            {
                name: 'barClick',
                description: `右侧时间条点击事件`,
                type: 'EventEmitter<GanttBarClickEvent>'
            },
            {
                name: 'lineClick',
                description: `关联关系线点击时间`,
                type: 'EventEmitter<GanttLinkDragEvent>'
            },
            {
                name: '#group',
                description: `设置分组显示模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#bar',
                description: `设置时间条显示模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#groupHeader',
                description: `设置分组头部显示模板`,
                type: 'TemplateRef<any>'
            }
        ]
    },
    {
        type: 'component',
        name: 'ngx-gantt-table',
        description: '甘特图左侧表格',
        properties: [
            {
                name: 'columnChanges',
                description: `列宽变化事件集`,
                type: 'EventEmitter<GanttTableEvent>'
            }
        ]
    },
    {
        type: 'component',
        name: 'ngx-gantt-column',
        description: '甘特图左侧列',
        properties: [
            {
                name: 'name',
                description: `设置列名称`,
                type: 'string'
            },
            {
                name: 'width',
                description: `设置列宽`,
                type: 'string ｜ number'
            },
            {
                name: '#header',
                description: `设置每列头部模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#cell',
                description: `设置每列内容模板`,
                type: 'TemplateRef<any>'
            }
        ]
    },
    // {
    //     type: 'class',
    //     name: 'GanttItem',
    //     description: '数据项格式定义',
    //     properties: [
    //         {
    //             name: 'id',
    //             description: `唯一标识`,
    //             type: 'string'
    //         },
    //         {
    //             name: 'title',
    //             description: `名称`,
    //             type: 'string'
    //         },
    //         {
    //             name: 'start',
    //             description: `开始时间`,
    //             type: 'number'
    //         },
    //         {
    //             name: 'end',
    //             description: `截止时间`,
    //             type: 'number'
    //         },
    //         {
    //             name: 'group_id',
    //             description: `对应分组的Id`,
    //             type: 'string'
    //         },
    //         {
    //             name: 'links',
    //             description: `关联数据项Ids`,
    //             type: 'string[]'
    //         },
    //         {
    //             name: 'color',
    //             description: `设置颜色`,
    //             type: 'string'
    //         },
    //         {
    //             name: 'draggable',
    //             description: `设置是否可拖拽`,
    //             type: 'boolean'
    //         },
    //         {
    //             name: 'linkable',
    //             description: `设置是否可关联/被关联`,
    //             type: 'boolean'
    //         },
    //         {
    //             name: 'expand',
    //             description: `设置是否展开`,
    //             type: 'boolean',
    //             default: 'false'
    //         },
    //         {
    //             name: 'children',
    //             description: `设置子数据`,
    //             type: 'GanttItem[]',
    //             default: ''
    //         },
    //         {
    //             name: 'origin',
    //             description: `设置原始数据`,
    //             type: 'T',
    //             default: ''
    //         },
    //         {
    //             name: 'type',
    //             description: `数据展示方式（区间展示和普通展示）`,
    //             type: 'GanttItemType',
    //             default: ''
    //         },
    //         {
    //             name: 'progress',
    //             description: `进度`,
    //             type: 'number',
    //             default: ''
    //         }
    //     ]
    // },
    // {
    //     type: 'class',
    //     name: 'GanttGroup',
    //     description: '分组数据格式定义',
    //     properties: [
    //         {
    //             name: 'id',
    //             description: `唯一标识`,
    //             type: 'string'
    //         },
    //         {
    //             name: 'title',
    //             description: `名称`,
    //             type: 'string'
    //         },
    //         {
    //             name: 'expand',
    //             description: `设置是否展开`,
    //             type: 'boolean',
    //             default: 'true'
    //         },
    //         {
    //             name: 'origin',
    //             description: `设置原始数据`,
    //             type: 'T',
    //             default: ''
    //         }
    //     ]
    // }
];
