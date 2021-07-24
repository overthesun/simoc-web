//Contains the shared state for threejs component.

import Vue from 'vue'
import * as THREE from 'three'

import {BoxBufferGeometry, Mesh, MeshStandardMaterial, Group, Box3} from 'three'

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

const buildModel = (key) => {
    const size = modelRefs[key].size
    const color = modelRefs[key].color

    const geometry = new BoxBufferGeometry(size[0], size[1], size[2]);
    const spec = {color: color}
    const material = new MeshStandardMaterial(spec)
    const model = new Mesh(geometry, material)
	model.userData.key = key
    return model
}

// Returns an object or group of objects centered at origin
const buildPlace = async ({place, amount}) => {
	switch(place) {
		case 'solar_pv_array_mars': {
			if (!amount) {
				return null
			}
			let panels = new Group()
			// Find largest square, add append extras
			let square = Math.floor(Math.sqrt(amount))
			let extraPanels = amount - (square * square)
			let extraRows = extraPanels % square
			let arrayLayout = Array(square + extraRows).fill(square)
			let extraCol = extraPanels - (extraRows * square)
			arrayLayout.push(extraCol) // amount=20 => arrayLayout=[4, 4, 4, 4, 4]
			// Add panels in grid
			let panelRef = 'solar_pv_panel'
			let panelSpacing = 0.1
			let [width, height, depth] = modelRefs[panelRef].size
			for (let i = 0; i < arrayLayout.length; i++) {
				for (let j = 0; j < arrayLayout[i]; j++) {
					let panelModel = buildModel(panelRef)
					let offsetX = i * (width + panelSpacing) + width/2
					let offsetZ = j * (depth + panelSpacing) + depth/2
					panelModel.position.set(offsetX, 0, offsetZ)
					panels.add(panelModel)
				}
			}
			let bbox = new Box3().setFromObject(panels)
			panels.position.x = -bbox.max.x/2
			panels.position.z = -bbox.max.z/2
			return panels
		}
		case 'storage': {
			let storageTanks = new Group()
			let stores = ['air_storage', 'water_storage', 'food_storage',
						'nutrient_storage', 'power_storage']
			let rightEdge = 0
			for (let i = 0; i < stores.length; i++) {
				let tank = buildModel(stores[i])
				let [width, height, depth] = modelRefs[stores[i]].size
				if (tank) {
					tank.position.x = rightEdge + width/2
					rightEdge = rightEdge + width * 1.2
					storageTanks.add(tank)
				}
			}
			let bbox = new Box3().setFromObject(storageTanks)
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

export default{
    state:{
        layout: [],
        assets: {},
    },
    getters:{
        getLayout: state => state.layout,
        getAssets: state => state.assets,
    },
    mutations:{
        SETLAYOUT (state, value) {
            state.layout = value
        },
        REMOVEASSET (state, value) {
            const {hash} = value
            if (hash in state.assets) {
                delete state.assets[hash]
            }
        },
    },
    actions:{
        async loadAsset ({commit, state}, value) {
            return new Promise((resolve, reject) => {
                return buildPlace({place, amount})
            })
        },
        async getAsset ({dispatch, state}, value) {
            const {place, amount} = value
            const hash = JSON.stringify(place) + JSON.stringify(amount)
            if (hash in state.assets) {
                return state.assets[hash].clone(true)
            } else {
                let model = await buildPlace({place, amount})
                state.assets[place] = model.clone(true)
                return model
            }
        },
        CLEARCACHE ({commit, state}) {
            let active = state.layout.map(({place, amount}) => {
                return JSON.stringify(place) + JSON.stringify(amount)
            })
            for (let hash in state.assets) {
                if (!active.includes(hash)) {
                    commit('REMOVEASSET', {hash})
                }
            }
        },
    }
}
