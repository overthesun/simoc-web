// extract all vue files from the panels/ dir
const requireModule = import.meta.glob('./*.vue', { eager: true })
const panels = {}

// create an object that maps file names (without extension)
// to the corresponding components and export it
for (const path in requireModule) {
    // remove leading ./ and trailing .vue
    const panelName = path.replace(/(\.\/|\.vue)/g, '')
    const panel = requireModule[path].default
    if (!panel.panelTitle) {
        // show an error and use the name if the title is missing
        console.error('* Missing panelTitle in panel', panelName)
        panel.panelTitle = panelName
    }
    panels[panelName] = panel
}

export default panels
