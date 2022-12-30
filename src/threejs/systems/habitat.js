import * as THREE from 'three'

const placeIndex = {
    solar_pv_array_mars: {assetName: 'solar_panel'},
    solar_panel_single: {assetName: 'solar_panel_single'},
    solar_panel_double: {assetName: 'solar_panel_double'},
    solar_panel_triple: {assetName: 'solar_panel'},
    steps: {assetName: 'steps'},
    airlock: {assetName: 'airlock'},
    crew_habitat_b2: {assetName: 'hub_small'},
    crew_habitat_sam: {assetName: 'hub_small'},
    crew_habitat_small: {assetName: 'hub_small'},
    crew_habitat_medium: {assetName: 'hub_large'},
    crew_habitat_large: {assetName: 'hub_large'},
    greenhouse_sam: {assetName: 'greenhouse_small'},
    greenhouse_small: {assetName: 'greenhouse_small'},
    greenhouse_medium: {assetName: 'greenhouse_medium'},
    greenhouse_large: {assetName: 'greenhouse_large'},
    b2_intensive_agricultural_biome: {assetName: 'greenhouse_small'},
    lander: {assetName: 'lander'},
    rover: {assetName: 'rover'},
}

const buildLayout = config => {
    // Build a basic, human-readable 'layout' object from a gameConfig object.
    const layout = {
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
            {place: 'steps', amount: 1}
        )
    }

    // Solar is just solar panels
    if (Object.keys(config).includes('powerGeneration')) {
        if (config.powerGeneration.type !== 'none' && config.powerGeneration.amount) {
            layout.solar.push(
                {place: config.powerGeneration.type, amount: config.powerGeneration.amount}
            )
        }
    }

    // Vehicles includes the rover and lander by default
    layout.vehicles.push(
        // {place: 'rover', amount: 1},
        {place: 'empty', amount: 50},
        {place: 'lander', amount: 1}
    )

    return layout
}

const buildHabitat = (layout, models) => {
    const habitat = new THREE.Group()
    habitat.name = 'habitat'
    let rightEdge = 0
    let leftEdge = 0

    // 1. Build the pressurized section, centered at x=0, extending from z=0 into -z
    if (layout.pressurized.length > 0) {
        const pressurizedEnv = new THREE.Group()
        pressurizedEnv.name = 'pressurizedEnv'
        let backEdge = 0
        layout.pressurized.forEach(item => {
            const model = models[item.place]

            let scl = 1
            if (['crew_habitat_small', 'crew_habitat_medium',
                 'crew_habitat_large', 'crew_habitat_sam'].includes(item.place)) {
                scl = 0.82  // Remove 'margin' around the outside of hub models
            }

            const mBox = new THREE.Box3().setFromObject(model)
            model.position.y = -mBox.min.y  // Place on ground
            model.position.z -= backEdge + (mBox.min.z * scl)  // Move behind last object
            backEdge = backEdge - (mBox.max.z * scl) + (mBox.min.z * scl)  // Reset back edge

            pressurizedEnv.add(model)
        })
        const peBox = new THREE.Box3().setFromObject(pressurizedEnv)
        pressurizedEnv.position.z -= peBox.max.z  // front door to habitat is at origin
        rightEdge = peBox.max.x
        leftEdge = peBox.min.x
        habitat.add(pressurizedEnv)
    }

    // 2. Build solar array
    const solar = layout.solar[0]
    if (solar) {
        const model = models[solar.place]
        model.name = 'solar'
        const sBox = new THREE.Box3().setFromObject(model)
        model.position.y = -sBox.min.y  // Place on ground
        model.position.z -= sBox.max.z  // Align front with front of habitat
        model.position.x += rightEdge - sBox.min.x  // Move to 'right' of habitat
        model.rotation.y += Math.PI/4  // Rotate 45-deg

        // Rotating the rectangular solar array causes the corners to stick out beyond the sBox
        // calculated above. Pad to prevent overlap with pressurized environment.
        const SOLAR_PADDING = 5
        model.position.x += SOLAR_PADDING

        habitat.add(model)
    }

    // 3. Add vehicles
    const vehicles = new THREE.Group()
    vehicles.name = 'vehicles'
    let vBackEdge = 0
    layout.vehicles.forEach(item => {
        if (item.place === 'empty') {
            vBackEdge += item.amount
        } else {
            const model = models[item.place]
            const mBox = new THREE.Box3().setFromObject(model)
            model.position.y = -mBox.min.y  // Place on ground
            model.position.z -= vBackEdge - mBox.min.z  // Move behind last object
            vBackEdge = vBackEdge - mBox.max.z - mBox.min.z  // Reset back edge
            vehicles.add(model)
        }
    })
    const vBox = new THREE.Box3().setFromObject(vehicles)
    vehicles.position.x += leftEdge - vBox.max.x  // Move to 'left' of habitat
    vehicles.position.x -= 10  // Add extra space (for greenhouse_large + rocket)
    habitat.add(vehicles)

    // Center everything at x=0
    const hbox = new THREE.Box3().setFromObject(habitat)
    habitat.position.x -= (hbox.max.x + hbox.min.x) / 2
    habitat.position.z -= (hbox.max.z + hbox.min.z) / 2

    habitat.traverse(item => {
        if (item.matrixAutoUpdate) {
            item.matrixAutoUpdate = false
        }
    })

    return habitat
}

