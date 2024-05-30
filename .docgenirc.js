module.exports = {
    mode: 'full',
    title: 'NgxGantt',
    siteProjectName: 'example',
    outputDir: 'dist/site',
    logoUrl: '/assets/imgs/logo.png',
    repoUrl: 'https://github.com/worktile/ngx-gantt',
    locales: [
        { key: 'en-us', name: 'English' },
        { key: 'zh-cn', name: '中文' }
    ],
    defaultLocale: 'zh-cn',
    navs: [
        null,
        {
            title: '组件',
            path: 'components',
            locales: {
                'en-us': {
                    title: 'Component'
                }
            }
        },
        {
            title: '参数',
            path: 'configuration',
            lib: 'ngx-gantt',
            locales: {
                'en-us': {
                    title: 'Configuration'
                }
            }
        },
        {
            title: 'GitHub',
            path: 'https://github.com/worktile/ngx-gantt',
            isExternal: true
        },
        {
            title: '更新日志',
            path: 'https://github.com/worktile/ngx-gantt/blob/master/CHANGELOG.md',
            isExternal: true,
            locales: {
                'en-us': {
                    title: 'Changelog'
                }
            }
        }
    ],
    libs: [
        {
            name: 'ngx-gantt',
            rootDir: './example/src/app/configuration',
            exclude: [],
            categories: [
                {
                    id: 'config',
                    title: '配置',
                    locales: {
                        'en-us': {
                            title: 'Configuration'
                        }
                    }
                }
            ]
        }
    ]
};
