module.exports = [
    {
        type: 'component',
        name: 'ngx-gantt-root',
        description: '甘特图根组件，用于控制甘特图的整体布局结构',
        properties: [
            {
                name: 'sideWidth',
                description: `左侧内容区域宽度（像素）`,
                type: 'number'
            },
            {
                name: '#sideTemplate',
                description: `左侧内容自定义模板`,
                type: 'TemplateRef<any>'
            },
            {
                name: '#mainTemplate',
                description: `右侧主要内容自定义模板`,
                type: 'TemplateRef<any>'
            }
        ]
    }
];
