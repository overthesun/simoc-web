import {DirectionalLight} from 'three';

function createLights() {
  const light = new DirectionalLight('white', 3)
  light.position.set(10, 20, 15)
  return light
}

export {createLights}
