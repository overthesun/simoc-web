// import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'

import {createCamera} from './components/camera.js'
import {createCube} from './components/cube.js'
import {createLights} from './components/lights.js'
import {createScene} from './components/scene.js'

import {createControls} from './systems/controls.js'
import {createRenderer} from './systems/renderer.js'
import {Resizer} from './systems/Resizer.js'

// TODO: Make this a Vue component
// ref: https://stackoverflow.com/questions/47849626/import-and-use-three-js-library-in-vue-component (PolygonParrot's answer)

class World {
    constructor(container) {
        this.camera = createCamera()
        this.scene = createScene()
        this.renderer = createRenderer()
        container.append(this.renderer.domElement)

        this.cube = createCube()
        this.light = createLights()
        this.scene.add(this.cube, this.light)

        this.resizer = new Resizer(container, this.camera, this.renderer)
        this.resizer.onResize = () => {
            this.render()
        }

        this.controls = createControls(this.camera, this.renderer.domElement)
        
        // this.loader = new OBJLoader()
        // this.loader.load(
        //     'src/assets/models/Inflatable-25x8-A.obj',
        //     function(object) {
        //         this.scene.add(object, this.light)
        //     }
        // )

        this.render = this.render.bind(this)
    }
    
    render() {
        requestAnimationFrame( this.render )

        // this.cube.rotation.x += 0.01
        // this.cube.rotation.y += 0.01

        this.renderer.render( this.scene, this.camera )
    }
}

export default World
