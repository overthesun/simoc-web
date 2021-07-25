<template>
    <div id="world">
        <div id="scene-container" ref="sceneContainer" class="scene-container" />
        <div class="tooltip-text">{{tooltipText}}</div>
        <Skybox :scene="scene" />
    </div>
</template>

<script>
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {Resizer} from './systems/resizer'
import {Tooltip} from './systems/tooltip'
import Skybox from './systems/Skybox'
import {getAsset} from './systems/modelLoader'

// ref: https://threejs.org/docs/#api/en/loaders/Cache

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
            raycaster: null,
            mouse: null,
            directLight: null,
            ambientLight: null,
            scene: null,
            animationFrame: null,
            models: {}, // TODO: Move to store, trim extras when user runs sim
            layout: [], // A grid showing relative positions of active places
            habitat: null, // A 3D object of all active places rendered according to layout
            tooltipText: '',
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
            this.directLight.castShadow = true
            this.ambientLight = new THREE.AmbientLight('white', 1)
            this.scene.add(this.directLight, this.ambientLight)

            this.renderer = new THREE.WebGLRenderer({antialias: true})
            this.renderer.physicallyCorrectLights = true
            this.renderer.shadowMap.enabled = true
            document.getElementById(this.containerId).append(this.renderer.domElement)

            this.controls = new OrbitControls(this.camera, this.renderer.domElement)
            this.controls.maxPolarAngle = Math.PI * 0.49
            this.controls.enableDamping = true
            this.controls.autoRotate = true

            this.resizer = new Resizer(this.camera, this.renderer, this.containerId)
            this.tooltip = new Tooltip(this.camera, this.scene, this.containerId,
                                       this.setTooltipText)

            this.buildScene(this.gameConfig)
        },
        setTooltipText(message) {
            this.tooltipText = message
        },
        hookup() {
            if (this.resizer) { this.resizer.hookup() }
            if (this.tooltip) { this.tooltip.hookup() }
        },
        unhook() {
            if (this.resizer) { this.resizer.unhook() }
            if (this.tooltip) { this.tooltip.unhook() }
        },
        render() {
            this.animationFrame = requestAnimationFrame(this.render)
            this.controls.update() // required for auto-rotate
            this.tooltip.tick()
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
                {place: 'inflatable', amount: 1}
            )
            return layout
        },
        async buildHabitat(layout) {
            const models = new THREE.Group()
            let edge = 0 // tracks the 'back' of last placed model
            for (let i = layout.length - 1; i >= 0; i--) {
                const place = layout[i]
                if (place.place === 'empty') {
                    edge -= place.amount
                } else {
                    // Store with a given quantity
                    const model = await getAsset(place)
                    const bbox = new THREE.Box3().setFromObject(model)
                    model.position.y = -bbox.min.y // Place on ground
                    model.position.z -= edge + bbox.min.z // Move behind last object
                    edge = edge - bbox.max.z + bbox.min.z // Reset back edge

                    const addShadows = mod => {
                        if (mod.children.length > 0) {
                            mod.children.forEach(child => addShadows(child))
                        } else {
                            mod.castShadow = true
                            mod.receiveShadow = true
                        }
                    }
                    addShadows(model)

                    models.add(model)
                }
            }
            const bbox = new THREE.Box3().setFromObject(models)
            models.position.z -= bbox.max.z/2 // Center habitat on origin
            return models
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
