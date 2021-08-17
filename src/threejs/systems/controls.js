import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const buildControls = (camera, domElement, settings, addTick) => {
    const controls = new OrbitControls(camera, domElement)
    controls.maxPolarAngle = Math.PI * 0.49

    controls.maxDistance = settings.maxDistance ? settings.maxDistance : 200
    controls.enableDamping = settings.enableDamping ? settings.enableDamping : true
    controls.autoRotate = settings.rotate

    addTick({
        name: 'controls',
        tick: () => controls.update()
    })

    return controls
}

export {buildControls}
