import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {buildSolar, placeIndex} from './habitat'

// Turn on caching for all loaders (includes the skybox loader)
// Assets will automatically be taken from cache if they have
// already been loaded in current session.
THREE.Cache.enabled = true

class Loader {
    constructor(settings) {
        this.settings = settings
        this.manager = new THREE.LoadingManager()
        this.manager.onError = fname => {
            console.log(`There was a problem loading ${fname}`)
        }

        this.manager.onStart = () => this.showLoadingScreen(true)
        this.manager.onLoad = () => this.showLoadingScreen(false)

        this.loader = new GLTFLoader(this.manager)
    }

    settings(newSettings) {
        this.settings = newSettings
    }

    showLoadingScreen(value) {
        const loadingScreen = document.getElementById('loading-overlay')
        if (value) {
            loadingScreen.style.display = 'flex'
        } else {
            loadingScreen.style.display = 'none'
        }
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

    clearCache(layout) {
        // Remove items from cache which are not part of current layout
                    // Make a list of all models in the scene
                    const allModels = []
                    for (let section in layout) {
                        layout[section].forEach(item => allModels.push(item))
                    }

        // Get the list of models in current layout
        const activePlaces = []
        for (let section in layout) {
            layout[section].forEach(item => {
                const placeData = placeIndex[item.place]
                if (placeData) {
                    activePlaces.push(placeData.assetName)
                }
            })
        }

        // Cycle through cache, find 3d models, check if active, remove if not.
        for (const [key, value] of Object.entries(THREE.Cache.files)) {
            // By default, items are added to Cache with the following format:
            // '/static/img/h2s_ft.b266c4a3.jpg'
            const fname = key.split('/').slice(-1)[0]
            const ftype = fname.split('.').slice(-1)[0]
            if (ftype === 'glb') {
                const place = fname.split('.')[0]
                if (!activePlaces.includes(place)) {
                    console.log(`Removing ${place} from cache`)
                    THREE.Cache.remove(key)
                }
            }
        }
    }
}

export default Loader





// PLACEHOLDERS (NO LONGER USED)

// Define placeholder models
const placeholderRefs = {
    // model references. for now, give a size
    connector: {size: [1.8, 1.8, 1], color: 'white'},
    airlock: {size: [2, 2, 1], color: 'white'},
    air_storage: {size: [1, 1, 2], color: 'white'},
    water_storage: {size: [1, 1, 3], color: 'lightblue'},
    nutrient_storage: {size: [1, 1, 2], color: 'lightgreen'},
    food_storage: {size: [1, 1, 2], color: 'tan'},
    power_storage: {size: [1, 1, 1], color: 'lightyellow'},

    // user-input
    solar_pv_panel: {size: [0.5, 0.5, 0.5], color: 'yellow'},
    crew_habitat_sam: {size: [4, 1, 1], color: 'gray'},
    crew_habitat_small: {size: [4, 2, 4], color: 'lightgray'},
    crew_habitat_medium: {size: [6, 2, 6], color: 'gray'},
    crew_habitat_large: {size: [8, 2, 8], color: 'darkgray'},
    greenhouse_sam: {size: [4, 1, 1], color: 'green'},
    greenhouse_small: {size: [4, 2, 4], color: 'lightgreen'},
    greenhouse_medium: {size: [6, 2, 6], color: 'green'},
    greenhouse_large: {size: [8, 2, 8], color: 'darkgreen'},

    // unused
    isru: {size: [1, 2, 1], color: 'red'},
    fabrication: {size: [5, 2, 8], color: 'orange'},
    wind_turbine: {size: [1, 10, 1], color: 'yellow'},
    radioisotope_generator: {size: [3, 3, 3], color: 'yellow'},
    mobility: {size: [2, 2, 4], color: 'black'},
    radio: {size: [0.5, 6, 0.5], color: 'black'},
    lab_equipment: {size: [2, 2, 0.5], color: 'orange'},
}

// Build a placeholder
const buildPlaceholder = key => {
    const {size} = placeholderRefs[key]
    const {color} = placeholderRefs[key]

    const geometry = new BoxBufferGeometry(size[0], size[1], size[2])
    const spec = {color: color}
    const material = new MeshStandardMaterial(spec)
    const model = new Mesh(geometry, material)
    model.userData.key = key
    return model
}
