const path = require('path');

module.exports = {
  assetsDir: 'static', // For simple configuration of static files in Flask (the "static_folder='client/dist/static'" part in app.py)
  devServer: {
    // proxy the requests to the SIMOC server
    //proxy: 'http://localhost:8000',  // http
    //proxy: 'https://localhost:8443',  // https

    proxy: {
        '/*': {
            target: 'http://nginx:8000',
            logLevel: 'debug',
        },/*
        '/socket.io/*': {
            // websocket don't seem to work over https
            target: 'http://localhost:8000',
            logLevel: 'debug',
        },
        '/*': {
            target: 'https://localhost:8443',
            logLevel: 'debug',
        },*/
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: `

                `,
      },
    },
  },
  // NOTE ON LINTER
  // Auto-linting is controlled by @vue/cli-service, which is based on webpack
  // but has some differences. View settings by running:
  //    >>> vue inspect > output.js
  // 
  // Configuration options, either from .eslintrc.js or via chining in vue.config.js,
  // are loaded with 'npm run serve'. In order for updates to be applied, stop 
  // and restart the vue server.
  // ref: https://stegriff.co.uk/upblog/how-to-change-webpack-settings-set-by-vue-cli/)
  lintOnSave: true,
};
