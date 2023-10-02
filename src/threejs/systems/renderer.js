import * as THREE from 'three'

const buildRenderer = (containerId, settings) => {
    const renderer = new THREE.WebGLRenderer({
        antialias: settings.antialias,
    })

    if (settings.shadows) {
        renderer.shadowMap.enabled = true
    }

    const container = document.getElementById(containerId)
    container.append(renderer.domElement)

    return renderer
}

export {buildRenderer}
