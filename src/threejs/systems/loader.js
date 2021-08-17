import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

THREE.Cache.enabled = true

const placeIndex = {
    solar_pv_array_mars: {assetName: 'solar_panel'},
    steps: {assetName: 'steps'},
    airlock: {assetName: 'airlock'},
    crew_habitat_sam: {assetName: 'hub_small'},
    crew_habitat_small: {assetName: 'hub_small'},
    crew_habitat_medium: {assetName: 'hub_large'},
    crew_habitat_large: {assetName: 'hub_large'},
    greenhouse_sam: {assetName: 'greenhouse_small'},
    greenhouse_small: {assetName: 'greenhouse_small'},
    greenhouse_medium: {assetName: 'greenhouse_medium'},
    greenhouse_large: {assetName: 'greenhouse_large'},
}

class Loader {
    constructor(settings) {
        this.settings = settings
        this.manager = new THREE.LoadingManager()
        this.manager.onError = fname => {
            console.log(`There was a problem loading ${fname}`)
        }
        this.loader = new GLTFLoader(this.manager)
    }

    settings(newSettings) {
        this.settings = newSettings
    }

    async load({place, amount}) {
        if (!(place in placeIndex)) {
            console.log(`Place ${place} not in placeIndex.`)
            return null
        }

        // Load model
        const {assetName} = placeIndex[place]
        let model
        // eslint-disable-next-line prefer-template
        const asset = await import('../../assets/models/' + assetName + '.glb')
        model = await this.loader.loadAsync(asset.default)
        model = model.scene
        // Rotate to face +z
        model.rotation.y += Math.PI/2

        if (assetName === 'hub_small') {
            model = this.buildHub(model)
        }
        if (assetName === 'solar_panel') {
            model = this.buildSolar(model, amount)
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

    buildHub(model) {
        // The model provided is half, with a slighly imperfect center.
        // Clone it, rotate 90-deg, move behind the other, adjust, merge.
        const backside = model.clone()
        model.rotation.y += Math.PI
        const modelBox = new THREE.Box3().setFromObject(model)
        const backsideBox = new THREE.Box3().setFromObject(backside)
        const manualOffset = '0.6'
        backside.position.z += modelBox.max.z - backsideBox.min.z - manualOffset
        const newModel = new THREE.Group()
        newModel.add(model)
        newModel.add(backside)
        // TODO: Rotate by Math.PI/12 to line up airlocks.
        // When I do it now, the bounding box rotates as well, so habitat is misaligned.
        // I think it needs a model.updateMatrix() and wait a tick before building the layout.
        return newModel
    }

    buildSolar(model, amount) {
        const panelBox = new THREE.Box3().setFromObject(model)
        const width = panelBox.max.x - panelBox.min.x
        const depth = panelBox.max.z - panelBox.min.z
        const colSpacing = 1
        const rowSpacing = -0.5

        // Make a layout in the form of [[height] * width]
        // Calculate the largest square, add extras in columns
        // math ref: https://math.stackexchange.com/a/1183694
        const squareRatio = Math.round((depth + colSpacing) / (width + rowSpacing) * 10) / 10
        const widthRaw = Math.sqrt(amount * squareRatio)
        const height = Math.floor(widthRaw / squareRatio)
        const widthBase = height
        const extraPanels = amount - (height * widthBase)
        const extraRows = Math.floor(extraPanels / height)
        const layout = Array(widthBase + extraRows).fill(height)
        const extraCol = extraPanels - (extraRows * height)
        if (extraCol) {
            layout.push(extraCol)
        }

        // Build an array of clones
        const solar_array = new THREE.Group()
        layout.forEach((col, i) => {
            for (let j = col; j > 0; j--) {
                const panelModel = model.clone()
                const offsetX = i * ((width + rowSpacing) + (width/2))
                const offsetZ = j * ((depth + colSpacing) + (depth/2))
                panelModel.position.set(offsetX, 0, offsetZ)
                solar_array.add(panelModel)
            }
        })

        const arrayBox = new THREE.Box3().setFromObject(solar_array)
        solar_array.position.x = -arrayBox.max.x/2
        solar_array.position.z = -arrayBox.max.z/2
        return solar_array
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
