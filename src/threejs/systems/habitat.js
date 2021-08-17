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
            {place: 'airlock', amount: 1}
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

const buildHub = model => {
    // The small hub provided is half, with a slighly imperfect center.
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

export {buildLayout, buildHabitat, buildHub, buildSolar}
