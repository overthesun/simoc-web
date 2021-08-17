import * as THREE from 'three'

const buildCamera = () => {
    const camera = new THREE.PerspectiveCamera(
        35,  // field of view (deg)
        1,  // aspect ratio
        0.1,  // near plane
        1000  // far plane
    )
    camera.position.set(
        0,  // x
        5,  // y
        30  // z
    )
    return camera
}

export {buildCamera}
