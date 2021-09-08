class Resizer {
    constructor(camera, renderer, addHookup, container) {
        this.container = container
        this.camera = camera
        this.renderer = renderer
        this.setSize()

        this.hookup = this.hookup.bind(this)
        this.unhook = this.unhook.bind(this)
        this.setSize = this.setSize.bind(this)
        addHookup({
            name: 'resizer',
            hookup: this.hookup,
            unhook: this.unhook,
        })
    }

    setSize() {
        const width = this.container.offsetWidth
        const height = this.container.offsetHeight
        const aspectRatio = width / height
        this.camera.aspect = aspectRatio
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
        this.renderer.setPixelRatio(aspectRatio)
    }

    hookup() {
        window.addEventListener('resize', this.setSize)
    }

    unhook() {
        window.removeEventListener('resize', this.setSize)
    }
}

export default Resizer
