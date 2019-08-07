// extract all vue files from the panels/ dir
const requireModule = require.context(".", false, /\.vue$/);
const panels = {};

requireModule.keys().forEach(fileName => {
    // remove leading ./ and trailing .vue
    const panelName = fileName.replace(/(^\.\/|\.vue$)/g, "");
    panels[panelName] = requireModule(fileName).default;
});

export default panels;
