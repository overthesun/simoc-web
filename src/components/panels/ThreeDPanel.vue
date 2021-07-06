This component renders a 3d view of the habitat using threeJS.
ref: https://discoverthreejs.com/book/introduction/threejs-with-frameworks/

<template>
    <div id="scene-container">
        <!-- Canvas will be inserted here -->
    </div>
</template>

<script>
import {
  BoxBufferGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'


export default {
    panelTitle: '3D View',
    data() {
        return {}
    },
    mounted() {
        const container = document.getElementById('scene-container');

        const scene = new Scene();
        scene.background = new Color('skyblue');

        // Create a camera
        const fov = 35; // AKA Field of View
        const aspect = container.offsetWidth / container.offsetHeight;
        const near = 0.1; // the near clipping plane
        const far = 100; // the far clipping plane
        const camera = new PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 0, 10); // every object is initially created at ( 0, 0, 0 )

        // create a cube
        const geometry = new BoxBufferGeometry(2, 2, 2);
        const material = new MeshBasicMaterial();
        const cube = new Mesh(geometry, material);
        scene.add(cube);

        // create the renderer
        const renderer = new WebGLRenderer();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setPixelRatio(container.offsetWidth / container.offsetHeight);
        container.append(renderer.domElement);
        renderer.render(scene, camera);
        
        function animate() {
            requestAnimationFrame( animate );

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render( scene, camera );
        }
        animate();
    }
}
</script>


<style lang="scss" scoped>
#scene-container {
    width: 100%;
    height: 100%;
    background-color: red;
}
</style>
