import {
    BoxBufferGeometry,
    Color,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from 'three';

class World {
    constructor(container) {
        this.scene = new Scene();
        this.scene.background = new Color('skyblue');

        // Create a camera
        const fov = 35; // AKA Field of View
        const aspect = container.offsetWidth / container.offsetHeight;
        const near = 0.1; // the near clipping plane
        const far = 100; // the far clipping plane
        this.camera = new PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 0, 10); // every object is initially created at ( 0, 0, 0 )

        // create a cube
        const geometry = new BoxBufferGeometry(2, 2, 2);
        const material = new MeshBasicMaterial();
        this.cube = new Mesh(geometry, material);
        this.scene.add(this.cube);

        // create the renderer
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        this.renderer.setPixelRatio(container.offsetWidth / container.offsetHeight);
        container.append(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);

        this.render = this.render.bind(this)
    }
    
    render() {
        requestAnimationFrame( this.render );

        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        this.renderer.render( this.scene, this.camera );
    }
}

export default World
