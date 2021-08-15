<template>
    <div v-show="tooltipText && isActive" class="tooltip">
        <div>{{tooltipText}}</div>
    </div>
</template>

<script>
import * as THREE from 'three'
// import _ from 'lodash'

import {StringFormatter} from '../../javascript/utils'

const IGNORE_MODELS = ['ground']

export default {
    props: {
        isActive: {
            default: false,
            type: Boolean,
        },
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
    },
    data() {
        return {
            raycaster: null,
            mouse: null,
            hoveringOver: null,
            tooltipText: null,
        }
    },
    watch: {
        isActive(newActive) {
            if (newActive) {
                this.hookup()
            } else {
                this.unhook()
            }
        }
    },
    mounted() {
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.hookup()
    },
    beforeDestroy() {
        this.unhook()
    },
    methods: {
        onMouseMove(event) {
            // Update mouse position
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

            // Check what the mouse is intersecting
            this.raycaster.setFromCamera(this.mouse, this.camera)
            const intersects = this.raycaster.intersectObjects(this.scene.children, true)
            const key = (intersects.length > 0) ? intersects[0].object.userData.key : null
            if (key && !IGNORE_MODELS.includes(key)) {
                if (this.hoveringOver !== key) {
                    this.hoveringOver = key
                    this.tooltipText = `Mars habitat ${StringFormatter(key)}.`
                }
            } else {
                this.hoveringOver = null
                this.tooltipText = null
            }
        },

        hookup() {
            window.addEventListener('mousemove', this.onMouseMove, false)
        },
        unhook() {
            window.removeEventListener('mousemove', this.onMouseMove, false)
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
