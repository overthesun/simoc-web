1. First build the front end image:
```
python3 simoc-web.py build-image
```

2. Make sure the backend is running 
`See readme in SIMOC repo... SIMOC/simoc.py up`

3. Configure babel.config.js properly for your use case.
    a. I want to run simoc web in deployment environment
```
chmod 777 configure_non_local.sh
./configure_non_locally.sh
```
    b. I want to run simoc web for development on localhost
```
chmod 777configure_locally.sh
./configure_locally.sh
```

4. Start the shell
```
python3 simoc-web.py shell
```

5. From within the frontend docker container:
# frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
