module.exports = [
    {
        type: 'component',
        name: 'ngx-gantt',
        description: 'Gantt chart main component',
        properties: [
            {
                name: 'items',
                description: `Task data items array. Set separately for list display; set group_id to associate with groups for grouped display; supports tree structure (children)`,
                type: 'GanttItem[]'
            },
            {
                name: 'groups',
                description: `Grouped data array. Items need to set group_id to associate, supports expand/collapse`,
                type: 'GanttGroup[]'
            },
            {
                name: 'baselineItems',
                description: `Baseline comparison data, displayed below task bars`,
                type: 'GanttBaselineItem[]'
            },
            {
                name: 'viewType',
                description: `View type: hour, day, week, month, quarter, year, default month`,
                type: `GanttViewType`,
                default: 'GanttViewType.month'
            },
            {
                name: 'start',
                description: `Start time (Unix timestamp, seconds). Auto-calculated from items if not set`,
                type: 'number'
            },
            {
                name: 'end',
                description: `End time (Unix timestamp, seconds). Auto-calculated from items if not set`,
                type: 'number'
            },
            {
                name: 'showTodayLine',
                description: `Whether to display today line`,
                type: 'boolean',
                default: 'true'
            },
            {
                name: 'draggable',
                description: `Whether to allow dragging task bars to modify time`,
                type: 'boolean'
            },
            {
                name: 'styles',
                description: `Style configuration (theme, row height, task bar height, etc.)`,
                type: 'GanttStyleOptions'
            },
            {
                name: 'showToolbar',
                description: `Whether to display toolbar`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'toolbarOptions',
                description: `Toolbar configuration, can configure list of view types to display`,
                type: 'GanttToolbarOptions',
                default: `{
                    viewTypes: [GanttViewType.day, GanttViewType.month, GanttViewType.year]
                }`
            },
            {
                name: 'viewOptions',
                description: `View configuration (time tick format, unit width, scroll loading, etc.)`,
                type: 'GanttViewOptions'
            },
            {
                name: 'linkOptions',
                description: `Link relationship configuration (dependency types, arrows, line types, etc.)`,
                type: 'GanttLinkOptions'
            },
            {
                name: 'disabledLoadOnScroll',
                description: `Whether to disable scroll loading, default true`,
                type: 'boolean',
                default: 'true'
            },
            {
                name: 'selectable',
                description: `Whether to enable row selection`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'multiple',
                description: `Whether to enable multiple selection mode (requires selectable to be true)`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'quickTimeFocus',
                description: `Whether to enable quick time focus (click task bar endpoints to quickly locate)`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'maxLevel',
                description: `Maximum display level, default 2`,
                type: 'number',
                default: 2
            },
            {
                name: 'async',
                description: `Whether to enable asynchronous loading of sub-tasks`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'childrenResolve',
                description: `Async loading sub-tasks function, returns Observable<GanttItem[]>`,
                type: '(item: GanttItem) => Observable<GanttItem[]>'
            },
            {
                name: 'linkable',
                description: `Whether to allow creating task link relationships`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'loading',
                description: `Whether to display loading state`,
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'virtualScrollEnabled',
                description: `Whether to enable virtual scrolling, default true`,
                type: 'boolean',
                default: 'true'
            },
            {
                name: 'loadingDelay',
                description: `Loading delay time (milliseconds), used to avoid flickering, default 0`,
                type: 'number',
                default: '0'
            },
            {
                name: 'loadOnScroll',
                description: `Scroll loading event, event object contains start and end timestamps`,
                type: 'EventEmitter<GanttLoadOnScrollEvent>'
            },
            {
                name: 'dragStarted',
                description: `Task bar drag start event`,
                type: 'EventEmitter<GanttDragEvent>'
            },
            {
                name: 'dragMoved',
                description: `Task bar drag move event`,
                type: 'EventEmitter<GanttDragEvent>'
            },
            {
                name: 'dragEnded',
                description: `Task bar drag end event`,
                type: 'EventEmitter<GanttDragEvent>'
            },
            {
                name: 'barClick',
                description: `Task bar click event`,
                type: 'EventEmitter<GanttBarClickEvent>'
            },
            {
                name: 'viewChange',
                description: `View type change event`,
                type: 'EventEmitter<GanttView>'
            },
            {
                name: 'expandChange',
                description: `Expand/collapse state change event`,
                type: 'EventEmitter<GanttItemInternal | GanttGroupInternal | (GanttItemInternal | GanttGroupInternal)[]>'
            },
            {
                name: 'linkDragStarted',
                description: `Link drag start event`,
                type: 'EventEmitter<GanttLinkDragEvent>'
            },
            {
                name: 'linkDragEnded',
                description: `Link drag end event`,
                type: 'EventEmitter<GanttLinkDragEvent>'
            },
            {
                name: 'lineClick',
                description: `Link line click event`,
                type: 'EventEmitter<GanttLineClickEvent>'
            },
            {
                name: 'selectedChange',
                description: `Task selection change event`,
                type: 'EventEmitter<GanttSelectedEvent>'
            },
            {
                name: 'virtualScrolledIndexChange',
                description: `Virtual scroll index change event`,
                type: 'EventEmitter<GanttVirtualScrolledIndexChangeEvent>'
            },
            {
                name: '#bar',
                description: `Task bar custom template (bar type)`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#range',
                description: `Range custom template (range type)`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#item',
                description: `Task item custom template`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#baseline',
                description: `Baseline custom template`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#group',
                description: `Group custom template`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#groupHeader',
                description: `Group header custom template`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#toolbar',
                description: `Toolbar custom template`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#footer',
                description: `Footer custom template`,
                type: 'TemplateRef<any>'
            }
        ]
    }
];
