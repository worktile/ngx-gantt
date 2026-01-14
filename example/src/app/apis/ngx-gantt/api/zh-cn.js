module.exports = [
    {
        type: 'component',
        name: 'ngx-gantt',
        description: '甘特图主组件',
        properties: [
            {
                name: 'items',
                description: `任务数据项数组，单独设置以列表展示；设置 group_id 可关联到 groups 进行分组展示；支持树形结构（children）`,
                type: 'GanttItem[]'
            },
            {
                name: 'groups',
                description: `分组数据数组，items 需设置 group_id 关联，支持展开/收起`,
                type: 'GanttGroup[]'
            },
            {
                name: 'baselineItems',
                description: `基线对比数据，显示在任务条下方`,
                type: 'GanttBaselineItem[]'
            },
            {
                name: 'viewType',
                description: `视图类型：hour、day、week、month、quarter、year，默认 month`,
                type: `GanttViewType`,
                default: 'GanttViewType.month'
            },
            {
                name: 'start',
                description: `开始时间（Unix 时间戳，秒）。不设置则根据 items 自动计算`,
                type: 'number'
            },
            {
                name: 'end',
                description: `结束时间（Unix 时间戳，秒）。不设置则根据 items 自动计算`,
                type: 'number'
            },
            {
                name: 'showTodayLine',
                description: `是否显示今天线`,
                type: 'boolean',
                default: 'true'
            },
            {
                name: 'draggable',
                description: `是否允许拖拽任务条修改时间`,
                type: 'boolean'
            },
            {
                name: 'styles',
                description: `样式配置（主题、行高、任务条高度等）`,
                type: 'GanttStyleOptions'
            },
            {
                name: 'showToolbar',
                description: `是否显示工具栏`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'toolbarOptions',
                description: `工具栏配置，可配置显示的视图类型列表`,
                type: 'GanttToolbarOptions',
                default: `{
                    viewTypes: [GanttViewType.day, GanttViewType.month, GanttViewType.year]
                }`
            },
            {
                name: 'viewOptions',
                description: `视图配置（时间刻度格式、单位宽度、滚动加载等）`,
                type: 'GanttViewOptions'
            },
            {
                name: 'linkOptions',
                description: `关联关系配置（依赖类型、箭头、连线类型等）`,
                type: 'GanttLinkOptions'
            },
            {
                name: 'disabledLoadOnScroll',
                description: `是否禁用滚动加载，默认 true`,
                type: 'boolean',
                default: 'true'
            },
            {
                name: 'selectable',
                description: `是否启用行选择功能`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'multiple',
                description: `是否启用多选模式（需 selectable 为 true）`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'quickTimeFocus',
                description: `是否启用快速时间聚焦（点击任务条端点快速定位）`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'maxLevel',
                description: `最大展示层级，默认 2`,
                type: 'number',
                default: 2
            },
            {
                name: 'async',
                description: `是否启用异步加载子任务`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'childrenResolve',
                description: `异步加载子任务函数，返回 Observable<GanttItem[]>`,
                type: '(item: GanttItem) => Observable<GanttItem[]>'
            },
            {
                name: 'linkable',
                description: `是否允许创建任务关联关系`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'loading',
                description: `是否显示加载状态`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'virtualScrollEnabled',
                description: `是否启用虚拟滚动，默认 true`,
                type: 'boolean',
                default: 'true'
            },
            {
                name: 'loadingDelay',
                description: `加载延迟时间（毫秒），用于避免闪烁，默认 0`,
                type: 'number',
                default: '0'
            },
            {
                name: 'loadOnScroll',
                description: `滚动加载事件，事件对象包含 start 和 end 时间戳`,
                type: 'EventEmitter<GanttLoadOnScrollEvent>'
            },
            {
                name: 'dragStarted',
                description: `任务条拖拽开始事件`,
                type: 'EventEmitter<GanttDragEvent>'
            },
            {
                name: 'dragMoved',
                description: `任务条拖拽移动事件`,
                type: 'EventEmitter<GanttDragEvent>'
            },
            {
                name: 'dragEnded',
                description: `任务条拖拽结束事件`,
                type: 'EventEmitter<GanttDragEvent>'
            },
            {
                name: 'barClick',
                description: `任务条点击事件`,
                type: 'EventEmitter<GanttBarClickEvent>'
            },
            {
                name: 'viewChange',
                description: `视图类型变化事件`,
                type: 'EventEmitter<GanttView>'
            },
            {
                name: 'expandChange',
                description: `展开/收起状态变化事件`,
                type: 'EventEmitter<GanttItemInternal | GanttGroupInternal | (GanttItemInternal | GanttGroupInternal)[]>'
            },
            {
                name: 'linkDragStarted',
                description: `关联关系拖拽开始事件`,
                type: 'EventEmitter<GanttLinkDragEvent>'
            },
            {
                name: 'linkDragEnded',
                description: `关联关系拖拽结束事件`,
                type: 'EventEmitter<GanttLinkDragEvent>'
            },
            {
                name: 'lineClick',
                description: `关联关系线点击事件`,
                type: 'EventEmitter<GanttLineClickEvent>'
            },
            {
                name: 'selectedChange',
                description: `任务选择变化事件`,
                type: 'EventEmitter<GanttSelectedEvent>'
            },
            {
                name: 'virtualScrolledIndexChange',
                description: `虚拟滚动索引变化事件`,
                type: 'EventEmitter<GanttVirtualScrolledIndexChangeEvent>'
            },
            {
                name: '#bar',
                description: `任务条自定义模板（bar 类型）`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#range',
                description: `区间自定义模板（range 类型）`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#item',
                description: `任务项自定义模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#baseline',
                description: `基线自定义模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#group',
                description: `分组自定义模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#groupHeader',
                description: `分组头部自定义模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#toolbar',
                description: `工具栏自定义模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#footer',
                description: `底部自定义模板`,
                type: 'TemplateRef<any>'
            }
        ],
        methods: [
            {
                name: 'scrollToToday',
                description: `滚动到今天的位置`,
                parameters: [],
                returnValue: {
                    type: 'void'
                }
            },
            {
                name: 'scrollToDate',
                description: `滚动到指定日期位置`,
                parameters: [
                    {
                        name: 'date',
                        type: 'number | Date | GanttDate'
                    }
                ],
                returnValue: {
                    type: 'void'
                }
            },
            {
                name: 'expandChildren',
                description: `展开或收起指定任务项的子任务`,
                parameters: [
                    {
                        name: 'item',
                        type: 'GanttItemInternal'
                    }
                ],
                returnValue: {
                    type: 'void'
                }
            },
            {
                name: 'expandGroup',
                description: `展开或收起指定分组`,
                parameters: [
                    {
                        name: 'group',
                        type: 'GanttGroupInternal'
                    }
                ],
                returnValue: {
                    type: 'void'
                }
            },
            {
                name: 'expandAll',
                description: `展开所有分组和任务项`,
                parameters: [],
                returnValue: {
                    type: 'void'
                }
            },
            {
                name: 'collapseAll',
                description: `收起所有分组和任务项`,
                parameters: [],
                returnValue: {
                    type: 'void'
                }
            },
            {
                name: 'getGanttItem',
                description: `根据 ID 获取任务项`,
                parameters: [
                    {
                        name: 'id',
                        type: 'string'
                    }
                ],
                returnValue: {
                    type: 'GanttItemInternal | null'
                }
            },
            {
                name: 'getGanttItems',
                description: `根据 ID 数组获取多个任务项`,
                parameters: [
                    {
                        name: 'ids',
                        type: 'string[]'
                    }
                ],
                returnValue: {
                    type: 'GanttItemInternal[]'
                }
            },
            {
                name: 'isSelected',
                description: `判断指定任务项是否被选中`,
                parameters: [
                    {
                        name: 'id',
                        type: 'string'
                    }
                ],
                returnValue: {
                    type: 'boolean'
                }
            },
            {
                name: 'changeView',
                description: `切换视图类型并重新计算`,
                parameters: [],
                returnValue: {
                    type: 'void'
                }
            },
            {
                name: 'rerenderView',
                description: `重新渲染视图`,
                parameters: [],
                returnValue: {
                    type: 'void'
                }
            }
        ]
    }
];
