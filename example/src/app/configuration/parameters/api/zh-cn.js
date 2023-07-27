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
                name: 'baselineItems',
                description: `设置基线对比数据`,
                type: 'GanttBaselineItem[]'
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
                name: 'virtualScrollEnabled',
                description: `设置是否使用虚拟滚动功能`,
                type: 'boolean',
                default: 'true'
            },
            {
                name: 'linkable',
                description: `设置是否可连接关联关系`,
                type: 'boolean',
                default: 'false'
            },

            {
                name: 'loading',
                description: `是否展示加载器`,
                type: 'boolean',
                default: 'false'
            },

            {
                name: 'loadingDelay',
                description: '设置在多少`毫秒`内,忽略加载器展示',
                type: 'number',
                default: '0'
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
                name: 'selectable',
                description: `设置是否启动选择整行`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'multiple',
                description: `设置选择整行是否为多选模式`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'showToolbar',
                description: `设置是否展示工具栏`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'toolbarOptions',
                description: `工具栏配置项`,
                type: 'GanttToolbarOptions',
                default: `{
                    viewTypes: [GanttViewType.day, GanttViewType.month, GanttViewType.year]
                }`
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
                name: 'selectedChange',
                description: `选择数据项事件`,
                type: 'EventEmitter<GanttSelectedEvent>'
            },
            {
                name: 'virtualScrolledIndexChange',
                description: `虚拟滚动视口中可见的第一个元素的索引发生变化事件`,
                type: 'EventEmitter<GanttVirtualScrolledIndexChangeEvent>'
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
            },
            {
                name: '#toolbar',
                description: `工具栏自定义模版`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#tableFooter',
                description: `设置底部模板`,
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
                name: 'draggable',
                description: `设置表格数据项是否支持上下拖动排序`,
                default: false,
                type: 'boolean'
            },
            {
                name: 'dropEnterPredicate',
                description: `该函数用于判断是否允许某个数据项拖到其他项`,
                type: '(context: GanttTableDragEnterPredicateContext<T>) => boolean'
            },
            {
                name: 'dragDropped',
                description: `当把一个数据项拖动到另一个数据项时就会触发`,
                type: 'EventEmitter<GanttTableDragDroppedEvent>'
            },
            {
                name: 'dragStarted',
                description: `拖拽开始后事件`,
                type: 'EventEmitter<GanttTableDragStartedEvent>'
            },
            {
                name: 'dragEnded',
                description: `拖拽结束后事件`,
                type: 'EventEmitter<GanttTableDragEndedEvent>'
            },
            {
                name: 'columnChanges',
                description: `列宽变化事件集`,
                type: 'EventEmitter<GanttTableEvent>'
            },
            {
                name: 'itemClick',
                description: `选择整行数据项事件`,
                type: 'EventEmitter<GanttSelectedEvent>'
            },
            {
                name: '#rowBeforeSlot',
                description: `设置表格中每行的前置自定义渲染模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#rowAfterSlot',
                description: `设置表格中每行的后置自定义渲染模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#tableEmpty',
                description: `设置空表格模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#tableFooter',
                description: `设置表格底部模板`,
                type: 'TemplateRef<any>'
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
    {
        type: 'component',
        name: 'ngx-gantt-bar',
        description: '数据项条形图展示组件',
        properties: [
            {
                name: 'template',
                description: `设置时间条显示模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: 'item',
                description: `设置时间条显示数据`,
                type: 'GanttItemInternal'
            },
            {
                name: 'barClick',
                description: `数据项条形图点击事件`,
                type: 'EventEmitter<GanttBarClickEvent>'
            }
        ]
    },
    {
        type: 'component',
        name: 'ngx-gantt-range',
        description: '数据项区间展示组件',
        properties: [
            {
                name: 'template',
                description: `设置区间展示模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: 'item',
                description: `设置区间展示数据`,
                type: 'GanttItemInternal'
            }
        ]
    },
    {
        type: 'component',
        name: 'ngx-gantt-toolbar',
        description: '工具栏组件',
        properties: [
            {
                name: 'template',
                description: `自定义工具栏模板`,
                type: 'TemplateRef<any>'
            }
        ]
    },
    {
        type: 'component',
        name: 'ngx-gantt-baseline',
        description: '基线展示组件',
        properties: [
            {
                name: 'baselineItem',
                description: `设置基线展示数据`,
                type: 'GanttBaselineItemInternal'
            }
        ]
    },
    {
        type: 'component',
        name: 'ngx-gantt-root',
        description: '甘特图根组件',
        properties: [
            {
                name: 'sideWidth',
                description: `设置甘特图左侧内容宽度`,
                type: 'number'
            },
            {
                name: 'sideTemplate',
                description: `设置甘特图左侧内容模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: 'mainTemplate',
                description: `设置甘特图右侧主要内容模板`,
                type: 'TemplateRef<any>'
            }
        ]
    }
];
