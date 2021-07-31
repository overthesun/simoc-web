import * as THREE from 'three'
import { StringFormatter } from '../../javascript/utils'

const _IGNORE = ['ground']

class Tooltip {
    constructor(camera, scene, containerId, setTooltipText) {
        this.camera = camera
        this.scene = scene
        this.containerId = containerId
        this.setTooltipText = setTooltipText

        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.hoveringOver = null

        this.onMouseMove = this.onMouseMove.bind(this)
        this.hookup()
    }

    tick() {
        this.raycaster.setFromCamera(this.mouse, this.camera)
        const intersects = this.raycaster.intersectObjects(this.scene.children, true)
        const key = (intersects.length > 0) ? intersects[0].object.userData.key : null
        if (key && !_IGNORE.includes(key)) {
            if (this.hoveringOver !== key) {
                this.hoveringOver = key
                this.drawHover(intersects[0])
            }
        } else {
            this.hoveringOver = null
            this.setTooltipText(null)
        }
    }

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
    }

    drawHover(model) {
        const {key} = model.object.userData
        this.setTooltipText(`Mars habitat ${StringFormatter(key)}.`)
    }

    hookup() {
        window.addEventListener('mousemove', this.onMouseMove, false)
    }

    unhook() {
        window.removeEventListener('mousemove', this.onMouseMove, false)
    }
}

export {Tooltip}