const buildSolar = (nPanels, solar_panel_single, solar_panel_double, solar_panel_triple) => {
    // Arrange panels into rows of equal length up to N panels long. Use the following names:
    // - PANEL: A single, square solar panel.
    // - GROUP: 1, 2 or 3 panels, a single model
    // - ROW: Several groups positioned side-by-side
    const PANELS_PER_GROUP = 3
    const MAX_ROW_LENGTH = 20

    // Determine the number of groups and size of last group
    const nGroups = Math.ceil(nPanels / PANELS_PER_GROUP)
    const lastGroupSize = nPanels - ((nGroups - 1) * PANELS_PER_GROUP)

    // Determine the number of rows, length, and length of last row
    const nRows = Math.ceil(nGroups / MAX_ROW_LENGTH)
    const baseRowLength = Math.ceil(nGroups / nRows)
    const lastRowLength = nGroups - ((nRows - 1) * baseRowLength)

    // Build layout array where elements = rows and element values = row lengths
    const layout = Array(nRows - 1).fill(baseRowLength)
    layout.unshift(lastRowLength)

    // Calculate spacing values
    const pBox = new THREE.Box3().setFromObject(solar_panel_triple)
    const width = pBox.max.x - pBox.min.x
    const depth = pBox.max.z - pBox.min.z
    const colSpacing = 1
    const rowSpacing = -0.5

    // Build an array of clones
    const solar_array = new THREE.Group()
    layout.forEach((col, i) => {
        for (let j = col; j > 0; j--) {
            let panelModel
            // Use different model for last group
            if (i === 0 && j === col && lastGroupSize !== PANELS_PER_GROUP) {
                panelModel = lastGroupSize === 1 ? solar_panel_single : solar_panel_double
            } else {
                panelModel = solar_panel_triple.clone()
            }
            const offsetX = j * ((width + rowSpacing) + (width/2))
            const offsetZ = i * ((depth + colSpacing) + (depth/2))
            panelModel.position.set(offsetX, 0, offsetZ)
            solar_array.add(panelModel)
        }
    })

    const aBox = new THREE.Box3().setFromObject(solar_array)
    solar_array.position.x = -aBox.max.x/2
    solar_array.position.z = -aBox.max.z/2
    return solar_array
}

const buildHitbox = habitat => {
    const hitbox = new THREE.Group()
    hitbox.name = 'hitbox'

    // Traverse the habitat and separate object(s) named 'body'
    habitat.traverse(child => {
        if (child.name === 'body') {
            const cloned = child.clone()
            cloned.applyMatrix4(child.matrix)
            hitbox.add(cloned)
        }
    })
    // Remove the originals
    for (let i = 0; i < hitbox.children.length; i++) {
        const body = habitat.getObjectByName('body')
        if (body) {
            body.parent.remove(body)
        }
    }
    // Add them back as a separate child.
    // Tooltip will only watch the 'hitbox' portion of habitat
    habitat.add(hitbox)

    // Return a new haitat object with a child named 'hitbox'
    return habitat
}

export {buildLayout, buildHabitat, buildSolar, placeIndex, buildHitbox}
