<template>
    <div id="world">
        <div id="scene-container" class="scene-container" ref="sceneContainer"></div>
        <Skybox :scene="scene" />
    </div>
</template>

<script>
import * as THREE from 'three'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {createControls} from './systems/controls.js'
import {createRenderer} from './systems/renderer.js'
import {Resizer} from './systems/resizer.js'
import {Tooltip} from './systems/tooltip.js'
import Skybox from './systems/Skybox'
import {createCamera} from './components/camera.js'
import {createLights} from './components/lights.js'
import {createScene} from './components/scene.js'
import {buildPlace} from './components/placeholders'

// Vue/ThreeJS structure ref:
// https://stackoverflow.com/questions/47849626/import-and-use-three-js-library-in-vue-component (PolygonParrot's answer)

// File structure ref:
// discoverthreejs.com

export default {
    components: {
        Skybox,
    },
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
            models: {}, // TODO: Move to store, trim extras when user runs sim
            layout: [], // A grid showing relative positions of active places
            habitat: null, // A 3D object of all active places rendered according to layout
            hoveringOver: null,
            hoverMessage: null,
        }
    },
    computed: {
        ...mapGetters('threejs', ['getLayout'])
    },
    watch: {
        gameConfig: {
            handler: function() {
                this.buildScene(this.gameConfig)
                console.log(this.scene.children)
            },
            deep: true
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
        ...mapMutations('threejs', ['SETLAYOUT']),
        ...mapActions('threejs', ['GETASSET', 'CLEARCACHE']),

        init() {
            this.container = document.getElementById('scene-container')
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
        async buildScene(config) {
            // Ignore changes that don't affect layout
            let newLayout = this.buildLayout(config)
            // if (JSON.stringify(newLayout) === JSON.stringify(this.layout)) {
            //     return
            // }
            // this.layout = newLayout
            if (JSON.stringify(newLayout) === JSON.stringify(this.getLayout)) {
                return
            }
            this.SETLAYOUT(newLayout)
            if (this.habitat) {
                this.scene.remove(this.habitat)
            }
            this.habitat = await this.buildHabitat(this.getLayout)
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
        async buildHabitat(layout) {
            let models = new THREE.Group()
            let edge = 0 // tracks the 'back' of last placed model
            layout.reverse().forEach(place => {
                if (place.place === 'empty') {
                    edge = edge - place.amount
                } else {
                    // Store with a given quantity
                    let model = await this.GETASSET(place)
                    let bbox = new THREE.Box3().setFromObject(model)
                    model.position.y = -bbox.min.y // Place on ground
                    model.position.z -= edge + bbox.min.z // Move behind last object
                    edge = edge - bbox.max.z + bbox.min.z // Reset back edge
                    models.add(model)
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
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
}

.scene-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 10;
    flex-grow: 1;
}

.tooltip {
    position: absolute;
    top: 100;
    left: 100;
    width: 90px;
    height: 30px;
    background-color: gray;
    z-index: 100;
}
</style>
