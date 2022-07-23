// extract all vue files from the panels/ dir
const requireModule = import.meta.glob('./*.vue')
const panels = {}

for (const path in requireModule) {
  requireModule[path]().then((mod) => {
    const panelName = path.replace(/(^\.\/|\.vue$)/g, '')
    const panel = mod.default
    if (!panel.panelTitle) {
            console.error('* Missin panelTitle in panel', panelName)
            panel.panelTitle = panelName
        }
        panels[panelName] = panel
  })
}

/*
// create an object that maps file names (without extension)
// to the corresponding components and export it
requireModule.forEach(fileName => {
    // remove leading ./ and trailing .vue
    const panelName = fileName.replace(/(^\.\/|\.vue$)/g, '')
    const panel = requireModule(fileName).default
    if (!panel.panelTitle) {
        // show an error and use the name if the title is missing
        console.error('* Missing panelTitle in panel', panelName)
        panel.panelTitle = panelName
    }
    panels[panelName] = panel
})
*/
export default panels
