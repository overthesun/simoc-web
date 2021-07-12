<template>
    <div id="scene-container"></div>
</template>

<script>
// import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'

import {createControls} from './systems/controls.js'
import {createRenderer} from './systems/renderer.js'
import {createCamera} from './components/camera.js'
import {createCube} from './components/cube.js'
import {createLights} from './components/lights.js'
import {createScene} from './components/scene.js'

// ref: https://stackoverflow.com/questions/47849626/import-and-use-three-js-library-in-vue-component (PolygonParrot's answer)
export default {
    props: [
        'gameConfig'
    ],
    data() {
        return {
            // Systems
            renderer: null,
            controls: null,
            resizer: null,

            // Components
            camera: null,
            cube: null,
            light: null,
            scene: null,

            container: null
        }
    },
    methods: {
        init() {
            // Setup the scene
            this.camera = createCamera()
            this.scene = createScene()
            this.renderer = createRenderer()
            this.controls = createControls(this.camera, this.renderer.domElement)

            this.container = document.getElementById('scene-container')
            this.container.append(this.renderer.domElement)

            // Add objects to scene
            this.cube = createCube()
            this.light = createLights()
            this.scene.add(this.cube, this.light)

            this.resizeHandler()
        },
        animate() {
            requestAnimationFrame(this.animate)
            this.renderer.render(this.scene, this.camera)
        },
        resizeHandler() {
            let width = this.container.offsetWidth
            let height = this.container.offsetHeight
            let aspectRatio = width / height

            this.camera.aspect = aspectRatio;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(aspectRatio)
        }
    },
    mounted() {
        this.init()
        this.animate()
        window.addEventListener('resize', this.resizeHandler)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeHandler)
    }
}
</script>

<style scoped>
#scene-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
