module.exports = {
    presets: [
        '@vue/app',
    ],
    // Hot reloading was very slow (60s+) while running on MacOS, in and outside of docker.
    // Adding this line helps, but breaks presents & 3d layout.
    // ref: https://github.com/webpack/webpack/issues/8557#issuecomment-450347248
    // plugins: ["dynamic-import-node"]
}
