import {modelRefs, buildModel} from './components/placeholders.js'
import * as THREE from 'three'

// Determines which things are included and where.
// Output is human-readable
const buildLayout = (gameConfig) => {
	let layout = []
	// If solar, add solar
	if (Object.keys(gameConfig).includes('powerGeneration')) {
		if (gameConfig.powerGeneration.type !== 'none') {
			layout.push ({
				place: gameConfig.powerGeneration.type,
				amount: gameConfig.powerGeneration.amount
			})
		}
	}
	
	let habitat = []
	// Airlock and crewQuarters
	if (gameConfig.crewQuarters.type !== 'none') {
		habitat.push({
			place: gameConfig.crewQuarters.type,
			amount: gameConfig.crewQuarters.amount
		})
	}
	// connector & greenhouse
	if (gameConfig.greenhouse.type !== 'none') {
		habitat.push({
			place: 'connector',
			amount: 1,
		}, {
			place: gameConfig.greenhouse.type,
			amount: gameConfig.greenhouse.amount
		})
	}
	// If there are buildings, add airlock at the front
	if (habitat.length > 0) {
		habitat.unshift({
			place: 'empty',
			amount: 1
		}, {
			place: 'airlock',
			amount: 1
		})

		layout = layout.concat(habitat)
	}
	
	// 1 empty & storage
	layout.push({
		place: 'empty',
		amount: 1
	}, {
		place: 'storage',
		amount: 1
	})
	return layout
}

// Builds places in a line, one after another
const buildHabitat = (layout) => {
	let models = new THREE.Group()
	let edge = 0 // tracks the 'back' of last placed model
	layout.reverse().forEach(place => {
		if (place.place === 'empty') {
			edge = edge - place.amount
		} else {
			let model = buildPlace(place)
			if (model) {
				let bbox = new THREE.Box3().setFromObject(model)
				model.position.y = -bbox.min.y // Place on ground
				model.position.z -= edge + bbox.min.z // Move behind last object
				edge = edge - bbox.max.z + bbox.min.z // Reset back edge
				models.add(model)
			}
		}
	})
	let bbox = new THREE.Box3().setFromObject(models)
	models.position.z -= bbox.max.z/2 // Center habitat on origin
	return models
}

// Returns an object or group of objects centered at origin
const buildPlace = ({place, amount}) => {
	switch(place) {
		case 'solar_pv_array_mars': {
			if (!amount) {
				return null
			}
			let panels = new THREE.Group()
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
			let bbox = new THREE.Box3().setFromObject(panels)
			panels.position.x = -bbox.max.x/2
			panels.position.z = -bbox.max.z/2
			return panels
		}
		case 'storage': {
			let storageTanks = new THREE.Group()
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
			let bbox = new THREE.Box3().setFromObject(storageTanks)
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

export {buildLayout, buildHabitat}
