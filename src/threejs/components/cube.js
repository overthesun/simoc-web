import {BoxBufferGeometry, Mesh, MeshStandardMaterial} from 'three'

function createCube() {
    const geometry = new BoxBufferGeometry(2, 2, 2);
    const spec = {
        color: 'purple'
    }
    const material = new MeshStandardMaterial(spec)
    const cube = new Mesh(geometry, material)
    return cube
}

export {createCube}
