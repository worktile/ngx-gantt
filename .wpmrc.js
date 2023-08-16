module.exports = {
    allowBranch: ['master', 'v15.*', 'v16.*', 'v17.*', 'release-auto-*'],
    bumpFiles: ['package.json', 'package-lock.json', 'packages/gantt/package.json'],
    skip: {
        confirm: true
    },
    tagPrefix: '',
    hooks: {
        prepublish: 'npm run build'
    }
};
