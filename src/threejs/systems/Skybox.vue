<template />

<script>
import * as THREE from 'three'

export default {
    props: [
        'scene',
    ],
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
        loadSkybox() {
            const angles = ['ft', 'bk', 'up', 'dn', 'rt', 'lf']
            const images = {}
            angles.forEach(angle => {
                // image source: https://opengameart.org/content/mayhems-skyboxes-more
                // ref: (acdcjunior's answer) https://stackoverflow.com/questions/47313165/how-to-reference-static-assets-within-vue-javascript
                images[angle] = require(`../../assets/h2s_${angle}.jpg`)
            })

            // Add the skybox
            this.scene.background = new THREE.CubeTextureLoader()
                    .load(angles.map(angle => images[angle]))

            // Add the ground
            const groundTexture = new THREE.TextureLoader().load(images.dn)
            groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping
            groundTexture.repeat.set(1000, 1000)
            const groundGeometry = new THREE.PlaneGeometry(10000, 10000)
            const groundMaterial = new THREE.MeshStandardMaterial({map: groundTexture})
            const mesh = new THREE.Mesh(groundGeometry, groundMaterial)
            mesh.position.y = 0.0
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
