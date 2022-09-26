const requireModule = import.meta.glob('./*.js', {eager: true})
const modules = {}
Object.keys(requireModule).forEach(path => {
    modules[path.replace(/(\.\/|\.js)/g, '')] = {
        namespaced: true,
        ...requireModule[path].default,
    }
})

export default modules
