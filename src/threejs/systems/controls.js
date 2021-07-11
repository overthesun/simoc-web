import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

function createControls(camera, canvas) {
    const controls = new OrbitControls(camera, canvas)

    controls.enableDamping = true

    return controls
}

export {createControls}
