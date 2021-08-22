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
    // Build a basic, human-readable 'layout' object from a gameConfig object.
    let layout = {
        pressurized: [],
        solar: [],
        vehicles: [],
    }

    // Pressurized buildings includes crewQuarters and greenhouse
    if (config.greenhouse.type !== 'none') {
        layout.pressurized.push(
            {place: config.greenhouse.type, amount: config.greenhouse.amount}
        )
    }
    if (config.crewQuarters.type !== 'none') {
        layout.pressurized.push(
            {place: config.crewQuarters.type, amount: config.crewQuarters.amount}
        )
    }
    if (layout.pressurized.length > 0) { // If there are buildings, add airlock at the front
        layout.pressurized.push(
            {place: 'airlock', amount: 1},
            {place: 'steps', amount: 1},
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

    // Vehicles includes the rover and lander by default
    layout.vehicles.push(
        {place: 'rover', amount: 1},
        {place: 'empty', amount: 50},
        {place: 'lander', amount: 1},
    )

    return layout
}

const buildHabitat = (layout, models) => {
    const habitat = new THREE.Group()

    // 1. Build the pressurized section, centered at x=0, extending from z=0 into -z
    const pressurizedEnv = new THREE.Group()
    let backEdge = 0
    layout.pressurized.forEach(item => {
        const model = models[item.place]

        let scl = 1
        if (['crew_habitat_small', 'crew_habitat_medium',
        'crew_habitat_large'].includes(item.place)) {
            scl = 0.82  // Remove 'margin' around the outside of hub models
        }

        const bbox = new THREE.Box3().setFromObject(model)
        model.position.y = -bbox.min.y  // Place on ground
        model.position.z -= backEdge + (bbox.min.z * scl)  // Move behind last object
        backEdge = backEdge - (bbox.max.z * scl) + (bbox.min.z * scl)  // Reset back edge

        pressurizedEnv.add(model)
    })
    const bbox = new THREE.Box3().setFromObject(pressurizedEnv)
    pressurizedEnv.position.z -= bbox.max.z  // front door to habitat is at origin
    const rightEdge = bbox.max.x
    const leftEdge = bbox.min.x
    habitat.add(pressurizedEnv)

    // 2. Build solar array
    const solar = layout.solar[0]
    if (solar) {
        const model = models[solar.place]
        const bbox = new THREE.Box3().setFromObject(model)
        model.position.y = -bbox.min.y  // Place on ground
        model.position.z -= bbox.max.z  // Align front with front of habitat
        model.position.x += rightEdge - bbox.min.x  // Move to 'right' of habitat
        model.rotation.y += Math.PI/4  // Rotate 45-deg
        habitat.add(model)
    }

    // 3. Add vehicles
    const vehicles = new THREE.Group()
    let vBackEdge = 0
    layout.vehicles.forEach(item => {
        if (item.place === 'empty') {
            vBackEdge += item.amount
        } else {
            const model = models[item.place]
            const bbox = new THREE.Box3().setFromObject(model)
            model.position.y = -bbox.min.y  // Place on ground
            model.position.z -= vBackEdge - bbox.min.z  // Move behind last object
            vBackEdge = vBackEdge - bbox.max.z - bbox.min.z  // Reset back edge
            vehicles.add(model)
        }
    })
    const vbox = new THREE.Box3().setFromObject(vehicles)
    vehicles.position.x += leftEdge - vbox.max.x // Move to 'left' of habitat
    habitat.add(vehicles)

    // Center everything at x=0
    const hbox = new THREE.Box3().setFromObject(habitat)
    habitat.position.x -= (hbox.max.x + hbox.min.x) / 2

    return habitat
}

const buildSolar = (model, amount) => {
    const panelBox = new THREE.Box3().setFromObject(model)
    const width = panelBox.max.x - panelBox.min.x
    const depth = panelBox.max.z - panelBox.min.z
    const colSpacing = 1
    const rowSpacing = -0.5

    // Make an array in the form of [[height] * width]
    // Calculate the largest square, add extras in columns
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
