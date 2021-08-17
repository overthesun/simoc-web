import * as THREE from 'three'

class Renderer {
    constructor(containerId, scene, camera, settings) {
        this.containerId = containerId
        this.scene = scene
        this.camera = camera
        this.settings = settings
        this.animationFrame = null
        this.updatables = []
        this.tick = this.tick.bind(this)
        this.addTick = this.addTick.bind(this)

        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: settings.antialias,
        })
        this.renderer.physicallyCorrectLights = true
        if (settings.shadows) {
            this.renderer.shadowMap.enabled = true
        }
        const container = document.getElementById(this.containerId)
        container.append(this.renderer.domElement)
    }

    // controls, tooltip,
    addTick(item) {
        console.log(item)
        this.updatables.push(item)
    }

    tick() {
        this.animationFrame = requestAnimationFrame(this.tick)
        this.updatables.forEach(item => {
            item.tick()
        })
        this.renderer.render(this.scene, this.camera)
    }

}

export default Renderer
