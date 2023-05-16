module.exports = {
    allowBranch: ['master', 'release-auto-*'],
    bumpFiles: ['package.json', 'package-lock.json', 'packages/gantt/package.json'],
    skip: {
        confirm: true
    },
    tagPrefix: '',
    hooks: {
        prepublish: 'npm run build'
    }
};
