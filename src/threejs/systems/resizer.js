class Resizer {
    constructor(camera, renderer, containerId, addHookup) {
        this.containerId = containerId
        this.camera = camera
        this.renderer = renderer
        this.setSize()

        this.hookup = this.hookup.bind(this)
        this.unhook = this.unhook.bind(this)
        addHookup({
            name: 'resizer',
            hookup: this.hookup,
            unhook: this.unhook,
        })
    }

    setSize() {
        const container = document.getElementById(this.containerId)
        const width = container.offsetWidth
        const height = container.offsetHeight
        const aspectRatio = width / height
        this.camera.aspect = aspectRatio
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
        this.renderer.setPixelRatio(aspectRatio)
    }

    hookup() {
        window.addEventListener('resize', () => this.setSize())
    }

    unhook() {
        window.removeEventListener('resize', this.setSize)
    }
}

export default Resizer
