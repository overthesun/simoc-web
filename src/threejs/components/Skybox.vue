<template />

<script>
import * as THREE from 'three'

// Image taken from JMARS
// (Not using because it doesn't go well with sky colors)
const SURFACE_TEXTURE = 'mars-colormap-25973N23598E'

export default {
    props: {
        scene: {
            default: null,
            type: Object,
        },
    },
    data() {
        return {
            loaded: false,
        }
    },
    watch: {
        scene(newScene, oldScene) {
            if (!newScene || this.loaded) {
                return
            }
            this.loadSkybox()
            this.loaded = true
        },
    },
    methods: {
        async loadSkybox() {
            const angles = ['ft', 'bk', 'up', 'dn', 'rt', 'lf']
            const images = {}
            // ref: https://stackoverflow.com/a/37576787
            await Promise.all(angles.map(async angle => {
                // image source: https://opengameart.org/content/mayhems-skyboxes-more
                // ref: (acdcjunior's answer) https://stackoverflow.com/questions/47313165/how-to-reference-static-assets-within-vue-javascript
                const image = await import('../../assets/skybox/h2s_' + angle + '.jpg')
                images[angle] = image.default
            }))

            // Add the skybox
            this.scene.background = new THREE.CubeTextureLoader()
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
            mesh.receiveShadow = true
            mesh.userData.key = 'ground'
            this.scene.add(mesh)
        },
    },
}
</script>

<style>

</style>
