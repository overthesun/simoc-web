class Resizer {
    constructor(container, camera, renderer) {
        const aspectRatio = container.offsetWidth / container.offsetHeight

        camera.aspect = aspectRatio;
        camera.updateProjectionMatrix();

        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setPixelRatio(aspectRatio)
    }
}

export {Resizer}
