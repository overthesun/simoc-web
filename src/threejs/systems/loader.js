import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {buildSolar, placeIndex} from './habitat'

// Turn on caching for all loaders (includes the skybox loader)
// Assets will automatically be taken from cache if they have
// already been loaded in current session.
THREE.Cache.enabled = true

class Loader {
    constructor(settings, showLoadingScreen) {
        this.settings = settings
        this.showLoadingScreen = showLoadingScreen
        this.manager = new THREE.LoadingManager()
        this.manager.onError = fname => {
            console.log(`There was a problem loading ${fname}`)
        }

        this.manager.onStart = () => this.showLoadingScreen(true)
        this.manager.onLoad = () => this.showLoadingScreen(false)

        this.loader = new GLTFLoader(this.manager)
    }

    async load({place, amount}) {
        if (!(place in placeIndex)) {
            console.log(`Place ${place} not in placeIndex.`)
            return null
        }

        // Load model
        const {assetName} = placeIndex[place]
        // eslint-disable-next-line prefer-template
        const asset = await import('../../assets/models/' + assetName + '.glb')
        let model = await this.loader.loadAsync(asset.default)
        model = model.scene
        model.name = place

        // Rotate to face +z
        model.rotation.y += Math.PI/2

        if (assetName === 'solar_panel') {
            model = buildSolar(model, amount)
        }

        model.traverse(item => {
            // Set transparency
            if (this.settings.transparency && item.material) {
                if (item.material.name.includes('transperant')) {  // (sic)
                    item.material.transparent = true
                    item.material.opacity = 0.5
                }
            }
            if (this.settings.shadow) {
                item.castShadow = true
                item.receiveShadow = true
            }

            // Add userData for tooltip to use
            if (item.userData) {
                item.userData.key = place
            }
        })

        return model
    }

    // eslint-disable-next-line class-methods-use-this
    clearCache(layout) {
        // Remove items from cache which are not part of current layout
        // Technically it doesn't need to be a method of loader as it doesn't
        // interact with the loader itself, but it seemed the most logical place
        // to put it.

        // Get the list of models in current layout
        const activePlaces = []
        Object.entries(layout).forEach(([key_s, section]) => {
            Object.entries(section).forEach(([key_i, item]) => {
                const placeData = placeIndex[item.place]
                if (placeData) {
                    activePlaces.push(placeData.assetName)
                }
            })
        })

        // Cycle through cache, find 3d models, check if active, remove if not.
        Object.keys(THREE.Cache.files).forEach(key => {
            // By default, items are added to Cache with the following format:
            // '/static/img/h2s_ft.b266c4a3.jpg'
            const fname = key.split('/').slice(-1)[0]
            const ftype = fname.split('.').slice(-1)[0]
            if (ftype === 'glb') {  // Ignore .jpg files
                const place = fname.split('.')[0]
                if (!activePlaces.includes(place)) {
                    console.log(`Removing ${place} from cache`)
                    THREE.Cache.remove(key)
                }
            }
        })
    }
}

export default Loader
