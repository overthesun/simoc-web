import * as THREE from 'three'

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
    lander: {assetName: 'lander'},
    rover: {assetName: 'rover'},
}

const buildLayout = config => {
    let layout = {
        pressurized: [],
        solar: [],
        vehicles: [],
    }

    // Pressurized environment includes steps, airlock, crewQuarters, greenhouse
    // Position in order
    const pressurizedEnv = []
    if (config.crewQuarters.type !== 'none') {
        layout.pressurized.push(
            {place: config.crewQuarters.type, amount: config.crewQuarters.amount}
        )
    }
    if (config.greenhouse.type !== 'none') {
        layout.pressurized.push(
            {place: config.greenhouse.type, amount: config.greenhouse.amount}
        )
    }
    if (layout.pressurized.length > 0) { // If there are buildings, add airlock at the front
        layout.pressurized.unshift(
            {place: 'steps', amount: 1},
            {place: 'airlock', amount: 1}
        )
    }

    // Solar is just solar panels
    if (Object.keys(config).includes('powerGeneration')) {
        if (config.powerGeneration.type !== 'none' && config.powerGeneration.amount) {
            layout.solar.push(
                {place: config.powerGeneration.type, amount: config.powerGeneration.amount},
            )
        }
    }

    // Vehicles includes the rover and lander
    layout.vehicles.push(
        {place: 'rover', amount: 1},
        {place: 'lander', amount: 1},
    )

    return layout
}

const buildHabitat = (layout, models) => {
    const habitat = new THREE.Group()

    // 1. Build the pressurized section
    const pressurizedEnv = new THREE.Group()
    let edge = 0 // tracks the 'back' of last placed model
    for (let i = layout.pressurized.length - 1; i >= 0; i--) {
        const item = layout.pressurized[i]
        if (item.place === 'empty') {
            edge -= item.amount
        } else {
            const model = models[item.place]
            const bbox = new THREE.Box3().setFromObject(model)

            let boxScale = 1
            if (['crew_habitat_small', 'crew_habitat_medium',
                 'crew_habitat_large'].includes(item.place)) {
                boxScale = 0.82
            }

            model.position.y = -bbox.min.y // Place on ground
            model.position.z -= edge + (bbox.min.z * boxScale) // Move behind last object
            edge = edge - (bbox.max.z * boxScale) + (bbox.min.z * boxScale) // Reset back edge

            pressurizedEnv.add(model)
        }
    }
    const bbox = new THREE.Box3().setFromObject(pressurizedEnv)
    pressurizedEnv.position.z -= bbox.max.z // front door to habitat is at origin
    const rightEdge = bbox.max.x
    const leftEdge = bbox.min.x
    habitat.add(pressurizedEnv)

    // 2. Build solar array
    const solar = layout.solar[0]
    if (solar) {
        const model = models[solar.place]
        const bbox = new THREE.Box3().setFromObject(model)
        model.position.y = -bbox.min.y // Place on ground
        model.position.z -= bbox.max.z // Align front with front of habitat
        model.position.x += rightEdge - bbox.min.x
        habitat.add(model)
    }
    return habitat
}


const buildSolar = (model, amount) => {
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

export {buildLayout, buildHabitat, buildSolar, placeIndex}
