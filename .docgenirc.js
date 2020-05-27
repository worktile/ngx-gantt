module.exports = {
    $schema: 'node_modules/@docgeni/cli/cli.schema.json',
    baseHref: '/',
    heads: [],
    mode: 'site',
    title: 'NgxGantt',
    heading: 'Ngx Gantt',
    description: 'A modern documentation generator for doc and Angular Lib',
    docsPath: 'docs',
    sitePath: 'example',
    output: 'example-site',
    repoUrl: 'https://github.com/worktile/ngx-gantt',
    navs: [
        null,
        { title: 'Examples', path: 'examples' },
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
};
