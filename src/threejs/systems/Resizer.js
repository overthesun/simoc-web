class Resizer {
    constructor(container, camera, renderer) {
        setSize(container, camera, renderer)

        window.addEventListener('resize', () => {
            setSize(container, camera, renderer)
            this.onResize()
        })
    }

    onResize() {}
}

const setSize = (container, camera, renderer) => {
    var width = container.clientWidth
    var height = container.clientHeight
    var aspectRatio = width / height
    console.log(`Resizing to height: ${height}, width: ${width}, aspect ratio ${aspectRatio}.`)

    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(aspectRatio)
}

export {Resizer}
