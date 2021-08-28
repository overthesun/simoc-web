<template>
    <div id="world">
        <div id="scene-container" ref="sceneContainer" class="scene-container">
            <div ref="loadingScreen" class="loading-screen">Loading...</div>
            <div v-if="settings.tooltip">
                <Tooltip :camera="camera" :scene="scene" :container-id="containerId"
                         :add-tick="addTick" :add-hookup="addHookup" />
            </div>
        </div>
    </div>
</template>

<script>
import * as THREE from 'three'

import Tooltip from './components/Tooltip'
import StatsBox from './systems/stats'
import {buildCamera} from './systems/camera'
import {buildRenderer} from './systems/renderer'
import {buildControls} from './systems/controls'
import {buildLights} from './systems/lights'
import {buildSkybox} from './systems/skybox'
import {buildLayout, buildHabitat} from './systems/habitat'
import Resizer from './systems/resizer'
import Loader from './systems/loader'

// In Vue3, these items can't be in 'data'
// ref: https://discourse.threejs.org/t/got-an-error-when-trying-to-add-mesh-to-scene-using-this-in-vue3/20086/2
let scene
let camera
let renderer
let loader
let controls
let lights
let resizer
let skybox
let stats

export default {
    components: {
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
            settings: {
                tooltip: false,
                shadows: false,  // TODO: Get working, test framerates (look at different types)
                transparency: false,
                rotate: false,
                antialias: true,
                maxDistance: 200,
                enableDamping: true,
                // stats: true,
            },

            // State
            layout: {}, // An object with the current layout parameters
            updatables: [], // Objects with a .tick() function which is called every frame
            hookupables: [], // Objects with .hookup()/.unhook(), called when World goes active/hidden
        }
    },
    watch: {
        gameConfig: {
            handler() {
                this.buildScene(this.gameConfig)
            },
            deep: true,
        },
        isActive(newActive) {
            if (newActive) {
                this.start()
            } else {
                this.stop()
            }
        },
    },
    mounted() {
        this.init()
        this.buildScene(this.gameConfig)
        this.start()
    },
    beforeUnmount() {
        this.stop()

        // Remove unused items from cache.
        loader.clearCache(this.layout)
    },
    methods: {
        init() {
            scene = new THREE.Scene()
            camera = buildCamera()
            renderer = buildRenderer(this.containerId, this.settings)
            loader = new Loader(this.settings, this.showLoadingScreen)

            new Resizer(camera, renderer, this.containerId, this.addHookup)
            buildControls(camera, renderer.domElement, this.settings, this.addTick)
            buildLights(this.settings, scene)
            buildSkybox(scene, this.settings)
            if (this.settings.stats) {
                StatsBox(this.containerId, this.addTick)
            }
        },
        start() {
            this.hookupables.forEach(obj => obj.hookup())
            renderer.setAnimationLoop(() => {
                this.updatables.forEach(obj => obj.tick())
                renderer.render(scene, camera)
            })
        },
        stop() {
            renderer.setAnimationLoop(null)
            this.hookupables.forEach(obj => obj.unhook())
        },
        addHookup(obj) {
            // {name: String, hookup: Function, unhook: Function}
            this.hookupables.push(obj)
        },
        addTick(obj) {
            // {name: String, tick: Function}
            this.updatables.push(obj)
        },
        showLoadingScreen(value) {
            const ls = this.$refs.loadingScreen
            if (value) {
                ls.style.display = 'flex'
            } else {
                ls.style.display = 'none'
            }
        },
        async buildScene(config) {
            // Check if config update results in layout update (not always the case)
            const layout = buildLayout(config)
            if (JSON.stringify(layout) === JSON.stringify(this.layout)) {
                return
            }
            this.layout = layout

            // Make a list of all models in the scene
            const allModels = []
            Object.entries(layout).forEach(([key, section]) => {
                section.forEach(item => allModels.push(item))
            })

            // Load models
            const models = {}
            await Promise.all(allModels.map(async item => {
                if (item.place !== 'empty') {
                    models[item.place] = await loader.load(item)
                }
            }))

            // Build scene and update
            const habitat = buildHabitat(layout, models)
            const oldHab = scene.getObjectByName('habitat')
            if (oldHab) {
                scene.remove(oldHab)
            }
            scene.add(habitat)
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

.settingsMenu {
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

.loading-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: white;
    background-color: #1e1e1eaa;
    z-index: 101;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    display: none;
}
</style>
