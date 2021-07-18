class Resizer {
    constructor(camera, renderer, containerId) {
        this.containerId = containerId
        this.camera = camera
        this.renderer = renderer
        this.setSize()
        this.hookup()
    }
    
    setSize() {
        let container = document.getElementById(this.containerId)
        let width = container.offsetWidth
        let height = container.offsetHeight
        let aspectRatio = width / height
        this.camera.aspect = aspectRatio;
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

export {Resizer}
