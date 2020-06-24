module.exports = {
    $schema: 'node_modules/@docgeni/cli/cli.schema.json',
    baseHref: '/',
    heads: [],
    mode: 'site',
    title: 'NgxGantt',
    siteProjectName: 'example',
    output: 'dist/site',
    repoUrl: 'https://github.com/worktile/ngx-gantt',
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
