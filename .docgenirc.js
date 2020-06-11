module.exports = {
    $schema: 'node_modules/@docgeni/cli/cli.schema.json',
    baseHref: '/',
    heads: [],
    mode: 'site',
    title: 'NgxGantt',
    sitePath: 'example',
    output: 'dist/site',
    repoUrl: 'https://github.com/worktile/ngx-gantt',
    navs: [
        null,
        { title: '示例', path: 'examples' },
        { title: 'Flat', path: 'flat' },
        { title: '组件', path: 'components', lib: 'ngx-gantt' },
        {
            title: 'GitHub',
            path: 'https://github.com/worktile/ngx-gantt',
            isExternal: true,
        },
        {
            title: '更新日志',
            path: 'https://github.com/worktile/ngx-gantt/changelog.md',
            isExternal: true,
            locales: {
                'en-us': {
                    title: 'Changelog',
                },
            },
        },
    ],
    libs: [
        {
            name: 'ngx-gantt',
            rootDir: './packages/gantt/src',
            exclude: '',
            categories: [
                {
                    id: 'general',
                    title: '通用',
                    locales: {
                        'en-us': {
                            title: 'General'
                        }
                    }
                }
            ]
        }
    ]
};
