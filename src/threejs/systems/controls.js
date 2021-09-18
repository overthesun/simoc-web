import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const buildControls = (camera, domElement, settings, addTick) => {
    const controls = new OrbitControls(camera, domElement)
    controls.maxPolarAngle = Math.PI * 0.49

    controls.maxDistance = settings.maxDistance ? settings.maxDistance : 200
    controls.enableDamping = settings.enableDamping
    controls.autoRotate = settings.rotate

    // Limit pan
    // eslint-disable-next-line max-len
    // ref: https://discourse.threejs.org/t/how-to-limit-pan-in-orbitcontrols-for-orthographiccamera/9061/10
    const minPan = new THREE.Vector3(-50, 0, -50)
    const maxPan = new THREE.Vector3(50, 0, 50)
    const adjPan = new THREE.Vector3()

    controls.addEventListener('change', () => {
        adjPan.copy(controls.target)
        controls.target.clamp(minPan, maxPan)
        adjPan.sub(controls.target)
        camera.position.sub(adjPan)
    })
    // --

    addTick({
        name: 'controls',
        tick: () => controls.update(),
    })

    return controls
}

export {buildControls}
