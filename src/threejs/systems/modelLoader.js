import * as THREE from 'three'
import {BoxBufferGeometry, Mesh, MeshStandardMaterial, Group, Box3} from 'three'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'

THREE.Cache.enabled = true

// Define placeholder models
const modelRefs = {
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
const buildModel = key => {
    const {size} = modelRefs[key]
    const {color} = modelRefs[key]

    const geometry = new BoxBufferGeometry(size[0], size[1], size[2])
    const spec = {color: color}
    const material = new MeshStandardMaterial(spec)
    const model = new Mesh(geometry, material)
    model.userData.key = key
    return model
}

// Return an object or group of objects centered at origin
const buildPlace = async({place, amount}) => {
    switch (place) {
        case 'solar_pv_array_mars': {
            if (!amount) {
                return null
            }
            const panels = new Group()
            // Find largest square, add append extras
            const square = Math.floor(Math.sqrt(amount))
            const extraPanels = amount - (square * square)
            const extraRows = Math.floor(extraPanels / square)
            const arrayLayout = Array(square + extraRows).fill(square)
            const extraCol = extraPanels - (extraRows * square)
            arrayLayout.push(extraCol) // amount=20 => arrayLayout=[4, 4, 4, 4, 4]
            // Add panels in grid
            const panelRef = 'solar_pv_panel'
            const panelSpacing = 0.1
            const [width, height, depth] = modelRefs[panelRef].size
            for (let i = 0; i < arrayLayout.length; i++) {
                for (let j = 0; j < arrayLayout[i]; j++) {
                    const panelModel = buildModel(panelRef)
                    const offsetX = i * ((width + panelSpacing) + (width/2))
                    const offsetZ = j * ((depth + panelSpacing) + (depth/2))
                    panelModel.position.set(offsetX, 0, offsetZ)
                    panels.add(panelModel)
                }
            }
            const bbox = new Box3().setFromObject(panels)
            panels.position.x = -bbox.max.x/2
            panels.position.z = -bbox.max.z/2
            return panels
        }
        case 'storage': {
            const storageTanks = new Group()
            const stores = ['air_storage', 'water_storage', 'food_storage',
                            'nutrient_storage', 'power_storage']
            let rightEdge = 0
            for (let i = 0; i < stores.length; i++) {
                const tank = buildModel(stores[i])
                const [width, height, depth] = modelRefs[stores[i]].size
                if (tank) {
                    tank.position.x = rightEdge + (width/2)
                    rightEdge += width * 1.2
                    storageTanks.add(tank)
                }
            }
            const bbox = new Box3().setFromObject(storageTanks)
            storageTanks.position.x = -bbox.max.x/2
            storageTanks.position.z = -bbox.max.z/2
            return storageTanks
        }
        case 'inflatable': {
            const fname = 'inflatable'
            // eslint-disable-next-line prefer-template
            const inflatable = require('../../assets/' + fname + '.obj')
            const loader = new OBJLoader()
            const model = await loader.loadAsync(inflatable)
            model.scale.set(0.005, 0.005, 0.005)
            model.children[0].userData.key = 'inflatable'
            return model
        }
        default: {
            if (Object.keys(modelRefs).includes(place)) {
                return buildModel(place)
            } else {
                console.log(`can't load model for ${place}.`)
                return null
            }
        }
    }
}

// Return an asset
const getAsset = async({place, amount}) => {
    const model = await buildPlace({place, amount})
    return model
}

export {getAsset}
