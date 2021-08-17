import * as THREE from 'three'

const buildLayout = config => {
    let layout = []
    if (Object.keys(config).includes('powerGeneration')) {
        if (config.powerGeneration.type !== 'none' && config.powerGeneration.amount) {
            layout.push(
                {place: config.powerGeneration.type, amount: config.powerGeneration.amount}
            )
        }
    }
    const pressurizedEnv = []
    if (config.crewQuarters.type !== 'none') {
        pressurizedEnv.push(
            {place: config.crewQuarters.type, amount: config.crewQuarters.amount}
        )
    }
    if (config.greenhouse.type !== 'none') {
        pressurizedEnv.push(
            {place: config.greenhouse.type, amount: config.greenhouse.amount}
        )
    }
    if (pressurizedEnv.length > 0) { // If there are buildings, add airlock at the front
        pressurizedEnv.unshift(
            {place: 'empty', amount: 5},
            {place: 'steps', amount: 1},
            {place: 'airlock', amount: 1},
        )
        layout = layout.concat(pressurizedEnv)
    }

    return layout
}

const buildHabitat = (layout, models) => {
    const habitat = new THREE.Group()
    let edge = 0 // tracks the 'back' of last placed model
    for (let i = layout.length - 1; i >= 0; i--) {
        const item = layout[i]
        if (item.place === 'empty') {
            edge -= item.amount
        } else {
            const model = models[item.place]
            const bbox = new THREE.Box3().setFromObject(model)
            model.position.y = -bbox.min.y // Place on ground
            model.position.z -= edge + bbox.min.z // Move behind last object
            edge = edge - bbox.max.z + bbox.min.z // Reset back edge

            habitat.add(model)
        }
    }
    const bbox = new THREE.Box3().setFromObject(habitat)
    habitat.position.z -= bbox.max.z/2 // Center habitat on origin
    return habitat
}

export {buildLayout, buildHabitat}
