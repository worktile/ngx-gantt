module.exports = {
    mode: 'full',
    title: 'NgxGantt',
    siteProjectName: 'example',
    outputDir: 'dist/site',
    logoUrl: 'https://cdn.pingcode.com/open-sources/gantt/logo.png',
    repoUrl: 'https://github.com/worktile/ngx-gantt',
    defaultLocale: 'zh-cn',
    navs: [
        null,
        {
            title: '组件',
            path: 'component',
            locales: {
                'en-us': {
                    title: 'Component'
                }
            }
        },
        {
            title: '平铺模式',
            path: 'flat',
            locales: {
                'en-us': {
                    title: 'Flat'
                }
            }
        },
        {
            title: '区间展示',
            path: 'range',
            locales: {
                'en-us': {
                    title: 'Range'
                }
            }
        },
        {
            title: '配置',
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
            path: 'https://github.com/worktile/ngx-gantt/changelog.md',
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
