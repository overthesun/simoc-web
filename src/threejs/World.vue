<template>
    <div id="world">
        <div id="scene-container" ref="sceneContainer" class="scene-container">
            <div class="rotation">
                Auto-rotate
                <input v-model="rotating" type="checkbox">
            </div>
            <Tooltip :is-active="isActive" :camera="camera" :scene="scene"
                     :container-id="containerId" />
        </div>
        <Skybox :scene="scene" />
    </div>
</template>

<script>
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {Resizer} from './systems/resizer'
// import {Tooltip} from './systems/tooltip'
import Skybox from './systems/Skybox'
import Tooltip from './systems/Tooltip.vue'
import Loader from './systems/loader'

// ref: https://threejs.org/docs/#api/en/loaders/Cache

// Vue/ThreeJS structure ref:
// https://stackoverflow.com/questions/47849626/import-and-use-three-js-library-in-vue-component (PolygonParrot's answer)

// File structure ref:
// discoverthreejs.com

export default {
    components: {
        Skybox,
        Tooltip,
    },
    props: {
        gameConfig: {
            type: Object,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            containerId: 'scene-container',
            container: null,
            renderer: null,
            controls: null,
            camera: null,
            rotating: true,
            raycaster: null,
            mouse: null,
            directLight: null,
            ambientLight: null,
            scene: null,
            animationFrame: null,
            models: {}, // TODO: Move to store, trim extras when user runs sim
            layout: [], // A grid showing relative positions of active places
            habitat: null, // A 3D object of all active places rendered according to layout
            loader: null,
            settings: {
                shadows: false,
                transparency: false,
                rotate: false,
                antialias: false,
            },
        }
    },
    watch: {
        gameConfig: {
            handler() {
                this.buildScene(this.gameConfig)
            },
            deep: true,
        },
        isActive(newActive, oldActive) {
            if (newActive) {
                this.hookup()
            } else {
                this.unhook()
            }
        },
        rotating(newVal) {
            this.controls.autoRotate = newVal
        },
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
            this.scene = new THREE.Scene()

            this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000) // fov, aspect, near, far
            this.camera.position.set(0, 5, 30)

            this.directLight = new THREE.DirectionalLight('white', 3)
            this.directLight.position.set(10, 20, 15)
            if (this.settings.shadows) {
                this.directLight.castShadow = true
            }
            this.ambientLight = new THREE.AmbientLight('white', 1)
            this.scene.add(this.directLight, this.ambientLight)

            this.renderer = new THREE.WebGLRenderer({antialias: this.settings.antialias})
            this.renderer.physicallyCorrectLights = true
            if (this.settings.shadows) {
                this.renderer.shadowMap.enabled = true
            }
            document.getElementById(this.containerId).append(this.renderer.domElement)

            this.controls = new OrbitControls(this.camera, this.renderer.domElement)
            this.controls.maxPolarAngle = Math.PI * 0.49
            this.controls.maxDistance = 200
            this.controls.enableDamping = true
            this.controls.autoRotate = true

            this.resizer = new Resizer(this.camera, this.renderer, this.containerId)

            this.loader = new Loader(this.settings)

            this.buildScene(this.gameConfig)
        },
        hookup() {
            if (this.resizer) { this.resizer.hookup() }
        },
        unhook() {
            if (this.resizer) { this.resizer.unhook() }
        },
        render() {
            this.animationFrame = requestAnimationFrame(this.render)
            this.controls.update() // required for auto-rotate
            this.renderer.render(this.scene, this.camera)
        },
        async buildScene(config) {
            // Ignore changes that don't affect layout
            const newLayout = this.buildLayout(config)
            if (JSON.stringify(newLayout) === JSON.stringify(this.layout)) {
                return
            }
            this.layout = newLayout
            if (this.habitat) {
                this.scene.remove(this.habitat)
            }
            this.habitat = await this.buildHabitat(this.layout)
            this.scene.add(this.habitat)
        },
        buildLayout(config) {
            let layout = []
            if (Object.keys(config).includes('powerGeneration')) {
                if (config.powerGeneration.type !== 'none' && config.powerGeneration.amount) {
                    layout.push(
                        {place: config.powerGeneration.type, amount: config.powerGeneration.amount}
                    )
                }
            }
            const pressurizedEnv = []
            if (config.crewQuarters.type !== 'none') {
                pressurizedEnv.push(
                    {place: config.crewQuarters.type, amount: config.crewQuarters.amount}
                )
            }
            if (config.greenhouse.type !== 'none') {
                pressurizedEnv.push(
                    {place: config.greenhouse.type, amount: config.greenhouse.amount}
                )
            }
            if (pressurizedEnv.length > 0) { // If there are buildings, add airlock at the front
                pressurizedEnv.unshift(
                    {place: 'empty', amount: 5},
                    {place: 'steps', amount: 1},
                    {place: 'airlock', amount: 1},
                )
                layout = layout.concat(pressurizedEnv)
            }

            return layout
        },
        async buildHabitat(layout) {
            const models = {}
            await Promise.all(layout.map(async item => {
                if (item.place !== 'empty') {
                    models[item.place] = await this.loader.load(item)
                }
            }))

            const habitat = new THREE.Group()
            let edge = 0 // tracks the 'back' of last placed model
            for (let i = layout.length - 1; i >= 0; i--) {
                const item = layout[i]
                if (item.place === 'empty') {
                    edge -= item.amount
                } else {
                    const model = models[item.place]
                    const bbox = new THREE.Box3().setFromObject(model)
                    model.position.y = -bbox.min.y // Place on ground
                    model.position.z -= edge + bbox.min.z // Move behind last object
                    edge = edge - bbox.max.z + bbox.min.z // Reset back edge

                    habitat.add(model)
                }
            }
            const bbox = new THREE.Box3().setFromObject(habitat)
            habitat.position.z -= bbox.max.z/2 // Center habitat on origin
            return habitat
        },
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

.rotation {
    position: absolute;
    top: 0;
    right: 0;
    width: auto;
    height: auto;
    margin: 4px;
    padding: 4px;
    background-color: #1e1e1eaa;
    z-index: 100;

}
</style>
