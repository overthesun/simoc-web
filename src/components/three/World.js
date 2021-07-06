import { createCamera } from './components/camera.js'
import { createCube } from './components/cube.js'
import { createScene } from './components/scene.js'

import { createRenderer } from './systems/renderer.js'
import { Resizer } from './systems/Resizer.js'

class World {
    constructor(container) {
        this.camera = createCamera()
        this.scene = createScene()
        this.renderer = createRenderer()
        container.append(this.renderer.domElement)
        this.resizer = new Resizer(container, this.camera, this.renderer)

        this.cube = createCube()
        this.scene.add(this.cube)
        
        this.render = this.render.bind(this)
    }
    
    render() {
        requestAnimationFrame( this.render );

        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        this.renderer.render( this.scene, this.camera );
    }
}

export default World
