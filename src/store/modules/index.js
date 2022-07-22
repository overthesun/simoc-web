const requireModule = import.meta.glob('./dir/*.js')
const modules = {}

for (const path in requireModule) {
  requireModule[path]().then((mod) => {
    modules[moduleName] = mod.default
  })
}

export default modules

