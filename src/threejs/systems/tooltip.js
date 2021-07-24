import * as THREE from 'three'

class Tooltip {
    constructor(camera, scene, containerId) {
        this.camera = camera
        this.scene = scene
        this.containerId = containerId

        this.raycaster = new THREE.Raycaster
        this.mouse = new THREE.Vector2()
        this.hoveringOver = null
        this.hoverMessage = null

        this.onMouseMove = this.onMouseMove.bind(this)
        this.hookup()
    }

    tick() {
        this.raycaster.setFromCamera(this.mouse, this.camera)
        const intersects = this.raycaster.intersectObjects(this.scene.children, true)
        if (intersects.length > 0) {
            let model = intersects[0]
            let key = model.object.userData.key
            if (this.hoveringOver !== key) {
                this.hoveringOver = model.object.userData.key
                this.drawHover(model)
            }
        } else if (this.hoveringOver) {
            this.hoveringOver = null
            this.hoverMessage = null
        }
    }

    onMouseMove(event) {
        const container = document.getElementById(this.containerId)
        const frame = container.getBoundingClientRect()
        if (event.clientX > frame.left && event.clientX < frame.right &&
            event.clientY > frame.top && event.clientY < frame.bottom) {
            // convert to (-1 to +1) over the scene
            let xCoord = event.clientX - frame.left
            let yCoord = event.clientY - frame.top
            this.mouse.x = (xCoord / (frame.right - frame.left)) * 2 - 1
            this.mouse.y = -((yCoord / (frame.bottom - frame.top)) * 2 - 1)
        }
    }

    drawHover(model) {
        let key = model.object.userData.key
        this.hoverMessage = key
        console.log(this.hoverMessage)
    }

    hookup() {
        window.addEventListener('mousemove', this.onMouseMove, false)
    }

    unhook() {
        window.removeEventListener('mousemove',this.onMouseMove, false)
    }
}

export {Tooltip}
