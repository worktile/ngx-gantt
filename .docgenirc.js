module.exports = {
    mode: 'full',
    title: 'NgxGantt',
    siteProjectName: 'example',
    outputDir: 'dist/site',
    logoUrl: 'assets/imgs/logo.png',
    repoUrl: 'https://github.com/worktile/ngx-gantt',
    locales: [
        { key: 'zh-cn', name: '中文' },
        { key: 'en-us', name: 'English' }
    ],
    defaultLocale: 'zh-cn',
    navs: [
        null,
        {
            title: '组件 API',
            path: 'configuration',
            lib: 'ngx-gantt',
            locales: {
                'en-us': {
                    title: 'Configuration'
                }
            }
        },
        {
            title: '示例',
            path: 'components',
            locales: {
                'en-us': {
                    title: 'Component'
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
            rootDir: './example/src/app/apis',
            exclude: [],
            categories: [
                {
                    id: 'core',
                    title: '核心组件',
                    locales: {
                        'en-us': {
                            title: 'Core Components'
                        }
                    }
                },
                {
                    id: 'feature',
                    title: '功能组件',
                    locales: {
                        'en-us': {
                            title: 'Feature Components'
                        }
                    }
                }
            ]
        }
    ]
};
