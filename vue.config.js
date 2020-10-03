const path = require('path');

module.exports = {
  assetsDir: 'static', // For simple configuration of static files in Flask (the "static_folder='client/dist/static'" part in app.py)
  devServer: {
    // proxy the requests to the SIMOC server
    //proxy: 'http://localhost:8000',  // http
    //proxy: 'https://localhost:8443',  // https

    proxy: {
        '/*': {
            target: 'http://localhost:8000',
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
};
