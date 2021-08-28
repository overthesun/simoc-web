echo '* Running <run.sh>...'
echo '* Current working directory is:' `pwd`

if [ ! -e node_modules ]; then
    echo '* No node_modules/ dir found, installing dependencies...'
    npm install
    echo '* Dependencies installed'
fi

if [ ! -e src/assets/simdata ]; then
    echo '* No simdata dir found, creating <src/assets/simdata> dir...'
    cd src/assets
    mkdir simdata
    cd ../..
    echo '* <src/assets/simdata> dir created'
fi

echo '* Updating/downloading presets simdata...'
cd src/assets/simdata
wget -c -r -nH --cut-dirs=2 --no-parent --accept="*.json" -erobots=off -q https://simoc.space/download/simdata/
echo '* Presets simdata downloaded to <src/assets/simdata>'
cd ../../..

if [ ! -e src/assets/models ]; then
    echo '* No models dir found, creating <src/assets/models> dir...'
    cd src/assets
    mkdir models
    cd ../..
    echo '* <src/assets/models> dir created'
fi

echo '* Updating/downloading 3D models...'
cd src/assets/models
wget -c -r -nH --cut-dirs=2 --no-parent --accept="*.glb" -erobots=off -q https://simoc.space/download/models/
echo '* 3D models downloaded to <src/assets/models>'
cd ../../..

if [ ! -e src/assets/skybox ]; then
    echo '* No skybox dir found, creating <src/assets/skybox> dir...'
    cd src/assets
    mkdir skybox
    cd ../..
    echo '* <src/assets/skybox> dir created'
fi

echo '* Updating/downloading Skybox images...'
cd src/assets/skybox
wget -c -r -nH --cut-dirs=2 --no-parent --accept="*.jpg" -erobots=off -q https://simoc.space/download/skybox/
echo '* Skybox images downloaded to <src/assets/skybox>'
cd ../../..

echo '* To start the dev server use: npm run serve'
/bin/bash
