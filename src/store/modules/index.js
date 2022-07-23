const requireModule = import.meta.glob('./*.js', { eager: true })
const modules = {}

for (const path in requireModule) {
    modules[path.replace(/(\.\/|\.js)/g, "")] = requireModule[path].default; 
}

console.log(modules)
export default modules
