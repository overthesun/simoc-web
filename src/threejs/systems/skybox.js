import * as THREE from 'three'

const buildSkybox = async (scene, settings) => {
    const angles = ['ft', 'bk', 'up', 'dn', 'rt', 'lf']
    const images = {}
    // ref: https://stackoverflow.com/a/37576787
    await Promise.all(angles.map(async angle => {
        // image source: https://opengameart.org/content/mayhems-skyboxes-more
        // ref: (acdcjunior's answer) https://stackoverflow.com/questions/47313165/how-to-reference-static-assets-within-vue-javascript
        // eslint-disable-next-line prefer-template
        const image = await import('../../assets/skybox/h2s_' + angle + '.jpg')
        images[angle] = image.default
    }))

    // Add the skybox
    // eslint-disable-next-line vue/no-mutating-props
    scene.background = new THREE.CubeTextureLoader()
            .load(angles.map(angle => images[angle]))

    // Add the ground
    const groundTexture = new THREE.TextureLoader().load(images.dn)
    groundTexture.wrapS = THREE.RepeatWrapping
    groundTexture.wrapT = THREE.RepeatWrapping
    groundTexture.repeat.set(100, 100)
    const groundGeometry = new THREE.PlaneGeometry(10000, 10000)
    const groundMaterial = new THREE.MeshStandardMaterial({map: groundTexture})
    const mesh = new THREE.Mesh(groundGeometry, groundMaterial)
    mesh.position.y = 0.0
    mesh.position.x = 50
    mesh.position.z = 50
    mesh.rotation.x = -Math.PI / 2
    mesh.receiveShadow = (settings.shadows)
    scene.add(mesh)
}

export {buildSkybox}
