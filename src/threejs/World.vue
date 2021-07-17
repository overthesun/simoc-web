<template>
    <div id="scene-container"></div>
</template>

<script>
import {createControls} from './systems/controls.js'
import {createRenderer} from './systems/renderer.js'
import {createCamera} from './components/camera.js'
import {createLights} from './components/lights.js'
import {createScene} from './components/scene.js'
import {buildLayout, buildHabitat} from './buildScene.js'

// Vue/ThreeJS structure ref: 
// https://stackoverflow.com/questions/47849626/import-and-use-three-js-library-in-vue-component (PolygonParrot's answer)

// File structure ref:
// discoverthreejs.com

export default {
    props: [
        'gameConfig'
    ],
    data() {
        return {
            container: null,
            renderer: null,
            controls: null,
            resizer: null,
            camera: null,
            light: null,
            scene: null,
            habitat: null,
        }
    },
    methods: {
        init() {
            this.container = document.getElementById('scene-container')
            // Setup the scene
            this.camera = createCamera()
            this.scene = createScene()
            this.renderer = createRenderer()
            this.controls = createControls(this.camera, this.renderer.domElement)
            this.container.append(this.renderer.domElement)
            this.resizeHandler()
            // Add lighting
            this.light = createLights()
            this.scene.add(this.light)
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
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(width, height)
            this.renderer.setPixelRatio(aspectRatio)
        },
        buildScene() {
            if (this.habitat) {
                this.scene.remove(this.habitat)
            }
            let layout = buildLayout(this.gameConfig)
            this.habitat = buildHabitat(layout)
            this.scene.add(this.habitat)
        },
    },
    mounted() {
        this.init()
        this.animate()
        window.addEventListener('resize', this.resizeHandler)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeHandler)
    },
    watch: {
        // TODO:
        // Individual sections, e.g. 'crewQuarters', change the corresponding
        // property in gameConfig, but that doesn't trigger this watcher.
        // Possible solutions:
        // - Trigger an update from config page after every action
        // - Make a separate getter for crewQuarters, also watch that
        // - Add a 'modifed' flag to the store
        gameConfig() {
            this.buildScene()
        }
    },
}
</script>

<style scoped>
#scene-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
