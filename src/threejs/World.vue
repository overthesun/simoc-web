<template>
    <div>
        <div id="scene-container" class="scene-container" ref="sceneContainer"></div>
    </div>
</template>

<script>
import * as THREE from 'three'
import {createControls} from './systems/controls.js'
import {createRenderer} from './systems/renderer.js'
import {Resizer} from './systems/resizer.js'
import {Tooltip} from './systems/tooltip.js'
import {createCamera} from './components/camera.js'
import {createLights} from './components/lights.js'
import {createScene} from './components/scene.js'
import {buildPlace} from './components/placeholders'

// Vue/ThreeJS structure ref: 
// https://stackoverflow.com/questions/47849626/import-and-use-three-js-library-in-vue-component (PolygonParrot's answer)

// File structure ref:
// discoverthreejs.com

export default {
    props: {
        gameConfig: {
            default: null
        },
        isActive: {
            default: true
        }
    },
    data() {
        return {
            containerId: 'scene-container',
            container: null,
            renderer: null,
            controls: null,
            camera: null,
            raycaster: null,
            mouse: null,
            light: null,
            scene: null,
            animationFrame: null,
            models: {}, // A cache of rendered models
            layout: [], // A grid showing relative positions of active places
            habitat: null, // A 3D object of all active places rendered according to layout
            hoveringOver: null,
            hoverMessage: null,
        }
    },
    watch: {
        // TODO:
        // Individual sections (e.g. 'crewQuarters') mutate a property in gameConfig, 
        // but that doesn't trigger this watcher. Possible solutions:
        //   - Trigger an update from config page after every action
        //   - Make a separate getter for crewQuarters et al, also watch them
        //   - Add a 'modifed' flag to the store
        gameConfig(newConfig, oldConfig) {
            this.buildScene(newConfig)
        },
        isActive(newActive, oldActive) {
            if (newActive) {
                this.hookup()
            } else {
                this.unhook()
            }
        }
    },
    mounted() {
        this.init()
        this.render()
        this.hookup = this.hookup.bind(this)
        this.unhook = this.unhook.bind(this)
    },
    beforeDestroy() {
        cancelAnimationFrame(this.animationFrame)
        this.unhook()
    },
    methods: {
        init() {
            this.container = document.getElementById('scene-container')
            console.log(this.$refs.sceneContainer)
            this.camera = createCamera()
            this.scene = createScene()
            this.renderer = createRenderer()

            this.controls = createControls(this.camera, this.renderer.domElement)
            this.container.append(this.renderer.domElement)
            
            this.resizer = new Resizer(this.camera, this.renderer, this.containerId)
            this.tooltip = new Tooltip(this.camera, this.scene, this.containerId)
            this.light = createLights()
            this.scene.add(this.light)

            this.buildScene(this.gameConfig)
        },
        hookup() {
            if (this.resizer) {this.resizer.hookup()}
            if (this.tooltip) {this.tooltip.hookup()}
        },
        unhook() {
            if (this.resizer) {this.resizer.unhook()}
            if (this.tooltip) {this.tooltip.unhook()}
        },
        render() {
            this.animationFrame = requestAnimationFrame(this.render)
            
            this.tooltip.tick()

            this.renderer.render(this.scene, this.camera)
        },
        buildScene(config) {
            // Ignore changes that don't affect layout
            let newLayout = this.buildLayout(config)
            if (JSON.stringify(newLayout) === JSON.stringify(this.layout)) {
                return
            }
            this.layout = newLayout
            if (this.habitat) {
                this.scene.remove(this.habitat)
            }
            this.habitat = this.buildHabitat(this.layout)
            this.scene.add(this.habitat)
        },
        buildLayout(config) {
            let layout = []
            if (Object.keys(config).includes('powerGeneration')) {
                if (config.powerGeneration.type !== 'none') {
                    layout.push (
                        {place: config.powerGeneration.type, amount: config.powerGeneration.amount}
                    )
                }
            }
            let pressurizedEnv = []
            if (config.crewQuarters.type !== 'none') {
                pressurizedEnv.push(
                    {place: config.crewQuarters.type, amount: config.crewQuarters.amount}
                )
            }
            if (config.greenhouse.type !== 'none') {
                pressurizedEnv.push(
                    {place: 'connector', amount: 1}, 
                    {place: config.greenhouse.type, amount: config.greenhouse.amount}
                )
            }
            if (pressurizedEnv.length > 0) { // If there are buildings, add airlock at the front
                pressurizedEnv.unshift(
                    {place: 'empty', amount: 1},
                    {place: 'airlock', amount: 1}
                )
                layout = layout.concat(pressurizedEnv)
            }
            // 1 empty & storage
            layout.push(
                {place: 'empty', amount: 1},
                {place: 'storage', amount: 1}
            )
            return layout
        },
        buildHabitat(layout) {
            let models = new THREE.Group()
            let edge = 0 // tracks the 'back' of last placed model
            layout.reverse().forEach(place => {
                if (place.place === 'empty') {
                    edge = edge - place.amount
                } else {
                    let model
                    if (!this.models[place.place]) {
                        // Return a new Object3D centered at (0,0,0)
                        model = buildPlace(place)
                    } else {
                        // TODO: Doesn't update when number of solar panels changes
                        model = this.models[place.place].clone(true)
                    }
                    if (model) {
                        this.models[place.place] = model.clone(true)
                        let bbox = new THREE.Box3().setFromObject(model)
                        model.position.y = -bbox.min.y // Place on ground
                        model.position.z -= edge + bbox.min.z // Move behind last object
                        edge = edge - bbox.max.z + bbox.min.z // Reset back edge
                        models.add(model)
                    }
                }
            })
            let bbox = new THREE.Box3().setFromObject(models)
            models.position.z -= bbox.max.z/2 // Center habitat on origin
            return models
        }
    },
}
</script>

<style scoped>

#world {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
}

scene-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

#tool-tip {
    position: absolute;
    bottom: 0;
    z-index: 100;
}
</style>
