<template>
    <div v-show="tooltipText" ref="tooltip" class="tooltip">
        <div>{{tooltipText}}</div>
    </div>
</template>

<script>
import * as THREE from 'three'

import {StringFormatter} from '../../javascript/utils'

export default {
    props: {
        camera: {
            default: null,
            type: Object,
        },
        scene: {
            default: null,
            type: Object,
        },
        containerId: {
            default: null,
            type: String,
        },
        addTick: {
            default: null,
            type: Function,
        },
        addHookup: {
            default: null,
            type: Function,
        },
    },
    data() {
        return {
            raycaster: null,
            mouse: null,
            hoveringOver: null,
            tooltipText: null,
        }
    },
    mounted() {
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.hookup()

        this.tick = this.tick.bind(this)
        this.addTick({name: 'tooltip', tick: this.tick})

        this.hookup = this.hookup.bind(this)
        this.unhook = this.unhook.bind(this)
        this.addHookup({
            name: 'tooltip',
            hookup: this.hookup,
            unhook: this.unhook,
        })
    },
    methods: {
        hookup() {
            window.addEventListener('mousemove', this.onMouseMove, false)
        },
        unhook() {
            window.removeEventListener('mousemove', this.onMouseMove, false)
        },

        // Check for intersections between mouse position and models in scene
        tick() {
            this.raycaster.setFromCamera(this.mouse, this.camera)
            const habitat = this.scene.getObjectByName('habitat')
            if (!habitat) {
                return
            }
            const intersects = this.raycaster.intersectObjects(habitat.children, true)
            const key = (intersects.length > 0) ? intersects[0].object.userData.key : null
            if (key) {
                if (this.hoveringOver !== key) {
                    this.hoveringOver = key
                    this.tooltipText = StringFormatter(key)
                }
            } else {
                this.hoveringOver = null
                this.tooltipText = null
            }
        },

        // Update mouse position
        onMouseMove(event) {
            const container = document.getElementById(this.containerId)
            const frame = container.getBoundingClientRect()
            if (event.clientX > frame.left && event.clientX < frame.right &&
                event.clientY > frame.top && event.clientY < frame.bottom) {
                // convert to (-1 to +1) over the scene
                const xCoord = event.clientX - frame.left
                const yCoord = event.clientY - frame.top
                this.mouse.x = ((xCoord / (frame.right - frame.left)) * 2) - 1
                this.mouse.y = -(((yCoord / (frame.bottom - frame.top)) * 2) - 1)
            }
        },
    },
}
</script>

<style scoped>
.tooltip {
    position: absolute;
    bottom: 0;
    left: 0;
    width: auto;
    height: auto;
    margin: 4px;
    padding: 4px;
    background-color: #1e1e1eaa;
    z-index: 100;
    user-select: none;
}
</style>
