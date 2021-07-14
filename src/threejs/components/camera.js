import {PerspectiveCamera} from 'three'

function createCamera() {
    const camera = new PerspectiveCamera(
        35, // fov = Field Of View
        1, // aspect ratio (dummy value)
        0.1, // near clipping plane
        100, // far clipping plane
    )

    camera.position.set(0, 20, 30)

    return camera
}

export {createCamera}
