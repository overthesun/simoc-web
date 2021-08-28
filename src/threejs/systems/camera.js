import * as THREE from 'three'

const buildCamera = () => {
    const camera = new THREE.PerspectiveCamera(
        35,  // field of view (deg)
        1,  // aspect ratio
        0.1,  // near plane
        10000  // far plane
    )
    camera.position.set(
        40,  // x
        20,  // y
        80   // z
    )
    return camera
}

export {buildCamera}
