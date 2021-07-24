// Contains the shared state for threejs component.

import Vue from 'vue'
import * as THREE from 'three'

import {BoxBufferGeometry, Mesh, MeshStandardMaterial, Group, Box3} from 'three'

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
            const extraRows = extraPanels % square
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
                    const offsetX = i * (width + panelSpacing) + width/2
                    const offsetZ = j * (depth + panelSpacing) + depth/2
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
                    tank.position.x = rightEdge + width/2
                    rightEdge += width * 1.2
                    storageTanks.add(tank)
                }
            }
            const bbox = new Box3().setFromObject(storageTanks)
            storageTanks.position.x = -bbox.max.x/2
            storageTanks.position.z = -bbox.max.z/2
            return storageTanks
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

export default {
    state: {
        layout: [],
        assets: {},
    },
    getters: {
        getLayout: state => state.layout,
        getAssets: state => state.assets,
    },
    mutations: {
        SETLAYOUT(state, value) {
            state.layout = value
        },
        REMOVEASSET(state, value) {
            const {hash} = value
            if (hash in state.assets) {
                delete state.assets[hash]
            }
        },
    },
    actions: {
        async loadAsset({commit, state}, value) {
            return new Promise((resolve, reject) => buildPlace({place, amount}))
        },
        async getAsset({dispatch, state}, value) {
            const {place, amount} = value
            const hash = JSON.stringify(place) + JSON.stringify(amount)
            if (hash in state.assets) {
                return state.assets[hash].clone(true)
            } else {
                const model = await buildPlace({place, amount})
                state.assets[place] = model.clone(true)
                return model
            }
        },
        CLEARCACHE({commit, state}) {
            const active = state.layout.map(({place, amount}) => JSON.stringify(place) + JSON.stringify(amount))
            for (const hash in state.assets) {
                if (!active.includes(hash)) {
                    commit('REMOVEASSET', {hash})
                }
            }
            state.layout = null // So the dashboard panel reloads assets
        },
    },
}
