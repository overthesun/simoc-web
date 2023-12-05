import * as THREE from 'three'

const buildLights = (settings, scene) => {
    const directLight = new THREE.DirectionalLight('white', 3/Math.PI)
    directLight.position.set(10, 20, 15)
    if (settings.shadows) {
        directLight.castShadow = true
    }
    const ambientLight = new THREE.AmbientLight('white', 1/Math.PI)

    const lights = new THREE.Group()
    lights.add(directLight, ambientLight)

    scene.add(lights)
    return lights
}

export {buildLights}
