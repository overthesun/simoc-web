import {DirectionalLight} from 'three';

function createLights() {
  const light = new DirectionalLight('white', 8)
  light.position.set(10, 20, 10)
  return light
}

export {createLights}
