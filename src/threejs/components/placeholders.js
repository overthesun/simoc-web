import {BoxBufferGeometry, Mesh, MeshStandardMaterial} from 'three'

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
    return model
}

export {modelRefs, buildModel}
