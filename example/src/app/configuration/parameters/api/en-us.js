module.exports = [
    {
        type: 'component',
        name: 'ngx-gantt',
        description: '',
        properties: [
            {
                name: 'items',
                description: `Set data items. If you set items separately, they will be displayed in a list. If you need to display them in groups, you need to set the property groupId to correspond to the grouped data`,
                type: 'GanttItem[]'
            },
            {
                name: 'groups',
                description: `Set grouped data`,
                type: 'GanttGroup[]'
            },
            {
                name: 'baselineItems',
                description: `Set baseline comparison data`,
                type: 'GanttBaselineItem[]'
            },
            {
                name: 'viewType',
                description: `Set view type`,
                type: `day | month | quarter`,
                default: 'month'
            },
            {
                name: 'start',
                description: `Set the start time of the Gantt chart in the format of a 10-digit timestamp`,
                type: 'number'
            },
            {
                name: 'end',
                description: `Set the end time of the Gantt chart in the format of a 10-digit timestamp`,
                type: 'number'
            },
            {
                name: 'draggable',
                description: `Set whether it can be dragged`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'virtualScrollEnabled',
                description: `Set whether to use the virtual scrolling function`,
                type: 'boolean',
                default: 'true'
            },
            {
                name: 'linkable',
                description: `Set whether the association relationship can be connected`,
                type: 'boolean',
                default: 'false'
            },

            {
                name: 'loading',
                description: `Whether to display the loader`,
                type: 'boolean',
                default: 'false'
            },

            {
                name: 'loadingDelay',
                description: 'Set the number of `milliseconds` to ignore the loader display',
                type: 'number',
                default: '0'
            },

            {
                name: 'maxLevel',
                description: `Set the maximum display level`,
                type: 'number',
                default: 2
            },

            {
                name: 'async',
                description: `Set whether to start asynchronous`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'childrenResolve',
                description: `Set the asynchronous data source return function, the return value is Observable data stream`,
                type: 'Function'
            },

            {
                name: 'styles',
                description: `Configure built-in style options`,
                type: 'GanttStyles'
            },
            {
                name: 'viewOptions',
                description: `Configure view options`,
                type: 'GanttViewOptions'
            },
            {
                name: 'disabledLoadOnScroll',
                description: `Set whether to disable scroll loading`,
                type: 'boolean',
                default: false
            },
            {
                name: 'selectable',
                description: `Set whether to enable selection of the entire row`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'multiple',
                description: `Set whether to select the entire row in multiple selection mode`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'showToolbar',
                description: `Set whether to display the toolbar`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'toolbarOptions',
                description: `Toolbar configuration items`,
                type: 'GanttToolbarOptions',
                default: `{
                viewTypes: [GanttViewType.day, GanttViewType.month, GanttViewType.year]
                }`
            },
            {
                name: 'loadOnScroll',
                description: `Scroll loading event`,
                type: 'EventEmitter<GanttLoadOnScrollEvent>'
            },
            {
                name: 'dragStarted',
                description: `Drag start event`,
                type: 'EventEmitter<GanttDragEvent>'
            },
            {
                name: 'dragEnded',
                description: `Event after drag ends`,
                type: 'EventEmitter<GanttDragEvent>'
            },
            {
                name: 'linkDragStarted',
                description: `Event after the relationship drag starts`,
                type: 'EventEmitter<GanttLinkDragEvent>'
            },
            {
                name: 'linkDragEnded',
                description: `Event after the relationship drag ends`,
                type: 'EventEmitter<GanttLinkDragEvent>'
            },
            {
                name: 'barClick',
                description: `Right time bar click event`,
                type: 'EventEmitter<GanttBarClickEvent>'
            },
            {
                name: 'lineClick',
                description: `Relationship line click time`,
                type: 'EventEmitter<GanttLinkDragEvent>'
            },
            {
                name: 'selectedChange',
                description: `Select data item event`,
                type: 'EventEmitter<GanttSelectedEvent>'
            },
            {
                name: 'virtualScrolledIndexChange',
                description: `The index of the first element visible in the virtual scroll viewport has changed`,
                type: 'EventEmitter<GanttVirtualScrolledIndexChangeEvent>'
            },
            {
                name: '#group',
                description: `Set group display template`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#bar',
                description: `Set time bar display template`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#groupHeader',
                description: `Set group header display template`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#toolbar',
                description: `Toolbar custom template`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#tableFooter',
                description: `Set the bottom template`,
                type: 'TemplateRef<any>'
            }
        ]
    },
    {
        type: 'component',
        name: 'ngx-gantt-table',
        description: 'Gantt chart left table',
        properties: [
            {
                name: 'draggable',
                description: `Set whether the table data items support dragging up and down sorting`,
                default: false,
                type: 'boolean'
            },
            {
                name: 'dropEnterPredicate',
                description: `This function is used to determine whether a data item is allowed to be dragged to other items`,
                type: '(context: GanttTableDragEnterPredicateContext<T>) => boolean'
            },
            {
                name: 'dragDropped',
                description: `When a data item is dragged to another data item, it will be triggered`,
                type: 'EventEmitter<GanttTableDragDroppedEvent>'
            },
            {
                name: 'dragStarted',
                description: `Drag starts after the event`,
                type: 'EventEmitter<GanttTableDragStartedEvent>'
            },
            {
                name: 'dragEnded',
                description: `Drag ends after the event`,
                type: 'EventEmitter<GanttTableDragEndedEvent>'
            },
            {
                name: 'columnChanges',
                description: `Column width change event set`,
                type: 'EventEmitter<GanttTableEvent>'
            },
            {
                name: 'itemClick',
                description: `Select the entire row of data items event`,
                type: 'EventEmitter<GanttSelectedEvent>'
            },
            {
                name: '#rowBeforeSlot',
                description: `Set the front custom rendering template for each row in the table`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#rowAfterSlot',
                description: `Set the back custom rendering template for each row in the table`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#tableEmpty',
                description: `Set the empty table template`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#tableFooter',
                description: `Set the table bottom template`,
                type: 'TemplateRef<any>'
            }
        ]
    },
    {
        type: 'component',
        name: 'ngx-gantt-column',
        description: 'Gantt chart left column',
        properties: [
            {
                name: 'name',
                description: `Set column name`,
                type: 'string'
            },
            {
                name: 'width',
                description: `Set column width`,
                type: 'string ｜ number'
            },
            {
                name: '#header',
                description: `Set each column header template`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#cell',
                description: `Set each column content template`,
                type: 'TemplateRef<any>'
            }
        ]
    },
    {
        type: 'component',
        name: 'ngx-gantt-bar',
        description: 'Data item bar chart display component',
        properties: [
            {
                name: 'template',
                description: `Set time bar display template`,
                type: 'TemplateRef<any>'
            },
            {
                name: 'item',
                description: `Set time bar display data`,
                type: 'GanttItemInternal'
            },
            {
                name: 'barClick',
                description: `Data item bar chart click event`,
                type: 'EventEmitter<GanttBarClickEvent>'
            }
        ]
    },
    {
        type: 'component',
        name: 'ngx-gantt-range',
        description: 'Data item range display component',
        properties: [
            {
                name: 'template',
                description: `Set range display template`,
                type: 'TemplateRef<any>'
            },
            {
                name: 'item',
                description: `Set range display data`,
                type: 'GanttItemInternal'
            }
        ]
    },
    {
        type: 'component',
        name: 'ngx-gantt-toolbar',
        description: 'Toolbar component',
        properties: [
            {
                name: 'template',
                description: `Custom toolbar template`,
                type: 'TemplateRef<any>'
            }
        ]
    },
    {
        type: 'component',
        name: 'ngx-gantt-baseline',
        description: 'Baseline display component',
        properties: [
            {
                name: 'baselineItem',
                description: `Set baseline display data`,
                type: 'GanttBaselineItemInternal'
            }
        ]
    },
    {
        type: 'component',
        name: 'ngx-gantt-root',
        description: 'Gantt chart root component',
        properties: [
            {
                name: 'sideWidth',
                description: `Set the width of the left content of the Gantt chart`,
                type: 'number'
            },
            {
                name: 'sideTemplate',
                description: `Set the content template on the left side of the Gantt chart`,
                type: 'TemplateRef<any>'
            },
            {
                name: 'mainTemplate',
                description: `Set the main content template on the right side of the Gantt chart`,
                type: 'TemplateRef<any>'
            }
        ]
    }
];
